import type { ReactNode } from "react";
import { getStoreSettings } from "@/lib/content/store-settings";
import { prisma } from "@/lib/db/prisma";
import { updateStoreSettings, updateBusinessClaimsEn } from "@/lib/admin/content-actions";
import { updateBusinessClaimsTranslation } from "@/lib/admin/translation-actions";
import { LocaleContentTabs } from "@/components/admin/locale-content-tabs";

export default async function AdminSettingsPage() {
  const [settings, translations] = await Promise.all([
    getStoreSettings(),
    prisma.storeSettingsTranslation.findMany({ where: { settingsId: "singleton" } }),
  ]);

  const deTranslation = translations.find((t) => t.locale === "DE");
  const frTranslation = translations.find((t) => t.locale === "FR");
  const boundClaimsDe = updateBusinessClaimsTranslation.bind(null, "de");
  const boundClaimsFr = updateBusinessClaimsTranslation.bind(null, "fr");

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-display text-3xl">Store Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Business values used across the storefront. Editing these takes effect immediately — no
        code changes needed.
      </p>

      <form action={updateStoreSettings} className="mt-8 space-y-8">
        <fieldset className="space-y-4 rounded-sm border border-sand p-5">
          <legend className="px-1 text-sm font-semibold">General</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Store Name">
              <input name="storeName" defaultValue={settings.storeName} className="input" />
            </Field>
            <Field label="Currency">
              <select name="currency" defaultValue={settings.currency} className="input">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </Field>
            <Field label="Contact Email">
              <input name="contactEmail" type="email" defaultValue={settings.contactEmail} className="input" />
            </Field>
            <Field label="Contact Phone">
              <input name="contactPhone" defaultValue={settings.contactPhone ?? ""} className="input" placeholder="Optional" />
            </Field>
            <Field label="WhatsApp Number (digits, country code, no +)">
              <input name="whatsappNumber" defaultValue={settings.whatsappNumber ?? ""} className="input" placeholder="Optional" />
            </Field>
            <Field label="Default Production Time">
              <input name="defaultProductionTime" defaultValue={settings.defaultProductionTime} className="input" />
            </Field>
            <Field label="Free Shipping Threshold">
              <input
                name="freeShippingThreshold"
                type="number"
                step="0.01"
                defaultValue={Number(settings.freeShippingThreshold)}
                className="input"
              />
            </Field>
          </div>
          <Field label="Business Address">
            <textarea name="businessAddress" defaultValue={settings.businessAddress ?? ""} rows={2} className="input" placeholder="Optional" />
          </Field>
        </fieldset>

        <fieldset className="space-y-4 rounded-sm border border-sand p-5">
          <legend className="px-1 text-sm font-semibold">Social Links</legend>
          <p className="text-xs text-muted">Left blank, the icon is hidden on the storefront rather than pointing to a placeholder.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Instagram URL">
              <input name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} className="input" />
            </Field>
            <Field label="Facebook URL">
              <input name="facebookUrl" defaultValue={settings.facebookUrl ?? ""} className="input" />
            </Field>
            <Field label="TikTok URL">
              <input name="tiktokUrl" defaultValue={settings.tiktokUrl ?? ""} className="input" />
            </Field>
          </div>
        </fieldset>

        <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
          Save Settings
        </button>
      </form>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Business Claims</h2>
        <p className="mb-4 text-xs text-muted">
          Demo content until confirmed — these feed copy across the site (product pages, About,
          Artisans). Translated per language; English is the fallback shown wherever a German or
          French translation is missing.
        </p>
        <LocaleContentTabs
          missing={{ de: !deTranslation?.brandOriginCountry, fr: !frTranslation?.brandOriginCountry }}
          en={
            <form action={updateBusinessClaimsEn} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Origin Country">
                  <input name="brandOriginCountry" defaultValue={settings.brandOriginCountry} className="input" />
                </Field>
                <Field label="Workshop Location(s)">
                  <input name="brandWorkshopLocations" defaultValue={settings.brandWorkshopLocations} className="input" />
                </Field>
              </div>
              <Field label="Leather Claim">
                <input name="leatherClaim" defaultValue={settings.leatherClaim} className="input" />
              </Field>
              <Field label="Artisan Process Claim">
                <input name="artisanProcessClaim" defaultValue={settings.artisanProcessClaim} className="input" />
              </Field>
              <Field label="Production Model Claim">
                <input name="productionModelClaim" defaultValue={settings.productionModelClaim} className="input" />
              </Field>
              <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
                Save English Claims
              </button>
            </form>
          }
          de={<BusinessClaimsForm action={boundClaimsDe} translation={deTranslation} localeLabel="Deutsch" />}
          fr={<BusinessClaimsForm action={boundClaimsFr} translation={frTranslation} localeLabel="Français" />}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

type ClaimsTranslationRow = {
  brandOriginCountry: string | null;
  brandWorkshopLocations: string | null;
  leatherClaim: string | null;
  artisanProcessClaim: string | null;
  productionModelClaim: string | null;
} | undefined;

function BusinessClaimsForm({
  action,
  translation,
  localeLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  translation: ClaimsTranslationRow;
  localeLabel: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {!translation?.brandOriginCountry && (
        <p className="rounded-sm border border-camel/40 bg-camel/10 px-3 py-2 text-xs text-charcoal/85">
          No {localeLabel} translation yet — these fields fall back to English on the storefront until filled in.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Origin Country">
          <input name="brandOriginCountry" defaultValue={translation?.brandOriginCountry ?? ""} className="input" />
        </Field>
        <Field label="Workshop Location(s)">
          <input name="brandWorkshopLocations" defaultValue={translation?.brandWorkshopLocations ?? ""} className="input" />
        </Field>
      </div>
      <Field label="Leather Claim">
        <input name="leatherClaim" defaultValue={translation?.leatherClaim ?? ""} className="input" />
      </Field>
      <Field label="Artisan Process Claim">
        <input name="artisanProcessClaim" defaultValue={translation?.artisanProcessClaim ?? ""} className="input" />
      </Field>
      <Field label="Production Model Claim">
        <input name="productionModelClaim" defaultValue={translation?.productionModelClaim ?? ""} className="input" />
      </Field>
      <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
        Save {localeLabel} Claims
      </button>
    </form>
  );
}
