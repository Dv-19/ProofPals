import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/common/Header';
import { Navigation } from '@/components/common/Navigation';
import { Loading } from '@/components/common/Loading';
import { ContentViewer } from '@/components/submission/ContentViewer';
import { AlertTriangle, CheckCircle, XCircle, Eye, Calendar, Sparkles, Zap } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

export function Escalations() {
  const queryClient = useQueryClient();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const { data: escalationsData, isLoading } = useQuery<any>({
    queryKey: ['escalations'],
    queryFn: () => apiClient.get('/api/v1/admin/escalations'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const resolveMutation = useMutation({
    mutationFn: ({ submissionId, resolution }: { submissionId: number; resolution: string }) =>
      apiClient.post(`/api/v1/admin/escalations/${submissionId}/resolve`, { resolution }),
    onSuccess: (_, { submissionId, resolution }) => {
      toast.success(`Escalation resolved as ${resolution}d`);
      setResolvingId(null);
      setExpandedCard(null);
      queryClient.invalidateQueries({ queryKey: ['escalations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['approved-submissions'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to resolve escalation');
      setResolvingId(null);
    },
  });

  const handleResolve = (submissionId: number, resolution: 'approve' | 'reject') => {
    if (confirm(`Are you sure you want to ${resolution} this escalated submission?`)) {
      setResolvingId(submissionId);
      resolveMutation.mutate({ submissionId, resolution });
    }
  };

  if (isLoading) return <Loading />;

  const escalations = escalationsData?.escalated_submissions || [];

  return (
    <div className="flex min-h-screen">
      <Navigation role="admin" />
      <div className="flex-1">
        <Header />
        <main className="container mx-auto p-8">
          <div className="mb-12 relative">
            {/* Animated background elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -top-2 -right-8 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className={cn("relative", animations.fadeIn)}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg animate-glow">
                    <AlertTriangle className="h-6 w-6 text-white animate-bounce" style={{animationDuration: '2s'}} />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-5xl font-light bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">Escalations</h1>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                    <p className="text-gray-600">Review and resolve escalated submissions with care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {escalations.length === 0 ? (
            <Card className={cn("relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30", animations.scaleIn)}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 animate-gradient-x"></div>
              <CardContent className="py-16 text-center relative">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative h-16 w-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white animate-bounce" style={{animationDuration: '2s'}} />
                  </div>
                </div>
                <h3 className="mb-3 text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">All Clear!</h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  No escalations at the moment. All submissions are being handled smoothly by our reviewers.
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4 text-green-500 animate-pulse" />
                  <span>System running optimally</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {escalations.map((escalation: any, index: number) => (
                <Card 
                  key={escalation.id} 
                  className={cn(
                    "group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-orange-50/30 to-red-50/20",
                    animations.cardHover,
                    animations.fadeIn
                  )}
                  style={{animationDelay: `${index * 150}ms`}}
                >
                  {/* Animated border gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <AlertTriangle className="h-5 w-5 text-white group-hover:animate-pulse" />
                          </div>
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
                        </div>
                        <div>
                          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300">
                            Submission #{escalation.id}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="capitalize bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 hover:shadow-md transition-all duration-200">
                              {escalation.genre}
                            </Badge>
                            <div className="h-1 w-1 bg-orange-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-500 font-medium">Priority Review</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/80 rounded-lg px-3 py-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{new Date(escalation.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <CardDescription className="mt-4 text-gray-600 leading-relaxed">
                      This submission requires your expert attention and careful review.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="group relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <div className="absolute inset-0 h-2 w-2 rounded-full bg-blue-500 animate-ping"></div>
                          </div>
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Submitted Content</p>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-gray-200/60 bg-gradient-to-br from-gray-50/80 via-white to-blue-50/30 p-5 transition-all duration-300 hover:shadow-lg hover:border-blue-300/60 group-hover:bg-gradient-to-br group-hover:from-blue-50/80 group-hover:via-white group-hover:to-purple-50/30">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="relative">
                                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg"></div>
                                <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 font-mono break-all leading-relaxed hover:text-blue-700 transition-colors duration-200 cursor-pointer">
                                {escalation.content_ref}
                              </p>
                            </div>
                          </div>
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{transition: 'transform 1s ease-in-out, opacity 0.3s'}}></div>
                        </div>
                      </div>

                      {expandedCard === escalation.id ? (
                        <div className="space-y-6">
                          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6">
                            <p className="text-sm font-medium text-gray-700 mb-3">Content Preview</p>
                            <ContentViewer contentRef={escalation.content_ref} />
                          </div>
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedCard(null)}
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 font-medium px-4 py-2"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Hide Content
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedCard(escalation.id)}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200 font-medium px-4 py-2"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Content
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-6 pt-8 mt-8 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent relative">
                        {/* Animated divider */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
                        
                        <Button
                          onClick={() => handleResolve(escalation.id, 'approve')}
                          disabled={resolvingId === escalation.id}
                          variant="success"
                          className={cn(
                            "relative overflow-hidden group/btn shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3",
                            animations.hoverScale,
                            animations.buttonPress
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center gap-2">
                            <CheckCircle className={cn(
                              "h-4 w-4 transition-all duration-300",
                              resolvingId === escalation.id ? "animate-spin" : "group-hover/btn:animate-pulse"
                            )} />
                            <span className="font-semibold">
                              {resolvingId === escalation.id ? (
                                <span className="flex items-center gap-2">
                                  <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  Approving
                                </span>
                              ) : 'Approve'}
                            </span>
                          </div>
                        </Button>
                        
                        <Button
                          onClick={() => handleResolve(escalation.id, 'reject')}
                          disabled={resolvingId === escalation.id}
                          variant="destructive"
                          className={cn(
                            "relative overflow-hidden group/btn shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3",
                            animations.hoverScale,
                            animations.buttonPress
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center gap-2">
                            <XCircle className={cn(
                              "h-4 w-4 transition-all duration-300",
                              resolvingId === escalation.id ? "animate-spin" : "group-hover/btn:animate-pulse"
                            )} />
                            <span className="font-semibold">
                              {resolvingId === escalation.id ? (
                                <span className="flex items-center gap-2">
                                  <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  Rejecting
                                </span>
                              ) : 'Reject'}
                            </span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

