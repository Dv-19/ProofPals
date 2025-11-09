// src/components/voting/VoteButtons.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnonConfirmationModal } from './AnonConfirmationModal';
import { ThumbsUp, AlertTriangle, ThumbsDown, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animations';

export type VoteType = 'approve' | 'escalate' | 'reject' | 'flag';

interface VoteButtonsProps {
  submissionId: number;
  onVote: (voteType: VoteType) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function VoteButtons({ 
  submissionId, 
  onVote, 
  disabled = false,
  className 
}: VoteButtonsProps) {
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVoteClick = (voteType: VoteType) => {
    setSelectedVote(voteType);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedVote) return;
    
    setIsVoting(true);
    try {
      await onVote(selectedVote);
      setShowConfirmation(false);
    } catch (error) {
      // Error handling will be in parent component
      throw error;
    } finally {
      setIsVoting(false);
    }
  };

  const voteOptions = [
    {
      type: 'approve' as VoteType,
      label: 'Approve',
      description: 'This content meets quality standards',
      icon: ThumbsUp,
      variant: 'success' as const,
    },
    {
      type: 'escalate' as VoteType,
      label: 'Escalate',
      description: 'Needs expert review',
      icon: AlertTriangle,
      variant: 'warning' as const,
    },
    {
      type: 'reject' as VoteType,
      label: 'Reject',
      description: 'Does not meet standards',
      icon: ThumbsDown,
      variant: 'destructive' as const,
    },
    {
      type: 'flag' as VoteType,
      label: 'Flag',
      description: 'Potentially harmful content',
      icon: Flag,
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <div className={cn('grid grid-cols-2 gap-6', className)}>
        {voteOptions.map(({ type, label, description, icon: Icon, variant }, index) => (
          <Button
            key={type}
            size="lg"
            variant={variant}
            disabled={disabled || isVoting}
            onClick={() => handleVoteClick(type)}
            className={cn(
              "h-28 flex-col gap-3 relative overflow-hidden group/vote shadow-lg hover:shadow-xl transition-all duration-300 border-0",
              animations.hoverScale,
              animations.buttonPress,
              animations.fadeIn
            )}
            style={{animationDelay: `${index * 150}ms`}}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/vote:opacity-100 transition-opacity duration-300"></div>
            
            {/* Icon with animation */}
            <div className="relative z-10">
              <Icon className={cn(
                "h-7 w-7 transition-all duration-300 group-hover/vote:scale-110",
                isVoting && selectedVote === type ? "animate-spin" : "group-hover/vote:animate-pulse"
              )} />
            </div>
            
            {/* Text content */}
            <div className="flex flex-col relative z-10">
              <span className="font-bold text-sm group-hover/vote:text-white transition-colors duration-300">{label}</span>
              <span className="text-xs opacity-90 group-hover/vote:opacity-100 transition-all duration-300 leading-tight">{description}</span>
            </div>
            
            {/* Loading state overlay */}
            {isVoting && selectedVote === type && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </Button>
        ))}
      </div>

      <AnonConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        voteType={selectedVote}
        onConfirm={handleConfirm}
        isLoading={isVoting}
      />
    </>
  );
}