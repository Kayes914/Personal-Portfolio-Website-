'use client';

import { useEffect, useState } from 'react';

interface JsonLdProps {
  type: 'Person' | 'WebSite' | 'Organization' | 'Portfolio';
  data: Record<string, any>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const [jsonLd, setJsonLd] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // Build the appropriate JSON-LD structure based on type
    switch (type) {
      case 'Person':
        setJsonLd({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: data.name,
          url: data.url,
          image: data.image,
          jobTitle: data.jobTitle,
          sameAs: data.socialProfiles,
          description: data.description,
          ...data.additionalData
        });
        break;
      case 'WebSite':
        setJsonLd({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: data.name,
          url: data.url,
          description: data.description,
          ...data.additionalData
        });
        break;
      case 'Organization':
        setJsonLd({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: data.name,
          url: data.url,
          logo: data.logo,
          description: data.description,
          ...data.additionalData
        });
        break;
      case 'Portfolio':
        // Custom portfolio schema that combines person and their work
        setJsonLd({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              name: data.name,
              url: data.url,
              image: data.image,
              jobTitle: data.jobTitle,
              description: data.description,
              sameAs: data.socialProfiles,
            },
            {
              '@type': 'WebSite',
              name: data.websiteName || `${data.name}'s Portfolio`,
              url: data.url,
              description: data.description,
            }
          ]
        });
        break;
      default:
        setJsonLd(null);
    }
  }, [type, data]);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 