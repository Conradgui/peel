/**
 * Peel motion + shadow constants for JS code.
 *
 * Why JS and not CSS @theme?
 *   - Framer Motion springs take JS objects (`{ damping, stiffness }`),
 *     not CSS variables.
 *   - OrangeRain timing constants are read by animation logic.
 *   - Shadows used in CSS-in-JS / inline styles where Tailwind doesn't apply.
 *
 * Colors / fonts / type scale live in src/app/globals.css under @theme.
 * Source of truth: PRD § 7 Appendix A/B/C.
 */

export const motion = {
  ease: {
    natural: 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
  spring: {
    default: { damping: 25, stiffness: 200 },
    bouncy: { damping: 15, stiffness: 150 },
    slow: { damping: 30, stiffness: 100 },
  },
  duration: {
    quick: 150,
    standard: 300,
    page: 500,
    rainDrop: 4500,
    rainTotal: 7500,
    pomodoroFade: 200,
    restFade: 2000,
  },
} as const;

export const shadows = {
  subtle: '0 1px 2px rgba(0,0,0,0.04)',
  soft: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  lifted: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
} as const;
