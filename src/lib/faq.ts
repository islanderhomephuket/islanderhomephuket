/**
 * The questions every foreign buyer asks before they enquire.
 *
 * These are the searches with no listing behind them — "can a foreigner buy a
 * house in Phuket", "what are the transfer fees" — and the ones a buyer needs
 * answered before an enquiry is worth anything. Every figure here matches the
 * buying guide, which was checked against the Civil and Commercial Code and the
 * Condominium Act; nothing gets a number it cannot support.
 */

export interface Faq {
  q: string;
  a: string;
}

export const BUY_FAQS: Faq[] = [
  {
    q: "Can a foreigner buy property in Phuket?",
    a: "Yes, with one limit: a foreigner cannot own land in their own name. You can own a condominium unit freehold, and you can hold a house or villa through a registered lease of the land, or own the building separately from the land it stands on. Which route fits depends on the property, and it is a question for a Thai property lawyer before you sign anything.",
  },
  {
    q: "What can a foreigner own freehold in Phuket?",
    a: "A condominium unit. Under Thailand's Condominium Act, foreign buyers together can own up to 49% of the total saleable floor area of a building. Inside that quota the unit is registered in your own name, and you can sell it, mortgage it or leave it to your heirs like any other owner.",
  },
  {
    q: "How does a 30-year lease on a Phuket villa work?",
    a: "Section 540 of the Civil and Commercial Code caps a registered lease at 30 years. Leases longer than three years are registered at the Land Office, with a registration fee of 1% of the rent for the whole term. Renewal clauses are common, but a Supreme Court ruling has treated pre-agreed renewals stacked into a 90-year arrangement as an attempt to get around the 30-year ceiling — so treat a renewal as a promise to be reviewed by your lawyer, not as a guarantee.",
  },
  {
    q: "What taxes and fees are payable when buying property in Phuket?",
    a: "Transfer fee 2% of the appraised value, usually split 50/50. Specific Business Tax 3.3%, paid by the seller if they have owned the property less than five years; where it does not apply, stamp duty of 0.5% does instead. Withholding tax varies with the seller's tax position. Who pays what is negotiable and belongs in the sale agreement in writing.",
  },
  {
    q: "Do I need to transfer the purchase money from abroad?",
    a: "For a condominium bought freehold, yes — the purchase funds must be remitted into Thailand in foreign currency and converted to baht, and your Thai bank issues the foreign exchange transaction record the Land Office needs at registration. Send the money in the buyer's own name and keep every bank document.",
  },
  {
    q: "How long does buying a property in Phuket take?",
    a: "A resale with clean title and no mortgage usually runs four to eight weeks: reservation, due diligence on the title and the seller, the sale agreement, then transfer at the Land Office where payment and the deed change hands on the same day. Off-plan runs to the developer's construction schedule instead.",
  },
  {
    q: "What should be checked before I pay a deposit?",
    a: "The title deed and its type, that the seller is the registered owner, that there is no mortgage or other encumbrance, the building permit and that what was built matches it, access to the road, and — in a condominium — the foreign ownership quota and any outstanding common-area fees. This is what a Thai property lawyer is for, and it costs a fraction of the deposit.",
  },
];

/** The money-first subset, for the budget pages. */
export const BUY_BUDGET_FAQS: Faq[] = [
  BUY_FAQS[3],
  BUY_FAQS[1],
  BUY_FAQS[4],
  BUY_FAQS[0],
];

/**
 * The rental side. Same rule as above — nothing here gets a figure we cannot
 * stand behind, and the terms quoted are what our own landlords ask for, which
 * is not the same thing as a law.
 */
