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
