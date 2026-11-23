import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
test('committed configuration cannot enable unapproved production pathways', () => {
  const context = { window: {} }; runInNewContext(readFileSync('site-config.js', 'utf8'), context);
  const config = context.window.WFG_CONFIG;
  assert.equal(config.assessmentAppUrl, null);
  assert.equal(config.assessmentDevelopmentPreview, false);
  assert.ok(Object.values(config.assessmentPathways).every(value => value === false));
  assert.equal(config.whatsappUrl, 'https://wa.me/64226064444');
});
test('all original WhatsApp anchors and messages are preserved', () => {
  const anchors = source => [...source.matchAll(/<a\b[^>]*data-wh-sms[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
  for (const file of ['index.html', 'digital/index.html', 'relational/index.html']) {
    const original = execFileSync('git', ['show', `origin/main:${file}`], { encoding: 'utf8' });
    assert.deepEqual(anchors(readFileSync(file, 'utf8')), anchors(original), file);
  }
});
test('host integration contains no copied backend or webhook settings', () => {
  const bridge = readFileSync('assessments/bridge.js', 'utf8');
  assert.doesNotMatch(bridge, /N8N_|WEBHOOK_SECRET|contact\.email|postMessage\(/);
  assert.match(bridge, /Object\.hasOwn\(pathways, pathway\)/);
  assert.match(bridge, /referrerPolicy = 'no-referrer'/);
});
