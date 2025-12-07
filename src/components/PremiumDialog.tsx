import { useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedCharacter } from '@/components/AnimatedCharacter';
import { Check, Crown, Sparkles, Zap, Infinity as InfinityIcon, Loader2 } from 'lucide-react';
import { PREMIUM_UNLOCK_PRICE, FREE_HABIT_LIMIT_PER_MONTH } from '@/types/habit';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { userPrefsStorage } from '@/lib/storage';

// Stripe publishable key - In production, this should come from environment variables
// This is a test key for demonstration purposes
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key_here';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const premiumFeatures = [
  { icon: InfinityIcon, text: 'Unlimited habit creation', highlight: true },
  { icon: Sparkles, text: 'Exclusive color palettes', highlight: true },
  { icon: Zap, text: 'Advanced statistics & insights' },
  { icon: Check, text: 'Priority support' },
];

const flowerShowcase = [
  { type: 'plant' as const, name: 'Plant', stage: 5 },
  { type: 'rose' as const, name: 'Rose', stage: 6 },
  { type: 'lily' as const, name: 'Lily', stage: 6 },
];

export function PremiumDialog({ open, onOpenChange }: PremiumDialogProps) {
  const { data: userPrefs } = useUserPreferences();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load. Please try again.');
      }

      // In a real application, you would call your backend API to create a Stripe Checkout Session
      // The backend would return a sessionId that you'd use with redirectToCheckout
      //
      // Example backend call:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     priceId: 'price_premium_monthly', // Your Stripe Price ID
      //     successUrl: window.location.origin + '/payment-success',
      //     cancelUrl: window.location.origin + '/payment-cancelled',
      //   }),
      // });
      // const { sessionId } = await response.json();
      // await stripe.redirectToCheckout({ sessionId });

      // For demo purposes, show a message that Stripe integration requires backend setup
      setError(
        'Stripe checkout requires a backend server to create checkout sessions securely. ' +
        'Please configure your Stripe secret key on your server and create a /api/create-checkout-session endpoint.'
      );

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo: Allow simulating a successful payment (would be removed in production)
  const handleDemoUpgrade = () => {
    userPrefsStorage.update({ isPremium: true });
    window.location.reload();
  };

  if (userPrefs?.isPremium) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="text-yellow-500" size={32} />
            <DialogTitle className="text-3xl">Upgrade to Premium</DialogTitle>
          </div>
          <DialogDescription className="text-center text-base">
            Create unlimited habits for just ${PREMIUM_UNLOCK_PRICE}/month
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Flower Showcase */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white">Grow Beautiful Flowers</h3>
            <div className="grid grid-cols-3 gap-4">
              {flowerShowcase.map((flower, index) => (
                <motion.div
                  key={flower.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
                    <div className="flex flex-col items-center">
                      <AnimatedCharacter
                        theme={flower.type}
                        stage={flower.stage}
                        colorPalette="pastel-green"
                        size="medium"
                      />
                      <div className="text-center mt-2">
                        <div className="font-semibold text-gray-900 dark:text-white">{flower.name}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Free vs Premium Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Plan */}
            <Card className="p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-semibold text-center mb-3 text-gray-900 dark:text-white">Free Plan</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 dark:text-gray-500">✓</span>
                  <span className="text-gray-900 dark:text-white">All flower types</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 dark:text-gray-500">✓</span>
                  <span className="text-gray-900 dark:text-white">{FREE_HABIT_LIMIT_PER_MONTH} habits per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 dark:text-gray-500">✓</span>
                  <span className="text-gray-900 dark:text-white">Basic color palettes</span>
                </li>
              </ul>
            </Card>

            {/* Premium Plan */}
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-300 dark:border-yellow-700">
              <div className="flex items-center justify-center gap-1 mb-3">
                <Crown className="text-yellow-600 dark:text-yellow-400" size={20} />
                <h4 className="font-semibold text-center text-gray-900 dark:text-white">Premium</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={16} />
                  <span className="font-medium text-gray-900 dark:text-white">Unlimited habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={16} />
                  <span className="font-medium text-gray-900 dark:text-white">All color palettes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-yellow-600 dark:text-yellow-400 shrink-0" size={16} />
                  <span className="font-medium text-gray-900 dark:text-white">All features</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Feature List */}
          <div>
            <h4 className="font-semibold text-center mb-3 text-gray-900 dark:text-white">Everything Premium Includes</h4>
            <div className="grid gap-2">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    feature.highlight
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className={`rounded-full p-2 ${feature.highlight ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-white dark:bg-gray-700'}`}>
                    <feature.icon
                      size={20}
                      className={feature.highlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'}
                    />
                  </div>
                  <span className={`font-medium ${feature.highlight ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Upgrade Button */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={handleStripeCheckout}
              disabled={isLoading}
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold text-lg py-6 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={24} />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="mr-2" size={24} />
                  Pay with Stripe - ${PREMIUM_UNLOCK_PRICE}/month
                </>
              )}
            </Button>

            {/* Demo button for testing - would be removed in production */}
            <Button
              onClick={handleDemoUpgrade}
              variant="outline"
              size="sm"
              className="w-full text-gray-600 dark:text-gray-400"
            >
              Demo: Activate Premium (Test Only)
            </Button>

            <p className="text-center text-xs text-gray-900 dark:text-white">
              Secure payment powered by Stripe. Cancel anytime. 7-day money-back guarantee.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
