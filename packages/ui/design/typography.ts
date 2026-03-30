// Reusable Typography Definitions matching Tailwind config
export const TYPOGRAPHY = {
  h1: { fontSize: '36px', lineHeight: '44px', fontWeight: '700' },
  h2: { fontSize: '28px', lineHeight: '36px', fontWeight: '600' },
  h3: { fontSize: '20px', lineHeight: '28px', fontWeight: '500' },
  body: {
    base: { fontSize: '14px', lineHeight: '20px' },
    sm: { fontSize: '16px', lineHeight: '24px' },
  },
} as const;
