"use client";

import React from 'react';

interface SEOStructuredDataProps {
  type: 'Article' | 'Product' | 'SoftwareApplication';
  data: {
    title: string;
    description: string;
    image?: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
    authorName?: string;
    publisherName?: string;
    publisherLogo?: string;
    // For Product / SoftwareApplication
    brand?: string;
    category?: string;
    price?: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock';
    operatingSystem?: string;
  };
}

/**
 * SEOStructuredData
 * Injects JSON-LD for rich search results (Article snippet for news, Product snippet for tools).
 */
export default function SEOStructuredData({ type, data }: SEOStructuredDataProps) {
  let schema: any = {
    "@context": "https://schema.org",
  };

  if (type === 'Article') {
    schema = {
      ...schema,
      "@type": "NewsArticle",
      "headline": data.title,
      "description": data.description,
      "image": [data.image].filter(Boolean),
      "datePublished": data.datePublished || new Date().toISOString(),
      "dateModified": data.dateModified || data.datePublished || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": data.authorName || "AI Portal Weekly Staff"
      },
      "publisher": {
        "@type": "Organization",
        "name": data.publisherName || "AI Portal Weekly",
        "logo": {
          "@type": "ImageObject",
          "url": data.publisherLogo || "https://www.aiportalweekly.com/logos/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": data.url
      }
    };
  } else if (type === 'Product') {
    schema = {
      ...schema,
      "@type": "Product",
      "name": data.title,
      "description": data.description,
      "image": [data.image].filter(Boolean),
      "brand": {
        "@type": "Brand",
        "name": data.brand || "AI Tool"
      },
      "category": data.category || "Software",
      "offers": {
        "@type": "Offer",
        "url": data.url,
        "price": data.price || "0",
        "priceCurrency": data.currency || "USD",
        "availability": `https://schema.org/${data.availability || 'InStock'}`
      }
    };
  } else if (type === 'SoftwareApplication') {
    schema = {
      ...schema,
      "@type": "SoftwareApplication",
      "name": data.title,
      "description": data.description,
      "image": [data.image].filter(Boolean),
      "applicationCategory": data.category || "Software",
      "operatingSystem": data.operatingSystem || "Web",
      "offers": {
        "@type": "Offer",
        "url": data.url,
        "price": data.price || "0",
        "priceCurrency": data.currency || "USD"
      }
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
