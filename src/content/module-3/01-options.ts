import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-options',
  title: 'Options in Commodity Markets',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'options-basics',
      title: 'Options: The Right Without the Obligation',
      body: `An **option** gives the buyer the right — but not the obligation — to buy or sell a futures contract at a specified price (strike) before or at expiry.\n\n**Call option:** Right to buy → used by buyers to cap their cost\n**Put option:** Right to sell → used by sellers to set a price floor\n\n**Premium:** The option buyer pays an upfront premium to the seller. This is the maximum loss for the buyer; the seller's risk is theoretically unlimited (on calls).\n\nOptions are priced by: intrinsic value + time value. Key Greeks: Delta (sensitivity to price), Theta (time decay), Vega (sensitivity to volatility).`,
    },
    {
      id: 'physical-options',
      title: 'Physical Options: Storage & Processing',
      body: `In physical commodity markets, "optionality" exists in infrastructure itself:\n\n**Storage option:** Having a warehouse gives you the option to wait for better prices rather than selling now. You exercise this option when: expected future price > current price + storage cost.\n\n**Refinery option:** Having a refinery gives you the option to process crude into products (gasoline, diesel) or not. You exercise when the "crack spread" (product price − crude cost) covers processing costs.\n\n**Blending option:** Owning multiple coffee origins gives you the option to blend to certifiable grade when the exchange price makes tendering economic.\n\nPhysical options are not traded on exchanges but are core to how integrated commodity companies create value.`,
    },
    {
      id: 'strategies',
      title: 'Common Option Strategies',
      body: `**Protective put (producer hedge):** Producer buys put options to set a price floor while retaining upside if prices rise. Cost = option premium.\n\n**Cap (consumer hedge):** Buyer purchases call options to cap their purchase price. Retains benefit if prices fall.\n\n**Collar:** Producer buys puts AND sells calls. Net premium is low or zero (zero-cost collar). Sets a price floor and ceiling. Most common in commercial hedging programs.\n\n**Straddle/Strangle:** Buy both call and put. Profits if prices move significantly in either direction. Used by traders expecting high volatility around a known event (WASDE release, harvest report).`,
    },
  ],
}

export default topic
