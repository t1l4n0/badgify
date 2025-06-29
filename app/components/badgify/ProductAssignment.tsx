import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Checkbox,
  DataTable,
  Modal,
  Tabs,
  Banner,
  Tag,
  Autocomplete,
  Listbox,
  Combobox
} from '@shopify/polaris';

interface Product {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
  collections: string[];
  image?: string;
  status: string;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  productsCount: number;
}

interface AssignmentRule {
  type: 'manual' | 'collection' | 'tag' | 'product_type' | 'vendor';
  criteria: string[];
  conditions?: {
    operator: 'equals' | 'contains' | 'starts_with' | 'ends_with';
    value: string;
  }[];
}

interface ProductAssignmentProps {
  badgeId: string;
  badgeName: string;
  currentAssignments: string[];
  products: Product[];
  collections: Collection[];
  onSave?: (assignments: string[], rules: AssignmentRule) => void;
  onClose?: () => void;
}

export function ProductAssignment({
  badgeId,
  badgeName,
  currentAssignments,
  products,
  collections,
  onSave,
  onClose
}: ProductAssignmentProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [assignmentRule, setAssignmentRule] = useState<AssignmentRule>({
    type: 'manual',
    criteria: []
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>(currentAssignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  const tabs = [
    { id: 'manual', content: 'Manual Selection', panelID: 'manual-panel' },
    { id: 'collection', content: 'By Collection', panelID: 'collection-panel' },
    { id: 'tag', content: 'By Tags', panelID: 'tag-panel' },
    { id: 'automatic', content: 'Automatic Rules', panelID: 'automatic-panel' }
  ];

  const assignmentTypes = [
    { label: 'Manual Selection', value: 'manual' },
    { label: 'By Collection', value: 'collection' },
    { label: 'By Product Tags', value: 'tag' },
    { label: 'By Product Type', value: 'product_type' },
    { label: 'By Vendor', value: 'vendor' }
  ];

  // Get unique values for filters
  const uniqueProductTypes = [...new Set(products.map(p => p.productType).filter(Boolean))];
  const uniqueVendors = [...new Set(products.map(p => p.vendor).filter(Boolean))];
  const uniqueTags = [...new Set(products.flatMap(p => p.tags))];

  // Filter products based on search and current tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.handle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 1) { // Collection tab
      return matchesSearch && selectedCollections.some(collectionId => 
        product.collections.includes(collectionId)
      );
    }
    
    if (selectedTab === 2) { // Tag tab
      return matchesSearch && selectedTags.some(tag => 
        product.tags.includes(tag)
      );
    }
    
    return matchesSearch;
  });

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const allProductIds = filteredProducts.map(p => p.id);
    setSelectedProducts(prev => {
      const newSelection = [...new Set([...prev, ...allProductIds])];
      return newSelection;
    });
  };

  const handleDeselectAll = () => {
    const filteredProductIds = filteredProducts.map(p => p.id);
    setSelectedProducts(prev => prev.filter(id => !filteredProductIds.includes(id)));
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = () => {
    let finalRule: AssignmentRule;
    let finalAssignments: string[] = [];

    switch (selectedTab) {
      case 0: // Manual
        finalRule = { type: 'manual', criteria: selectedProducts };
        finalAssignments = selectedProducts;
        break;
      case 1: // Collection
        finalRule = { type: 'collection', criteria: selectedCollections };
        finalAssignments = products
          .filter(p => selectedCollections.some(cId => p.collections.includes(cId)))
          .map(p => p.id);
        break;
      case 2: // Tags
        finalRule = { type: 'tag', criteria: selectedTags };
        finalAssignments = products
          .filter(p => selectedTags.some(tag => p.tags.includes(tag)))
          .map(p => p.id);
        break;
      case 3: // Automatic
        finalRule = assignmentRule;
        // Calculate assignments based on rules
        finalAssignments = products
          .filter(product => {
            switch (assignmentRule.type) {
              case 'product_type':
                return assignmentRule.criteria.includes(product.productType);
              case 'vendor':
                return assignmentRule.criteria.includes(product.vendor);
              default:
                return false;
            }
          })
          .map(p => p.id);
        break;
      default:
        finalRule = { type: 'manual', criteria: [] };
    }

    if (onSave) {
      onSave(finalAssignments, finalRule);
    }
  };

  const productTableRows = filteredProducts.map(product => [
    <Checkbox
      key={product.id}
      checked={selectedProducts.includes(product.id)}
      onChange={() => handleProductToggle(product.id)}
    />,
    product.image ? (
      <img 
        src={product.image} 
        alt={product.title}
        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
      />
    ) : (
      <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
    ),
    product.title,
    product.vendor || '-',
    product.productType || '-',
    product.tags.length > 0 ? (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {product.tags.slice(0, 3).map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {product.tags.length > 3 && <Text variant="bodyMd" tone="subdued">+{product.tags.length - 3}</Text>}
      </div>
    ) : '-'
  ]);

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Assign "${badgeName}" Badge to Products`}
      primaryAction={{
        content: 'Save Assignment',
        onAction: handleSave
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose
        }
      ]}
      large
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Banner tone="info" title="Product Assignment">
            <p>Choose how you want to assign this badge to products. You can manually select products, assign by collections, tags, or set up automatic rules.</p>
          </Banner>

          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
            <div style={{ padding: '1rem 0' }}>
              {selectedTab === 0 && (
                <BlockStack gap="400">
                  <InlineStack gap="200" align="space-between">
                    <TextField
                      label="Search products"
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search by product name or handle"
                      clearButton
                      onClearButtonClick={() => setSearchQuery('')}
                    />
                    <InlineStack gap="200">
                      <Button onClick={handleSelectAll}>Select All</Button>
                      <Button onClick={handleDeselectAll}>Deselect All</Button>
                    </InlineStack>
                  </InlineStack>

                  <Text variant="bodyMd">
                    {selectedProducts.length} of {filteredProducts.length} products selected
                  </Text>

                  <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
                    headings={['Select', 'Image', 'Product', 'Vendor', 'Type', 'Tags']}
                    rows={productTableRows}
                    truncate
                  />
                </BlockStack>
              )}

              {selectedTab === 1 && (
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">
                    Select Collections
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    The badge will be automatically assigned to all products in the selected collections.
                  </Text>

                  <BlockStack gap="300">
                    {collections.map(collection => (
                      <div key={collection.id} style={{ 
                        padding: '1rem', 
                        border: '1px solid #e1e3e5', 
                        borderRadius: '8px',
                        backgroundColor: selectedCollections.includes(collection.id) ? '#f0f8ff' : '#fff'
                      }}>
                        <InlineStack gap="300" align="space-between">
                          <div style={{ flex: 1 }}>
                            <Checkbox
                              label={collection.title}
                              checked={selectedCollections.includes(collection.id)}
                              onChange={() => handleCollectionToggle(collection.id)}
                            />
                            <Text variant="bodyMd" tone="subdued">
                              {collection.productsCount} products
                            </Text>
                          </div>
                        </InlineStack>
                      </div>
                    ))}
                  </BlockStack>

                  <Text variant="bodyMd">
                    {selectedCollections.length} collections selected
                  </Text>
                </BlockStack>
              )}

              {selectedTab === 2 && (
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">
                    Select Product Tags
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    The badge will be automatically assigned to all products with the selected tags.
                  </Text>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {uniqueTags.map(tag => (
                      <Checkbox
                        key={tag}
                        label={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                      />
                    ))}
                  </div>

                  <Text variant="bodyMd">
                    {selectedTags.length} tags selected
                  </Text>
                </BlockStack>
              )}

              {selectedTab === 3 && (
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">
                    Automatic Assignment Rules
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    Set up rules to automatically assign badges to products based on their properties.
                  </Text>

                  <Select
                    label="Assignment Type"
                    options={assignmentTypes}
                    value={assignmentRule.type}
                    onChange={(value) => setAssignmentRule({ 
                      ...assignmentRule, 
                      type: value as AssignmentRule['type'],
                      criteria: []
                    })}
                  />

                  {assignmentRule.type === 'product_type' && (
                    <div>
                      <Text variant="bodyMd" fontWeight="medium">Select Product Types</Text>
                      <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {uniqueProductTypes.map(type => (
                          <Checkbox
                            key={type}
                            label={type}
                            checked={assignmentRule.criteria.includes(type)}
                            onChange={(checked) => {
                              if (checked) {
                                setAssignmentRule({
                                  ...assignmentRule,
                                  criteria: [...assignmentRule.criteria, type]
                                });
                              } else {
                                setAssignmentRule({
                                  ...assignmentRule,
                                  criteria: assignmentRule.criteria.filter(c => c !== type)
                                });
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {assignmentRule.type === 'vendor' && (
                    <div>
                      <Text variant="bodyMd" fontWeight="medium">Select Vendors</Text>
                      <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {uniqueVendors.map(vendor => (
                          <Checkbox
                            key={vendor}
                            label={vendor}
                            checked={assignmentRule.criteria.includes(vendor)}
                            onChange={(checked) => {
                              if (checked) {
                                setAssignmentRule({
                                  ...assignmentRule,
                                  criteria: [...assignmentRule.criteria, vendor]
                                });
                              } else {
                                setAssignmentRule({
                                  ...assignmentRule,
                                  criteria: assignmentRule.criteria.filter(c => c !== vendor)
                                });
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <Banner tone="warning" title="Automatic Assignment">
                    <p>Automatic rules will continuously assign badges to new products that match the criteria. This happens in real-time as products are added or updated.</p>
                  </Banner>
                </BlockStack>
              )}
            </div>
          </Tabs>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}