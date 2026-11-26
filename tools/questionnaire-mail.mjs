import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const context = { window: {} };
runInNewContext(readFileSync(new URL('../wh-sms/questions.js', import.meta.url), 'utf8'), context);
const questionnaires = context.window.WHSMS_PREVIEW_QUESTIONS;
const defaultRecipient = 'info@wgholdings.co.nz';
const copyRecipient = 'js8490674@gmail.com';
const htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = value => value.replace(/[&<>"']/g, character => htmlEntities[character]);
const defaultSender = 'questionnaire@mail.wgholdings.co.nz';

export async function sendResend(submission, env = process.env) {
  const { id, title, contact, responses } = submission;
  const body = [
    `Reference: ${id}`, `Questionnaire: ${title}`, `Name: ${contact.name}`,
    `Email: ${contact.email}`, `Phone: ${contact.phone || 'Not provided'}`, '',
    ...responses.map(({ question, answer }) => `${question}\r\n${answer || 'Skipped'}\r\n`)
  ].join('\r\n');
  const html = `
    <div style="max-width:640px;margin:auto;font:16px/1.5 Arial,sans-serif;color:#25221d">
      <div style="background:#211b13;color:#fff;padding:24px">
        <p style="margin:0;color:#ebbd73">Wolfgramm Holdings</p>
        <h1 style="margin:8px 0 0;font-size:26px">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:24px">
        <h2 style="font-size:20px;margin:0 0 8px">Contact details</h2>
        <p style="margin:0 0 24px"><strong>Name:</strong> ${escapeHtml(contact.name)}<br>
          <strong>Email:</strong> ${escapeHtml(contact.email)}<br>
          <strong>Phone:</strong> ${escapeHtml(contact.phone || 'Not provided')}</p>
        <h2 style="font-size:20px;margin:0 0 8px">Questions and answers</h2>
        ${responses.map(({ question, answer }, index) => `
          <div style="border-top:1px solid #dfd8ca;padding:14px 0">
            <strong>${index + 1}. ${escapeHtml(question)}</strong>
            <p style="margin:4px 0 0">${escapeHtml(answer || 'Skipped').replace(/\r\n|\r|\n/g, '<br>')}</p>
          </div>`).join('')}
        <p style="font-size:12px;color:#655d50">Reference ${id}</p>
      </div>
    </div>`;
  const recipient = env.QUESTIONNAIRE_RECIPIENT || defaultRecipient;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `questionnaire/${id}`
    },
    body: JSON.stringify({
      from: env.QUESTIONNAIRE_SENDER || defaultSender,
      to: [recipient],
      ...(recipient.toLowerCase() === copyRecipient ? {} : { cc: [copyRecipient] }),
      reply_to: contact.email,
      subject: `New questionnaire: ${contact.name} \u2013 ${title}`,
      text: body,
      html
    }),
    signal: AbortSignal.timeout(12000)
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.id !== 'string' || !result.id) {
    const error = new Error('Resend did not confirm acceptance');
    error.status = response.status;
    throw error;
  }
}

const mailbox = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function validate(input) {
  if (!input || typeof input.id !== 'string' ||
      !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/.test(input.id) ||
      !Object.hasOwn(questionnaires, input.pathway) || !input.contact || !input.answers) return;
  const { title, questions } = questionnaires[input.pathway];
  const contact = {};
  for (const [key, limit] of [['name', 120], ['email', 254], ['phone', 40]]) {
    const value = input.contact[key];
    if (typeof value !== 'string' || value.length > limit || /[\x00-\x1f\x7f]/.test(value)) return;
    contact[key] = value.trim();
  }
  if (!contact.name || !mailbox.test(contact.email)) return;
  const responses = [];
  for (const question of questions) {
    const value = input.answers[question.id];
    if (typeof value !== 'string' || (question.required && !value.trim())) return;
    const answer = question.type === 'choice' && value
      ? question.choices.find(choice => choice.id === value)?.label
      : value;
    if (answer === undefined || (question.maxLength && answer.length > question.maxLength)) return;
    responses.push({ question: question.prompt, answer });
  }
  return { id: input.id, title, contact, responses };
}

export function createQuestionnaireHandler({ env = process.env, send = sendResend } = {}) {
  return async request => {
    const reply = (status, body) => Response.json(body, {
      status, headers: { 'Cache-Control': 'no-store' }
    });
    if (request.method !== 'POST') return reply(405, {});
    if (!env.QUESTIONNAIRE_SITE_ORIGIN || request.headers.get('origin') !== env.QUESTIONNAIRE_SITE_ORIGIN) {
      return reply(403, {});
    }
    if (request.headers.get('content-type') !== 'application/json') return reply(415, {});
    if (!mailbox.test(env.QUESTIONNAIRE_SENDER || defaultSender) ||
        !mailbox.test(env.QUESTIONNAIRE_RECIPIENT || defaultRecipient) || !env.RESEND_API_KEY?.trim()) {
      return reply(503, { message: 'Email delivery is temporarily unavailable.' });
    }
    let input;
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request.body) {
        size += chunk.length;
        if (size > 160 * 1024) return reply(413, { message: 'The questionnaire is too large.' });
        chunks.push(chunk);
      }
      input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      return reply(400, { message: 'The questionnaire could not be read.' });
    }
    const submission = validate(input);
    if (!submission) return reply(400, { message: 'Check your contact details and answers.' });
    try {
      await send(submission, env);
      return reply(200, { reference: submission.id });
    } catch (error) {
      console.error('Questionnaire email failed', {
        reference: submission.id,
        provider: 'resend',
        ...(Number.isInteger(error?.status) ? { status: error.status } : {}),
        ...(error?.name === 'TimeoutError' ? { timeout: true } : {})
      });
      return reply(502, { message: 'Email delivery could not be confirmed.' });
    }
  };
}
