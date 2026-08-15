import { createProduct } from "@/lib/admin/actions";

export default function NewProductPage() {
  return (
    <div className="max-w-md">
      <h1 className="font-serif-display text-3xl">New Product</h1>
      <p className="mt-2 text-sm text-muted">
        Creates a draft product with placeholder copy. You can fill in the rest — including
        images and variants — on the edit screen.
      </p>
      <form action={createProduct} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border border-sand px-3 py-2 text-sm focus:border-charcoal focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
          Create Draft
        </button>
      </form>
    </div>
  );
}
