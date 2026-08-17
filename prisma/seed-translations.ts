// Backfills DE/FR sample translations for the existing seed data (products,
// collections, store settings CMS copy, shipping zone labels, testimonial
// quotes). Safe to re-run: every write is an upsert keyed on the
// (entityId, locale) unique constraint, so it never duplicates rows and
// always reflects the text below — including edits made through this file.
// Run with: npx tsx prisma/seed-translations.ts
//
// English on the base rows (prisma/seed.ts) is untouched by this script —
// it remains the canonical/fallback source. This only ever creates or
// updates DE/FR *Translation rows.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ProductTranslation = {
  name: string;
  shortDescription: string;
  description: string;
  story?: string;
  materials: string;
  careInstructions: string;
};

const MATERIALS_DE =
  "Vollnarbenleder aus pflanzlich gegerbtem marokkanischem Leder. Beschläge aus massivem Messing oder Antikmessing. Innenfutter aus Baumwoll-Twill.";
const MATERIALS_FR =
  "Cuir pleine fleur marocain tanné au végétal. Quincaillerie en laiton massif ou laiton vieilli. Doublure en coton sergé.";
const CARE_DE =
  "Mit einem weichen, trockenen Tuch abwischen. Das Leder alle paar Monate mit einem natürlichen Lederbalsam pflegen. Längere direkte Sonneneinstrahlung und Regen vermeiden. Bei Nichtgebrauch mit Seidenpapier ausgestopft im Staubbeutel aufbewahren.";
const CARE_FR =
  "Essuyer avec un chiffon doux et sec. Nourrir le cuir tous les quelques mois avec un baume pour cuir naturel. Éviter une exposition prolongée au soleil direct et à la pluie. Ranger rembourré de papier de soie dans la housse anti-poussière lorsqu'il n'est pas utilisé.";

