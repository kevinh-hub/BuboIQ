import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  articleId,
  articleTitle
}) => {
  const [feedbackType, setFeedbackType] = useState<'success' | 'failure' | null>(null);
  const [comments, setComments] = useState('');
  const [timeToComplete, setTimeToComplete] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // In real app, send feedback to API
    console.log('Feedback submitted:', {
      type: feedbackType,
      comments,
      timeToComplete,
      articleTitle,
      stepExecuted
    });
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackType(null);
      setComments('');
      setTimeToComplete(null);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setFeedbackType(null);
    setComments('');
    setTimeToComplete(null);
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bubo-glass border-iq-neon-green/30 max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-iq-neon-green" />
            </div>
            <h3 className="text-xl font-semibold text-pure-white mb-2">
              Feedback Submitted!
            </h3>
            <p className="text-mist-gray">
              Thank you for helping improve our knowledge base.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bubo-glass border-slate-gray/30 max-w-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-space-grotesk text-pure-white">
              How did it go?
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-mist-gray hover:text-pure-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-mist-gray">
            Your feedback helps us improve solution accuracy and effectiveness.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Context */}
          <Card className="bg-[#1C1C1E]/50 p-4 border-slate-gray/30">
            <h4 className="font-medium text-pure-white mb-2">{articleTitle}</h4>
            <p className="text-sm text-mist-gray">Article ID: {articleId}</p>
          </Card>

          {/* Success/Failure Selection */}
          <div>
            <h3 className="text-lg font-medium text-pure-white mb-4">Did this solution work?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                  feedbackType === 'success' 
                    ? 'border-iq-neon-green bg-iq-neon-green/10' 
                    : 'border-slate-gray/30 bg-surface-dark/50 hover:border-iq-neon-green/50'
                }`}
                onClick={() => setFeedbackType('success')}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    feedbackType === 'success' ? 'bg-iq-neon-green/20' : 'bg-slate-gray/20'
                  }`}>
                    <ThumbsUp className={`w-6 h-6 ${
                      feedbackType === 'success' ? 'text-iq-neon-green' : 'text-mist-gray'
                    }`} />
                  </div>
                  <h4 className="font-medium text-pure-white mb-1">Yes, it worked!</h4>
                  <p className="text-sm text-mist-gray">The problem was resolved</p>
                </div>
              </Card>

              <Card 
                className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                  feedbackType === 'failure' 
                    ? 'border-crimson-danger bg-crimson-danger/10' 
                    : 'border-slate-gray/30 bg-surface-dark/50 hover:border-crimson-danger/50'
                }`}
                onClick={() => setFeedbackType('failure')}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    feedbackType === 'failure' ? 'bg-crimson-danger/20' : 'bg-slate-gray/20'
                  }`}>
                    <ThumbsDown className={`w-6 h-6 ${
                      feedbackType === 'failure' ? 'text-crimson-danger' : 'text-mist-gray'
                    }`} />
                  </div>
                  <h4 className="font-medium text-pure-white mb-1">No, still broken</h4>
                  <p className="text-sm text-mist-gray">The issue persists</p>
                </div>
              </Card>
            </div>
          </div>

          {feedbackType && (
            <>
              {/* Time to Complete */}
              <div>
                <h3 className="text-lg font-medium text-pure-white mb-4">How long did it take?</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[2, 5, 10, 15].map((minutes) => (
                    <Button
                      key={minutes}
                      variant={timeToComplete === minutes ? "default" : "outline"}
                      onClick={() => setTimeToComplete(minutes)}
                      className={`${
                        timeToComplete === minutes 
                          ? 'bubo-btn-neon-primary' 
                          : 'bubo-btn-secondary'
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {minutes}min
                    </Button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-lg font-medium text-pure-white mb-4">
                  Additional Details
                  <span className="text-sm text-mist-gray font-normal ml-2">(Optional)</span>
                </h3>
                <Textarea
                  placeholder={
                    feedbackType === 'success' 
                      ? "What worked well? Any suggestions for improvement?"
                      : "What went wrong? What error messages did you see?"
                  }
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="bg-[#1C1C1E]/50 border-slate-gray/30 text-pure-white placeholder-mist-gray min-h-[100px]"
                />
              </div>

              {/* Quick Feedback Tags */}
              <div>
                <h3 className="text-lg font-medium text-pure-white mb-4">Quick Feedback</h3>
                <div className="flex flex-wrap gap-2">
                  {(feedbackType === 'success' ? [
                    'Easy to follow',
                    'Steps were clear',
                    'Solved quickly',
                    'Good documentation'
                  ] : [
                    'Steps unclear',
                    'Missing prerequisites',
                    'Error not covered',
                    'Outdated information'
                  ]).map((tag) => (
                    <Badge
                      key={tag}
                      className="cursor-pointer bg-[#1C1C1E]/50 text-mist-gray border-slate-gray/30 hover:border-iq-neon-green/50 hover:text-iq-neon-green transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-gray/20">
                <div className="text-sm text-mist-gray">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Your feedback is anonymous and helps improve our solutions
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="text-mist-gray hover:text-pure-white"
                  >
                    Skip for now
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bubo-btn-neon-primary"
                    disabled={!feedbackType}
                  >
                    Submit Feedback
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};