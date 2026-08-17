import { MessageCircle, Mail } from "lucide-react";
import { getStoreSettings } from "@/lib/content/store-settings";

export async function CustomOrderBox({ productName }: { productName: string }) {
  const settings = await getStoreSettings();
  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        `Hi Dar Asala, I'd like to ask about customizing the ${productName}.`
      )}`
    : null;
  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(`Custom order — ${productName}`)}`;

  return (
    <div className="rounded-sm border border-tan bg-sand/50 p-6">
      <p className="font-serif-display text-xl text-charcoal">Your Bag, Your Details</p>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
        Every piece is made by hand. Ask us about a different leather color, strap length, size,
        monogram initials or hardware finish.
      </p>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-charcoal px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
        )}
        <a
          href={emailHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-charcoal px-4 py-3 text-sm font-medium text-ivory transition-colors hover:bg-leather"
        >
          <Mail className="h-4 w-4" />
          Email the Atelier
        </a>
      </div>
    </div>
  );
}
