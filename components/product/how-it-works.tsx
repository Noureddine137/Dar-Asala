const STEPS = [
  { number: "1", title: "You Order", copy: "Choose your bag, color and options online or via our atelier." },
  { number: "2", title: "Handcrafted in Morocco", copy: "Your piece is cut, stitched and finished by hand in our workshop." },
  { number: "3", title: "Shipped to Your Door", copy: "Packed with care and shipped with tracking, wherever you are." },
];

export function HowItWorks() {
  return (
    <div>
      <p className="mb-5 text-center font-serif-display text-xl text-charcoal md:text-2xl">How It Works</p>
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {STEPS.map((step) => (
          <div key={step.number} className="rounded-sm bg-sand/50 p-4 text-center md:p-6">
            <span className="font-serif-display text-2xl text-leather md:text-3xl">{step.number}</span>
            <p className="mt-2 text-xs font-semibold text-charcoal md:text-sm">{step.title}</p>
            <p className="mt-1.5 hidden text-xs leading-relaxed text-charcoal/65 md:block">{step.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
