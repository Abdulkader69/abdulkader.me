export type ProjectCategory =
  | 'Nonprofit'
  | 'Sports'
  | 'Business'
  | 'Wellness & Care'
  | 'Industry'
  | 'Education';

export type Project = {
  slug: string;
  name: string;
  url: string;
  category: ProjectCategory;
  /** One line shown under the name on cards and on the details page. */
  tagline: string;
  description: string;
  industry: string;
  location: string;
  /** Country used by the sidebar's region filter. */
  region: 'USA' | 'UK' | 'Fiji' | 'France' | 'Global';
  features: string[];
  stack: string[];
  /** Brand colour, used for the glow, monogram and accents on its pages. */
  color: string;
};

/**
 * Screenshots live in /public/projects: `-thumb` is the 720px hero shot,
 * `-desktop` a 1440px-wide full page and `-mobile` a 390pt-wide full page.
 */
export const shot = (slug: string, kind: 'thumb' | 'desktop' | 'mobile') =>
  `/projects/${slug}-${kind}.jpg`;

export const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export const projects: Project[] = [
  {
    slug: 'signupengine',
    name: 'SignUpEngine',
    url: 'https://signupengine.io/',
    category: 'Business',
    tagline: 'Conversion-focused websites & online registration',
    description:
      'Marketing site for a US growth platform that builds conversion-focused websites, online registration systems and lead-generation tools for sports clubs, event organisers, restaurants and service businesses.',
    industry: 'SaaS / Digital Marketing',
    location: 'United States',
    region: 'USA',
    features: [
      'Product pages for registration & lead generation',
      'Pricing and service breakdowns',
      'monday CRM integration for incoming leads',
      'Testimonials and FAQ sections',
    ],
    stack: ['WordPress', 'WooCommerce', 'jQuery', 'Slick', 'Yoast SEO'],
    color: '#6d3fd6',
  },
  {
    slug: 'standforthesilent',
    name: 'Stand for the Silent',
    url: 'https://standforthesilent.org/',
    category: 'Nonprofit',
    tagline: 'Anti-bullying nonprofit, founded in 2010',
    description:
      'Website for an Oklahoma-based anti-bullying nonprofit that delivers school presentations, scholarships and resources to raise awareness of bullying and teen suicide worldwide.',
    industry: 'Nonprofit',
    location: 'Oklahoma City, USA',
    region: 'USA',
    features: [
      'Dedicated hubs for students, schools and parents',
      'Scholarship programme and student chapters',
      'Downloadable handbooks and curricula',
      'Blog and Shopify-powered merch store',
    ],
    stack: ['WordPress', 'Shopify', 'jQuery', 'Slick', 'Yoast SEO'],
    color: '#1e8fd6',
  },
  {
    slug: 'jtcc',
    name: 'Junior Tennis Champions Center',
    url: 'https://jtcc.org/',
    category: 'Sports',
    tagline: 'Tennis for Everybody — nonprofit tennis academy',
    description:
      'Site for JTCC, a nonprofit tennis academy in College Park, Maryland serving juniors, adults, high-performance athletes and adaptive players, with satellite locations in Virginia and Florida.',
    industry: 'Sports & Education',
    location: 'College Park, Maryland, USA',
    region: 'USA',
    features: [
      'Programme finder for juniors, adults & high performance',
      'Membership and camp registration via Club Automation',
      'Events, news and alumni stories',
      'Community outreach and volunteer pages',
    ],
    stack: ['WordPress', 'WPML', 'Club Automation', 'jQuery', 'Yoast SEO'],
    color: '#1f4e9c',
  },
  {
    slug: 'tennisct',
    name: 'TennisCT',
    url: 'https://tennisct.com/',
    category: 'Sports',
    tagline: "Connecticut's premier network of tennis clubs",
    description:
      'Website for a network of indoor and outdoor tennis clubs across Fairfield, Darien and Trumbull, offering lessons, clinics, leagues and coaching for all ages and levels.',
    industry: 'Sports & Recreation',
    location: 'Connecticut, USA',
    region: 'USA',
    features: [
      'Club location pages',
      'Junior and adult programme listings',
      '"Learn Tennis Now" beginner funnel',
      'Lottie animations and Instagram feed',
    ],
    stack: ['WordPress', 'Elementor', 'Swiper', 'Lottie', 'Yoast SEO'],
    color: '#0f5fd6',
  },
  {
    slug: 'international-abrasives',
    name: 'International Abrasives',
    url: 'https://international-abrasives-ltd.co.uk/',
    category: 'Industry',
    tagline: "The UK's one-stop shop for industrial abrasives",
    description:
      'B2B catalogue for an exclusive UK distributor of four premium abrasive brands, supplying the industrial distribution market from Leicester since 2012.',
    industry: 'Industrial Supplies',
    location: 'Leicester, UK',
    region: 'UK',
    features: [
      'Product catalogue by category and brand',
      'CORE24 best-sellers range',
      'Quote and enquiry forms',
      'Downloads and technical resources',
    ],
    stack: ['WordPress', 'WooCommerce', 'WPForms', 'Rank Math'],
    color: '#d21f26',
  },
  {
    slug: 'donovan',
    name: 'Donovan Hair & Beauty',
    url: 'https://donovanhairandbeauty.co.uk/',
    category: 'Wellness & Care',
    tagline: 'Exquisite style, exceptional service',
    description:
      'Website for a hair and beauty salon in Blaby, Leicestershire, covering styling, colour, extensions, weddings, grooming and beauty treatments, with online booking.',
    industry: 'Hair & Beauty',
    location: 'Blaby, Leicestershire, UK',
    region: 'UK',
    features: [
      'Service menus for Her, Him and Beauty',
      'Phorest online booking integration',
      'GSAP-driven page animations',
      'News & blog',
    ],
    stack: ['WordPress', 'GSAP', 'Swiper', 'AOS', 'Phorest'],
    color: '#c9a36a',
  },
  {
    slug: 'peaksaunas',
    name: 'Peak Saunas',
    url: 'https://peaksaunas.co.uk/',
    category: 'Wellness & Care',
    tagline: 'Wild sauna & cold plunge in the Peak District',
    description:
      'Booking-led site for a wild sauna and cold-plunge experience on an organic farm in Derbyshire, offering community sessions, private hire and guided wellness events.',
    industry: 'Wellness',
    location: 'Derbyshire, UK',
    region: 'UK',
    features: [
      'Session types, pricing and booking',
      'Special events with guest instructors',
      'Health benefits & FAQ content',
      'Photo gallery',
    ],
    stack: ['WordPress', 'WooCommerce', 'ACF', 'AOS'],
    color: '#2f6b3a',
  },
  {
    slug: 'cranbornestone',
    name: 'Cranborne Stone',
    url: 'https://cranbornestone.co.uk/',
    category: 'Industry',
    tagline: 'The cast stone experts since 1968',
    description:
      'Catalogue site for a UK cast stone manufacturer making balustrades, columns, porticos, window surrounds and garden features for architects, builders and homeowners.',
    industry: 'Building Materials',
    location: 'Dorset, UK',
    region: 'UK',
    features: [
      'Product catalogue with detailed ranges',
      'Bespoke design and restoration services',
      'Projects showcase gallery',
      'Downloadable technical catalogues',
    ],
    stack: ['WordPress', 'Elementor', 'WooCommerce', 'WPForms', 'Rank Math'],
    color: '#8b7a5e',
  },
  {
    slug: 'ecoledesroches',
    name: 'École des Roches',
    url: 'https://www.ecoledesroches.com/',
    category: 'Education',
    tagline: 'International boarding school, founded 1899',
    description:
      'Bilingual site for a prestigious international boarding school in Normandy welcoming students aged 11–18 from 50+ nationalities, with French Baccalaureate and IB pathways.',
    industry: 'International Education',
    location: 'Normandy, France',
    region: 'France',
    features: [
      'French / English multilingual content',
      'Academic pathway pages (IB, Bac, FLE)',
      'Admissions and events via OpenApply',
      'Boarding life and campus activities',
    ],
    stack: ['WordPress', 'WPML', 'GSAP', 'OpenApply', 'Rank Math'],
    color: '#f0a623',
  },
  {
    slug: 'kibblesandcuts',
    name: 'Kibbles & Cuts',
    url: 'https://kibblesandcuts.com/',
    category: 'Wellness & Care',
    tagline: "Utah's premier choice for dog & cat grooming",
    description:
      'Website for a Utah pet-grooming chain with five locations, offering full grooming, bath & brush and specialist breed care alongside pet nutrition advice.',
    industry: 'Pet Care',
    location: 'Utah, USA',
    region: 'USA',
    features: [
      'Location finder for five salons',
      'Service menu and appointment booking',
      'Nutrition guidance',
      'Reviews and FAQ',
    ],
    stack: ['WordPress', 'Elementor', 'Rank Math'],
    color: '#f28c28',
  },
  {
    slug: 'virtuoso',
    name: 'Virtuoso',
    url: 'https://virtuoso.tech/',
    category: 'Business',
    tagline: 'Award-winning managed IT services',
    description:
      'Website for a London-headquartered managed IT provider operating across the UK, New Zealand and Australia, covering IT support, cyber security, cloud and Data & AI.',
    industry: 'IT Services',
    location: 'London, UK',
    region: 'UK',
    features: [
      'Service pages for IT, security, cloud and AI',
      'Customer stories and resource library',
      'Events and Trust Centre',
      'Multi-region content with WPML',
    ],
    stack: ['WordPress', 'Elementor', 'WPML', 'AOS', 'Rank Math'],
    color: '#f05a28',
  },
  {
    slug: 'qualitas',
    name: 'Qualitas Insurance Brokers',
    url: 'https://qualitasinsurance.co.uk/',
    category: 'Business',
    tagline: 'Insurance that performs',
    description:
      'Site for a UK commercial insurance broker serving founder-led SMEs, built around their free "Cover Rebuild Review" and sector-specific specialisms.',
    industry: 'Insurance',
    location: 'United Kingdom',
    region: 'UK',
    features: [
      'Tabbed sector specialisms',
      'Leaders’ stories and case studies',
      'Microsoft Bookings consultation scheduling',
      'Careers and team pages',
    ],
    stack: ['WordPress', 'Contact Form 7', 'AOS', 'Rank Math'],
    color: '#43c9a0',
  },
  {
    slug: 'epay',
    name: 'epay Worldwide',
    url: 'https://epayworldwide.com/',
    category: 'Business',
    tagline: 'We connect brands and consumers',
    description:
      'Global site for epay, part of Euronet Worldwide, a payments and content-distribution network for gift cards, prepaid and mobile products across 60+ countries.',
    industry: 'Fintech / Payments',
    location: 'Global',
    region: 'Global',
    features: [
      'Business and consumer product pages',
      'Partner, retailer & distribution network',
      'Use cases by region',
      'Links to 11 local country sites',
    ],
    stack: ['WordPress', 'jQuery', 'AOS'],
    color: '#2c2a7a',
  },
  {
    slug: 'goldtechcare',
    name: 'Goldtech Care',
    url: 'https://goldtechcare.com/',
    category: 'Wellness & Care',
    tagline: 'Personalised home care in Woking, Surrey',
    description:
      'Website for a home care agency supporting seniors and people with long-term conditions, offering personal, live-in, dementia, respite and end-of-life care.',
    industry: 'Healthcare',
    location: 'Woking, Surrey, UK',
    region: 'UK',
    features: [
      'Care service pages',
      'Team and careers section',
      'Blog',
      'Contact and enquiry forms',
    ],
    stack: ['WordPress', 'jQuery', 'Optimole'],
    color: '#2e2a8c',
  },
  {
    slug: 'livelearnfiji',
    name: 'Live & Learn Fiji',
    url: 'https://livelearnfiji.org/',
    category: 'Nonprofit',
    tagline: 'Preserving nature for a better earth tomorrow',
    description:
      'Site for an environmental-education nonprofit working with Pacific communities since 1999 on climate resilience, water & sanitation and disaster risk reduction.',
    industry: 'Environmental Nonprofit',
    location: 'Suva, Fiji',
    region: 'Fiji',
    features: [
      'Programme areas and impact',
      'Current and past projects',
      'News, media and resources',
      'Team and office contacts',
    ],
    stack: ['WordPress', 'GSAP', 'Bootstrap', 'jQuery'],
    color: '#1b8a6b',
  },
  {
    slug: 'gdl',
    name: 'Goulding Developments',
    url: 'https://gdl.com.fj/',
    category: 'Industry',
    tagline: 'Building success, managing every detail',
    description:
      'Website for a construction project-management company in Lautoka, Fiji that runs builds, renovations and refurbishments from concept to completion.',
    industry: 'Construction',
    location: 'Lautoka, Fiji',
    region: 'Fiji',
    features: [
      'Services and process overview',
      'Current and completed projects',
      'Meet the team',
      'Contact and enquiry',
    ],
    stack: ['WordPress', 'jQuery', 'Slick'],
    color: '#1d8fb3',
  },
];
