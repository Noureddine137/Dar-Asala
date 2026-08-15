import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-10">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-10 w-full max-w-lg" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="mt-3 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
