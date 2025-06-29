import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Tabs,
  Banner,
  Button,
  InlineStack,
  Modal,
  EmptyState
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { requireSubscription } from "../utils/subscription-guard.server";
import { BadgeDesigner } from "../components/badgify/BadgeDesigner";
import { BadgeManager } from "../components/badgify/BadgeManager";
import { ProductAssignment } from "../components/badgify/ProductAssignment";
import { BadgePresets } from "../components/badgify/BadgePresets";
import { BadgeHistory } from "../components/badgify/BadgeHistory";
import { useState, useCallback } from "react";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  
  // Require active subscription to access Badgify features
  await requireSubscription(session.shop, {
    requireActive: true,
    allowTrial: true,
    redirectTo: "/app/billing"
  });

  // Load badges for this shop
  const badges = await prisma.badge.findMany({
    where: { shop: session.shop },
    include: {
      badgeAssignments: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Load badge templates
  const templates = await prisma.badgeTemplate.findMany({
    where: { isPublic: true },
    orderBy: { usageCount: 'desc' }
  });

  // Load products from Shopify (simplified - in production you'd paginate)
  let products = [];
  let collections = [];
  
  try {
    const productsResponse = await admin.rest.resources.Product.all({
      session,
      limit: 50
    });
    products = productsResponse.data || [];

    const collectionsResponse = await admin.rest.resources.Collection.all({
      session,
      limit: 50
    });
    collections = collectionsResponse.data || [];
  } catch (error) {
    console.error('Error loading Shopify data:', error);
  }

  return json({
    shop: session.shop,
    badges: badges.map(badge => ({
      ...badge,
      assignmentCount: badge.badgeAssignments.length
    })),
    templates,
    products: products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      vendor: product.vendor || '',
      productType: product.product_type || '',
      tags: product.tags ? product.tags.split(',').map((tag: string) => tag.trim()) : [],
      collections: [], // Would need to fetch product collections separately
      image: product.images?.[0]?.src,
      status: product.status
    })),
    collections: collections.map((collection: any) => ({
      id: collection.id.toString(),
      title: collection.title,
      handle: collection.handle,
      productsCount: collection.products_count || 0
    }))
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  try {
    switch (action) {
      case "create_badge": {
        const badgeData = JSON.parse(formData.get("badgeData") as string);
        
        const badge = await prisma.badge.create({
          data: {
            shop: session.shop,
            ...badgeData
          }
        });

        return json({ success: true, badge });
      }

      case "update_badge": {
        const badgeId = formData.get("badgeId") as string;
        const badgeData = JSON.parse(formData.get("badgeData") as string);
        
        const badge = await prisma.badge.update({
          where: { id: badgeId, shop: session.shop },
          data: badgeData
        });

        return json({ success: true, badge });
      }

      case "delete_badge": {
        const badgeId = formData.get("badgeId") as string;
        
        await prisma.badge.delete({
          where: { id: badgeId, shop: session.shop }
        });

        return json({ success: true });
      }

      case "toggle_badge": {
        const badgeId = formData.get("badgeId") as string;
        const isActive = formData.get("isActive") === "true";
        
        const badge = await prisma.badge.update({
          where: { id: badgeId, shop: session.shop },
          data: { isActive }
        });

        return json({ success: true, badge });
      }

      case "assign_products": {
        const badgeId = formData.get("badgeId") as string;
        const productIds = JSON.parse(formData.get("productIds") as string);
        const assignmentRules = formData.get("assignmentRules") as string;
        
        // Clear existing assignments
        await prisma.badgeAssignment.deleteMany({
          where: { badgeId, shop: session.shop }
        });

        // Create new assignments
        if (productIds.length > 0) {
          await prisma.badgeAssignment.createMany({
            data: productIds.map((productId: string) => ({
              shop: session.shop,
              badgeId,
              productId,
              assignedBy: 'manual'
            }))
          });
        }

        // Update badge assignment rules
        await prisma.badge.update({
          where: { id: badgeId, shop: session.shop },
          data: { assignmentRules }
        });

        return json({ success: true });
      }

      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Badge action error:", error);
    return json({ error: "An error occurred" }, { status: 500 });
  }
};

export default function Badgify() {
  const { shop, badges, templates, products, collections } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const tabs = [
    { id: 'badges', content: 'My Badges', panelID: 'badges-panel' },
    { id: 'designer', content: 'Badge Designer', panelID: 'designer-panel' },
    { id: 'templates', content: 'Templates', panelID: 'templates-panel' },
    { id: 'analytics', content: 'Analytics', panelID: 'analytics-panel' }
  ];

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelectedTab(selectedTabIndex);
  }, []);

  const handleCreateBadge = () => {
    setSelectedBadge(null);
    setDesignerOpen(true);
  };

  const handleEditBadge = (badge: any) => {
    setSelectedBadge(badge);
    setDesignerOpen(true);
  };

  const handleSaveBadge = async (design: any) => {
    const formData = new FormData();
    formData.append("action", selectedBadge ? "update_badge" : "create_badge");
    if (selectedBadge) {
      formData.append("badgeId", selectedBadge.id);
    }
    formData.append("badgeData", JSON.stringify(design));

    // Submit form (this would trigger the action)
    // In a real implementation, you'd use fetcher or form submission
    setDesignerOpen(false);
    setSelectedBadge(null);
  };

  const handleAssignProducts = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    setSelectedBadge(badge);
    setAssignmentOpen(true);
  };

  const handleSaveAssignment = async (assignments: string[], rules: any) => {
    const formData = new FormData();
    formData.append("action", "assign_products");
    formData.append("badgeId", selectedBadge.id);
    formData.append("productIds", JSON.stringify(assignments));
    formData.append("assignmentRules", JSON.stringify(rules));

    // Submit form
    setAssignmentOpen(false);
    setSelectedBadge(null);
  };

  return (
    <Page
      title="Badgify - Product Badge System"
      subtitle="Create and manage custom product badges with advanced design options"
      backAction={{ content: "Dashboard", url: "/app" }}
      primaryAction={{
        content: "Create Badge",
        onAction: handleCreateBadge
      }}
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
                <p>Badge operation completed successfully!</p>
              </Banner>
            </div>
          )}

          <Card>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              <div style={{ padding: '1.5rem 0' }}>
                {selectedTab === 0 && (
                  <BadgeManager
                    badges={badges}
                    onEdit={handleEditBadge}
                    onDelete={(badgeId) => {
                      // Handle delete
                    }}
                    onDuplicate={(badge) => {
                      // Handle duplicate
                    }}
                    onToggleActive={(badgeId, isActive) => {
                      // Handle toggle
                    }}
                    onAssignProducts={handleAssignProducts}
                    onViewAnalytics={(badgeId) => {
                      // Handle analytics
                    }}
                  />
                )}
                
                {selectedTab === 1 && (
                  <BadgeDesigner
                    initialDesign={selectedBadge}
                    onSave={handleSaveBadge}
                  />
                )}
                
                {selectedTab === 2 && (
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Badge Templates
                    </Text>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                      gap: '1rem' 
                    }}>
                      {templates.map(template => (
                        <Card key={template.id}>
                          <BlockStack gap="300">
                            <InlineStack gap="200" align="space-between">
                              <div>
                                <Text variant="bodyMd" fontWeight="semibold">
                                  {template.name}
                                </Text>
                                <Text variant="bodyMd" tone="subdued">
                                  {template.category}
                                </Text>
                              </div>
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: '4px 8px',
                                  backgroundColor: template.backgroundColor,
                                  color: template.textColor,
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  borderRadius: template.shape === 'circle' ? '50%' : '4px'
                                }}
                              >
                                {template.text}
                              </div>
                            </InlineStack>
                            <Text variant="bodyMd">
                              {template.description}
                            </Text>
                            <Button
                              onClick={() => {
                                setSelectedBadge(template);
                                setDesignerOpen(true);
                              }}
                            >
                              Use Template
                            </Button>
                          </BlockStack>
                        </Card>
                      ))}
                    </div>
                  </BlockStack>
                )}
                
                {selectedTab === 3 && (
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2">
                      Badge Analytics
                    </Text>
                    <Banner tone="info" title="Coming Soon">
                      <p>Badge analytics and performance metrics will be available in a future update.</p>
                    </Banner>
                  </BlockStack>
                )}
              </div>
            </Tabs>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Badgify Features
              </Text>
              <BlockStack gap="200">
                <Text variant="bodyMd">
                  ✓ 8 Badge Shapes & Styles
                </Text>
                <Text variant="bodyMd">
                  ✓ Advanced Design Options
                </Text>
                <Text variant="bodyMd">
                  ✓ Automatic Assignment Rules
                </Text>
                <Text variant="bodyMd">
                  ✓ Real-time Preview
                </Text>
                <Text variant="bodyMd">
                  ✓ Collection & Tag-based Assignment
                </Text>
                <Text variant="bodyMd">
                  ✓ Custom CSS & SVG Support
                </Text>
                <Text variant="bodyMd">
                  ✓ Badge Templates Library
                </Text>
                <Text variant="bodyMd">
                  ✓ Performance Analytics
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Quick Stats
              </Text>
              <BlockStack gap="200">
                <InlineStack gap="200" align="space-between">
                  <Text variant="bodyMd">Total Badges:</Text>
                  <Text variant="bodyMd" fontWeight="semibold">{badges.length}</Text>
                </InlineStack>
                <InlineStack gap="200" align="space-between">
                  <Text variant="bodyMd">Active Badges:</Text>
                  <Text variant="bodyMd" fontWeight="semibold">
                    {badges.filter(b => b.isActive).length}
                  </Text>
                </InlineStack>
                <InlineStack gap="200" align="space-between">
                  <Text variant="bodyMd">Products with Badges:</Text>
                  <Text variant="bodyMd" fontWeight="semibold">
                    {badges.reduce((sum, badge) => sum + badge.assignmentCount, 0)}
                  </Text>
                </InlineStack>
                <InlineStack gap="200" align="space-between">
                  <Text variant="bodyMd">Available Templates:</Text>
                  <Text variant="bodyMd" fontWeight="semibold">{templates.length}</Text>
                </InlineStack>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>

      {designerOpen && (
        <Modal
          open={designerOpen}
          onClose={() => setDesignerOpen(false)}
          title={selectedBadge ? "Edit Badge" : "Create New Badge"}
          large
        >
          <Modal.Section>
            <BadgeDesigner
              initialDesign={selectedBadge}
              onSave={handleSaveBadge}
            />
          </Modal.Section>
        </Modal>
      )}

      {assignmentOpen && selectedBadge && (
        <ProductAssignment
          badgeId={selectedBadge.id}
          badgeName={selectedBadge.name}
          currentAssignments={[]} // Would load from database
          products={products}
          collections={collections}
          onSave={handleSaveAssignment}
          onClose={() => setAssignmentOpen(false)}
        />
      )}
    </Page>
  );
}