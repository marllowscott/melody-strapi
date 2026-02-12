// Strapi API Client Utility
// For Strapi 5 CMS integration

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface MediaFile {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface NavLink {
  id: number;
  text: string;
  href: string;
}

interface Button {
  id: number;
  text: string;
  link: string;
}

interface Homepage {
  id: number;
  logo?: {
    data: {
      attributes: MediaFile;
    };
  };
  navbar: NavLink[];
  heroTitle: string;
  heroSubtitle: string;
  heroButtons: Button[];
  heroImages?: {
    data: {
      attributes: MediaFile;
    }[];
  };
  heroBackgroundType?: 'image' | 'local' | 'color';
  heroBackgroundColor?: string;
  heroOverlayColor?: string;
  heroOverlayOpacity?: number;
  heroLocalImage?: string;
  contentSections?: ContentSectionType[];
}

// Content Section Base
interface BaseContentSection {
  __component: string;
  id: number;
  [key: string]: any;
}

// Number Item Component
interface NumberItem {
  id: number;
  number: string;
  label: string;
}

// Number Section Component
interface NumberSection extends BaseContentSection {
  __component: 'sections.number';
  title: string;
  description?: string;
  numberItems: NumberItem[];
}

// About Section Component
interface AboutSection extends BaseContentSection {
  __component: 'sections.about-section';
  title: string;
  subtitle?: string;
  description1?: string;
  description2?: string;
  bulletPoints?: string[];
  image?: {
    data: {
      attributes: MediaFile;
    };
  };
  buttonText?: string;
  buttonLink?: string;
}

// Card Component
interface Card {
  id: number;
  title: string;
  description?: string;
  icon?: {
    data: {
      attributes: MediaFile;
    };
  };
}

// Text Card Section Component
interface TextCardSection extends BaseContentSection {
  __component: 'sections.text-card';
  title: string;
  description?: string;
  cards: Card[];
}

// Service Component
interface Service extends BaseContentSection {
  __component: 'sections.service';
  title: string;
  description?: string;
  icon?: {
    data: {
      attributes: MediaFile;
    };
  };
}

// Testimonial Component
interface Testimonial extends BaseContentSection {
  __component: 'sections.testimonial';
  quote: string;
  name: string;
  title?: string;
}

// Text Image Section Component
interface TextImageSection extends BaseContentSection {
  __component: 'sections.text-image';
  title: string;
  description?: any; // blocks type
  image?: {
    data: {
      attributes: MediaFile;
    };
  };
}

// Union type for all content sections
type ContentSectionType = 
  | TextCardSection
  | NumberSection
  | TextImageSection
  | AboutSection
  | Service
  | Testimonial;

// Page Types
interface AboutPage {
  id: number;
  title: string;
  subtitle?: string;
  heroImage?: {
    data: {
      attributes: MediaFile;
    };
  };
  contentSections?: ContentSectionType[];
}

interface ServicesPage {
  id: number;
  title: string;
  subtitle?: string;
  heroImage?: {
    data: {
      attributes: MediaFile;
    };
  };
  contentSections?: ContentSectionType[];
}

interface ContactPage {
  id: number;
  title: string;
  subtitle?: string;
  heroImage?: {
    data: {
      attributes: MediaFile;
    };
  };
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  contentSections?: ContentSectionType[];
}

interface BookPage {
  id: number;
  title: string;
  subtitle?: string;
  heroImage?: {
    data: {
      attributes: MediaFile;
    };
  };
  bookingLink?: string;
  contentSections?: ContentSectionType[];
}

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  const url = `${STRAPI_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        })
      }
    });

    if (!response.ok) {
      console.error(`Strapi API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Strapi API Fetch Error:', error);
    return null;
  }
}

export async function getHomepage(): Promise<Homepage | null> {
  const data = await fetchAPI<StrapiResponse<Homepage>>('/api/homepage?populate=*');
  if (!data) return null;
  return data.data;
}

export async function getAboutPage(): Promise<AboutPage | null> {
  const data = await fetchAPI<StrapiResponse<AboutPage>>('/api/about-page?populate=*');
  if (!data) return null;
  return data.data;
}

export async function getServicesPage(): Promise<ServicesPage | null> {
  const data = await fetchAPI<StrapiResponse<ServicesPage>>('/api/services-page?populate=*');
  if (!data) return null;
  return data.data;
}

export async function getContactPage(): Promise<ContactPage | null> {
  const data = await fetchAPI<StrapiResponse<ContactPage>>('/api/contact-page?populate=*');
  if (!data) return null;
  return data.data;
}

export async function getBookPage(): Promise<BookPage | null> {
  const data = await fetchAPI<StrapiResponse<BookPage>>('/api/book-page?populate=*');
  if (!data) return null;
  return data.data;
}

export { STRAPI_URL };
