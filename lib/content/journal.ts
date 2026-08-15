export type JournalArticle = {
  slug: string;
  title: string;
  dek: string;
  image: string;
  body: string[];
};

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "marrakech-edit",
    title: "The Marrakech Edit",
    dek: "Warm tones and market-worn leather, styled for the city.",
    image: "/images/editorial/marrakech-edit.webp",
    body: [
      "Marrakech's leather quarter has shaped the way we think about color — not the flat, uniform tones of tanned hides fresh off a factory line, but the warm, uneven richness that comes from vegetable tanning and hand finishing.",
      "This edit pulls together the pieces from our current collection that lean hardest into that palette: cognac, dark brown and natural leathers, styled the way they're worn on the city's own streets.",
    ],
  },
  {
    slug: "medina-collection",
    title: "The Medina Collection",
    dek: "Structured shapes inspired by the alleyways of the old city.",
    image: "/images/editorial/medina-collection.webp",
    body: [
      "The medina's narrow, winding alleyways have an architecture of their own — compact, structured, purposeful. We wanted a collection of bags that carried the same quality: clean silhouettes with no wasted material.",
      "The result leans on our shoulder bag and crossbody shapes, each one built for movement through a busy day without sacrificing the structure that keeps a bag looking sharp.",
    ],
  },
  {
    slug: "workshop-to-wardrobe",
    title: "From Workshop to Wardrobe",
    dek: "Following one bag from raw hide to finished piece.",
    image: "/images/editorial/workshop-to-wardrobe.webp",
    body: [
      "Every Dar Asala bag starts as a single, hand-selected hide. From there it moves through cutting, stitching, edge finishing and inspection — five stages, each handled by an artisan trained specifically in that step.",
      "This piece walks through that full journey using the Lalla Leather Bag as an example, from the first cut to the final polish before it's packed for shipping.",
    ],
  },
];
