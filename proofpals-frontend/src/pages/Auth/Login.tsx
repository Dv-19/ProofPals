import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, AlertCircle, Sparkles, Lock, User, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast.success('Login successful!');
      const role = useAuthStore.getState().user?.role;
      if (role === 'reviewer') {
        navigate('/reviewer/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/submitter/submissions');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-float-delay"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-300/20 to-transparent rounded-full blur-xl animate-bounce" style={{animationDuration: '3s'}}></div>
        </div>

        <div className="text-center text-white max-w-md relative z-10">
          <div className={cn("mb-8", animations.fadeIn)}>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-lg mb-8 shadow-2xl border border-white/30 animate-float hover:animate-glow transition-all duration-300 cursor-pointer group">
              <Shield className="h-12 w-12 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-shimmer">
              ProofPals
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent mx-auto rounded-full mb-8 animate-pulse"></div>
          </div>
          <p className={cn("text-xl font-light text-white/95 leading-relaxed mb-8", animations.slideInFromBottom)} style={{animationDelay: '0.3s'}}>
            Secure, anonymous peer review platform powered by cryptographic verification
          </p>
          <div className={cn("flex items-center justify-center gap-3 text-white/80", animations.slideInFromBottom)} style={{ animationDelay: '0.6s' }}>
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-medium">Zero-knowledge proofs • CLSAG signatures</span>
            <Zap className="h-4 w-4 animate-bounce" style={{animationDelay: '1s'}} />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30 relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-lg animate-float-delay"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className={cn("lg:hidden text-center mb-10", animations.scaleIn)}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 mb-6 shadow-2xl animate-float hover:shadow-3xl transition-all duration-300 group">
              <Shield className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-white">ProofPals</h1>
          </div>

          {/* Login Card */}
          <div className={cn(
            "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-10 relative overflow-hidden group",
            animations.scaleIn
          )}>
            {/* Card background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className={cn("text-center mb-10", animations.fadeIn)} style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-white">Welcome back</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Sign in to continue your secure journey</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className={cn(animations.slideInFromLeft)} style={{animationDelay: '0.4s'}}>
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Username
                  </Label>
                  <div className="relative group">
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      {...register('username')}
                      className="h-14 rounded-xl border-gray-300/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/80 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 pl-4 pr-4 group-hover:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.username && (
                    <p className={cn("text-sm text-red-500 dark:text-red-400 flex items-center gap-2 mt-3", animations.slideInFromLeft)}>
                      <AlertCircle className="h-4 w-4 animate-pulse" />
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className={cn(animations.slideInFromRight)} style={{animationDelay: '0.6s'}}>
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Password
                    </Label>
                    <button
                      type="button"
                      className={cn(
                        "text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-200 hover:scale-105",
                        animations.hoverScale
                      )}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...register('password')}
                      className="h-14 rounded-xl border-gray-300/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/80 focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-600 transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 pl-4 pr-4 group-hover:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.password && (
                    <p className={cn("text-sm text-red-500 dark:text-red-400 flex items-center gap-2 mt-3", animations.slideInFromRight)}>
                      <AlertCircle className="h-4 w-4 animate-pulse" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className={cn(
                    "w-full h-14 relative overflow-hidden group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300",
                    animations.hoverScale,
                    animations.buttonPress
                  )}
                  style={{animationDelay: '0.8s'}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3 font-semibold text-lg">
                    {isLoading ? (
                      <>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-white rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 group-hover/btn:animate-pulse" />
                        <span>Sign in</span>
                      </>
                    )}
                  </div>
                </Button>
            </form>

              <div className={cn("mt-10 text-center", animations.fadeIn)} style={{animationDelay: '1s'}}>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => navigate('/signup')}
                    className={cn(
                      "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all duration-200",
                      animations.hoverScale
                    )}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={cn("text-center mt-10", animations.fadeIn)} style={{animationDelay: '1.2s'}}>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <Shield className="h-3 w-3 animate-pulse" />
              <span>Protected by zero-knowledge cryptography</span>
              <Sparkles className="h-3 w-3 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
