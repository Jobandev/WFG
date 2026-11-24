import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
const whsms = resolve(process.env.WHSMS_ROOT || '../whsms-website-host');
const { pathways } = await import(pathToFileURL(resolve(whsms, 'frontend/src/config/pathways.js')).href);
const { verifyWebsiteAutomation } = await import(pathToFileURL(resolve(whsms, 'tests/fixtures/verify-website-automation.mjs')).href);
async function enter(page, pathway) {
  await page.goto('/digital/');
  await expect(page.locator('[data-wh-sms]').first()).toHaveAttribute('href', /^https:\/\/wa.me\//);
  await page.locator(`[data-website-assessment="${pathway}"]`).click();
  await expect(page.locator('[data-assessment-status]')).toContainText('synthetic data only');
  return page.frameLocator('iframe');
}
async function questions(frame, pathway) {
  for (const question of pathways[pathway].questions) {
    if (question.type === 'choice') {
      await expect(frame.getByRole('group', { name: question.prompt })).toBeVisible();
      await frame.getByRole('button', { name: question.choices[0].label, exact: false }).click();
    } else {
      await frame.getByRole('textbox').fill('Synthetic local assessment');
      await frame.getByRole('button', { name: 'Send answer' }).click();
    }
  }
}
async function contact(frame) {
  await frame.getByRole('textbox').fill('Synthetic Tester');
  await frame.getByRole('button', { name: 'Send answer' }).click();
  await frame.getByRole('button', { name: 'Skip' }).click();
  await frame.getByRole('textbox').fill('synthetic@example.invalid');
  await frame.getByRole('button', { name: 'Send answer' }).click();
  await frame.getByRole('button', { name: 'Email', exact: true }).click();
  await frame.getByRole('button', { name: 'Agree and send' }).click();
  await expect(frame.getByRole('alert')).toContainText('tick the box');
  await frame.getByRole('checkbox').check();
  await frame.getByRole('button', { name: 'Agree and send' }).click();
}
for (const pathway of ['sponsor', 'cyber-resilience', 'business-systems']) test(`website -> ${pathway} -> durable backend receipt`, async ({ page }) => {
  let sent, receipt;
  page.on('request', request => { if (request.url().endsWith('/api/connectors/submissions')) sent = request.postDataJSON(); });
  page.on('response', async response => { if (response.url().endsWith('/api/connectors/submissions') && response.status() === 201) receipt = await response.json(); });
  const frame = await enter(page, pathway); await questions(frame, pathway);
  if (pathway === 'sponsor') await contact(frame);
  else await frame.getByRole('button', { name: 'No thanks' }).click();
  await expect(frame.getByRole('status')).toContainText(/Reference: sub_/);
  await expect.poll(() => receipt?.submissionId).toBeTruthy();
  expect(sent.connectorType).toBe(pathway);
  if (pathway !== 'sponsor') { expect(sent.contact).toBeUndefined(); expect(sent.consent).toBeUndefined(); }
  const db = new DatabaseSync(resolve(whsms, 'work/website-e2e.sqlite'), { readOnly: true });
  try {
    const row = db.prepare('SELECT submission_id, received_at FROM submissions WHERE session_id=?').get(sent.metadata.sessionId);
    expect(row.submission_id).toBe(receipt.submissionId); expect(Number.isFinite(Date.parse(row.received_at))).toBe(true);
    expect(db.prepare('SELECT state FROM automation_outbox WHERE submission_id=?').get(row.submission_id).state).toBe('pending');
  } finally { db.close(); }
  const automation = await verifyWebsiteAutomation(resolve(whsms, 'work/website-e2e.sqlite'), sent.metadata.sessionId);
  expect(automation).toMatchObject({ mode: 'mock-n8n-code', delivered: 1, queueState: 'delivered', accepted: 1, intents: pathway === 'sponsor' ? 1 : 0, messages: pathway === 'sponsor' ? 1 : 0 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('backend failure stays unsuccessful and retries keep the original session', async ({ page }) => {
  let first = true; const sessions = [];
  await page.route('**/api/connectors/submissions', async route => {
    sessions.push(route.request().postDataJSON().metadata.sessionId);
    if (first) { first = false; await route.fulfill({ status: 503, json: { success: false, message: 'Synthetic backend unavailable' } }); }
    else await route.continue();
  });
  const frame = await enter(page, 'cyber-resilience'); await questions(frame, 'cyber-resilience');
  await frame.getByRole('button', { name: 'No thanks' }).click();
  await expect(frame.getByRole('alert')).toContainText('Synthetic backend unavailable');
  await expect(frame.getByText('Reference:')).toHaveCount(0);
  const retryReceipt = page.waitForResponse(response => response.url().endsWith('/api/connectors/submissions'));
  await frame.getByRole('button', { name: 'Try sending again' }).click();
  const response = await retryReceipt;
  expect(response.status()).toBe(201);
  const receipt = await response.json();
  expect(receipt.success).toBe(true); expect(receipt.submissionId).toMatch(/^sub_/);
  await expect(frame.getByRole('status')).toContainText(/Reference: sub_/);
  expect(sessions).toHaveLength(2); expect(sessions[0]).toBe(sessions[1]);
});
test('original navigation, WhatsApp and subdirectory links still work', async ({ page }) => {
  await page.goto('/WFG/');
  await expect(page.locator('[data-wh-sms]').first()).toHaveAttribute('href', /wa.me\/64226064444/);
  await page.locator('[data-website-assessment="hub"]').click();
  await expect(page).toHaveURL(/\/WFG\/assessments\//);
  await expect(page.getByRole('button', { name: 'Open Sponsor pathway' })).toBeVisible();
  if (test.info().project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded', 'true');
  }
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Relational Outcomes' }).click();
  await expect(page).toHaveURL(/\/relational\//);
  await expect(page.locator('[data-wh-sms]').first()).toHaveAttribute('href', /^https:\/\/wa.me\//);
});
test('disabled public settings and hostile pathway values cannot load assessments', async ({ page }) => {
  await page.route('**/site-config.js*', route => route.fulfill({ contentType: 'text/javascript', body: 'window.WFG_CONFIG={whatsappUrl:"https://wa.me/64226064444",assessmentAppUrl:null,assessmentPathways:{sponsor:false}};' }));
  await page.goto('/assessments/?pathway=sponsor');
  await expect(page.locator('[data-assessment-status]')).toContainText('awaiting release approval');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.goto('/assessments/?pathway=javascript:alert(1)');
  await expect(page.locator('[data-assessment-status]')).toContainText('choose one');
  await expect(page.locator('iframe')).toHaveCount(0);
});
test('iframe resizes without exposing answers and ignores messages from the wrong source', async ({ page }) => {
  await enter(page, 'sponsor');
  const iframe = page.locator('iframe');
  await expect.poll(() => iframe.evaluate(element => element.style.height)).not.toBe('');
  const previous = await iframe.evaluate(element => element.style.height);
  await page.evaluate(() => window.postMessage({ type: 'whsms:height', height: 12345 }, location.origin));
  await expect(iframe).not.toHaveCSS('height', '12345px');
  await expect.poll(() => iframe.evaluate(element => element.style.height)).toBe(previous);
});
