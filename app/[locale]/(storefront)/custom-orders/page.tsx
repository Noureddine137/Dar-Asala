import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { CustomOrderForm } from "@/components/forms/custom-order-form";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Custom Orders",
  description: "Commission a bespoke, hand-built Dar Asala bag — your leather, your details.",
};

type Props = { params: Promise<{ locale: string }> };

export default async function CustomOrdersPage({ params }: Props) {
  const { locale } = await params;
  const [products, tNav, t] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { name: true }, orderBy: { name: "asc" } }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "customOrders" }),
  ]);

  return (
    <div>
      <PageHeader
        title={t("pageTitle")}
        image="/images/brand/custom-orders.webp"
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("customOrders") }]}
      />
      <div className="container-page py-14 md:py-20">
        <p className="mb-10 max-w-xl text-base leading-relaxed text-charcoal/80">{t("description")}</p>
        <CustomOrderForm productNames={products.map((p) => p.name)} />
      </div>
    </div>
  );
}
