import Image from "next/image";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function PageHeader({
  title,
  description,
  image,
  breadcrumb,
}: {
  title: string;
  description?: string;
  image?: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  if (image) {
    return (
      <div className="relative flex h-56 items-end overflow-hidden bg-charcoal md:h-72">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-70" priority />
        <div className="container-page relative z-10 pb-6 md:pb-8">
          <Breadcrumb items={breadcrumb} light />
          <h1 className="mt-2 font-serif-display text-3xl text-ivory md:text-4xl">{title}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb items={breadcrumb} />
      <h1 className="mt-4 font-serif-display text-3xl text-charcoal md:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-sm text-charcoal/80 md:text-base">{description}</p>}
    </div>
  );
}
