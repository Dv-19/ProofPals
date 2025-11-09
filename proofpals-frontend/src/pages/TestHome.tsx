import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark, Award, ExternalLink, Calendar, Flame, Clock, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock Reddit-style posts for testing
const mockRedditPosts = [
  {
    id: 1,
    title: "Verified Content Submission",
    subreddit: "cryptography",
    author: "anonymous",
    timeAgo: "3h ago",
    content_ref: "https://example.com/crypto-article",
    domain: "example.com",
    initialScore: 2847,
    comments: 156
  },
  {
    id: 2,
    title: "Verified Content Submission", 
    subreddit: "privacy",
    author: "anonymous",
    timeAgo: "5h ago",
    content_ref: "https://blog.privacy.com/anonymous-review",
    domain: "blog.privacy.com",
    initialScore: 1923,
    comments: 89
  },
  {
    id: 3,
    title: "Verified Content Submission",
    subreddit: "technology", 
    author: "anonymous",
    timeAgo: "8h ago",
    content_ref: "https://tech.news/decentralized-verification",
    domain: "tech.news",
    initialScore: 1456,
    comments: 234
  }
];

interface PostVote {
  postId: number;
  voteType: 'up' | 'down' | null;
  score: number;
}

export function TestHome() {
  const navigate = useNavigate();
  const [postVotes, setPostVotes] = useState<Map<number, PostVote>>(new Map());

  // Handle vote
  const handleVote = (postId: number, voteType: 'up' | 'down') => {
    const currentVote = postVotes.get(postId);
    const newVoteType = currentVote?.voteType === voteType ? null : voteType;
    
    let scoreChange = 0;
    if (currentVote?.voteType === 'up' && newVoteType === 'down') scoreChange = -2;
    else if (currentVote?.voteType === 'down' && newVoteType === 'up') scoreChange = 2;
    else if (currentVote?.voteType === null && newVoteType === 'up') scoreChange = 1;
    else if (currentVote?.voteType === null && newVoteType === 'down') scoreChange = -1;
    else if (currentVote?.voteType === 'up' && newVoteType === null) scoreChange = -1;
    else if (currentVote?.voteType === 'down' && newVoteType === null) scoreChange = 1;
    
    const post = mockRedditPosts.find(p => p.id === postId);
    const newScore = (currentVote?.score || post?.initialScore || 0) + scoreChange;
    
    setPostVotes(prev => new Map(prev.set(postId, {
      postId,
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
  const getVoteData = (postId: number) => {
    const existing = postVotes.get(postId);
    if (existing) return existing;
    
    const post = mockRedditPosts.find(p => p.id === postId);
    return {
      postId,
      voteType: null as 'up' | 'down' | null,
      score: post?.initialScore || 0
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-200">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">ProofPals</h1>
            </div>
            
            {/* Filter Tabs */}
            <nav className="hidden md:flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-400 transition-all">
                <Flame className="h-4 w-4 animate-pulse" />
                Hot
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Clock className="h-4 w-4" />
                New
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <Star className="h-4 w-4" />
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            {/* Create Post Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
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

            {/* Reddit-Style Posts */}
            {mockRedditPosts.map((post, index) => {
              const voteData = getVoteData(post.id);
              
              return (
                <article
                  key={post.id}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-2xl overflow-hidden hover:border-gray-300/60 dark:hover:border-gray-700/60 transition-all shadow-sm hover:shadow-xl group"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex">
                    {/* Voting Sidebar - Reddit Style */}
                    <div className="flex flex-col items-center gap-1 bg-gray-50/80 dark:bg-gray-800/50 px-3 py-4 min-w-[60px]">
                      <button 
                        onClick={() => handleVote(post.id, 'up')}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95",
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
                        onClick={() => handleVote(post.id, 'down')}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95",
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
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 p-6">
                      {/* Post Header - Reddit Style */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors">
                          r/{post.subreddit}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Posted by <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors font-medium">u/{post.author}</span>
                        </span>
                        <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.timeAgo}
                        </span>
                        <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-xs px-2 py-0 animate-pulse">
                          ✓ Approved
                        </Badge>
                      </div>

                      {/* Post Title & Content */}
                      <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h2>
                        
                        {/* Content Link */}
                        <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-4 mb-3 border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300/60 dark:hover:border-blue-600/60 transition-all group/link">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                {post.domain}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all leading-relaxed group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                                {post.content_ref}
                              </p>
                            </div>
                            <button 
                              onClick={() => window.open(post.content_ref, '_blank')}
                              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-950/50 transition-all hover:scale-105"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Post Actions - Reddit Style */}
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all text-xs font-medium hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments} Comments</span>
                        </button>
                        
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all text-xs font-medium hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105">
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                        
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all text-xs font-medium hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105">
                          <Bookmark className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                        
                        {/* Award button */}
                        <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-yellow-100/80 dark:hover:bg-yellow-950/80 transition-all text-xs font-medium hover:text-yellow-600 dark:hover:text-yellow-400 ml-auto hover:scale-105">
                          <Award className="h-4 w-4" />
                          <span>Award</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">🎉 Reddit-Style Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-orange-500" />
                  <span>Click to upvote posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-blue-500" />
                  <span>Click to downvote posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span>View comments (demo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-500" />
                  <span>Open external links</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