export const RENT_FAQS: Faq[] = [
  {
    q: "What is the minimum rental period in Phuket?",
    a: "Nearly every long-term listing on this site is a one-year contract, and that is what the rent quoted assumes. Shorter stays are possible on some properties at a higher monthly rate, and anything under 30 days is short-term accommodation, which falls under the Hotel Act and only licensed properties may offer.",
  },
  {
    q: "How much deposit do I have to pay?",
    a: "Two months' rent as a security deposit plus the first month in advance is the normal move-in payment on a yearly contract. The deposit is refundable at the end of the term, less anything owed for damage or unpaid bills — get the condition of the property recorded in writing and photographed on the day you move in.",
  },
  {
    q: "Are utilities included in the rent?",
    a: "No, water and electricity are billed on top and paid monthly on your meter reading. A house or villa is usually charged at the government rate; a condominium building often charges its own rate, which can be higher. Ask for the actual rate before you sign — on an air-conditioned villa this is a real number, not a rounding error.",
  },
  {
    q: "Does the tenant pay an agency fee?",
    a: "No. Our commission is paid by the landlord, so the rent you are quoted is the rent you pay. Anyone asking a tenant for a separate finder's fee on a long-term rental is not working the way this market normally works.",
  },
  {
    q: "What is usually included on a pool villa rental?",
    a: "On most yearly villa contracts the landlord keeps the pool serviced and the garden maintained, and the listing says so. Cleaning inside the house, internet and the bills are normally yours. It varies by property, so check what the listing states rather than assuming.",
  },
  {
    q: "Can a foreigner rent a house in Phuket, and do I need a visa?",
    a: "Yes, renting is open to foreigners with no ownership restrictions. You do not need a particular visa to sign a lease, but your landlord is required by law to report a foreign tenant's address to Immigration, so expect to hand over a passport copy at signing.",
  },
  {
    q: "Should the lease be registered at the Land Office?",
    a: "A lease longer than three years must be registered at the Land Office to be enforceable for its full term, with a registration fee of 1% of the total rent. A standard one-year contract does not need registering — the usual arrangement is a one-year term with an agreed renewal.",
  },
  {
    q: "Are pets allowed?",
    a: "It depends on the owner and, in a condominium, on the building's rules — many buildings do not allow pets at all. Tell us at the start if you have one; it narrows the list quickly and saves everybody a viewing that was never going to work.",
  },
];

/** The money-first subset, for the rental budget pages. */
export const RENT_BUDGET_FAQS: Faq[] = [
  RENT_FAQS[1],
  RENT_FAQS[2],
  RENT_FAQS[3],
  RENT_FAQS[0],
];

/**
 * Hotels are a business, not a home, and the questions are not the ones on
 * either list above. Kept deliberately short: what stops a deal, not a primer.
 */
export const HOTEL_FAQS: Faq[] = [
  {
    q: "Do I need a hotel licence to operate in Phuket?",
    a: "To run a hotel in Thailand you need a licence under the Hotel Act, granted for the building and held by its operator. A ministerial regulation exempts only very small properties — broadly up to four rooms and twenty guests, run as supplementary income — and that is no help at the size of a real hotel. Letting rooms for stays under 30 days without a licence is an offence, so the licence is the first thing to verify, not the last.",
  },
  {
    q: "Does the licence transfer with the hotel?",
    a: "Not automatically. A hotel licence is tied to the building and the person operating it, so a new operator normally has to have it transferred or reissued in their name, and that depends on the building still meeting the requirements it was licensed under. Make the deal conditional on it. A building that cannot be licensed as it stands is a different asset at a different price.",
  },
  {
    q: "Can a foreigner own or run a hotel in Phuket?",
    a: "A foreigner cannot own the land, which is why hotels are usually taken on a registered lease or held through a Thai company. Hotel and restaurant services are also restricted businesses for foreigners under the Foreign Business Act, so the operating company is normally majority Thai-owned or holds a foreign business licence. This is the part to take to a Thai lawyer before money moves, not after.",
  },
  {
    q: "What is key money on a hotel lease?",
    a: "An upfront payment to the landlord for the right to take over the lease, on top of the rent and the security deposit. Key money is normally non-refundable, so what it buys — the term, the renewals, the fixtures, the goodwill — belongs in the lease in writing. The security deposit is a different thing and is refundable at the end of the term.",
  },
  {
    q: "What should be checked before taking on a hotel?",
    a: "The last two or three years of accounts, occupancy and average room rate, the licence and building permit, the land title and the landlord's right to lease it, the staff contracts and any severance owed, the forward bookings and OTA contracts you are inheriting, and the condition of the plant — air conditioning, lifts, water and power. A lease over three years must be registered at the Land Office to be enforceable for its full term.",
  },
];

export const faqsFor = (intent: "buy" | "rent") =>
  intent === "buy" ? BUY_FAQS : RENT_FAQS;

export const budgetFaqsFor = (intent: "buy" | "rent") =>
  intent === "buy" ? BUY_BUDGET_FAQS : RENT_BUDGET_FAQS;

/** FAQPage structured data. Answers are plain text — no markup inside. */
export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
