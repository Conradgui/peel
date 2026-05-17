/**
 * A2 sanity-test page: verifies Peel design tokens reach Tailwind utility classes.
 *
 * Expectations when rendered:
 *   - Body bg is cream-white (#FAFAF7), not pure white
 *   - "Peel" heading is Peel Orange Deep (#EA580C) at h1 size
 *   - Body copy is warm dark gray (#1F1F1B), Inter font, body size
 *   - "00:23:14" is JetBrains Mono at display size (80px)
 *   - Footnote is tertiary warm gray (#A3A3A0) at 12px
 *
 * Replaced by Task A3 (App Shell) — keep minimal.
 */
export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-h1 text-peel-orange-deep">Peel</h1>
      <p className="text-body text-text-secondary">
        Tokens wired. Peel back the assumptions about your time.
      </p>
      <p className="text-display font-mono text-text-primary">00:23:14</p>
      <p className="text-footnote text-text-tertiary">
        Cream-white background · Inter body · JetBrains Mono digits
      </p>
    </main>
  );
}
