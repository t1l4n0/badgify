import { redirect } from "@remix-run/node";
import { BillingService } from "./billing.server";

export interface SubscriptionGuardOptions {
  requireActive?: boolean;
  allowTrial?: boolean;
  redirectTo?: string;
}

/**
 * Guard function to check subscription status
 * Use this in loaders to protect routes that require active subscriptions
 */
export async function requireSubscription(
  shop: string,
  options: SubscriptionGuardOptions = {}
): Promise<void> {
  const {
    requireActive = true,
    allowTrial = true,
    redirectTo = "/app/billing",
  } = options;

  const subscription = await BillingService.getSubscription(shop);

  // No subscription found
  if (!subscription) {
    throw redirect(redirectTo);
  }

  // Check if subscription is active
  if (requireActive && subscription.status !== "active") {
    // Allow trial period if specified
    if (allowTrial && subscription.status === "pending") {
      const isInTrial = await BillingService.isInTrialPeriod(shop);
      if (!isInTrial) {
        throw redirect(redirectTo);
      }
    } else {
      throw redirect(redirectTo);
    }
  }
}

/**
 * Check subscription status without throwing redirects
 * Useful for conditional rendering in components
 */
export async function checkSubscriptionStatus(shop: string) {
  const subscription = await BillingService.getSubscription(shop);
  
  if (!subscription) {
    return {
      hasSubscription: false,
      isActive: false,
      isInTrial: false,
      trialDaysRemaining: 0,
      subscription: null,
    };
  }

  const isActive = subscription.status === "active";
  const isInTrial = await BillingService.isInTrialPeriod(shop);
  const trialDaysRemaining = await BillingService.getTrialDaysRemaining(shop);

  return {
    hasSubscription: true,
    isActive,
    isInTrial,
    trialDaysRemaining,
    subscription,
  };
}

