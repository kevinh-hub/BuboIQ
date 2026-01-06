import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Palette, Save } from 'lucide-react';
import { BrandingSettings as BrandingSettingsType } from './types';
import { validateBrandingSettings, ValidationError } from './validation';
import FileUpload from './FileUpload';
import { toast } from 'sonner@2.0.3';

interface BrandingSettingsProps {
  settings: BrandingSettingsType;
  onUpdate: (settings: BrandingSettingsType) => void;
  onSave: () => void;
}

export default function BrandingSettings({ settings, onUpdate, onSave }: BrandingSettingsProps) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleSave = () => {
    const validation = validateBrandingSettings(settings);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave();
    } else {
      toast.error('Please fix the validation errors before saving');
    }
  };

  const handleFileChange = (file: File | null, dataUrl: string | null) => {
    onUpdate({ ...settings, logo: dataUrl || '' });
  };

  const handleColorChange = (color: string) => {
    onUpdate({ ...settings, primaryColor: color });
    // Real-time preview update
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--ticketease-green', color);
  };

  const resetToDefault = () => {
    const defaultColor = '#00C48C';
    handleColorChange(defaultColor);
    toast.success('Color reset to default TicketEase green');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Branding & Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of your TicketEase portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="primaryColor">Primary Color *</Label>
            <div className="flex items-center space-x-3">
              <Input
                id="primaryColor"
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#00C48C"
                className={getFieldError('primaryColor') ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetToDefault}
              >
                Reset
              </Button>
            </div>
            {getFieldError('primaryColor') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('primaryColor')}</p>
            )}
          </div>

          <FileUpload
            label="Portal Logo"
            description="Upload logo for client portal (max 5MB)"
            currentFile={settings.logo}
            onFileChange={handleFileChange}
            maxSize={5}
          />

          <div>
            <Label htmlFor="customDomain">Custom Domain</Label>
            <Input
              id="customDomain"
              value={settings.customDomain}
              onChange={(e) => onUpdate({ ...settings, customDomain: e.target.value })}
              placeholder="support.yourcompany.com"
              className={getFieldError('customDomain') ? 'border-red-500' : ''}
            />
            {getFieldError('customDomain') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('customDomain')}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Use your own domain for the client portal
            </p>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              style={{ backgroundColor: settings.primaryColor }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            See how your branding changes look in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: settings.primaryColor }}
              >
                {settings.logo ? (
                  <img 
                    src={settings.logo} 
                    alt="Logo" 
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwRkY4NSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzBFMEUwRSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCI+QjwvdGV4dD4KPHN2Zz4K" 
                    alt="TicketEase Logo" 
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>
              <div>
                <h3 className="font-semibold">TicketEase Support Portal</h3>
                <p className="text-sm text-gray-600">
                  {settings.customDomain || 'support.ticketease.com'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                size="sm" 
                style={{ backgroundColor: settings.primaryColor }}
              >
                Primary Button
              </Button>
              
              <div className="p-3 rounded border-l-4" style={{ borderLeftColor: settings.primaryColor }}>
                <h4 className="font-medium">Sample Card</h4>
                <p className="text-sm text-gray-600">This shows how your brand color appears in cards and highlights.</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <span className="text-sm">Active status indicator</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}