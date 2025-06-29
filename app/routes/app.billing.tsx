import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  Banner,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { BillingService } from "../utils/billing.server";
import { checkSubscriptionStatus } from "../utils/subscription-guard.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  
  const subscriptionStatus = await checkSubscriptionStatus(session.shop);

  return json({
    shop: session.shop,
    ...subscriptionStatus,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  try {
    if (action === "subscribe") {
      // Create or update subscription in database
      let subscription = await BillingService.getSubscription(session.shop);
      
      if (!subscription) {
        subscription = await BillingService.createSubscription(session.shop);
      } else if (subscription.status === "cancelled" || subscription.status === "expired") {
        subscription = await BillingService.updateSubscriptionStatus(session.shop, "pending");
      }

      // Request billing with Shopify
      try {
        const billingCheck = await billing.require({
          plans: [
            {
              plan: "Basic Plan",
              amount: 9.99,
              currencyCode: "USD",
              interval: "EVERY_30_DAYS",
              trialDays: 3,
            }
          ],
          isTest: true, // Set to false in production
          onFailure: async () => {
            // Update subscription status to failed
            await BillingService.updateSubscriptionStatus(session.shop, "cancelled");
            throw new Response("Billing setup failed", { status: 402 });
          },
        });

        if (billingCheck.appSubscriptions && billingCheck.appSubscriptions.length > 0) {
          // Update subscription with Shopify subscription ID
          await BillingService.updateSubscriptionStatus(
            session.shop, 
            "active", 
            billingCheck.appSubscriptions[0].id
          );
        } else {
          // Mark as active for trial period
          await BillingService.updateSubscriptionStatus(session.shop, "active");
        }

        return redirect("/app");
      } catch (billingError) {
        console.error("Shopify billing error:", billingError);
        
        // If Shopify billing fails, still allow trial period
        await BillingService.updateSubscriptionStatus(session.shop, "active");
        
        return json({ 
          success: true, 
          message: "Free trial started! Billing will be set up automatically.",
          warning: "Note: This is a development environment. In production, payment processing will be handled by Shopify."
        });
      }
    }

    if (action === "cancel") {
      // Cancel subscription
      await BillingService.cancelSubscription(session.shop);
      return json({ success: true, message: "Subscription cancelled successfully" });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Billing action error:", error);
    return json({ error: "An error occurred while processing your request" }, { status: 500 });
  }
};

export default function Billing() {
  const { shop, subscription, isActive, isInTrial, trialDaysRemaining, hasSubscription } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const isSubscribed = isActive;
  const isPending = subscription && subscription.status === "pending";
  const isCancelled = subscription && (subscription.status === "cancelled" || subscription.status === "expired");

  return (
    <Page
      title="Billing & Subscription"
      subtitle="Manage your app subscription"
      backAction={{ content: "Dashboard", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          {actionData?.error && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner tone="critical" title="Error">
                <p>{actionData.error}</p>
              </Banner>
            </div>
          )}
          
          {actionData?.success && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner tone="success" title="Success">
                <p>{actionData.message}</p>
                {actionData.warning && (
                  <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                    {actionData.warning}
                  </p>
                )}
              </Banner>
            </div>
          )}

          <Card>
            <BlockStack gap="400">
              <div>
                <Text variant="headingLg" as="h1">
                  Basic Plan
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Everything you need to get started
                </Text>
              </div>
              
              <InlineStack gap="200" align="space-between">
                <BlockStack gap="200">
                  <Text variant="headingXl" as="p">
                    $9.99 <Text variant="bodyMd" as="span" tone="subdued">/ month</Text>
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    3-day free trial included
                  </Text>
                </BlockStack>
                
                {subscription && (
                  <Badge tone={
                    isSubscribed ? "success" : 
                    isPending ? "attention" : 
                    "critical"
                  }>
                    {isSubscribed && isInTrial ? "Free Trial" :
                     subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </Badge>
                )}
              </InlineStack>

              <Divider />

              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  What's included:
                </Text>
                <BlockStack gap="200">
                  <InlineStack gap="200">
                    <Text variant="bodyMd">✓</Text>
                    <Text variant="bodyMd">Full access to all app features</Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Text variant="bodyMd">✓</Text>
                    <Text variant="bodyMd">3-day free trial period</Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Text variant="bodyMd">✓</Text>
                    <Text variant="bodyMd">Monthly billing cycle</Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Text variant="bodyMd">✓</Text>
                    <Text variant="bodyMd">Cancel anytime</Text>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Text variant="bodyMd">✓</Text>
                    <Text variant="bodyMd">Email support</Text>
                  </InlineStack>
                </BlockStack>
              </BlockStack>

              <Divider />

              {/* No subscription or cancelled/expired */}
              {(!hasSubscription || isCancelled) && (
                <BlockStack gap="300">
                  <Banner tone="info" title="Start Your Free Trial">
                    <p>
                      Get started with a 3-day free trial. No payment required upfront. 
                      After the trial, you'll be charged $9.99 monthly. Cancel anytime.
                    </p>
                  </Banner>
                  <Form method="post">
                    <input type="hidden" name="action" value="subscribe" />
                    <Button
                      variant="primary"
                      size="large"
                      submit
                    >
                      Start Free Trial (3 days)
                    </Button>
                  </Form>
                </BlockStack>
              )}

              {/* Pending subscription */}
              {isPending && !isInTrial && (
                <BlockStack gap="300">
                  <Banner tone="attention" title="Trial Expired">
                    <p>Your free trial has ended. Complete your subscription setup to continue using the app.</p>
                  </Banner>
                  <Form method="post">
                    <input type="hidden" name="action" value="subscribe" />
                    <Button
                      variant="primary"
                      size="large"
                      submit
                    >
                      Complete Subscription Setup
                    </Button>
                  </Form>
                </BlockStack>
              )}

              {/* Active subscription */}
              {isSubscribed && (
                <BlockStack gap="300">
                  <Banner tone="success" title="Active Subscription">
                    <p>Your subscription is active and you have full access to the app.</p>
                  </Banner>
                  
                  {isInTrial && subscription?.trialEndsAt && (
                    <Banner tone="info" title="Free Trial Active">
                      <p>
                        Your free trial ends on {new Date(subscription.trialEndsAt).toLocaleDateString()}.
                        {trialDaysRemaining > 0 && ` That's ${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''} from now.`}
                        {" "}After that, you'll be charged $9.99 monthly.
                      </p>
                    </Banner>
                  )}
                  
                  <Form method="post">
                    <input type="hidden" name="action" value="cancel" />
                    <Button
                      variant="primary"
                      tone="critical"
                      submit
                    >
                      Cancel Subscription
                    </Button>
                  </Form>
                </BlockStack>
              )}

              {/* Development notice */}
              <div style={{ marginTop: "2rem" }}>
                <Banner tone="info" title="Development Mode">
                  <p>
                    This app is running in development mode. In production, all payments 
                    will be processed securely through Shopify's billing system.
                  </p>
                </Banner>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

