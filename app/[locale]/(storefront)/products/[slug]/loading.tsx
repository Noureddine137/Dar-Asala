import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-6">
      <Skeleton className="h-4 w-48" />
      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-16">
        <Skeleton className="aspect-[4/5] w-full" />
        <div>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-3 h-4 w-32" />
          <Skeleton className="mt-4 h-6 w-24" />
          <Skeleton className="mt-6 h-16 w-full" />
          <Skeleton className="mt-8 h-10 w-full" />
          <Skeleton className="mt-4 h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
