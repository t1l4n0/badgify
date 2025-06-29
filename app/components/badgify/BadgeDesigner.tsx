import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  ColorPicker,
  RangeSlider,
  Checkbox,
  Tabs,
  Banner,
  Divider
} from '@shopify/polaris';

interface BadgeDesign {
  id?: string;
  name: string;
  description?: string;
  shape: 'rectangle' | 'circle' | 'pill' | 'ribbon' | 'burst' | 'tag' | 'eclipse' | 'custom';
  text: string;
  textColor: string;
  backgroundColor: string;
  borderColor?: string;
  borderWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textAlign: string;
  width?: number;
  height?: number;
  padding: number;
  borderRadius: number;
  gradient?: string;
  shadow?: string;
  animation?: string;
  customCSS?: string;
  customSVG?: string;
  position: string;
  zIndex: number;
  isActive: boolean;
}

interface BadgeDesignerProps {
  initialDesign?: Partial<BadgeDesign>;
  onSave?: (design: BadgeDesign) => void;
  onPreview?: (design: BadgeDesign) => void;
}

export function BadgeDesigner({ initialDesign, onSave, onPreview }: BadgeDesignerProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [design, setDesign] = useState<BadgeDesign>({
    name: '',
    shape: 'rectangle',
    text: 'NEW',
    textColor: '#FFFFFF',
    backgroundColor: '#007ACC',
    borderWidth: 0,
    fontSize: 12,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    textAlign: 'center',
    padding: 8,
    borderRadius: 4,
    position: 'top-right',
    zIndex: 10,
    isActive: true,
    ...initialDesign
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'basic', content: 'Basic', panelID: 'basic-panel' },
    { id: 'styling', content: 'Styling', panelID: 'styling-panel' },
    { id: 'advanced', content: 'Advanced', panelID: 'advanced-panel' },
    { id: 'preview', content: 'Preview', panelID: 'preview-panel' }
  ];

  const shapeOptions = [
    { label: 'Rectangle', value: 'rectangle' },
    { label: 'Circle', value: 'circle' },
    { label: 'Pill', value: 'pill' },
    { label: 'Ribbon', value: 'ribbon' },
    { label: 'Burst', value: 'burst' },
    { label: 'Tag', value: 'tag' },
    { label: 'Eclipse', value: 'eclipse' },
    { label: 'Custom SVG', value: 'custom' }
  ];

  const fontFamilyOptions = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Open Sans', value: 'Open Sans' }
  ];

  const fontWeightOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Bold', value: 'bold' },
    { label: 'Light', value: '300' },
    { label: 'Medium', value: '500' },
    { label: 'Semi Bold', value: '600' },
    { label: 'Extra Bold', value: '800' }
  ];

  const positionOptions = [
    { label: 'Top Left', value: 'top-left' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Center', value: 'center' }
  ];

  const updateDesign = (updates: Partial<BadgeDesign>) => {
    const newDesign = { ...design, ...updates };
    setDesign(newDesign);
    if (onPreview) {
      onPreview(newDesign);
    }
  };

  const generateBadgeCSS = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: design.textAlign as any,
      padding: `${design.padding}px`,
      backgroundColor: design.backgroundColor,
      color: design.textColor,
      fontSize: `${design.fontSize}px`,
      fontFamily: design.fontFamily,
      fontWeight: design.fontWeight as any,
      border: design.borderWidth > 0 ? `${design.borderWidth}px solid ${design.borderColor || design.backgroundColor}` : 'none',
      zIndex: design.zIndex,
      position: 'relative',
      overflow: 'hidden'
    };

    // Shape-specific styles
    switch (design.shape) {
      case 'rectangle':
        baseStyles.borderRadius = `${design.borderRadius}px`;
        break;
      case 'circle':
        baseStyles.borderRadius = '50%';
        baseStyles.width = '40px';
        baseStyles.height = '40px';
        break;
      case 'pill':
        baseStyles.borderRadius = '20px';
        break;
      case 'ribbon':
        baseStyles.clipPath = 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)';
        break;
      case 'burst':
        baseStyles.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        baseStyles.width = '60px';
        baseStyles.height = '60px';
        break;
      case 'tag':
        baseStyles.clipPath = 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)';
        break;
      case 'eclipse':
        baseStyles.borderRadius = '50% 20% 50% 20%';
        break;
    }

    // Custom dimensions
    if (design.width) baseStyles.width = `${design.width}px`;
    if (design.height) baseStyles.height = `${design.height}px`;

    return baseStyles;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(design);
    }
  };

  useEffect(() => {
    if (onPreview) {
      onPreview(design);
    }
  }, [design, onPreview]);

  return (
    <Card>
      <BlockStack gap="400">
        <div>
          <Text variant="headingMd" as="h2">
            Badge Designer
          </Text>
          <Text variant="bodyMd" tone="subdued">
            Create custom product badges with advanced styling options
          </Text>
        </div>

        <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
          <div style={{ padding: '1.5rem 0' }}>
            {selectedTab === 0 && (
              <BlockStack gap="400">
                <Text variant="headingSm" as="h3">Basic Settings</Text>
                
                <InlineStack gap="400">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Badge Name"
                      value={design.name}
                      onChange={(value) => updateDesign({ name: value })}
                      placeholder="Enter badge name"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Badge Text"
                      value={design.text}
                      onChange={(value) => updateDesign({ text: value })}
                      placeholder="Enter badge text"
                    />
                  </div>
                </InlineStack>

                <TextField
                  label="Description (optional)"
                  value={design.description || ''}
                  onChange={(value) => updateDesign({ description: value })}
                  placeholder="Describe this badge"
                  multiline={2}
                />

                <InlineStack gap="400">
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Shape"
                      options={shapeOptions}
                      value={design.shape}
                      onChange={(value) => updateDesign({ shape: value as BadgeDesign['shape'] })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Position"
                      options={positionOptions}
                      value={design.position}
                      onChange={(value) => updateDesign({ position: value })}
                    />
                  </div>
                </InlineStack>

                <Checkbox
                  label="Badge is active"
                  checked={design.isActive}
                  onChange={(checked) => updateDesign({ isActive: checked })}
                />
              </BlockStack>
            )}

            {selectedTab === 1 && (
              <BlockStack gap="400">
                <Text variant="headingSm" as="h3">Styling Options</Text>
                
                <InlineStack gap="400">
                  <div style={{ flex: 1 }}>
                    <Text variant="bodyMd" fontWeight="medium">Background Color</Text>
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="color"
                        value={design.backgroundColor}
                        onChange={(e) => updateDesign({ backgroundColor: e.target.value })}
                        style={{ width: '100%', height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text variant="bodyMd" fontWeight="medium">Text Color</Text>
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="color"
                        value={design.textColor}
                        onChange={(e) => updateDesign({ textColor: e.target.value })}
                        style={{ width: '100%', height: '40px', border: '1px solid #ccc', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                </InlineStack>

                <InlineStack gap="400">
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Font Family"
                      options={fontFamilyOptions}
                      value={design.fontFamily}
                      onChange={(value) => updateDesign({ fontFamily: value })}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Select
                      label="Font Weight"
                      options={fontWeightOptions}
                      value={design.fontWeight}
                      onChange={(value) => updateDesign({ fontWeight: value })}
                    />
                  </div>
                </InlineStack>

                <div>
                  <Text variant="bodyMd" fontWeight="medium">Font Size: {design.fontSize}px</Text>
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={design.fontSize}
                      onChange={(e) => updateDesign({ fontSize: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd" fontWeight="medium">Padding: {design.padding}px</Text>
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={design.padding}
                      onChange={(e) => updateDesign({ padding: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <Text variant="bodyMd" fontWeight="medium">Border Radius: {design.borderRadius}px</Text>
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={design.borderRadius}
                      onChange={(e) => updateDesign({ borderRadius: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </BlockStack>
            )}

            {selectedTab === 2 && (
              <BlockStack gap="400">
                <Text variant="headingSm" as="h3">Advanced Options</Text>
                
                <InlineStack gap="400">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Border Color (optional)"
                      value={design.borderColor || ''}
                      onChange={(value) => updateDesign({ borderColor: value })}
                      placeholder="#000000"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div>
                      <Text variant="bodyMd" fontWeight="medium">Border Width: {design.borderWidth}px</Text>
                      <div style={{ marginTop: '0.5rem' }}>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={design.borderWidth}
                          onChange={(e) => updateDesign({ borderWidth: parseInt(e.target.value) })}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </InlineStack>

                <InlineStack gap="400">
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Custom Width (px)"
                      type="number"
                      value={design.width?.toString() || ''}
                      onChange={(value) => updateDesign({ width: value ? parseInt(value) : undefined })}
                      placeholder="Auto"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Custom Height (px)"
                      type="number"
                      value={design.height?.toString() || ''}
                      onChange={(value) => updateDesign({ height: value ? parseInt(value) : undefined })}
                      placeholder="Auto"
                    />
                  </div>
                </InlineStack>

                <div>
                  <Text variant="bodyMd" fontWeight="medium">Z-Index: {design.zIndex}</Text>
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={design.zIndex}
                      onChange={(e) => updateDesign({ zIndex: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <TextField
                  label="Custom CSS (optional)"
                  value={design.customCSS || ''}
                  onChange={(value) => updateDesign({ customCSS: value })}
                  placeholder="Enter custom CSS properties"
                  multiline={4}
                  helpText="Add custom CSS for advanced styling"
                />

                {design.shape === 'custom' && (
                  <TextField
                    label="Custom SVG Code"
                    value={design.customSVG || ''}
                    onChange={(value) => updateDesign({ customSVG: value })}
                    placeholder="<svg>...</svg>"
                    multiline={6}
                    helpText="Paste your custom SVG code here"
                  />
                )}
              </BlockStack>
            )}

            {selectedTab === 3 && (
              <BlockStack gap="400">
                <Text variant="headingSm" as="h3">Live Preview</Text>
                
                <div style={{
                  padding: '2rem',
                  backgroundColor: '#f6f6f7',
                  borderRadius: '8px',
                  textAlign: 'center',
                  position: 'relative',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '200px',
                    height: '150px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    position: 'relative',
                    backgroundImage: 'url("https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <div
                      style={{
                        ...generateBadgeCSS(),
                        position: 'absolute',
                        ...(design.position === 'top-left' && { top: '8px', left: '8px' }),
                        ...(design.position === 'top-right' && { top: '8px', right: '8px' }),
                        ...(design.position === 'bottom-left' && { bottom: '8px', left: '8px' }),
                        ...(design.position === 'bottom-right' && { bottom: '8px', right: '8px' }),
                        ...(design.position === 'center' && { 
                          top: '50%', 
                          left: '50%', 
                          transform: 'translate(-50%, -50%)' 
                        })
                      }}
                    >
                      {design.text}
                    </div>
                  </div>
                </div>

                <Banner tone="info" title="Preview Information">
                  <p>This preview shows how your badge will appear on product images. The actual implementation will depend on your theme integration.</p>
                </Banner>
              </BlockStack>
            )}
          </div>
        </Tabs>

        <Divider />

        <InlineStack gap="300" align="end">
          <Button onClick={handleSave} variant="primary" size="large">
            Save Badge Design
          </Button>
          <Button onClick={() => onPreview?.(design)} size="large">
            Update Preview
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}