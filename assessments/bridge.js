(() => {
  const config = window.WFG_CONFIG || {};
  const pathways = { sponsor: 'Visibility Labs Sponsor', 'cyber-resilience': 'Cyber Resilience', 'business-systems': 'Business Systems' };
  const status = document.querySelector('[data-assessment-status]');
  const stage = document.querySelector('[data-assessment-stage]');
  const title = document.querySelector('[data-assessment-title]');
  const local = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
  const development = local && config.assessmentDevelopmentPreview === true;
  let activeFrame = null, activeOrigin = null;
  window.addEventListener('message', event => {
    if (!activeFrame || event.source !== activeFrame.contentWindow || event.origin !== activeOrigin || event.data?.type !== 'whsms:height' ||
        !Number.isInteger(event.data.height) || event.data.height < 500 || event.data.height > 20000) return;
    activeFrame.style.height = `${event.data.height}px`;
  });
  function open(pathway, focus = true) {
    if (!Object.hasOwn(pathways, pathway)) { status.textContent = 'Please choose one of the three pathways below.'; return; }
    if (config.assessmentPathways?.[pathway] !== true || !config.assessmentAppUrl) {
      status.textContent = `${pathways[pathway]} is awaiting release approval. You can still contact the team using WhatsApp.`;
      return;
    }
    let url;
    try {
      url = new URL(config.assessmentAppUrl, location.href);
      if (url.username || url.password || url.search || url.hash || (url.protocol !== 'https:' && !(development && url.origin === location.origin && url.protocol === 'http:'))) throw new Error('Invalid app URL');
    } catch { status.textContent = 'The assessment connection is not configured. Please use WhatsApp while the team checks it.'; return; }
    url.searchParams.set('pathway', pathway); url.searchParams.set('theme', 'wfg');
    if (development) url.searchParams.set('integration', '1');
    // Changing pathway must not silently discard in-memory answers.
    if (stage.childElementCount && !window.confirm('Changing pathways will clear answers in the current assessment. Continue?')) return;
    title.textContent = pathways[pathway];
    const readyMessage = development
      ? 'Local development preview — synthetic data only. Responses are saved to local SQLite. Cyber results and Business Systems content, consent and routing remain pending approval. No notifications are sent.'
      : 'Complete the assessment below. Contact details are requested only according to the selected pathway.';
    status.textContent = `Loading assessment… ${readyMessage}`;
    const frame = document.createElement('iframe');
    frame.title = `${pathways[pathway]} assessment`; frame.src = url.href;
    frame.referrerPolicy = 'no-referrer'; frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    frame.className = 'assessment-frame';
    activeFrame = frame; activeOrigin = url.origin;
    frame.addEventListener('load', () => { if (activeFrame === frame) status.textContent = readyMessage; });
    frame.addEventListener('error', () => { status.textContent = 'The assessment could not load. Use the separate-page link or WhatsApp.'; });
    const fallback = document.createElement('a'); fallback.href = url.href; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer';
    fallback.className = 'editorial-link'; fallback.textContent = 'Open assessment in a separate page';
    stage.replaceChildren(fallback, frame);
    if (focus) { title.focus(); title.scrollIntoView({ block: 'start', behavior: 'auto' }); }
    history.replaceState(null, '', `?pathway=${encodeURIComponent(pathway)}`);
  }
  document.querySelectorAll('[data-assessment-pathway]').forEach(button => button.addEventListener('click', () => open(button.dataset.assessmentPathway)));
  const selected = new URLSearchParams(location.search).get('pathway');
  if (selected) open(selected, false);
})();