const PRODUCT_TRANSLATIONS: Record<string, { de: ProductTranslation; fr: ProductTranslation }> = {
  "lalla-leather-bag": {
    de: {
      name: "Lalla Ledertasche",
      shortDescription: "Eine strukturierte, handgefertigte Handtasche, von Hand in Marokko fertiggestellt.",
      description:
        "Eine strukturierte, handgefertigte Handtasche aus echtem Leder, von Hand in Marokko fertiggestellt. Die Lalla verbindet eine klare Silhouette mit handpolierten Kanten und einem vollständig gefütterten Innenraum — mühelos vom Morgen bis zum Abend.",
      story:
        "Von einem einzigen Handwerker von Anfang bis Ende zugeschnitten und genäht, trägt jede Lalla-Tasche kleine, bewusste Unterschiede in der Narbung, die sie als handgefertigt und nicht als Massenware auszeichnen.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac en cuir Lalla",
      shortDescription: "Un sac à main structuré et fait main, fini à la main au Maroc.",
      description:
        "Un sac à main structuré et fait main, façonné en cuir véritable et fini à la main au Maroc. Le Lalla allie une silhouette épurée à des bords brunis à la main et un intérieur entièrement doublé, pensé pour accompagner aussi bien le matin que le soir.",
      story:
        "Coupé et cousu par un seul artisan du début à la fin, chaque sac Lalla porte de légères variations de grain qui témoignent de sa fabrication artisanale, non industrielle.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "zahra-tote": {
    de: {
      name: "Zahra Tote",
      shortDescription: "Ein übergroßer Alltags-Shopper aus weichem Vollnarbenleder.",
      description:
        "Der Zahra Tote ist für den täglichen Gebrauch gemacht — geräumig genug für einen Laptop und den Alltagsbedarf, mit verstärkten, handgenähten Riemen und einem weichen, unstrukturierten Fall, der mit der Zeit nur schöner wird.",
      story:
        "Benannt nach der Orangenblüte, entsteht die Zahra über zwei volle Tage handwerklichen Zuschneidens, Schärfens und Nähens in einer kleinen Werkstatt in Marrakesch.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Cabas Zahra",
      shortDescription: "Un grand cabas du quotidien en cuir pleine fleur souple.",
      description:
        "Le cabas Zahra est conçu pour un usage quotidien — assez spacieux pour un ordinateur portable et l'essentiel, avec des anses renforcées cousues main et un tombé souple et non structuré qui ne fait que s'embellir avec le temps.",
      story:
        "Nommé d'après la fleur d'oranger, le Zahra prend forme sur deux journées complètes de coupe, de refente et de couture à la main dans un petit atelier de Marrakech.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "atlas-crossbody": {
    de: {
      name: "Atlas Umhängetasche",
      shortDescription: "Eine kompakte Umhängetasche mit handgeflochtenem, verstellbarem Riemen.",
      description:
        "Benannt nach dem Gebirge, das die marokkanische Ledertradition so sehr prägt, verbindet die Atlas Umhängetasche einen kompakten, strukturierten Korpus mit einem langen, verstellbaren Riemen für müheloses Alltagstragen.",
      story: "Der Riemen wird von unseren Lederhandwerkern von Hand aus drei einzeln zugeschnittenen Lederschnüren geflochten.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac bandoulière Atlas",
      shortDescription: "Un sac bandoulière compact à la bandoulière réglable tressée main.",
      description:
        "Nommé d'après la chaîne de montagnes qui façonne tant la tradition marocaine du travail du cuir, le sac Atlas associe un corps compact et structuré à une longue bandoulière réglable pour un port quotidien sans effort.",
      story: "La bandoulière est tressée à la main par nos artisans du cuir à partir de trois lanières de cuir coupées individuellement.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "riad-shoulder-bag": {
    de: {
      name: "Riad Schultertasche",
      shortDescription: "Eine weich strukturierte Schultertasche mit handgenähter Klappe.",
      description:
        "Inspiriert von den Innenhöfen der Medina, hat die Riad Schultertasche einen weich strukturierten Korpus, eine mit einem Messing-Drehverschluss gesicherte Klappe und einen Schulterriemen, der bequem an der Hüfte sitzt.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac à épaule Riad",
      shortDescription: "Un sac à épaule souplement structuré à rabat cousu main.",
      description:
        "Inspiré des maisons à cour intérieure de la médina, le sac à épaule Riad présente un corps souplement structuré, un rabat fermé par un verrou torsadé en laiton, et une bandoulière dimensionnée pour reposer confortablement sur la hanche.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "medina-mini-bag": {
    de: {
      name: "Medina Mini-Tasche",
      shortDescription: "Eine Miniatur-Henkeltasche für das Nötigste.",
      description:
        "Klein in der Größe, aber reich an Details — die Medina Mini-Tasche fasst Telefon, Karten und Schlüssel mit Platz übrig, veredelt mit denselben handpolierten Kanten wie unsere großformatigen Stücke.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Mini sac Medina",
      shortDescription: "Un mini sac à poignée taillé pour l'essentiel.",
      description:
        "Petit par la taille mais riche en détails, le mini sac Medina accueille téléphone, cartes et clés avec de la place en plus, fini avec les mêmes bords brunis à la main que nos pièces grand format.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "noor-bucket-bag": {
    de: {
      name: "Noor Beuteltasche",
      shortDescription: "Eine Kordelzug-Beuteltasche mit handgerollter oberer Kante.",
      description:
        "Die Noor entlehnt ihre runde Silhouette der traditionellen marokkanischen Korbflechterei, neu interpretiert in weichem, kordelzugverschlossenem Leder mit abnehmbarem Schulterriemen.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac seau Noor",
      shortDescription: "Un sac seau à cordon avec un bord supérieur roulé à la main.",
      description:
        "Le Noor tire sa silhouette arrondie de la vannerie traditionnelle marocaine, réinterprétée dans un cuir souple resserré par un cordon, avec une bandoulière amovible.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "essaouira-tote": {
    de: {
      name: "Essaouira Tote",
      shortDescription: "Ein luftiger, von der Küste inspirierter Shopper aus Natur-Leder.",
      description:
        "Benannt nach der windumtosten Hafenstadt, ist der Essaouira Tote aus leichterem Natur-Leder mit offenen Seiten und kurzen, handgerollten Henkeln gefertigt — ein leichter Begleiter für Reisetage.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Cabas Essaouira",
      shortDescription: "Un cabas léger d'inspiration côtière en cuir naturel.",
      description:
        "Nommé d'après la ville portuaire balayée par les vents, le cabas Essaouira est taillé dans un cuir naturel plus léger, aux côtés ouverts et aux anses courtes roulées à la main — un compagnon facile pour les jours de voyage.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "amira-bag": {
    de: {
      name: "Amira Tasche",
      shortDescription: "Eine elegante Henkeltasche mit abnehmbarem Umhängeriemen.",
      description:
        "Die Amira verbindet eine elegante Henkeltaschen-Silhouette mit einem abnehmbaren, verstellbaren Riemen — eine Tasche, die zwischen strukturierter Handtasche und entspannter Umhängetasche wechselt.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac Amira",
      shortDescription: "Un sac à main raffiné à poignée avec bandoulière amovible.",
      description:
        "L'Amira associe une silhouette raffinée à poignée à une bandoulière amovible et réglable — un seul sac qui passe d'un sac à main structuré à une bandoulière décontractée.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "bahia-shoulder-bag": {
    de: {
      name: "Bahia Schultertasche",
      shortDescription: "Eine schmale, architektonische Schultertasche mit Messing-Rahmenverschluss.",
      description:
        "Benannt nach dem Bahia-Palast, verbindet diese schmale Schultertasche eine klare, architektonische Silhouette mit einem markanten Messing-Rahmenverschluss, von unseren Metallhandwerkern von Hand angepasst.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac à épaule Bahia",
      shortDescription: "Un sac à épaule fin et architectural à fermoir cadre en laiton.",
      description:
        "Nommé d'après le palais de la Bahia, ce sac à épaule fin associe une silhouette architecturale épurée à un fermoir cadre en laiton emblématique, ajusté à la main par nos artisans métalliers.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "safi-crossbody": {
    de: {
      name: "Safi Umhängetasche",
      shortDescription: "Eine schmale Pouch-Umhängetasche für unterwegs mit leichtem Gepäck.",
      description:
        "Eine schmale, pouchartige Umhängetasche für unterwegs mit leichtem Gepäck — ein Reißverschlussfach, ein flaches Kartenfach und ein langer, verstellbarer, körpernah getragener Riemen.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Sac bandoulière Safi",
      shortDescription: "Une pochette bandoulière fine pour voyager léger.",
      description:
        "Une pochette bandoulière fine conçue pour voyager léger — un compartiment zippé, une fente à carte plate, et une longue bandoulière réglable portée près du corps.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "kasbah-tote": {
    de: {
      name: "Kasbah Tote",
      shortDescription: "Ein limitierter, übergroßer Shopper aus schwerem Leder.",
      description:
        "In kleinen, limitierten Auflagen gefertigt, ist der Kasbah Tote aus schwererem Leder geschnitten — für eine Tasche mit echter Struktur und Präsenz, mit verstärkten Ecken, einem Reißverschlussfach im Innenraum und durchgehenden oberen Henkeln.",
      story: "Jede limitierte Auflage ist nummeriert und wird nach Ausverkauf nicht wieder aufgelegt.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Cabas Kasbah",
      shortDescription: "Un cabas surdimensionné en édition limitée, en cuir épais.",
      description:
        "Produit en petites séries limitées, le cabas Kasbah est taillé dans un cuir plus épais pour un sac à la structure et à la présence affirmées — coins renforcés, poche zippée intérieure et anses pleine longueur.",
      story: "Chaque série limitée est numérotée et n'est pas reconduite une fois épuisée.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
  "yasmine-mini": {
    de: {
      name: "Yasmine Mini",
      shortDescription: "Eine runde Mini-Schultertasche mit zarter Kettenriemen.",
      description:
        "Die Yasmine Mini verbindet eine runde, von Jasmin inspirierte Silhouette mit einem feinen Messing-Kettenriemen — ein Stück, das mühelos vom Tag in den Abend übergeht.",
      materials: MATERIALS_DE,
      careInstructions: CARE_DE,
    },
    fr: {
      name: "Mini Yasmine",
      shortDescription: "Un mini sac à épaule arrondi à fine chaîne bandoulière.",
      description:
        "Le mini Yasmine associe une silhouette arrondie inspirée du jasmin à une fine chaîne bandoulière en laiton, pour une pièce qui passe aisément du jour au soir.",
      materials: MATERIALS_FR,
      careInstructions: CARE_FR,
    },
  },
};

const COLLECTION_TRANSLATIONS: Record<string, { de: { title: string; description: string }; fr: { title: string; description: string } }> = {
  handbags: {
    de: { title: "Handtaschen", description: "Strukturierte Henkeltaschen für zeitlose Alltagseleganz." },
    fr: { title: "Sacs à main", description: "Des silhouettes structurées à poignée pour une élégance au quotidien." },
  },
  "shoulder-bags": {
    de: { title: "Schultertaschen", description: "Weich strukturierte Taschen, die mühelos an Schulter oder Hüfte sitzen." },
    fr: { title: "Sacs à épaule", description: "Des sacs souplement structurés, pensés pour reposer facilement à l'épaule ou à la hanche." },
  },
  "crossbody-bags": {
    de: { title: "Umhängetaschen", description: "Kompakte, freihändige Begleiter fürs Reisen mit leichtem Gepäck." },
    fr: { title: "Sacs bandoulière", description: "Des compagnons compacts et mains libres pour voyager léger." },
  },
  "tote-bags": {
    de: { title: "Shopper", description: "Geräumige, unstrukturierte Shopper für den täglichen Gebrauch." },
    fr: { title: "Cabas", description: "Des cabas spacieux et souples, conçus pour un usage quotidien." },
  },
  "mini-bags": {
    de: { title: "Mini-Taschen", description: "Kleine Silhouetten für das Nötigste, vom Tag bis in den Abend." },
    fr: { title: "Mini sacs", description: "Des silhouettes miniatures pour l'essentiel, du jour au soir." },
  },
  "leather-accessories": {
    de: { title: "Lederaccessoires", description: "Kleine Lederwaren, gefertigt in derselben Werkstatt wie unsere Taschen — demnächst erhältlich." },
    fr: { title: "Maroquinerie", description: "De petits objets en cuir, fabriqués dans le même atelier que nos sacs — bientôt disponibles." },
  },
};

async function main() {
  console.log("Backfilling DE/FR translations...");

  // --- Products ---
  const products = await prisma.product.findMany({ select: { id: true, slug: true } });
  for (const product of products) {
    const t = PRODUCT_TRANSLATIONS[product.slug];
    if (!t) continue;
    for (const [locale, content] of [["DE", t.de], ["FR", t.fr]] as const) {
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale } },
        update: { ...content, story: content.story ?? null },
        create: { productId: product.id, locale, ...content, story: content.story ?? null },
      });
    }
  }

  // --- Collections ---
  const collections = await prisma.collection.findMany({ select: { id: true, slug: true } });
  for (const collection of collections) {
    const t = COLLECTION_TRANSLATIONS[collection.slug];
    if (!t) continue;
    for (const [locale, content] of [["DE", t.de], ["FR", t.fr]] as const) {
      await prisma.collectionTranslation.upsert({
        where: { collectionId_locale: { collectionId: collection.id, locale } },
        update: content,
        create: { collectionId: collection.id, locale, ...content },
      });
    }
  }

  // --- Store settings CMS copy + business claims ---
  const settings = await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  const settingsTranslations = {
    DE: {
      heroHeadline: "Handgefertigt in Marokko.\nFür die Ewigkeit gemacht.",
      heroSubtitle: "Zeitlose Ledertaschen, geformt von unseren Handwerkern, getragen von Ihnen.",
      heroCtaLabel: "Zur Kollektion",
      brandStoryHeading: "Langsam mit Absicht.",
      brandStoryBody:
        "Jedes Dar-Asala-Stück wird von Handwerkern geformt, die Techniken anwenden, die in der marokkanischen Lederhandwerkskunst verwurzelt sind — von Hand zugeschnitten, genäht und in kleinen Werkstätten in Marrakesch und Fès veredelt, ein Stück nach dem anderen.\nWir arbeiten aus freien Stücken in kleinen Serien, nicht aus Notwendigkeit: Nur so bleiben die Qualität — und die Menschen — hinter jeder Tasche sichtbar.",
      customOrderHeading: "Für Sie gemacht",
      customOrderBody:
        "Wählen Sie Ihr Leder, Ihre Farbe, den Riemen und ausgewählte Finish-Details, und unsere Handwerker fertigen ein Stück ganz nach Ihren Wünschen.",
      newsletterHeading: "Briefe aus dem Atelier",
      newsletterBody: "Neue Stücke, Handwerkergeschichten und exklusive Veröffentlichungen — direkt in Ihr Postfach, etwa einmal im Monat.",
      brandOriginCountry: "Marokko",
      brandWorkshopLocations: "Marrakesch und Fès",
      leatherClaim: "vollnarbiges, pflanzlich gegerbtes Leder",
      artisanProcessClaim: "von Hand zugeschnitten, genäht und von einem einzigen Handwerker von Anfang bis Ende fertiggestellt",
      productionModelClaim: "in Kleinserie, auf Bestellung gefertigt",
    },
    FR: {
      heroHeadline: "Fabriqué à la main au Maroc.\nConçu pour durer.",
      heroSubtitle: "Des sacs en cuir intemporels façonnés par nos artisans, portés par vous.",
      heroCtaLabel: "Découvrir la collection",
      brandStoryHeading: "Lent par choix.",
      brandStoryBody:
        "Chaque pièce Dar Asala est façonnée par des artisans selon des techniques ancrées dans le savoir-faire marocain du cuir — coupée, cousue et finie à la main, une pièce à la fois, dans de petits ateliers à Marrakech et à Fès.\nNous travaillons en petites séries par choix, non par nécessité : c'est la seule façon de préserver la visibilité de la qualité — et des personnes — derrière chaque sac.",
      customOrderHeading: "Fait pour vous",
      customOrderBody:
        "Choisissez votre cuir, sa couleur, la bandoulière et les finitions souhaitées, et nos artisans fabriqueront une pièce à la main selon vos choix.",
      newsletterHeading: "Lettres de l'atelier",
      newsletterBody: "Nouvelles pièces, histoires d'artisans et sorties privées — directement dans votre boîte mail, environ une fois par mois.",
      brandOriginCountry: "Maroc",
      brandWorkshopLocations: "Marrakech et Fès",
      leatherClaim: "cuir pleine fleur, tanné au végétal",
      artisanProcessClaim: "coupé, cousu et fini à la main par un seul artisan du début à la fin",
      productionModelClaim: "en petites séries, fabriqué sur commande",
    },
  } as const;

  for (const locale of ["DE", "FR"] as const) {
    await prisma.storeSettingsTranslation.upsert({
      where: { settingsId_locale: { settingsId: settings.id, locale } },
      update: settingsTranslations[locale],
      create: { settingsId: settings.id, locale, ...settingsTranslations[locale] },
    });
  }

  // --- Shipping zones (region/estimate labels only — never price/countries) ---
  const zoneTranslations: Record<string, { de: { region: string; estimate: string }; fr: { region: string; estimate: string } }> = {
    "European Union": {
      de: { region: "Europäische Union", estimate: "3-7 Werktage" },
      fr: { region: "Union européenne", estimate: "3 à 7 jours ouvrés" },
    },
    "United Kingdom": {
      de: { region: "Vereinigtes Königreich", estimate: "4-8 Werktage" },
      fr: { region: "Royaume-Uni", estimate: "4 à 8 jours ouvrés" },
    },
    "United States": {
      de: { region: "Vereinigte Staaten", estimate: "5-10 Werktage" },
      fr: { region: "États-Unis", estimate: "5 à 10 jours ouvrés" },
    },
    Switzerland: {
      de: { region: "Schweiz", estimate: "4-8 Werktage" },
      fr: { region: "Suisse", estimate: "4 à 8 jours ouvrés" },
    },
  };

  const zones = await prisma.shippingZone.findMany({ select: { id: true, region: true } });
  for (const zone of zones) {
    const t = zoneTranslations[zone.region];
    if (!t) continue;
    for (const [locale, content] of [["DE", t.de], ["FR", t.fr]] as const) {
      await prisma.shippingZoneTranslation.upsert({
        where: { zoneId_locale: { zoneId: zone.id, locale } },
        update: content,
        create: { zoneId: zone.id, locale, ...content },
      });
    }
  }

  // --- Testimonials (quote only) ---
  const testimonialTranslations: Record<string, { de: string; fr: string }> = {
    "Sophie B.": {
      de: "Das Leder wirkt in echt noch satter und die Nähte sind makellos. Genau die Art Tasche, die man einmal kauft und ein Jahrzehnt behält.",
      fr: "Le cuir est encore plus riche en réalité et les coutures sont impeccables. C'est le genre de sac qu'on achète une fois et qu'on garde dix ans.",
    },
    "Laura M.": {
      de: "Strukturiert, aber nicht steif, und die Größe ist perfekt für den täglichen Gebrauch, ohne je klobig zu wirken.",
      fr: "Structuré mais pas rigide, la taille est parfaite pour un usage quotidien sans jamais paraître encombrant.",
    },
    "Amel K.": {
      de: "Man spürt, dass es handgefertigt ist — kleine, ehrliche Details, die man bei Massenware einfach nicht bekommt.",
      fr: "On sent que c'est fait main — de petits détails authentiques qu'on ne trouve tout simplement pas dans la production de masse.",
    },
    "Nora H.": {
      de: "Passt meinen Laptop und sieht danach trotzdem elegant genug fürs Abendessen aus. Bei weitem meine meistgenutzte Tasche.",
      fr: "Il accueille mon ordinateur portable et reste assez élégant pour le dîner ensuite. De loin mon sac le plus utilisé.",
    },
    "Elise R.": {
      de: "Habe ein Stück auf Bestellung angefertigt bekommen, und die Wartezeit hat sich absolut gelohnt. Auch wunderschön verpackt.",
      fr: "J'ai commandé une pièce sur mesure et l'attente en valait vraiment la peine. Emballage magnifique aussi.",
    },
  };

  const testimonials = await prisma.testimonial.findMany({ select: { id: true, authorName: true } });
  for (const testimonial of testimonials) {
    const t = testimonialTranslations[testimonial.authorName];
    if (!t) continue;
    await prisma.testimonialTranslation.upsert({
      where: { testimonialId_locale: { testimonialId: testimonial.id, locale: "DE" } },
      update: { quote: t.de },
      create: { testimonialId: testimonial.id, locale: "DE", quote: t.de },
    });
    await prisma.testimonialTranslation.upsert({
      where: { testimonialId_locale: { testimonialId: testimonial.id, locale: "FR" } },
      update: { quote: t.fr },
      create: { testimonialId: testimonial.id, locale: "FR", quote: t.fr },
    });
  }

  console.log("Translation backfill complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
