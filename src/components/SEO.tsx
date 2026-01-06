import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'BuboIQ - AI-Driven Proactive IT Support Intelligence';
const DEFAULT_DESCRIPTION = 'Multi-tenant IT intelligence platform for MSPs. Predict problems before they impact clients, correlate related issues automatically, and reduce alert noise by up to 85%.';
const DEFAULT_IMAGE = 'https://buboiq.com/og-image.png'; // Placeholder
const DEFAULT_URL = 'https://buboiq.com';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false
}) => {
  const fullTitle = title ? `${title} | BuboIQ` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const fullImage = image || DEFAULT_IMAGE;
  const fullUrl = url || DEFAULT_URL;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="BuboIQ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional Meta */}
      <meta name="theme-color" content="#00FF85" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};