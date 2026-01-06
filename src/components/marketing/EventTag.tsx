import React from 'react';
import { Badge } from '../ui/badge';

interface EventTagProps {
  eventName: string;
  params?: Record<string, any>;
  className?: string;
  children?: React.ReactNode;
}

export const EventTag: React.FC<EventTagProps> = ({ 
  eventName, 
  params = {}, 
  className = '',
  children 
}) => {
  // This component is used for analytics mapping annotations
  // It doesn't render anything visible but helps developers identify tracked elements
  
  const handleClick = () => {
    // Track the event in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`inline-block ${className}`}
      data-event={eventName}
      data-params={JSON.stringify(params)}
    >
      {children}
      {/* Development mode indicator */}
      {process.env.NODE_ENV === 'development' && (
        <Badge className="ml-2 bg-amber-warning/20 text-amber-warning border-amber-warning/30 text-xs">
          {eventName}
        </Badge>
      )}
    </div>
  );
};