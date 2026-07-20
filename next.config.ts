import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Erlaubt grössere FormData für Server Actions (Blog-Cover- und
    // Editor-Bild-Uploads). Default ist 1 MB; wir erlauben bis 10 MB.
    serverActions: { bodySizeLimit: "10mb" },
  },
  // Pakete, die Node-only oder native-deps haben und nicht in den Edge/Turbopack-Bundle
  // sollen (sonst "Failed to load external module" beim Aufruf einer Server-Action).
  serverExternalPackages: [
    "cheerio",
    "isomorphic-dompurify",
    "jsdom",
    "@vercel/blob",
    "postgres",
    "drizzle-orm",
    "nodemailer",
    "@react-email/render",
    "@react-email/components",
  ],
  images: {
    // AVIF/WebP statt der schweren Originale ausliefern; optimierte Varianten
    // ein Jahr lang cachen (entscheidend, da die Public-Routen dynamisch sind
    // — sonst wird jedes Bild bei jedem ersten Treffer neu optimiert).
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      // Vercel Blob – fuer Cover-Bilder und im Editor hochgeladene Bilder
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
  // Security-Response-Headers: gegen XSS, Clickjacking, Sniffing, Referer-Leaks etc.
  // CSP ist die wichtigste Defense-Layer — Vorsicht bei Inline-Scripts/Styles
  // (TipTap-Editor, React-Email, Inline-onload in next/image).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
              "font-src 'self' data:",
              // Client-Uploads im Blog-Editor (s. api/blog/upload): das
              // @vercel/blob-SDK lädt über https://vercel.com/api/blob/ hoch,
              // die Blob-Hosts decken direkte Store-Zugriffe ab.
              "connect-src 'self' https://vercel.com/api/blob/ https://*.blob.vercel-storage.com https://*.public.blob.vercel-storage.com",
              // Blog-Embeds: muss mit ALLOWED_IFRAME_HOSTS in
              // lib/blog/sanitize.ts deckungsgleich sein
              "frame-src 'self' https://www.linkedin.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
