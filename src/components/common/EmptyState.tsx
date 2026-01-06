import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <Card className="bubo-glass p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-mist-gray" />
      </div>
      <h3 className="font-['Space_Grotesk'] text-lg mb-2">{title}</h3>
      <p className="text-mist-gray text-sm mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="bubo-btn-primary">
          {action.label}
        </Button>
      )}
    </Card>
  );
};
