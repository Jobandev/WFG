import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import nodemailer from 'nodemailer';
import { createQuestionnaireHandler, sendGmailSmtp, sendResend } from '../tools/questionnaire-mail.mjs';

test('Gmail SMTP uses TLS and requires acceptance of the primary recipient', async t => {
  const id = randomUUID();
  const sendMail = t.mock.fn(async message => {
    assert.equal(message.from, 'sender@gmail.com');
    assert.equal(message.replyTo, 'sample@example.com');
    assert.deepEqual(message.to, ['info@wgholdings.co.nz']);
    assert.equal(message.messageId, `<${id}@gmail.com>`);
    return { accepted: ['js8490674@gmail.com'] };
  });
  t.mock.method(nodemailer, 'createTransport', options => {
    assert.equal(options.host, 'smtp.gmail.com');
    assert.equal(options.port, 465);
    assert.equal(options.secure, true);
    assert.deepEqual(options.auth, { user: 'sender@gmail.com', pass: 'abcd1234' });
    return { sendMail };
  });
  await assert.rejects(sendGmailSmtp({
    id, title: 'Test questionnaire',
    contact: { name: 'Sample Person', email: 'sample@example.com' },
    responses: []
  }, {
    GMAIL_SENDER: 'sender@gmail.com', GMAIL_APP_PASSWORD: 'abcd 1234'
  }), /did not accept the primary recipient/);
});

test('Resend receives the questionnaire and reuses its reference for retries', async t => {
  const id = randomUUID();
  const submission = {
    id, title: 'Test questionnaire',
    contact: { name: 'Sample Person', email: 'sample@example.com' },
    responses: [{ question: 'Example?', answer: '<example>' }]
  };
  const fetch = t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    assert.equal(options.headers['Idempotency-Key'], `questionnaire/${id}`);
    const message = JSON.parse(options.body);
    assert.equal(message.from, 'questionnaire@mail.wgholdings.co.nz');
    assert.deepEqual(message.to, ['info@wgholdings.co.nz']);
    assert.deepEqual(message.cc, ['js8490674@gmail.com']);
    assert.equal(message.reply_to, 'sample@example.com');
    assert.match(message.html, /&lt;example&gt;/);
    return fetch.mock.callCount() === 0
      ? Response.json({ message: 'Forbidden' }, { status: 403 })
      : Response.json({ id: 'resend-message-id' });
  });
  const env = { RESEND_API_KEY: ' test-key ' };
  await assert.rejects(sendResend(submission, env), { status: 403 });
  await sendResend(submission, env);
});

test('questionnaire confirms only after email succeeds and can retry on the same reference', async () => {
  const context = { window: {} };
  runInNewContext(readFileSync('wh-sms/questions.js', 'utf8'), context);
  const origin = 'https://site.example';
  const deliveries = [];
  const handler = createQuestionnaireHandler({
    env: {
      QUESTIONNAIRE_SITE_ORIGIN: origin, RESEND_API_KEY: 'test'
    },
    send: async submission => {
      deliveries.push(submission);
      if (deliveries.length === 1) throw new Error('Simulated mail failure');
    }
  });
  const pathway = 'sponsor';
  const { questions } = context.window.WHSMS_PREVIEW_QUESTIONS[pathway];
  const payload = {
    id: randomUUID(),
    pathway,
    answers: Object.fromEntries(questions.map(q => [q.id, q.choices?.[0]?.id ?? 'Sample answer'])),
    contact: { name: 'Sample Person', email: 'sample@example.com', phone: '' }
  };
  const post = (body, requestOrigin = origin) => handler(new Request(`${origin}/api/questionnaire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: requestOrigin },
    body: JSON.stringify(body)
  }));
  assert.equal((await post(payload, 'https://other.example')).status, 403);
  assert.equal((await post({ ...payload, contact: { ...payload.contact, email: '' } })).status, 400);
  assert.equal(deliveries.length, 0);
  assert.equal((await post(payload)).status, 502);
  const response = await post(payload);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { reference: payload.id });
  assert.equal(deliveries.length, 2);
  assert.deepEqual(deliveries[1].contact, payload.contact);
  assert.equal(deliveries[1].responses[0].answer, questions[0].choices[0].label);
});
