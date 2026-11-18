/* Site configuration: the one file to edit for content hooks. */
window.TILLENIUM_CONFIG = {
  /* ---- Streamlit quantitative dashboard ----
     Replace with the live dashboard URL. While it still contains YOUR-, the buttons fall back
     to the on-page showcase so visitors never hit a dead link. */
  terminalUrl: 'https://YOUR-APP.streamlit.app',   /* "Explore Terminal" buttons */
  appUrl: 'https://YOUR-APP.streamlit.app',        /* "Launch App" buttons and the demo link after sign-up */

  /* ---- Access-request email delivery ----
     provider: 'formspree' (default) or 'emailjs'. Until the IDs below are filled in, submissions are
     only simulated in the browser and NO email is sent. */
  inboxEmail: 'admin@tillenium.network',
  provider: 'formspree',
  formspreeId: 'YOUR_FORM_ID',                     /* from formspree.io/f/<id> */
  emailjs: { serviceId: 'YOUR_SERVICE_ID', templateId: 'YOUR_TEMPLATE_ID', publicKey: 'YOUR_PUBLIC_KEY' },
  accessEndpoint: null,                            /* optional custom endpoint; overrides provider */
  blockFreeEmailDomains: false,

  /* ---- Hero backdrop (all optional) ---- */
  heroImage: 'hero-bg.jpg',        /* used only if the file exists */
  heroVideo: null,                                 /* e.g. 'hero-loop.mp4' */
  heroVideoPoster: null,
  /* Illustrative signal tape behind the hero: [label, value, % change]. Not live market data. */
  backdrop: [
    ['PORT-DWELL AE', 4.82, 0.31], ['LEAD-T2 SEMI', 38.4, -0.62], ['FRT-RATE TP', 1912, 1.18], ['INV-DAYS IDX', 71.2, 0.44],
    ['CONC-RISK A', 6.8, 0.9], ['SUPPLY-GAP B', 2.14, -0.27], ['LANE-UTIL EU', 87.5, 0.15], ['BACKLOG IDX', 112.6, -0.81],
    ['TIER1-DELAY', 3.6, 0.52], ['SPOT-FRT AS', 2480, -1.34], ['FILING-VELOCITY', 214, 2.07], ['MODEL-CONF', 80, 0.0],
  ],

  galleryCategories: [
    { id: 'dossier', label: 'Research dossiers' },
    { id: 'pdf', label: 'PDF reports' },
    { id: 'supply', label: 'Supply chain maps' },
    { id: 'risk', label: 'Risk assessment' },
    { id: 'terminal', label: 'Terminal screenshots' },
    { id: 'charts', label: 'Charts and graphs' },
  ],

  /* Curated by Tillenium: add PNGs in this same folder with these names (or edit the paths).
     Until a file exists, a sample layout is drawn in its place. */
  gallery: [
    { category: 'dossier', title: 'Dossier cover and executive summary', caption: 'Thesis, key findings and filing citations on page one.', src: 'dossier-01.png' },
    { category: 'dossier', title: 'Catalysts and valuation bridge', caption: 'Event timeline linked to the filings that triggered it.', src: 'dossier-02.png' },
    { category: 'pdf', title: 'Full multi-page report', caption: 'A complete dossier exported as a print-ready PDF.', src: 'pdf-01.png' },
    { category: 'pdf', title: 'Appendix: source map', caption: 'Every claim traced back to its EDGAR filing or data feed.', src: 'pdf-02.png' },
    { category: 'supply', title: 'Tier 1 to Tier 3 exposure map', caption: 'Supplier and customer concentration across the network.', src: 'supply-01.png' },
    { category: 'supply', title: 'Lane and port telemetry overlay', caption: 'Dwell-time and lead-time drift on the routes that matter.', src: 'supply-02.png' },
    { category: 'risk', title: 'Risk assessment matrix', caption: 'Probability against impact, scored per exposure.', src: 'risk-01.png' },
    { category: 'risk', title: 'Predictive model scenario bands', caption: 'Forecast ranges with the assumptions stated beside them.', src: 'risk-02.png' },
    { category: 'terminal', title: 'Terminal overview', caption: 'Filing feed, exposure map and risk score on one screen.', src: 'terminal-01.png' },
    { category: 'terminal', title: 'Signal monitor', caption: 'Ranked alerts across filings, telemetry and models.', src: 'terminal-02.png' },
    { category: 'charts', title: 'Institutional chart pack', caption: 'Exposure, lead-time and valuation charts for committee use.', src: 'charts-01.png' },
    { category: 'charts', title: 'Scenario and sensitivity graphs', caption: 'Forecast bands and sensitivities with stated assumptions.', src: 'charts-02.png' },
  ],

  /* Illustrative rows for the hero terminal. Not live data. */
  feed: [
    ['10-K', 'Customer concentration disclosure amended', 'med'],
    ['8-K', 'Material supply agreement terminated', 'high'],
    ['10-Q', 'Inventory days up on prior quarter', 'med'],
    ['TELEM', 'Port dwell-time anomaly, Asia to Europe lane', 'high'],
    ['13F', 'Institutional position change flagged', 'low'],
    ['TELEM', 'Tier 2 supplier lead-time drift', 'med'],
    ['10-K', 'New risk factor: single-source dependency', 'high'],
    ['FORM 4', 'Insider transaction cluster', 'low'],
  ],
};
