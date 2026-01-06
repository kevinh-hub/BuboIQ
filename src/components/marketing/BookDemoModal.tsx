import React, { useState } from 'react';
import { X, Calendar, Mail, CheckCircle, Sparkles, Play, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { PlanBadge } from './PlanBadge';
import { toast } from 'sonner';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string | null;
  onLaunchDemo?: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onLaunchDemo
}) => {
  // Safely handle selectedPlan to ensure it's always a string
  const safeSelectedPlan = typeof selectedPlan === 'string' ? selectedPlan : '';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    primaryTool: '',
    timePreference: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const planConfig = {
    basic: { name: 'Basic', price: '$9/mo', badge: 'basic' as const },
    pro: { name: 'Pro', price: '$49/mo', badge: 'pro' as const },
    enterprise: { name: 'Enterprise', price: 'Custom', badge: 'pro' as const }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.email.trim()) newErrors.email = 'Work email required';
    if (!formData.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (!formData.company.trim()) newErrors.company = 'Company name required';
    if (!formData.teamSize) newErrors.teamSize = 'Team size required';
    if (!formData.primaryTool) newErrors.primaryTool = 'Primary tool required';
    if (!formData.timePreference && !showCalendar) newErrors.timePreference = 'Time preference required';
    if (showCalendar && !selectedDate) newErrors.calendar = 'Pick a date';
    if (showCalendar && !selectedTimeSlot) newErrors.timeSlot = 'Pick a time';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Track demo request in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'open_demo', {
        source: 'modal',
        preselected_plan: safeSelectedPlan
      });
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success('Demo request sent!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Generate available dates (next 14 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (dates.length < 10) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Exclude weekends
        dates.push({
          date: currentDate.toISOString().split('T')[0],
          formatted: currentDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Generate time slots based on selected date
  const getTimeSlots = (date: string) => {
    const slots = [];
    const selectedDateObj = new Date(date + 'T00:00:00');
    const day = selectedDateObj.getDay();
    
    // Different slots for different days
    const morningSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];
    const afternoonSlots = ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];
    
    // Simulate some slots being taken
    const availableSlots = [...morningSlots, ...afternoonSlots].filter((slot, index) => {
      // Randomly make some slots unavailable based on date and slot
      const slotHash = date + slot;
      return slotHash.charCodeAt(slotHash.length - 1) % 3 !== 0;
    });
    
    return availableSlots;
  };

  const resetModal = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      teamSize: '',
      primaryTool: '',
      timePreference: '',
      message: ''
    });
    setErrors({});
    setIsSuccess(false);
    setIsSubmitting(false);
    setShowCalendar(false);
    setSelectedDate('');
    setSelectedTimeSlot('');
  };

  const handleClose = () => {
    // Track modal close in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'close_demo', {
        source: 'modal'
      });
    }
    
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const currentPlan = safeSelectedPlan && planConfig[safeSelectedPlan as keyof typeof planConfig];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-surface-dark border border-iq-neon-green/20 p-0 overflow-hidden bubo-glass">
        <DialogTitle className="sr-only">
          Experience BuboIQ
        </DialogTitle>
        <DialogDescription className="sr-only">
          Schedule a personalized demo of BuboIQ's AI-driven IT support platform. Fill out the form to book your demo session.
        </DialogDescription>
        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-iq-neon-green/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-iq-neon-green" />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
                    Book Your Bubo<span className="text-iq-neon-green">IQ</span> Demo
                  </h2>
                  {currentPlan && (
                    <div className="flex items-center space-x-2 mt-1">
                      <PlanBadge variant={currentPlan.badge} />
                      <span className="text-sm text-mist-gray">
                        {currentPlan.name} plan selected • {currentPlan.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleClose}
                className="bubo-btn-ghost p-2"
                size="sm"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Demo Options */}
            {onLaunchDemo && (
              <div className="p-6 border-b border-iq-neon-green/10">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Interactive Showcase */}
                  <div className="bubo-glass p-6 rounded-2xl border-2 border-iq-neon-green/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                        <Play className="w-5 h-5 text-iq-neon-green" />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Interactive Showcase</h3>
                        <p className="text-sm text-mist-gray">2-3 minutes</p>
                      </div>
                    </div>
                    <p className="text-sm text-mist-gray mb-4">
                      Experience how BuboIQ works from your perspective with our interactive demo.
                    </p>
                    <Button 
                      onClick={() => {
                        handleClose();
                        onLaunchDemo();
                      }}
                      className="bubo-btn-neon-primary w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try Interactive Demo
                    </Button>
                  </div>

                  {/* Personal Demo */}
                  <div className="bubo-glass p-6 rounded-2xl border-2 border-electric-blue/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-electric-blue/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-electric-blue" />
                      </div>
                      <div>
                        <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Personal Demo</h3>
                        <p className="text-sm text-mist-gray">15-30 minutes</p>
                      </div>
                    </div>
                    <p className="text-sm text-mist-gray mb-4">
                      Schedule a personalized session with our team to discuss your specific needs.
                    </p>
                    <Button 
                      onClick={() => {
                        setShowCalendar(true);
                      }}
                      className="bubo-btn-secondary w-full"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Demo
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Calendar Selection */}
            {showCalendar && (
              <div className="p-6 border-b border-iq-neon-green/10">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">Select Date & Time</h3>
                    <Button
                      onClick={() => setShowCalendar(false)}
                      className="bubo-btn-ghost p-2 text-xs"
                      size="sm"
                    >
                      Back to Form
                    </Button>
                  </div>
                  
                  {/* Date Selection */}
                  <div className="mb-6">
                    <Label className="text-pure-white mb-3 block">Available Dates</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {getAvailableDates().map((dateObj) => (
                        <button
                          key={dateObj.date}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateObj.date);
                            setSelectedTimeSlot(''); // Reset time slot when date changes
                          }}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                            selectedDate === dateObj.date
                              ? 'border-iq-neon-green bg-iq-neon-green/10 text-iq-neon-green'
                              : 'border-slate-gray/50 bg-surface-dark hover:border-iq-neon-green/50 text-mist-gray hover:text-pure-white'
                          }`}
                        >
                          {dateObj.formatted}
                        </button>
                      ))}
                    </div>
                    {errors.calendar && <p className="text-crimson-danger text-sm mt-2">{errors.calendar}</p>}
                  </div>
                  
                  {/* Time Slot Selection */}
                  {selectedDate && (
                    <div>
                      <Label className="text-pure-white mb-3 block">Available Times for {getAvailableDates().find(d => d.date === selectedDate)?.formatted}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {getTimeSlots(selectedDate).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                              selectedTimeSlot === slot
                                ? 'border-electric-blue bg-electric-blue/10 text-electric-blue'
                                : 'border-slate-gray/50 bg-surface-dark hover:border-electric-blue/50 text-mist-gray hover:text-pure-white'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {errors.timeSlot && <p className="text-crimson-danger text-sm mt-2">{errors.timeSlot}</p>}
                    </div>
                  )}
                  
                  {/* Selected Summary */}
                  {selectedDate && selectedTimeSlot && (
                    <div className="mt-6 p-4 bg-iq-neon-green/10 border border-iq-neon-green/20 rounded-xl">
                      <div className="flex items-center space-x-2 text-iq-neon-green">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          Demo scheduled for {getAvailableDates().find(d => d.date === selectedDate)?.formatted} at {selectedTimeSlot}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-pure-white">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`${errors.name ? 'border-crimson-danger' : ''}`}
                    placeholder="John Smith"
                  />
                  {errors.name && <p className="text-crimson-danger text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-pure-white">
                    Work Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${errors.email ? 'border-crimson-danger' : ''}`}
                    placeholder="john@company.com"
                  />
                  {errors.email && <p className="text-crimson-danger text-sm">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-pure-white">
                    Company *
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`${errors.company ? 'border-crimson-danger' : ''}`}
                    placeholder="Acme Corp"
                  />
                  {errors.company && <p className="text-crimson-danger text-sm">{errors.company}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-pure-white">Team Size *</Label>
                  <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                    <SelectTrigger className={`${errors.teamSize ? 'border-crimson-danger' : ''}`}>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3">1-3 people (Basic)</SelectItem>
                      <SelectItem value="4-10">4-10 people (Pro)</SelectItem>
                      <SelectItem value="11-25">11-25 people (Pro)</SelectItem>
                      <SelectItem value="26-50">26-50 people (Pro)</SelectItem>
                      <SelectItem value="50+">50+ people (Enterprise)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.teamSize && <p className="text-crimson-danger text-sm">{errors.teamSize}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-pure-white">Current Primary Tool *</Label>
                <Select value={formData.primaryTool} onValueChange={(value) => handleInputChange('primaryTool', value)}>
                  <SelectTrigger className={`${errors.primaryTool ? 'border-crimson-danger' : ''}`}>
                    <SelectValue placeholder="What do you use now?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Do not have one</SelectItem>
                    <SelectItem value="zendesk">Zendesk</SelectItem>
                    <SelectItem value="jira">Jira Service Management</SelectItem>
                    <SelectItem value="servicenow">ServiceNow</SelectItem>
                    <SelectItem value="freshservice">Freshservice</SelectItem>
                    <SelectItem value="email">Email/Spreadsheets</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.primaryTool && <p className="text-crimson-danger text-sm">{errors.primaryTool}</p>}
              </div>

              {!showCalendar && (
                <div className="space-y-3">
                  <Label className="text-pure-white">Preferred Demo Time *</Label>
                  <RadioGroup 
                    value={formData.timePreference} 
                    onValueChange={(value) => handleInputChange('timePreference', value)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="morning" id="morning" />
                      <Label htmlFor="morning" className="text-mist-gray">Morning (9-12 EST)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="afternoon" id="afternoon" />
                      <Label htmlFor="afternoon" className="text-mist-gray">Afternoon (1-5 EST)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible" className="text-mist-gray">I'm flexible</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="evening" id="evening" />
                      <Label htmlFor="evening" className="text-mist-gray">Evening (6-8 EST)</Label>
                    </div>
                  </RadioGroup>
                  {errors.timePreference && <p className="text-crimson-danger text-sm">{errors.timePreference}</p>}
                </div>
              )}
              
              {/* Calendar Scheduling Summary */}
              {showCalendar && selectedDate && selectedTimeSlot && (
                <div className="space-y-3">
                  <Label className="text-pure-white">Selected Demo Time</Label>
                  <div className="p-4 bg-electric-blue/10 border border-electric-blue/20 rounded-xl">
                    <div className="flex items-center space-x-2 text-electric-blue">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {getAvailableDates().find(d => d.date === selectedDate)?.formatted} at {selectedTimeSlot} EST
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message" className="text-pure-white">
                  Anything specific you'd like to see?
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your biggest IT challenges or what you'd like to focus on during the demo..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="bubo-btn-ghost flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bubo-btn-neon-primary flex-1"
                >
                  {isSubmitting ? 'Scheduling...' : 'Book My Demo'}
                  {!isSubmitting && <Calendar className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-iq-neon-green" />
              </div>
              <div className="relative">
                <Sparkles className="w-6 h-6 text-iq-neon-green absolute -top-2 -right-2 animate-pulse" />
                <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
                  Demo Scheduled!
                </h2>
              </div>
            </div>
            
            <p className="text-mist-gray mb-6">
              {selectedDate && selectedTimeSlot 
                ? `Your demo is scheduled for ${getAvailableDates().find(d => d.date === selectedDate)?.formatted} at ${selectedTimeSlot} EST. We'll send you a calendar invite shortly.`
                : "We've received your demo request and will be in touch within 24 hours to confirm your time slot."
              }
            </p>
            
            <div className="bg-nocturne-indigo/50 rounded-xl p-4 mb-6 border border-iq-neon-green/10">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-cyan-accent" />
                <span className="font-semibold text-cyan-accent">Check Your Email</span>
              </div>
              <p className="text-sm text-mist-gray">
                We've sent a confirmation to <strong className="text-pure-white">{formData.email}</strong> with next steps and a calendar link.
              </p>
            </div>
            
            <Button onClick={handleClose} className="bubo-btn-neon-primary">
              Got it, thanks!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};