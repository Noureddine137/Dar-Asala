import { ButtonLink } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-serif-display text-3xl text-charcoal">Checkout cancelled</h1>
      <p className="max-w-md text-sm text-muted">
        Your order was not completed and your bag is still saved. You can pick up right where you
        left off.
      </p>
      <ButtonLink href="/cart" className="mt-2">
        Back to Bag
      </ButtonLink>
    </div>
  );
}
