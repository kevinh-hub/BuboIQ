import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Clock, Save, AlertTriangle } from 'lucide-react';
import { SLASettings as SLASettingsType, TIMEZONE_OPTIONS } from './types';
import { validateSLASettings, ValidationError } from './validation';
import { toast } from 'sonner@2.0.3';

interface SLASettingsProps {
  settings: SLASettingsType;
  onUpdate: (settings: SLASettingsType) => void;
  onSave: () => void;
}

export default function SLASettings({ settings, onUpdate, onSave }: SLASettingsProps) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const handleSave = () => {
    const validation = validateSLASettings(settings);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave();
    } else {
      toast.error('Fix errors before saving');
    }
  };

  const calculateBusinessHours = () => {
    const high = parseInt(settings.highPriority);
    const medium = parseInt(settings.mediumPriority);
    const low = parseInt(settings.lowPriority);

    if (isNaN(high) || isNaN(medium) || isNaN(low)) return null;

    const workingHoursPerDay = 8; // Assuming 8-hour workdays
    const workingDaysPerWeek = 5; // Monday to Friday

    return {
      high: {
        hours: high,
        businessDays: Math.ceil(high / workingHoursPerDay),
        businessHours: high <= workingHoursPerDay ? `${high}h` : `${Math.floor(high / workingHoursPerDay)}d ${high % workingHoursPerDay}h`
      },
      medium: {
        hours: medium,
        businessDays: Math.ceil(medium / workingHoursPerDay),
        businessHours: medium <= workingHoursPerDay ? `${medium}h` : `${Math.floor(medium / workingHoursPerDay)}d ${medium % workingHoursPerDay}h`
      },
      low: {
        hours: low,
        businessDays: Math.ceil(low / workingHoursPerDay),
        businessHours: low <= workingHoursPerDay ? `${low}h` : `${Math.floor(low / workingHoursPerDay)}d ${low % workingHoursPerDay}h`
      }
    };
  };

  const businessHours = calculateBusinessHours();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Response deadlines</CardTitle>
          </div>
          <CardDescription>
            Set how fast you'll respond to different priorities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="highPriority">Urgent (hours) *</Label>
              <Input
                id="highPriority"
                type="number"
                min="1"
                max="168"
                value={settings.highPriority}
                onChange={(e) => onUpdate({ ...settings, highPriority: e.target.value })}
                className={getFieldError('highPriority') ? 'border-red-500' : ''}
              />
              {getFieldError('highPriority') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('highPriority')}</p>
              )}
              {businessHours && (
                <p className="text-xs text-gray-500 mt-1">
                  ≈ {businessHours.high.businessHours} business time
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="mediumPriority">Medium (hours) *</Label>
              <Input
                id="mediumPriority"
                type="number"
                min="1"
                max="168"
                value={settings.mediumPriority}
                onChange={(e) => onUpdate({ ...settings, mediumPriority: e.target.value })}
                className={getFieldError('mediumPriority') ? 'border-red-500' : ''}
              />
              {getFieldError('mediumPriority') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('mediumPriority')}</p>
              )}
              {businessHours && (
                <p className="text-xs text-gray-500 mt-1">
                  ≈ {businessHours.medium.businessHours} business time
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lowPriority">Low (hours) *</Label>
              <Input
                id="lowPriority"
                type="number"
                min="1"
                max="168"
                value={settings.lowPriority}
                onChange={(e) => onUpdate({ ...settings, lowPriority: e.target.value })}
                className={getFieldError('lowPriority') ? 'border-red-500' : ''}
              />
              {getFieldError('lowPriority') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('lowPriority')}</p>
              )}
              {businessHours && (
                <p className="text-xs text-gray-500 mt-1">
                  ≈ {businessHours.low.businessHours} business time
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="workingHours">Working Hours *</Label>
              <Input
                id="workingHours"
                placeholder="e.g., 9-17"
                value={settings.workingHours}
                onChange={(e) => onUpdate({ ...settings, workingHours: e.target.value })}
                className={getFieldError('workingHours') ? 'border-red-500' : ''}
              />
              {getFieldError('workingHours') && (
                <p className="text-sm text-red-600 mt-1">{getFieldError('workingHours')}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                24-hour format (e.g., 9-17 for 9 AM to 5 PM)
              </p>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone *</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => onUpdate({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SLA Validation Warnings */}
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <h4 className="font-medium text-red-800">Validation Issues</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          )}

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

      {/* SLA Preview */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Summary</CardTitle>
          <CardDescription>
            Overview of your service level commitments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                <h4 className="font-medium text-red-800 mb-1">High Priority</h4>
                <p className="text-lg font-semibold text-red-900">{settings.highPriority} hours</p>
                <p className="text-sm text-red-700">Critical issues</p>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-1">Medium Priority</h4>
                <p className="text-lg font-semibold text-yellow-900">{settings.mediumPriority} hours</p>
                <p className="text-sm text-yellow-700">Important issues</p>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <h4 className="font-medium text-green-800 mb-1">Low Priority</h4>
                <p className="text-lg font-semibold text-green-900">{settings.lowPriority} hours</p>
                <p className="text-sm text-green-700">General inquiries</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
              <p className="text-sm text-gray-700">
                {settings.workingHours} ({settings.timezone}) - Monday to Friday
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}