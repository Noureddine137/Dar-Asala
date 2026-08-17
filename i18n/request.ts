import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  // Only the active locale's dictionary is ever loaded for a given request —
  // not all three — keeping the per-request payload small.
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
