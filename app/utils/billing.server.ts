import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import type { Session } from "@shopify/shopify-api";

const prisma = new PrismaClient();

export interface SubscriptionData {
  id: string;
  shop: string;
  subscriptionId?: string | null;
  status: string;
  planName: string;
  price: number;
  currency: string;
  billingCycle: string;
  trialDays: number;
  trialEndsAt?: Date | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class BillingService {
  /**
   * Get subscription for a shop
   */
  static async getSubscription(shop: string): Promise<SubscriptionData | null> {
    return await prisma.subscription.findUnique({
      where: { shop },
    });
  }

  /**
   * Create a new subscription
   */
  static async createSubscription(shop: string): Promise<SubscriptionData> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 3); // 3 days trial

    return await prisma.subscription.create({
      data: {
        shop,
        status: "pending",
        planName: "Basic Plan",
        price: 9.99,
        currency: "USD",
        billingCycle: "EVERY_30_DAYS",
        trialDays: 3,
        trialEndsAt,
      },
    });
  }

  /**
   * Update subscription status
   */
  static async updateSubscriptionStatus(
    shop: string,
    status: string,
    subscriptionId?: string
  ): Promise<SubscriptionData> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (subscriptionId) {
      updateData.subscriptionId = subscriptionId;
    }

    if (status === "active") {
      updateData.currentPeriodStart = new Date();
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30); // 30 days billing cycle
      updateData.currentPeriodEnd = periodEnd;
    }

    return await prisma.subscription.update({
      where: { shop },
      data: updateData,
    });
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(shop: string): Promise<SubscriptionData> {
    return await prisma.subscription.update({
      where: { shop },
      data: {
        status: "cancelled",
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Check if subscription is active
   */
  static async isSubscriptionActive(shop: string): Promise<boolean> {
    const subscription = await this.getSubscription(shop);
    return subscription?.status === "active";
  }

  /**
   * Check if subscription is in trial period
   */
  static async isInTrialPeriod(shop: string): Promise<boolean> {
    const subscription = await this.getSubscription(shop);
    if (!subscription || !subscription.trialEndsAt) {
      return false;
    }
    return new Date() < subscription.trialEndsAt;
  }

  /**
   * Get trial days remaining
   */
  static async getTrialDaysRemaining(shop: string): Promise<number> {
    const subscription = await this.getSubscription(shop);
    if (!subscription || !subscription.trialEndsAt) {
      return 0;
    }

    const now = new Date();
    const trialEnd = subscription.trialEndsAt;
    
    if (now >= trialEnd) {
      return 0;
    }

    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Clean up expired subscriptions
   */
  static async cleanupExpiredSubscriptions(): Promise<void> {
    const now = new Date();
    
    // Mark subscriptions as expired if trial period has ended and no payment
    await prisma.subscription.updateMany({
      where: {
        status: "pending",
        trialEndsAt: {
          lt: now,
        },
      },
      data: {
        status: "expired",
        updatedAt: now,
      },
    });
  }
}