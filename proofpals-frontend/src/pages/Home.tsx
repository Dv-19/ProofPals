import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, MessageSquare, Award, ArrowUp, ArrowDown, Share2, Bookmark, MoreHorizontal, Flame, Clock, Star, Users, Eye, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { apiClient } from '@/lib/api/client';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Post interaction state management
interface PostVote {
  submissionId: number;
  voteType: 'up' | 'down' | null;
  score: number;
}

// Format time ago
function timeAgo(date: string) {
  const now = new Date();
  const posted = new Date(date);
  const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
}

// Extract domain from URL
function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'external link';
  }
}

// Generate random vote counts for demo
function generateVoteCount() {
  return Math.floor(Math.random() * 5000) + 100;
}

// Generate random comment count
function generateCommentCount() {
  return Math.floor(Math.random() * 500) + 10;
}

export function Home() {
  const navigate = useNavigate();
  const [postVotes, setPostVotes] = useState<Map<number, PostVote>>(new Map());
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  
  // Fetch approved submissions
  const { data: submissionsData, isLoading } = useQuery<any>({
    queryKey: ['approved-submissions', sortBy],
    queryFn: () => apiClient.get('/api/v1/submissions'),
    refetchInterval: 60000, // Refresh every minute
  });
  
  const submissions = submissionsData?.submissions?.filter((sub: any) => sub.status === 'approved') || [];
  
  // Handle vote
  const handleVote = (submissionId: number, voteType: 'up' | 'down') => {
    const currentVote = postVotes.get(submissionId);
    const newVoteType = currentVote?.voteType === voteType ? null : voteType;
    
    let scoreChange = 0;
    if (currentVote?.voteType === 'up' && newVoteType === 'down') scoreChange = -2;
    else if (currentVote?.voteType === 'down' && newVoteType === 'up') scoreChange = 2;
    else if (currentVote?.voteType === null && newVoteType === 'up') scoreChange = 1;
    else if (currentVote?.voteType === null && newVoteType === 'down') scoreChange = -1;
    else if (currentVote?.voteType === 'up' && newVoteType === null) scoreChange = -1;
    else if (currentVote?.voteType === 'down' && newVoteType === null) scoreChange = 1;
    
    const newScore = (currentVote?.score || generateVoteCount()) + scoreChange;
    
    setPostVotes(prev => new Map(prev.set(submissionId, {
      submissionId,
      voteType: newVoteType,
      score: newScore
    })));
    
    // Show feedback
    if (newVoteType === 'up') {
      toast.success('Upvoted! 👍');
    } else if (newVoteType === 'down') {
      toast.success('Downvoted 👎');
    } else {
      toast.success('Vote removed');
    }
  };
  
  // Get vote data for a post
  const getVoteData = (submissionId: number) => {
    return postVotes.get(submissionId) || {
      submissionId,
      voteType: null,
      score: generateVoteCount()
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Minimalist Style */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">ProofPals</h1>
            </div>
            
            {/* Filter Tabs - Functional */}
            <nav className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => setSortBy('hot')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  animations.hoverScale,
                  sortBy === 'hot' 
                    ? "text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Flame className={cn("h-4 w-4", sortBy === 'hot' && "animate-pulse")} />
                Hot
              </button>
              <button 
                onClick={() => setSortBy('new')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  animations.hoverScale,
                  sortBy === 'new' 
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Clock className={cn("h-4 w-4", sortBy === 'new' && "animate-pulse")} />
                New
              </button>
              <button 
                onClick={() => setSortBy('top')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  animations.hoverScale,
                  sortBy === 'top' 
                    ? "text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-400" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Star className={cn("h-4 w-4", sortBy === 'top' && "animate-pulse")} />
                Top
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="font-medium">
              Log In
            </Button>
            <Button size="sm" onClick={() => navigate('/signup')} className="font-medium shadow-lg hover:shadow-xl transition-all">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Create Post Card - Minimalist */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-gray-50/80 dark:bg-gray-800/80 border-0 rounded-xl px-6 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition-all hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
                  onClick={() => navigate('/submitter/upload')}
                  readOnly
                />
              </div>
            </div>

            {/* Posts Feed - Reddit Style */}
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={cn("bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-6 animate-pulse", animations.fadeIn)}>
                    <div className="flex gap-4">
                      <div className="w-12 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className={cn("text-center py-16", animations.scaleIn)}>
                <div className="mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No approved content yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">Be the first to submit content for review!</p>
                </div>
                <Button onClick={() => navigate('/submitter/upload')} className="shadow-lg hover:shadow-xl transition-all">
                  Submit Content
                </Button>
              </div>
            ) : (
              submissions.map((submission: any, index: number) => (
              <article
                key={submission.id}
                className={cn(
                  "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-2xl overflow-hidden hover:border-gray-300/60 dark:hover:border-gray-700/60 transition-all shadow-sm hover:shadow-xl group",
                  animations.fadeIn,
                  animations.cardHover
                )}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="flex">
                  {/* Voting Sidebar - Reddit Style */}
                  <div className="flex flex-col items-center gap-1 bg-gray-50/80 dark:bg-gray-800/50 px-3 py-4 min-w-[60px]">
                    {(() => {
                      const voteData = getVoteData(submission.id);
                      return (
                        <>
                          <button 
                            onClick={() => handleVote(submission.id, 'up')}
                            className={cn(
                              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
                              animations.buttonPress,
                              voteData.voteType === 'up' 
                                ? "bg-orange-500 text-white shadow-lg" 
                                : "text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-950 hover:text-orange-500"
                            )}
                          >
                            <ArrowUp className={cn(
                              "h-5 w-5 transition-all duration-200",
                              voteData.voteType === 'up' ? "animate-bounce" : ""
                            )} />
                          </button>
                          
                          <span className={cn(
                            "text-sm font-bold py-1 transition-all duration-200",
                            voteData.voteType === 'up' ? "text-orange-500" :
                            voteData.voteType === 'down' ? "text-blue-500" :
                            "text-gray-900 dark:text-white"
                          )}>
                            {voteData.score >= 1000 ? `${(voteData.score / 1000).toFixed(1)}k` : voteData.score}
                          </span>
                          
                          <button 
                            onClick={() => handleVote(submission.id, 'down')}
                            className={cn(
                              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
                              animations.buttonPress,
                              voteData.voteType === 'down' 
                                ? "bg-blue-500 text-white shadow-lg" 
                                : "text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-500"
                            )}
                          >
                            <ArrowDown className={cn(
                              "h-5 w-5 transition-all duration-200",
                              voteData.voteType === 'down' ? "animate-bounce" : ""
                            )} />
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-6">
                    {/* Post Header - Reddit Style */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                        r/{submission.genre}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Posted by <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors font-medium">u/anonymous</span>
                      </span>
                      <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {timeAgo(submission.created_at)}
                      </span>
                      <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs px-2 py-0 animate-pulse">
                        ✓ Approved
                      </Badge>
                    </div>

                    {/* Post Title & Content */}
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Verified Content Submission
                      </h2>
                      
                      {/* Content Link */}
                      <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-4 mb-3 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/60 transition-all group/link">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {extractDomain(submission.content_ref)}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all leading-relaxed group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                              {submission.content_ref}
                            </p>
                          </div>
                          <button 
                            onClick={() => window.open(submission.content_ref, '_blank')}
                            className={cn(
                              "p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-950/50 transition-all",
                              animations.hoverScale
                            )}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Post Actions - Reddit Style */}
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <button className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all text-xs font-medium hover:text-gray-700 dark:hover:text-gray-300",
                        animations.hoverScale
                      )}>
                        <MessageSquare className="h-4 w-4" />
                        <span>{generateCommentCount()} Comments</span>
                      </button>
                      
                      <button className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all text-xs font-medium hover:text-gray-700 dark:hover:text-gray-300",
                        animations.hoverScale
                      )}>
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      
                      <button className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all text-xs font-medium hover:text-gray-700 dark:hover:text-gray-300",
                        animations.hoverScale
                      )}>
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      
                      <button className={cn(
                        "p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all hover:text-gray-700 dark:hover:text-gray-300",
                        animations.hoverScale
                      )}>
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {/* Award button */}
                      <button className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-yellow-100/80 dark:hover:bg-yellow-950/80 transition-all text-xs font-medium hover:text-yellow-600 dark:hover:text-yellow-400 ml-auto",
                        animations.hoverScale
                      )}>
                        <Award className="h-4 w-4" />
                        <span>Award</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4">
            {/* About ProofPals */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-16"></div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">About ProofPals</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  A decentralized anonymous peer review platform powered by zero-knowledge cryptography and CLSAG ring signatures.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">12.5k Members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">2.1k Online</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/signup')} 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Join Community
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Platform Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Anonymous Review</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Complete identity protection</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Cryptographic Proofs</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Zero-knowledge verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Weighted Voting</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fair quality control</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Documentation</a>
                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">API Reference</a>
                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Community Guidelines</a>
                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
