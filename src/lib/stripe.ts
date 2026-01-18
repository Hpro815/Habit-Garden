// Pricing plan types
export type PricingPlan = 'monthly' | 'yearly' | 'onetime';

// Stripe Payment Links
export const PAYMENT_LINKS: Record<PricingPlan, string> = {
  monthly: 'https://buy.stripe.com/test_4gMbJ1drcfjwcTMfQ51oI00',
  yearly: 'https://buy.stripe.com/test_4gMbJ1bj40oCdXQ8nD1oI01',
  onetime: 'https://buy.stripe.com/test_6oU00j72O7R44ngfQ51oI02',
};

// Start checkout by redirecting to Stripe Payment Link
export function startCheckout(plan: PricingPlan): void {
  const paymentLink = PAYMENT_LINKS[plan];
  if (paymentLink) {
    window.open(paymentLink, '_blank');
  }
}

// Get pricing display info
export interface PricingInfo {
  plan: PricingPlan;
  label: string;
  price: string;
  period: string;
  savings?: string;
  popular?: boolean;
}

export const PRICING_INFO: PricingInfo[] = [
  {
    plan: 'monthly',
    label: 'Monthly',
    price: '$1.99',
    period: '/month',
  },
  {
    plan: 'yearly',
    label: 'Yearly',
    price: '$10.99',
    period: '/year',
    savings: 'Save 54%',
    popular: true,
  },
  {
    plan: 'onetime',
    label: 'Lifetime',
    price: '$20.99',
    period: 'one-time',
    savings: 'Best value',
  },
];
