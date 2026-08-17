const NOTES = [
  {
    title: "Leather Varies Naturally",
    copy: "Natural leather contains variations in grain, tone and texture. No two hides — and no two bags — are ever perfectly identical.",
  },
  {
    title: "Handmade Means Unique",
    copy: "Minor differences in stitching and finishing are the signature of handcraftsmanship, not a flaw.",
  },
  {
    title: "Color May Vary From Photography",
    copy: "Screen settings and the natural character of leather can cause subtle differences from the photos shown.",
  },
];

export function BeforeYouOrder() {
  return (
    <div>
      <p className="mb-4 font-serif-display text-xl text-charcoal md:text-2xl">Before You Order</p>
      <div className="grid gap-4 md:grid-cols-3">
        {NOTES.map((note) => (
          <div key={note.title} className="rounded-sm bg-sand/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-leather">{note.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{note.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
