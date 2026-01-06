import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner@2.0.3';
import { Upload, X } from 'lucide-react';

interface CreateSignalFormProps {
  onSubmit?: (signalData: any) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function CreateSignalForm({ onSubmit, onCancel, onSuccess }: CreateSignalFormProps) {
  const { user, users, createLegacySignal, permissions } = useApp();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    assignedToId: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const categories = [
    'Infrastructure',
    'Security', 
    'Performance',
    'Application',
    'Network',
    'General Signal'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const assignedTo = formData.assignedToId ? users.find(u => u.id === formData.assignedToId) : undefined;

    const signalData = {
      subject: formData.subject,
      description: formData.description,
      category: formData.category || categories[0],
      priority: formData.priority,
      status: 'Open' as const,
      assignedTo,
      createdBy: user!,
      attachments: attachments.map(f => f.name)
    };

    if (onSubmit) {
      onSubmit(signalData);
    } else {
      createLegacySignal(signalData);
      toast.success('Signal created successfully!');
    }

    if (onSuccess) {
      onSuccess();
    }
    
    // Reset form
    setFormData({
      subject: '',
      description: '',
      category: '',
      priority: 'Medium',
      assignedToId: ''
    });
    setAttachments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="subject">Signal Title *</Label>
          <Input
            id="subject"
            placeholder="Brief description of the signal"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Severity</Label>
          <Select value={formData.priority} onValueChange={(value: 'Low' | 'Medium' | 'High') => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Info</SelectItem>
              <SelectItem value="Medium">Warning</SelectItem>
              <SelectItem value="High">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {permissions.canAssignSignals && (
          <div className="md:col-span-2">
            <Label htmlFor="assignedTo">Assign to</Label>
            <Select value={formData.assignedToId} onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee (optional)" />
              </SelectTrigger>
              <SelectContent>
                {users.filter(u => u.role === 'admin' || u.role === 'analyst' || u.role === 'engineer').map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="md:col-span-2">
          <Label htmlFor="description">Signal Description *</Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the signal or anomaly detected"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label>Evidence Attachments</Label>
          <div className="border-2 border-dashed border-mist-gray/30 rounded-xl p-6 text-center hover:border-iq-green/40 transition-colors bg-slate-gray/20">
            <Upload className="h-8 w-8 text-mist-gray mx-auto mb-2" />
            <p className="text-sm text-mist-gray mb-2">
              Drag & drop evidence files here, or click to select
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.log"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" className="bubo-btn-secondary">
                Choose Evidence Files
              </Button>
            </Label>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-cloud-white">Evidence files:</h4>
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-gray/30 rounded-xl border border-mist-gray/20">
                  <span className="text-sm text-cloud-white">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="text-mist-gray hover:text-crimson-danger"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel} className="bubo-btn-ghost">
          Cancel
        </Button>
        <Button type="submit" className="bubo-btn-primary">
          Create Signal
        </Button>
      </div>
    </form>
  );
}