import React, { useState, useRef } from 'react';
import { Card, Text, Button, BlockStack, InlineStack, TextField, Select, ColorPicker, Banner } from '@shopify/polaris';

interface BadgeConfig {
  text: string;
  style: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
  color: string;
  labelColor: string;
  logo: string;
  logoColor: string;
  label: string;
}

interface BadgeGeneratorProps {
  onBadgeGenerated?: (badgeUrl: string, badgeMarkdown: string) => void;
}

export function BadgeGenerator({ onBadgeGenerated }: BadgeGeneratorProps) {
  const [config, setConfig] = useState<BadgeConfig>({
    text: 'badge',
    style: 'flat',
    color: 'blue',
    labelColor: 'grey',
    logo: '',
    logoColor: 'white',
    label: ''
  });

  const [generatedBadge, setGeneratedBadge] = useState<string>('');
  const [badgeMarkdown, setBadgeMarkdown] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const styleOptions = [
    { label: 'Flat', value: 'flat' },
    { label: 'Flat Square', value: 'flat-square' },
    { label: 'Plastic', value: 'plastic' },
    { label: 'For the Badge', value: 'for-the-badge' },
    { label: 'Social', value: 'social' }
  ];

  const colorOptions = [
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Red', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Purple', value: 'purple' },
    { label: 'Pink', value: 'pink' },
    { label: 'Grey', value: 'grey' },
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' }
  ];

  const generateBadgeUrl = () => {
    const baseUrl = 'https://img.shields.io/badge';
    let badgeUrl = baseUrl;

    // Add label and text
    if (config.label) {
      badgeUrl += `/${encodeURIComponent(config.label)}-${encodeURIComponent(config.text)}`;
    } else {
      badgeUrl += `/${encodeURIComponent(config.text)}`;
    }

    // Add color
    badgeUrl += `-${config.color}`;

    // Add query parameters
    const params = new URLSearchParams();
    if (config.style !== 'flat') params.append('style', config.style);
    if (config.logo) params.append('logo', config.logo);
    if (config.logoColor !== 'white') params.append('logoColor', config.logoColor);
    if (config.labelColor !== 'grey') params.append('labelColor', config.labelColor);

    if (params.toString()) {
      badgeUrl += `?${params.toString()}`;
    }

    return badgeUrl;
  };

  const generateBadge = () => {
    const badgeUrl = generateBadgeUrl();
    const markdown = `![Badge](${badgeUrl})`;
    
    setGeneratedBadge(badgeUrl);
    setBadgeMarkdown(markdown);
    
    if (onBadgeGenerated) {
      onBadgeGenerated(badgeUrl, markdown);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadBadge = async () => {
    if (!generatedBadge) return;

    try {
      const response = await fetch(generatedBadge);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `badge-${config.text}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download badge:', err);
    }
  };

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd" as="h2">
            Badge Configuration
          </Text>
          
          <InlineStack gap="400">
            <div style={{ flex: 1 }}>
              <TextField
                label="Badge Text"
                value={config.text}
                onChange={(value) => setConfig({ ...config, text: value })}
                placeholder="Enter badge text"
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextField
                label="Label (optional)"
                value={config.label}
                onChange={(value) => setConfig({ ...config, label: value })}
                placeholder="Enter label text"
              />
            </div>
          </InlineStack>

          <InlineStack gap="400">
            <div style={{ flex: 1 }}>
              <Select
                label="Style"
                options={styleOptions}
                value={config.style}
                onChange={(value) => setConfig({ ...config, style: value as BadgeConfig['style'] })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Select
                label="Color"
                options={colorOptions}
                value={config.color}
                onChange={(value) => setConfig({ ...config, color: value })}
              />
            </div>
          </InlineStack>

          <InlineStack gap="400">
            <div style={{ flex: 1 }}>
              <TextField
                label="Logo (optional)"
                value={config.logo}
                onChange={(value) => setConfig({ ...config, logo: value })}
                placeholder="e.g., github, npm, react"
                helpText="Use simple icon names from Simple Icons"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Select
                label="Logo Color"
                options={colorOptions}
                value={config.logoColor}
                onChange={(value) => setConfig({ ...config, logoColor: value })}
              />
            </div>
          </InlineStack>

          <Button variant="primary" onClick={generateBadge} size="large">
            Generate Badge
          </Button>
        </BlockStack>
      </Card>

      {generatedBadge && (
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">
              Generated Badge
            </Text>
            
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f6f6f7', borderRadius: '8px' }}>
              <img src={generatedBadge} alt="Generated Badge" style={{ maxWidth: '100%' }} />
            </div>

            <BlockStack gap="300">
              <div>
                <Text variant="bodyMd" fontWeight="semibold">Badge URL:</Text>
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#f6f6f7', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  wordBreak: 'break-all'
                }}>
                  {generatedBadge}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <Button onClick={() => copyToClipboard(generatedBadge)}>
                    Copy URL
                  </Button>
                </div>
              </div>

              <div>
                <Text variant="bodyMd" fontWeight="semibold">Markdown:</Text>
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  backgroundColor: '#f6f6f7', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}>
                  {badgeMarkdown}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <InlineStack gap="200">
                    <Button onClick={() => copyToClipboard(badgeMarkdown)}>
                      Copy Markdown
                    </Button>
                    <Button onClick={downloadBadge}>
                      Download SVG
                    </Button>
                  </InlineStack>
                </div>
              </div>
            </BlockStack>
          </BlockStack>
        </Card>
      )}

      <Banner tone="info" title="Badge Tips">
        <BlockStack gap="200">
          <Text variant="bodyMd">
            • Use simple, descriptive text for better readability
          </Text>
          <Text variant="bodyMd">
            • Popular logos: github, npm, react, vue, typescript, javascript
          </Text>
          <Text variant="bodyMd">
            • Badges are automatically cached and optimized by shields.io
          </Text>
        </BlockStack>
      </Banner>
    </BlockStack>
  );
}