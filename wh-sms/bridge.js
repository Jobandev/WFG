(() => {
  const config = window.WFG_CONFIG || {};
  const pathways = { sponsor: 'Visibility Labs / Sponsor', 'cyber-resilience': 'Cyber Resilience', 'business-systems': 'Business Systems' };
  const status = document.querySelector('[data-assessment-status]');
  const stage = document.querySelector('[data-assessment-stage]');
  const title = document.querySelector('[data-assessment-title]');
  const selection = document.querySelector('[data-assessment-selection]');
  const questionnaire = document.querySelector('[data-assessment-questionnaire]');
  const back = document.querySelector('[data-whsms-context-action]');
  const development = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname) && config.assessmentDevelopmentPreview === true;
  // Frames live only for this page's lifetime. Returning to cards never discards answers.
  const frames = new Map();
  const previewAnswers = new Map();
  const previewSteps = new Map();
  let activeFrame = null, activeOrigin = null;
  window.addEventListener('message', event => {
    if (!activeFrame || event.source !== activeFrame.contentWindow || event.origin !== activeOrigin || event.data?.type !== 'whsms:height' ||
        !Number.isInteger(event.data.height) || event.data.height < 500 || event.data.height > 20000) return;
    activeFrame.style.height = `${event.data.height}px`;
  });
  function render(focus = false) {
    const pathway = new URLSearchParams(location.search).get('pathway');
    for (const { frame } of frames.values()) frame.hidden = true;
    stage.querySelectorAll('[data-preview-panel]').forEach(panel => panel.hidden = true);
    activeFrame = null; activeOrigin = null;
    const valid = pathway && Object.hasOwn(pathways, pathway);
    selection.hidden = !!valid; questionnaire.hidden = !valid;
    back.textContent = valid ? '← Back to WH SMS' : '← Back to Website';
    back.href = valid ? location.pathname : '../';
    status.textContent = pathway && !valid ? 'Please choose one of the three pathways below.' : 'Choose an assessment. Production availability remains subject to release approval.';
    if (valid) {
      title.textContent = pathways[pathway];
      if (config.assessmentPreviewOnly === true && window.WHSMS_PREVIEW_QUESTIONS?.[pathway]) {
        showPreview(pathway);
        status.textContent = 'Questionnaire preview only — answers stay in this browser tab and are not submitted or saved to a server.';
      } else if (config.assessmentPathways?.[pathway] !== true || !config.assessmentAppUrl) {
        status.textContent = `${pathways[pathway]} is awaiting release approval.`;
      } else {
        let url;
        try {
          url = new URL(config.assessmentAppUrl, location.href);
          if (url.username || url.password || url.search || url.hash || (url.protocol !== 'https:' && !(development && url.origin === location.origin && url.protocol === 'http:'))) throw new Error('Invalid app URL');
        } catch { status.textContent = 'The assessment connection is not configured. Please contact the team.'; return; }
        url.searchParams.set('pathway', pathway); url.searchParams.set('theme', 'wfg'); url.searchParams.set('embed', 'website');
        if (development) url.searchParams.set('integration', '1');
        let cached = frames.get(pathway);
        if (!cached) {
          const frame = document.createElement('iframe');
          frame.title = `${pathways[pathway]} assessment`; frame.src = url.href;
          frame.referrerPolicy = 'no-referrer'; frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
          frame.className = 'assessment-frame';
          cached = { frame, origin: url.origin }; frames.set(pathway, cached); stage.append(frame);
        }
        activeFrame = cached.frame; activeOrigin = cached.origin; activeFrame.hidden = false;
        status.textContent = development
          ? 'Local development preview — synthetic data only. Responses are saved to local SQLite. Pending content and routing approvals remain in force. No notifications are sent.'
          : 'Complete the assessment below. Contact details are requested only according to the selected pathway.';
      }
    }
    if (focus) {
      const heading = valid ? title : document.querySelector('[data-selection-title]');
      heading.focus(); window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  function showPreview(pathway) {
    const data = window.WHSMS_PREVIEW_QUESTIONS[pathway];
    let panel = stage.querySelector(`[data-preview-panel="${pathway}"]`);
    if (!panel) {
      panel = document.createElement('section');
      panel.dataset.previewPanel = pathway;
      panel.className = 'whsms-preview';
      stage.append(panel);
    }
    panel.hidden = false;
    const answers = previewAnswers.get(pathway) || {};
    previewAnswers.set(pathway, answers);
    let index = previewSteps.get(pathway) || 0;
    const questions = data.questions;
    const make = (tag, cls, text) => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text !== undefined) el.textContent = text;
      return el;
    };
    function draw() {
      panel.replaceChildren();
      if (index >= questions.length) {
        panel.append(make('p', 'preview-kicker', 'PREVIEW COMPLETE'));
        panel.append(make('h2', '', 'Thank you for exploring the questions.'));
        panel.append(make('p', '', 'No answers have been submitted, stored on a server, or sent to Wolfgramm Holdings.'));
        const restart = make('button', 'button primary', 'Start again');
        restart.type = 'button';
        restart.addEventListener('click', () => { previewAnswers.set(pathway, {}); index = 0; previewSteps.set(pathway, index); draw(); });
        panel.append(restart);
        return;
      }
      const q = questions[index];
      panel.append(make('p', 'preview-kicker', `QUESTION ${index + 1} OF ${questions.length}`));
      const progress = make('progress', 'preview-progress');
      progress.max = questions.length; progress.value = index + 1;
      progress.setAttribute('aria-label', 'Question progress'); panel.append(progress);
      const heading = make('h2', '', q.prompt); panel.append(heading);
      const form = make('form', 'preview-form');
      let control;
      if (q.type === 'choice') {
        const choices = make('div', 'preview-choices');
        for (const option of q.choices) {
          const label = make('label', 'preview-choice');
          const input = document.createElement('input');
          input.type = 'radio'; input.name = `answer-${pathway}-${q.id}`; input.value = option.id;
          input.checked = answers[q.id] === option.id;
          label.append(input, make('span', '', option.label)); choices.append(label);
        }
        control = choices;
      } else {
        control = document.createElement(q.multiline ? 'textarea' : 'input');
        if (!q.multiline) control.type = 'text';
        control.className = 'preview-text'; control.maxLength = q.maxLength;
        control.value = answers[q.id] || '';
        control.setAttribute('aria-label', q.prompt);
      }
      form.append(control);
      const error = make('p', 'preview-error'); error.setAttribute('role', 'alert'); form.append(error);
      const actions = make('div', 'preview-actions');
      const prev = make('button', 'button', 'Previous'); prev.type = 'button'; prev.disabled = index === 0;
      prev.addEventListener('click', () => { index--; previewSteps.set(pathway, index); draw(); });
      const next = make('button', 'button primary', index === questions.length - 1 ? 'Finish preview' : 'Next question');
      next.type = 'submit'; actions.append(prev, next); form.append(actions);
      form.addEventListener('submit', event => {
        event.preventDefault();
        const value = q.type === 'choice' ? form.querySelector('input:checked')?.value : control.value.trim();
        if (q.required && !value) { error.textContent = 'Please answer this question to continue.'; return; }
        answers[q.id] = value || '';
        index++; previewSteps.set(pathway, index); draw();
      });
      panel.append(form);
    }
    draw();
  }
  function navigate(pathway) {
    const url = new URL(location.href); url.search = ''; url.hash = '';
    if (pathway) url.searchParams.set('pathway', pathway);
    history.pushState(null, '', url); render(true);
  }
  document.querySelectorAll('[data-assessment-pathway]').forEach(link => link.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigate(link.dataset.assessmentPathway);
  }));
  back.addEventListener('click', event => {
    if (!questionnaire.hidden && !event.button && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); navigate(null); }
  });
  window.addEventListener('popstate', () => render(true)); render();
})();
