import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
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
  EmptyState,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { checkSubscriptionStatus } from "../utils/subscription-guard.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    
    const subscriptionStatus = await checkSubscriptionStatus(session.shop);

    return json({
      shop: session.shop,
      authenticated: true,
      ...subscriptionStatus,
    });
  } catch (error) {
    // If authentication fails, return a safe fallback
    console.error("Authentication error:", error);
    return json({
      shop: null,
      authenticated: false,
      hasSubscription: false,
      isActive: false,
      isInTrial: false,
      trialDaysRemaining: 0,
      subscription: null,
    });
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  
  // Handle unauthenticated state
  if (!data.authenticated) {
    return (
      <Page title="Badgify - Product Badge System">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Welcome to Badgify
                </Text>
                <Text variant="bodyMd">
                  This app needs to be accessed through the Shopify Admin to function properly.
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Please install and open this app from your Shopify Admin panel.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const { shop, subscription, isActive, isInTrial, trialDaysRemaining, hasSubscription } = data;

  // Show subscription setup if no subscription exists
  if (!hasSubscription) {
    return (
      <Page title="Welcome to Badgify">
        <Layout>
          <Layout.Section>
            <EmptyState
              heading="Get started with Badgify"
              action={{
                content: "Start Free Trial",
                url: "/app/billing",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Create stunning product badges with our advanced design system. 
                Start with a 3-day free trial, then just $9.99/month. Cancel anytime.
              </p>
            </EmptyState>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Badgify Dashboard">
      <Layout>
        <Layout.Section>
          {isInTrial && trialDaysRemaining > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner
                title="Free Trial Active"
                tone="info"
                action={{
                  content: "Manage Billing",
                  url: "/app/billing",
                }}
              >
                <p>
                  You have {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left in your free trial. 
                  Your subscription will automatically continue at $9.99/month after the trial ends.
                </p>
              </Banner>
            </div>
          )}

          {isActive && !isInTrial && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner
                title="Subscription Active"
                tone="success"
                action={{
                  content: "Manage Billing",
                  url: "/app/billing",
                }}
              >
                <p>
                  Your subscription is active. You have full access to all Badgify features.
                </p>
              </Banner>
            </div>
          )}

          {subscription && subscription.status === "pending" && !isInTrial && (
            <div style={{ marginBottom: "1rem" }}>
              <Banner
                title="Trial Expired - Action Required"
                tone="critical"
                action={{
                  content: "Complete Setup",
                  url: "/app/billing",
                }}
              >
                <p>
                  Your free trial has ended. Please complete your subscription setup to continue using Badgify.
                </p>
              </Banner>
            </div>
          )}
          
          <Card>
            <BlockStack gap="400">
              <div>
                <Text variant="headingMd" as="h2">
                  Welcome to Badgify for {shop || "your shop"}
                </Text>
                <Text variant="bodyMd" tone="subdued">
                  Create stunning product badges with advanced design options
                </Text>
              </div>
                
              {subscription && (
                <div>
                  <Text variant="headingMd" as="h3" fontWeight="medium">
                    Current Subscription
                  </Text>
                  <div style={{ marginTop: "1rem" }}>
                    <BlockStack gap="300">
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Plan:</Text>
                        <Text variant="bodyMd" fontWeight="semibold">
                          {subscription.planName || "Badgify Pro"}
                        </Text>
                      </InlineStack>
                      
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Status:</Text>
                        <Badge tone={
                          subscription.status === "active" ? "success" : 
                          subscription.status === "pending" ? "attention" : 
                          "critical"
                        }>
                          {subscription.status === "active" && isInTrial ? "Trial" : 
                           subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </InlineStack>
                      
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Price:</Text>
                        <Text variant="bodyMd" fontWeight="semibold">
                          ${subscription.price || "9.99"} USD / month
                        </Text>
                      </InlineStack>

                      {isInTrial && subscription.trialEndsAt && (
                        <InlineStack gap="200" align="space-between">
                          <Text variant="bodyMd">Trial ends:</Text>
                          <Text variant="bodyMd">
                            {new Date(subscription.trialEndsAt).toLocaleDateString()}
                          </Text>
                        </InlineStack>
                      )}
                    </BlockStack>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "2rem" }}>
                <InlineStack gap="300">
                  <Button variant="primary" url="/app/billing" size="large">
                    Manage Billing & Subscription
                  </Button>
                  {(isActive || isInTrial) && (
                    <Button url="/app/badgify" size="large">
                      Open Badgify
                    </Button>
                  )}
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Badgify Features
              </Text>
              <div>
                <BlockStack gap="200">
                  <Text variant="bodyMd">✓ 8 Custom Badge Shapes</Text>
                  <Text variant="bodyMd">✓ Advanced Design Options</Text>
                  <Text variant="bodyMd">✓ Automatic Assignment Rules</Text>
                  <Text variant="bodyMd">✓ Collection & Tag-based Assignment</Text>
                  <Text variant="bodyMd">✓ Real-time Preview</Text>
                  <Text variant="bodyMd">✓ Custom CSS & SVG Support</Text>
                  <Text variant="bodyMd">✓ Badge Templates Library</Text>
                  <Text variant="bodyMd">✓ Performance Analytics</Text>
                  <Text variant="bodyMd">✓ Multi-tenancy Support</Text>
                  <Text variant="bodyMd">✓ Theme Integration</Text>
                </BlockStack>
              </div>
              
              <div style={{ marginTop: "1rem" }}>
                <Button url="/app/billing" fullWidth>
                  {hasSubscription ? "Manage Subscription" : "Start Free Trial"}
                </Button>
              </div>
            </BlockStack>
          </Card>

          {(isActive || isInTrial) && (
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">
                  🎯 Badge Shapes Available
                </Text>
                <div>
                  <BlockStack gap="200">
                    <Text variant="bodyMd">🔲 Rectangle - Classic badge style</Text>
                    <Text variant="bodyMd">⭕ Circle - Round badges</Text>
                    <Text variant="bodyMd">💊 Pill - Rounded corners</Text>
                    <Text variant="bodyMd">🎀 Ribbon - Elegant ribbon style</Text>
                    <Text variant="bodyMd">💥 Burst - Star-shaped badges</Text>
                    <Text variant="bodyMd">🏷️ Tag - Price tag style</Text>
                    <Text variant="bodyMd">🌙 Eclipse - Unique curved shape</Text>
                    <Text variant="bodyMd">✨ Custom SVG - Your own designs</Text>
                  </BlockStack>
                </div>
                
                <div style={{ marginTop: "1rem" }}>
                  <Button url="/app/badgify" fullWidth variant="primary">
                    Create Your First Badge
                  </Button>
                </div>
              </BlockStack>
            </Card>
          )}

          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Assignment Options
              </Text>
              <div>
                <BlockStack gap="200">
                  <Text variant="bodyMd">📝 Manual Selection</Text>
                  <Text variant="bodyMd">📁 Collection-based</Text>
                  <Text variant="bodyMd">🏷️ Tag-based Assignment</Text>
                  <Text variant="bodyMd">🏪 Vendor-based Rules</Text>
                  <Text variant="bodyMd">📦 Product Type Rules</Text>
                  <Text variant="bodyMd">🤖 Automatic Assignment</Text>
                </BlockStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// Error boundary for this route
export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <Page title="Error">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Something went wrong
              </Text>
              <Text variant="bodyMd">
                We're sorry, but there was an error loading the page. Please try refreshing or contact support if the problem persists.
              </Text>
              <Button url="/app" variant="primary">
                Go to Dashboard
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}