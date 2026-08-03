import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useApp } from '../App';
import { toast } from 'sonner';
import { Upload, X, AlertCircle, CheckCircle2, FileText, Image, FileArchive, Send, Sparkles, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    'Bug Report',
    'Feature Request', 
    'Technical Support',
    'Account Issue',
    'Performance',
    'General Inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

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
      toast.success('Issue opened.', {
        description: 'We'll review it and get back to you soon.',
        icon: <CheckCircle2 className="h-5 w-5 text-[#00FF85]" />
      });
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
    setIsSubmitting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...attachments, ...files];
    if (newFiles.length > 5) {
      toast.error('You can only add 5 files');
      return;
    }
    setAttachments(newFiles);
    toast.success(`Added ${files.length} file${files.length === 1 ? '' : 's'}`);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
    toast.info('Removed file');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = [...attachments, ...files];
    if (newFiles.length > 5) {
      toast.error('You can only add 5 files');
      return;
    }
    setAttachments(newFiles);
    toast.success(`Added ${files.length} file${files.length === 1 ? '' : 's'}`);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext || '')) return <Image className="h-4 w-4" />;
    if (['zip', 'rar', '7z'].includes(ext || '')) return <FileArchive className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[#EF4444] border-[#EF4444]/30 bg-[#EF4444]/10';
      case 'Medium': return 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10';
      case 'Low': return 'text-[#00FF85] border-[#00FF85]/30 bg-[#00FF85]/10';
      default: return 'text-[#9CA3AF] border-[#9CA3AF]/30 bg-[#9CA3AF]/10';
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const subjectLength = formData.subject.length;
  const descriptionLength = formData.description.length;
  const maxSubjectLength = 100;
  const maxDescriptionLength = 1000;

  return (
    <TooltipProvider>
      <div className="bubo-glass rounded-3xl p-8 space-y-6 relative overflow-hidden">
        {/* Animated Intelligence Orb */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00FF85] to-[#1E90FF] blur-3xl bubo-orb-pulse" />
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#00FF85]/20 flex items-center justify-center bubo-orb-breathe">
              <Sparkles className="h-5 w-5 text-[#00FF85]" />
            </div>
            <div>
              <h2 className="text-2xl font-space-grotesk text-white">What's wrong?</h2>
              <p className="text-sm text-[#9CA3AF]">We'll respond within 24 hours</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Subject Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subject" className="text-[#F3F4F6] font-space-grotesk flex items-center gap-2">
                What's the problem? *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-[#9CA3AF] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Short summary of what's wrong</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <span className={`text-xs font-jetbrains-mono ${
                subjectLength > maxSubjectLength ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
              }`}>
                {subjectLength}/{maxSubjectLength}
              </span>
            </div>
            <Input
              id="subject"
              placeholder="e.g., Printer won't connect"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value.slice(0, maxSubjectLength) })}
              className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white placeholder:text-[#6B7280] focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20 transition-all"
              required
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#F3F4F6] font-space-grotesk">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1C1E] border-[#374151]/50">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-[#00FF85]/10 focus:bg-[#00FF85]/10">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-[#F3F4F6] font-space-grotesk flex items-center gap-2">
                How urgent is this?
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-[#9CA3AF] cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">High: Fix right now • Medium: Fix today • Low: Fix when you can</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={formData.priority} onValueChange={(value: 'Low' | 'Medium' | 'High') => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1C1E] border-[#374151]/50">
                  <SelectItem value="High" className="text-white hover:bg-[#EF4444]/10 focus:bg-[#EF4444]/10">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#EF4444]" />
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium" className="text-white hover:bg-[#F59E0B]/10 focus:bg-[#F59E0B]/10">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Low" className="text-white hover:bg-[#00FF85]/10 focus:bg-[#00FF85]/10">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#00FF85]" />
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-[#F3F4F6] font-space-grotesk">Tell us what you saw. Add steps if you can. *</Label>
              <span className={`text-xs font-jetbrains-mono ${
                descriptionLength > maxDescriptionLength ? 'text-[#EF4444]' : 'text-[#9CA3AF]'
              }`}>
                {descriptionLength}/{maxDescriptionLength}
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Describe what happened and what you tried..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, maxDescriptionLength) })}
              rows={5}
              className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white placeholder:text-[#6B7280] focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20 transition-all resize-none"
              required
            />
          </div>

          {/* Attachments Upload Area */}
          <div className="space-y-3">
            <Label className="text-[#F3F4F6] font-space-grotesk">
              Attachments <span className="text-[#6B7280] text-xs">(Optional, max 5 files)</span>
            </Label>
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragging 
                  ? 'border-[#00FF85] bg-[#00FF85]/10' 
                  : 'border-[#374151]/50 hover:border-[#00FF85]/30 hover:bg-[#1C1C1E]/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className={`h-10 w-10 mx-auto mb-3 transition-colors ${
                isDragging ? 'text-[#00FF85]' : 'text-[#6B7280]'
              }`} />
              <p className="text-sm text-[#9CA3AF] mb-3">
                {isDragging ? 'Drop files here' : 'Drag & drop files here, or click to browse'}
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" className="bubo-btn-secondary">
                  Choose Files
                </Button>
              </Label>
              <p className="text-xs text-[#6B7280] mt-2">Supported: Images, PDFs, Documents, Archives</p>
            </div>

            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#9CA3AF] font-space-grotesk">Attached files ({attachments.length}/5):</p>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-[#1C1C1E]/50 border border-[#374151]/30 rounded-xl hover:border-[#00FF85]/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#00FF85]/10 flex items-center justify-center flex-shrink-0">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-xs text-[#6B7280]">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options Toggle */}
          {permissions.canAssignSignals && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-[#00FF85] hover:text-[#00E676] transition-colors font-space-grotesk flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {showAdvanced ? 'Hide' : 'Show'} more options
              </button>

              {showAdvanced && (
                <div className="p-4 bg-[#1C1C1E]/30 border border-[#374151]/30 rounded-xl space-y-3 bubo-animate-fadeInUp">
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo" className="text-[#F3F4F6] font-space-grotesk">Assign to someone</Label>
                    <Select value={formData.assignedToId} onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}>
                      <SelectTrigger className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20">
                        <SelectValue placeholder="We'll assign it (recommended)" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1C1C1E] border-[#374151]/50">
                        {users.filter(u => u.role === 'admin' || u.role === 'agent').map((user) => (
                          <SelectItem key={user.id} value={user.id} className="text-white hover:bg-[#00FF85]/10 focus:bg-[#00FF85]/10">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#00FF85]" />
                              {user.name} <span className="text-[#6B7280]">({user.role})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-[#374151]/30">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <CheckCircle2 className="h-4 w-4 text-[#00FF85]" />
              <span>Your data is encrypted</span>
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="bubo-btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bubo-btn-neon-primary relative overflow-hidden group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0E0E0E] border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Open issue
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF85]/30 to-transparent" />
      </div>
    </TooltipProvider>
  );
}