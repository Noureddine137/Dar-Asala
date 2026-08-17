import { createCollection } from "@/lib/admin/collections-actions";

export default function NewCollectionPage() {
  return (
    <div className="max-w-md">
      <h1 className="font-serif-display text-3xl">New Collection</h1>
      <p className="mt-2 text-sm text-muted">
        Creates a collection with placeholder copy. Fill in the rest — including product
        assignment — on the edit screen.
      </p>
      <form action={createCollection} className="mt-8 space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
            Collection Title
          </label>
          <input id="title" name="title" required className="input" />
        </div>
        <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
          Create Collection
        </button>
      </form>
    </div>
  );
}
