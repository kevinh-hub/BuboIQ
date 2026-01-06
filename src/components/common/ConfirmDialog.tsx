import React from 'react';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'danger' | 'warning';
  isAudited?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
  isAudited = false
}) => {
  const iconMap = {
    default: Info,
    danger: AlertTriangle,
    warning: AlertTriangle
  };

  const Icon = iconMap[variant];

  const colorMap = {
    default: 'text-electric-blue',
    danger: 'text-crimson-danger',
    warning: 'text-signal-yellow'
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bubo-glass border border-slate-gray/20">
        <AlertDialogHeader>
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 ${colorMap[variant]}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="font-['Space_Grotesk'] text-xl mb-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-mist-gray">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        {isAudited && (
          <div className="flex items-center space-x-2 p-3 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl text-sm">
            <Shield className="w-4 h-4 text-iq-neon-green flex-shrink-0" />
            <span className="text-mist-gray">This action is audited</span>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel className="bubo-btn-secondary">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === 'danger' 
                ? 'bg-crimson-danger hover:bg-crimson-danger/90' 
                : variant === 'warning'
                ? 'bg-signal-yellow text-dark-midnight hover:bg-signal-yellow/90'
                : 'bubo-btn-primary'
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
