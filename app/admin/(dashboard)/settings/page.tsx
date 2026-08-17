import type { ReactNode } from "react";
import { getStoreSettings } from "@/lib/content/store-settings";
import { updateStoreSettings } from "@/lib/admin/content-actions";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

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

        <fieldset className="space-y-4 rounded-sm border border-sand p-5">
          <legend className="px-1 text-sm font-semibold">Business Claims (demo content until confirmed)</legend>
          <p className="text-xs text-muted">
            These feed copy across the site (product pages, About, Artisans). Update them once your
            real suppliers/artisans are confirmed — no code changes needed.
          </p>
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
        </fieldset>

        <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
          Save Settings
        </button>
      </form>
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
