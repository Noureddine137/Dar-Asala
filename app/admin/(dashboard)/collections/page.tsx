import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif-display text-3xl">Collections</h1>
        <Link href="/admin/collections/new" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
          + New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No collections yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Title</th>
                <th className="py-2 font-medium">Slug</th>
                <th className="py-2 font-medium">Products</th>
                <th className="py-2 font-medium">Position</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id} className="border-b border-sand/60">
                  <td className="py-2.5">
                    <Link href={`/admin/collections/${c.id}`} className="underline">
                      {c.title}
                    </Link>
                  </td>
                  <td className="py-2.5 text-muted">/{c.slug}</td>
                  <td className="py-2.5">{c._count.products}</td>
                  <td className="py-2.5">{c.position}</td>
                  <td className="py-2.5">{c.active ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
