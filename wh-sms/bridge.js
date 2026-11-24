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
  let activeFrame = null, activeOrigin = null;
  window.addEventListener('message', event => {
    if (!activeFrame || event.source !== activeFrame.contentWindow || event.origin !== activeOrigin || event.data?.type !== 'whsms:height' ||
        !Number.isInteger(event.data.height) || event.data.height < 500 || event.data.height > 20000) return;
    activeFrame.style.height = `${event.data.height}px`;
  });
  function render(focus = false) {
    const pathway = new URLSearchParams(location.search).get('pathway');
    for (const { frame } of frames.values()) frame.hidden = true;
    activeFrame = null; activeOrigin = null;
    const valid = pathway && Object.hasOwn(pathways, pathway);
    selection.hidden = !!valid; questionnaire.hidden = !valid;
    back.textContent = valid ? '← Back to WH SMS' : '← Back to Website';
    back.href = valid ? location.pathname : '../';
    status.textContent = pathway && !valid ? 'Please choose one of the three pathways below.' : 'Choose an assessment. Production availability remains subject to release approval.';
    if (valid) {
      title.textContent = pathways[pathway];
      if (config.assessmentPathways?.[pathway] !== true || !config.assessmentAppUrl) {
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
