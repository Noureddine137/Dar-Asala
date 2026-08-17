import { prisma } from "@/lib/db/prisma";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-3xl">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-muted">{subscribers.length} total</p>
        </div>
        <a href="/admin/newsletter/export" className="rounded-sm border border-sand px-4 py-2 text-sm">
          Export CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No subscribers yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Subscribed</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-sand/60">
                  <td className="py-2.5">{s.email}</td>
                  <td className="py-2.5">{s.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="py-2.5">{s.consented ? "Subscribed" : "Unsubscribed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
