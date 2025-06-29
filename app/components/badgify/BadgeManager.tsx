import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  DataTable,
  Badge,
  ActionList,
  Popover,
  Modal,
  EmptyState,
  Filters,
  TextField,
  Select,
  Pagination
} from '@shopify/polaris';

interface BadgeData {
  id: string;
  name: string;
  description?: string;
  shape: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  assignmentType: string;
  assignmentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BadgeManagerProps {
  badges: BadgeData[];
  onEdit?: (badge: BadgeData) => void;
  onDelete?: (badgeId: string) => void;
  onDuplicate?: (badge: BadgeData) => void;
  onToggleActive?: (badgeId: string, isActive: boolean) => void;
  onAssignProducts?: (badgeId: string) => void;
  onViewAnalytics?: (badgeId: string) => void;
}

export function BadgeManager({
  badges,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
  onAssignProducts,
  onViewAnalytics
}: BadgeManagerProps) {
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [shapeFilter, setShapeFilter] = useState<string>('all');

  const statusOptions = [
    { label: 'All Badges', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];

  const shapeOptions = [
    { label: 'All Shapes', value: 'all' },
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Circle', value: 'circle' },
    { label: 'Pill', value: 'pill' },
    { label: 'Ribbon', value: 'ribbon' },
    { label: 'Burst', value: 'burst' },
    { label: 'Tag', value: 'tag' },
    { label: 'Eclipse', value: 'eclipse' },
    { label: 'Custom', value: 'custom' }
  ];

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         badge.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && badge.isActive) ||
                         (statusFilter === 'inactive' && !badge.isActive);
    const matchesShape = shapeFilter === 'all' || badge.shape === shapeFilter;
    
    return matchesSearch && matchesStatus && matchesShape;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBadges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBadges = filteredBadges.slice(startIndex, startIndex + itemsPerPage);

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'activate':
        selectedBadges.forEach(id => onToggleActive?.(id, true));
        break;
      case 'deactivate':
        selectedBadges.forEach(id => onToggleActive?.(id, false));
        break;
      case 'delete':
        // Handle bulk delete
        break;
    }
    setSelectedBadges([]);
  };

  const handleDeleteConfirm = () => {
    if (badgeToDelete && onDelete) {
      onDelete(badgeToDelete);
    }
    setDeleteModalOpen(false);
    setBadgeToDelete(null);
  };

  const renderBadgePreview = (badge: BadgeData) => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        backgroundColor: badge.backgroundColor,
        color: badge.textColor,
        fontSize: '10px',
        fontWeight: 'bold',
        borderRadius: badge.shape === 'circle' ? '50%' : '4px',
        minWidth: badge.shape === 'circle' ? '20px' : 'auto',
        height: '20px'
      }}
    >
      {badge.text}
    </div>
  );

  const tableRows = paginatedBadges.map(badge => [
    renderBadgePreview(badge),
    badge.name,
    badge.text,
    <Badge tone={badge.isActive ? 'success' : 'critical'}>
      {badge.isActive ? 'Active' : 'Inactive'}
    </Badge>,
    badge.shape.charAt(0).toUpperCase() + badge.shape.slice(1),
    badge.assignmentCount.toString(),
    new Date(badge.createdAt).toLocaleDateString(),
    <Popover
      key={badge.id}
      active={activePopover === badge.id}
      activator={
        <Button
          variant="plain"
          onClick={() => setActivePopover(activePopover === badge.id ? null : badge.id)}
        >
          Actions
        </Button>
      }
      onClose={() => setActivePopover(null)}
    >
      <ActionList
        items={[
          {
            content: 'Edit',
            onAction: () => {
              onEdit?.(badge);
              setActivePopover(null);
            }
          },
          {
            content: 'Duplicate',
            onAction: () => {
              onDuplicate?.(badge);
              setActivePopover(null);
            }
          },
          {
            content: badge.isActive ? 'Deactivate' : 'Activate',
            onAction: () => {
              onToggleActive?.(badge.id, !badge.isActive);
              setActivePopover(null);
            }
          },
          {
            content: 'Assign to Products',
            onAction: () => {
              onAssignProducts?.(badge.id);
              setActivePopover(null);
            }
          },
          {
            content: 'View Analytics',
            onAction: () => {
              onViewAnalytics?.(badge.id);
              setActivePopover(null);
            }
          },
          {
            content: 'Delete',
            destructive: true,
            onAction: () => {
              setBadgeToDelete(badge.id);
              setDeleteModalOpen(true);
              setActivePopover(null);
            }
          }
        ]}
      />
    </Popover>
  ]);

  const tableHeadings = [
    'Preview',
    'Name',
    'Text',
    'Status',
    'Shape',
    'Products',
    'Created',
    'Actions'
  ];

  if (badges.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="No badges created yet"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Create your first product badge to get started with Badgify.</p>
        </EmptyState>
      </Card>
    );
  }

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="400">
          <InlineStack gap="200" align="space-between">
            <div>
              <Text variant="headingMd" as="h2">
                Badge Manager
              </Text>
              <Text variant="bodyMd" tone="subdued">
                {filteredBadges.length} of {badges.length} badges
              </Text>
            </div>
            {selectedBadges.length > 0 && (
              <InlineStack gap="200">
                <Button onClick={() => handleBulkAction('activate')}>
                  Activate Selected
                </Button>
                <Button onClick={() => handleBulkAction('deactivate')}>
                  Deactivate Selected
                </Button>
                <Button tone="critical" onClick={() => handleBulkAction('delete')}>
                  Delete Selected
                </Button>
              </InlineStack>
            )}
          </InlineStack>

          <Filters
            queryValue={searchQuery}
            filters={[
              {
                key: 'status',
                label: 'Status',
                filter: (
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                )
              },
              {
                key: 'shape',
                label: 'Shape',
                filter: (
                  <Select
                    label="Shape"
                    options={shapeOptions}
                    value={shapeFilter}
                    onChange={setShapeFilter}
                  />
                )
              }
            ]}
            onQueryChange={setSearchQuery}
            onQueryClear={() => setSearchQuery('')}
            onClearAll={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setShapeFilter('all');
            }}
          />

          <DataTable
            columnContentTypes={['text', 'text', 'text', 'text', 'text', 'numeric', 'text', 'text']}
            headings={tableHeadings}
            rows={tableRows}
            selectable
            selectedRows={selectedBadges}
            onSelectionChange={setSelectedBadges}
          />

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                hasPrevious={currentPage > 1}
                onPrevious={() => setCurrentPage(currentPage - 1)}
                hasNext={currentPage < totalPages}
                onNext={() => setCurrentPage(currentPage + 1)}
                label={`Page ${currentPage} of ${totalPages}`}
              />
            </div>
          )}
        </BlockStack>
      </Card>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Badge"
        primaryAction={{
          content: 'Delete',
          destructive: true,
          onAction: handleDeleteConfirm
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setDeleteModalOpen(false)
          }
        ]}
      >
        <Modal.Section>
          <Text variant="bodyMd">
            Are you sure you want to delete this badge? This action cannot be undone and will remove the badge from all assigned products.
          </Text>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
}