/**
 * Structured Data (JSON-LD) for SEO
 * Helps search engines understand the website content
 */

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://imagegen.ai/#website",
        url: "https://imagegen.ai/",
        name: "ImageGen AI",
        description: "Transform your photos into stunning AI art",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://imagegen.ai/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://imagegen.ai/#organization",
        name: "ImageGen AI",
        url: "https://imagegen.ai/",
        logo: {
          "@type": "ImageObject",
          url: "https://imagegen.ai/logo.png",
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://twitter.com/imagegen_ai",
          "https://linkedin.com/company/imagegen-ai",
        ],
      },
      {
        "@type": "WebApplication",
        name: "ImageGen AI Studio",
        url: "https://imagegen.ai/studio",
        applicationCategory: "DesignApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "49",
          offerCount: "3",
          offers: [
            {
              "@type": "Offer",
              name: "Free Plan",
              price: "0",
              priceCurrency: "USD",
            },
            {
              "@type": "Offer",
              name: "Pro Plan",
              price: "19",
              priceCurrency: "USD",
            },
            {
              "@type": "Offer",
              name: "Studio Plan",
              price: "49",
              priceCurrency: "USD",
            },
          ],
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "ImageGen AI",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web, iOS, Android",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does ImageGen AI work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ImageGen AI uses advanced AI models to transform your photos into various artistic styles. Simply upload an image, choose a style preset, and our AI will generate a stylized version in seconds.",
            },
          },
          {
            "@type": "Question",
            name: "What styles are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer 6 artistic styles: Storybook 3D, Anime Cel, Clay Render, Pixart, Voxel Block, and Marble Sculpture. Each style transforms your image with unique artistic characteristics.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a free plan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Our free plan includes 3 image generations per month. Perfect for trying out the service before upgrading to Pro (75/month) or Studio (175/month) plans.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
