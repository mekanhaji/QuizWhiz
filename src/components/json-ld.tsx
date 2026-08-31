// Escapes "<" so a payload value containing "</script>" can't break out of
// the script tag it's embedded in.
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
