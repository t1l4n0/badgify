import React from 'react';
import { Card, Text, Button, BlockStack, InlineStack, Badge } from '@shopify/polaris';

interface BadgePreset {
  name: string;
  description: string;
  url: string;
  markdown: string;
  category: string;
}

interface BadgePresetsProps {
  onPresetSelect?: (preset: BadgePreset) => void;
}

export function BadgePresets({ onPresetSelect }: BadgePresetsProps) {
  const presets: BadgePreset[] = [
    // Development Status
    {
      name: 'Build Passing',
      description: 'Indicates successful build status',
      url: 'https://img.shields.io/badge/build-passing-brightgreen',
      markdown: '![Build Status](https://img.shields.io/badge/build-passing-brightgreen)',
      category: 'Status'
    },
    {
      name: 'Build Failing',
      description: 'Indicates failed build status',
      url: 'https://img.shields.io/badge/build-failing-red',
      markdown: '![Build Status](https://img.shields.io/badge/build-failing-red)',
      category: 'Status'
    },
    {
      name: 'Tests Passing',
      description: 'Shows test status',
      url: 'https://img.shields.io/badge/tests-passing-brightgreen',
      markdown: '![Tests](https://img.shields.io/badge/tests-passing-brightgreen)',
      category: 'Status'
    },
    
    // Technology Badges
    {
      name: 'React',
      description: 'React framework badge',
      url: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
      markdown: '![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)',
      category: 'Technology'
    },
    {
      name: 'TypeScript',
      description: 'TypeScript language badge',
      url: 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
      markdown: '![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)',
      category: 'Technology'
    },
    {
      name: 'Node.js',
      description: 'Node.js runtime badge',
      url: 'https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white',
      markdown: '![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)',
      category: 'Technology'
    },
    {
      name: 'Shopify',
      description: 'Shopify platform badge',
      url: 'https://img.shields.io/badge/Shopify-7AB55C?style=for-the-badge&logo=shopify&logoColor=white',
      markdown: '![Shopify](https://img.shields.io/badge/Shopify-7AB55C?style=for-the-badge&logo=shopify&logoColor=white)',
      category: 'Technology'
    },

    // Version Badges
    {
      name: 'Version 1.0.0',
      description: 'Version number badge',
      url: 'https://img.shields.io/badge/version-1.0.0-blue',
      markdown: '![Version](https://img.shields.io/badge/version-1.0.0-blue)',
      category: 'Version'
    },
    {
      name: 'Latest Release',
      description: 'Latest release badge',
      url: 'https://img.shields.io/badge/release-latest-green',
      markdown: '![Release](https://img.shields.io/badge/release-latest-green)',
      category: 'Version'
    },

    // License Badges
    {
      name: 'MIT License',
      description: 'MIT license badge',
      url: 'https://img.shields.io/badge/License-MIT-yellow.svg',
      markdown: '![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)',
      category: 'License'
    },
    {
      name: 'Apache 2.0',
      description: 'Apache 2.0 license badge',
      url: 'https://img.shields.io/badge/License-Apache%202.0-blue.svg',
      markdown: '![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)',
      category: 'License'
    },

    // Social Badges
    {
      name: 'GitHub Stars',
      description: 'GitHub stars badge',
      url: 'https://img.shields.io/github/stars/username/repo?style=social',
      markdown: '![GitHub stars](https://img.shields.io/github/stars/username/repo?style=social)',
      category: 'Social'
    },
    {
      name: 'GitHub Forks',
      description: 'GitHub forks badge',
      url: 'https://img.shields.io/github/forks/username/repo?style=social',
      markdown: '![GitHub forks](https://img.shields.io/github/forks/username/repo?style=social)',
      category: 'Social'
    }
  ];

  const categories = [...new Set(presets.map(preset => preset.category))];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <BlockStack gap="400">
      <Text variant="headingMd" as="h2">
        Badge Presets
      </Text>
      
      {categories.map(category => (
        <Card key={category}>
          <BlockStack gap="300">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Text variant="headingSm" as="h3">
                {category}
              </Text>
              <Badge tone="info">{presets.filter(p => p.category === category).length}</Badge>
            </div>
            
            <BlockStack gap="300">
              {presets
                .filter(preset => preset.category === category)
                .map((preset, index) => (
                  <div key={index} style={{ 
                    padding: '1rem', 
                    border: '1px solid #e1e3e5', 
                    borderRadius: '8px',
                    backgroundColor: '#fafbfb'
                  }}>
                    <BlockStack gap="300">
                      <InlineStack gap="300" align="space-between">
                        <div style={{ flex: 1 }}>
                          <Text variant="bodyMd" fontWeight="semibold">
                            {preset.name}
                          </Text>
                          <Text variant="bodyMd" tone="subdued">
                            {preset.description}
                          </Text>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <img src={preset.url} alt={preset.name} style={{ maxHeight: '20px' }} />
                        </div>
                      </InlineStack>
                      
                      <InlineStack gap="200">
                        <Button 
                          size="small" 
                          onClick={() => copyToClipboard(preset.url)}
                        >
                          Copy URL
                        </Button>
                        <Button 
                          size="small" 
                          onClick={() => copyToClipboard(preset.markdown)}
                        >
                          Copy Markdown
                        </Button>
                        {onPresetSelect && (
                          <Button 
                            size="small" 
                            variant="primary"
                            onClick={() => onPresetSelect(preset)}
                          >
                            Use Preset
                          </Button>
                        )}
                      </InlineStack>
                    </BlockStack>
                  </div>
                ))}
            </BlockStack>
          </BlockStack>
        </Card>
      ))}
    </BlockStack>
  );
}