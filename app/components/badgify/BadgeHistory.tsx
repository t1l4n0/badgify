import React, { useState, useEffect } from 'react';
import { Card, Text, Button, BlockStack, InlineStack, EmptyState, Badge } from '@shopify/polaris';

interface BadgeHistoryItem {
  id: string;
  url: string;
  markdown: string;
  createdAt: Date;
  name?: string;
}

interface BadgeHistoryProps {
  onBadgeReuse?: (badge: BadgeHistoryItem) => void;
}

export function BadgeHistory({ onBadgeReuse }: BadgeHistoryProps) {
  const [history, setHistory] = useState<BadgeHistoryItem[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('badgify-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        })));
      } catch (err) {
        console.error('Failed to load badge history:', err);
      }
    }
  }, []);

  const saveBadge = (url: string, markdown: string, name?: string) => {
    const newBadge: BadgeHistoryItem = {
      id: Date.now().toString(),
      url,
      markdown,
      createdAt: new Date(),
      name
    };

    const updatedHistory = [newBadge, ...history.slice(0, 19)]; // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('badgify-history', JSON.stringify(updatedHistory));
  };

  const deleteBadge = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('badgify-history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('badgify-history');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Expose saveBadge function to parent components
  React.useImperativeHandle(React.createRef(), () => ({
    saveBadge
  }));

  if (history.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="No badge history yet"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>Generated badges will appear here for easy reuse.</p>
        </EmptyState>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack gap="200" align="space-between">
          <div>
            <Text variant="headingMd" as="h2">
              Badge History
            </Text>
            <Text variant="bodyMd" tone="subdued">
              {history.length} badge{history.length !== 1 ? 's' : ''} saved
            </Text>
          </div>
          <Button 
            variant="plain" 
            tone="critical" 
            onClick={clearHistory}
            size="small"
          >
            Clear All
          </Button>
        </InlineStack>

        <BlockStack gap="300">
          {history.map((badge) => (
            <div key={badge.id} style={{ 
              padding: '1rem', 
              border: '1px solid #e1e3e5', 
              borderRadius: '8px',
              backgroundColor: '#fafbfb'
            }}>
              <BlockStack gap="300">
                <InlineStack gap="300" align="space-between">
                  <div style={{ flex: 1 }}>
                    <InlineStack gap="200" align="start">
                      <img 
                        src={badge.url} 
                        alt="Badge" 
                        style={{ maxHeight: '20px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div>
                        {badge.name && (
                          <Text variant="bodyMd" fontWeight="semibold">
                            {badge.name}
                          </Text>
                        )}
                        <Text variant="bodyMd" tone="subdued">
                          {formatDate(badge.createdAt)}
                        </Text>
                      </div>
                    </InlineStack>
                  </div>
                  <Button 
                    variant="plain" 
                    tone="critical" 
                    onClick={() => deleteBadge(badge.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                </InlineStack>

                <div style={{ 
                  padding: '0.5rem', 
                  backgroundColor: '#f6f6f7', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  wordBreak: 'break-all'
                }}>
                  {badge.markdown}
                </div>

                <InlineStack gap="200">
                  <Button 
                    size="small" 
                    onClick={() => copyToClipboard(badge.url)}
                  >
                    Copy URL
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => copyToClipboard(badge.markdown)}
                  >
                    Copy Markdown
                  </Button>
                  {onBadgeReuse && (
                    <Button 
                      size="small" 
                      variant="primary"
                      onClick={() => onBadgeReuse(badge)}
                    >
                      Reuse
                    </Button>
                  )}
                </InlineStack>
              </BlockStack>
            </div>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}