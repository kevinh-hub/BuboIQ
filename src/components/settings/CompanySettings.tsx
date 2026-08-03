import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Building, Save } from 'lucide-react';
import { CompanySettings as CompanySettingsType } from './types';
import { validateCompanySettings, ValidationError } from './validation';
import FileUpload from './FileUpload';
import { toast } from 'sonner';

interface CompanySettingsProps {
  settings: CompanySettingsType;
  onUpdate: (settings: CompanySettingsType) => void;
  onSave: () => void;
}

export default function CompanySettings({ settings, onUpdate, onSave }: CompanySettingsProps) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleSave = () => {
    const validation = validateCompanySettings(settings);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave();
    } else {
      toast.error('Fix errors before saving');
    }
  };

  const handleFileChange = (file: File | null, dataUrl: string | null) => {
    onUpdate({ ...settings, logo: dataUrl || '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <CardTitle>Company info</CardTitle>
        </div>
        <CardDescription>
          Basic info about your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={settings.name}
              onChange={(e) => onUpdate({ ...settings, name: e.target.value })}
              className={getFieldError('name') ? 'border-red-500' : ''}
            />
            {getFieldError('name') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('name')}</p>
            )}
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://example.com"
              value={settings.website}
              onChange={(e) => onUpdate({ ...settings, website: e.target.value })}
              className={getFieldError('website') ? 'border-red-500' : ''}
            />
            {getFieldError('website') && (
              <p className="text-sm text-red-600 mt-1">{getFieldError('website')}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="supportEmail">Support Email *</Label>
          <Input
            id="supportEmail"
            type="email"
            placeholder="support@example.com"
            value={settings.supportEmail}
            onChange={(e) => onUpdate({ ...settings, supportEmail: e.target.value })}
            className={getFieldError('supportEmail') ? 'border-red-500' : ''}
          />
          {getFieldError('supportEmail') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('supportEmail')}</p>
          )}
        </div>

        <FileUpload
          label="Company Logo"
          description="Upload your company logo (max 5MB)"
          currentFile={settings.logo}
          onFileChange={handleFileChange}
          maxSize={5}
        />

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            style={{ backgroundColor: '#00C48C' }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}