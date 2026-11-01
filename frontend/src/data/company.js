/**
 * Content for the company homepage at "/" (CompanyHomePage.jsx).
 *
 * Everything a non-developer is likely to edit lives here — services,
 * products, clients and projects — so the page component never needs to be
 * touched to change copy.
 *
 * CLIENTS and PROJECTS are TEMPORARY placeholders until the real list is
 * supplied. Replace the entries; the page renders whatever is in the arrays.
 */

export const INTRO =
  'SkillKoder is a Hyderabad-based technology company. We help businesses put AI to work — ' +
  'from intelligent assistants and workflow automation to custom business software — and ' +
  'through SkillKoder Academy we train the data and AI talent the industry needs.';

/** The three things SkillKoder builds. `icon` is a lucide-react icon name. */
export const SERVICES = [
  {
    icon: 'Brain',
    title: 'AI Solutions',
    text: 'Chatbots, AI assistants, document intelligence and predictive models built around your data and your workflows.',
    points: ['Generative AI & LLM apps', 'Chatbots & voice agents', 'Predictive analytics'],
  },
  {
    icon: 'Workflow',
    title: 'Automations',
    text: 'Replace repetitive manual work with workflows that run themselves — integrations, alerts, reports and approvals.',
    points: ['Workflow & RPA automation', 'System integrations & APIs', 'Automated reporting'],
  },
  {
    icon: 'Briefcase',
    title: 'Business Solutions',
    text: 'Custom web applications, CRMs and dashboards that give your team one place to run the business.',
    points: ['Custom web & mobile apps', 'CRM & ERP solutions', 'BI dashboards'],
  },
];

/** SkillKoder products. `link` is optional — an internal path or external URL. */
export const PRODUCTS = [
  {
    icon: 'GraduationCap',
    name: 'SkillKoder Academy',
    text: 'Live, project-based courses in Data Analytics, Data Science, Generative AI and Azure Data Engineering.',
    link: '/academy',
    cta: 'Explore courses',
  },
  {
    icon: 'Bot',
    name: 'SkillKoder AI Assistant',
    text: 'A customisable AI assistant that answers customer questions from your own documents, 24/7.',
  },
  {
    icon: 'LayoutDashboard',
    name: 'SkillKoder Insights',
    text: 'Ready-to-deploy business dashboards that turn spreadsheets and databases into live KPIs.',
  },
  {
    icon: 'Shirt',
    name: 'SkillKoder Virtual Try-On',
    text: 'Photograph any piece of clothing, take a photo of yourself, and AI shows how it looks on you in about a minute.',
    link: '/virtualtryon',
    cta: 'Try it on',
  },
];

/**
 * Current clients. Logos live in public/clients/.
 * `featured` renders a wide card first; `locations` lists the properties covered.
 * `logoBg` puts a light-coloured logo on a dark tile so it stays visible.
 */
export const CLIENTS = [
  {
    name: 'Hotel Greenpark',
    logo: '/clients/greenpark.svg',
    logoBg: '#1f2937', // their logo is white-on-dark
    featured: true,
    note: 'All Greenpark hotels in India',
    locations: ['Bengaluru', 'Coorg', 'Chennai', 'Hyderabad', 'Vizag'],
  },
  { name: 'Marigold Hotel', logo: '/clients/marigold.svg' },
  { name: 'Avasa Hotel', logo: '/clients/avasa.svg' },
];

/** TEMPORARY — replace with real projects. `status` is shown as a pill. */
export const PROJECTS = [
  {
    title: 'AI Customer Support Agent',
    status: 'In progress',
    text: 'An LLM-powered assistant that resolves first-line support queries from a knowledge base.',
    tags: ['Generative AI', 'Chatbot'],
  },
  {
    title: 'Invoice Processing Automation',
    status: 'Launching soon',
    text: 'Extracts, validates and posts invoice data to accounting software with no manual entry.',
    tags: ['Automation', 'Document AI'],
  },
  {
    title: 'Sales Performance Dashboard',
    status: 'Live',
    text: 'A real-time dashboard that unifies CRM and sales data into one view for leadership.',
    tags: ['Business Intelligence'],
  },
];

export const ABOUT_POINTS = [
  { value: 'AI-first', label: 'Every solution designed around data and AI' },
  { value: 'End-to-end', label: 'From idea and design to deployment and support' },
  { value: 'Talent', label: 'Our own academy trains the engineers we hire' },
];
