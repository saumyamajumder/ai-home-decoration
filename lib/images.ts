/**
 * Sample interior photography served from the Unsplash CDN.
 *
 * Every URL is built with the exact same query string so that
 * `images.remotePatterns` in next.config.ts can allow only this form.
 * If you change UNSPLASH_QUERY, update next.config.ts too.
 */
export const UNSPLASH_QUERY = "?auto=format&fit=crop&w=2000&q=80";

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}${UNSPLASH_QUERY}`;

export const photos = {
  // Living spaces
  livingSunlit: unsplash("1600210492486-724fe5c67fb0"),
  livingGrey: unsplash("1600121848594-d8644e57abab"),
  livingSoft: unsplash("1583847268964-b28dc8f51f92"),
  livingOpenPlan: unsplash("1565183997392-2f6f122e5912"),
  livingModern: unsplash("1600607687939-ce8a6c25118c"),
  livingScandi: unsplash("1493809842364-78817add7ffb"),
  livingJapandi: unsplash("1631679706909-1844bbd07221"),
  livingMidCentury: unsplash("1618221195710-dd6b41faaea6"),
  livingContemporary: unsplash("1586023492125-27b2c045efd7"),
  livingBoho: unsplash("1615529182904-14819c35db37"),
  // Kitchens
  kitchenWhite: unsplash("1556911220-bff31c812dba"),
  kitchenModern: unsplash("1484154218962-a197022b5858"),
  kitchenDark: unsplash("1600489000022-c2086d79f9d4"),
  // Bedrooms
  bedroomLuxury: unsplash("1616594039964-ae9021a400a0"),
  bedroomTraditional: unsplash("1505693416388-ac5ce068fe85"),
  bedroomMinimal: unsplash("1595526114035-0d45ed16cfbf"),
  bedroomBoho: unsplash("1615874959474-d609969a20ed"),
  // Other rooms
  bathroomModern: unsplash("1620626011761-996317b8d101"),
  bathroomBright: unsplash("1552321554-5fefe8c9ef14"),
  dining: unsplash("1617806118233-18e1de247200"),
  office: unsplash("1611269154421-4e27233ac5c7"),
  garden: unsplash("1585320806297-9794b3e4eeae"),
  exterior: unsplash("1600585154340-be6161a56a0c"),
  exteriorTimber: unsplash("1600566753190-17f0baa2a6c3"),
} as const;

export type PhotoKey = keyof typeof photos;
