window.WFG_CONFIG = {
  whatsappUrl: 'https://wa.me/64226064444',
  contactUrl: 'https://wgholdings.co.nz/contact/',
  workshopsUrl: 'https://wgholdings.co.nz/workshops/',
  // Public application address, never a webhook or credential. Disabled until approved.
  assessmentAppUrl: null,
  assessmentPathways: { sponsor: false, 'cyber-resilience': false, 'business-systems': false },
  assessmentPreviewOnly: true,
  questionnaireSubmitUrl: globalThis.location?.hostname === 'wfg-questionnaire.vercel.app'
    ? '/api/questionnaire'
    : null,
  assessmentDevelopmentPreview: false
};
