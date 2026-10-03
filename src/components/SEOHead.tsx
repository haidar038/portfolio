import { Helmet } from 'react-helmet-async';
import { useI18n } from '../i18n/useI18n';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = 'https://hydr.codes';

export default function SEOHead(props: SEOHeadProps) {
  const { locale } = useI18n();
  const fullTitle = `${props.title}`;
  const ogImage = new URL(props.image ?? '/hdr.avif', SITE_URL).toString();
  const canonicalUrl = new URL(props.url ?? '/', SITE_URL).toString();
  const structuredData = props.structuredData
    ? Array.isArray(props.structuredData)
      ? props.structuredData
      : [props.structuredData]
    : [];

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{fullTitle}</title>
      <meta name="description" content={props.description} />
      <meta name="author" content="M. Khaidar" />
      {props.noindex && <meta name="robots" content="noindex,follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={props.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={props.imageAlt ?? fullTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={props.type ?? 'website'} />
      <meta property="og:site_name" content="M. Khaidar Portfolio" />
      <meta property="og:locale" content={locale === 'id' ? 'id_ID' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={props.imageAlt ?? fullTitle} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
