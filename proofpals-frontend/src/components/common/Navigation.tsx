import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils/formatting';
import { FileText, Users, Shield, BarChart3, KeyRound, Home, Sparkles, Zap } from 'lucide-react';
import { animations } from '@/lib/animations';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavigationProps {
  role: 'submitter' | 'reviewer' | 'admin';
}

const navItems: Record<NavigationProps['role'], NavItem[]> = {
  submitter: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'My Submissions', path: '/submitter/submissions', icon: FileText },
    { label: 'Upload', path: '/submitter/upload', icon: FileText },
  ],
  reviewer: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/reviewer/dashboard', icon: Shield },
    { label: 'Submissions', path: '/reviewer/submissions', icon: FileText },
    { label: 'Upload', path: '/reviewer/upload', icon: FileText },
    { label: 'Get Tokens', path: '/reviewer/tokens', icon: KeyRound },
  ],
  admin: [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { label: 'Rings', path: '/admin/rings', icon: Shield },
    { label: 'Escalations', path: '/admin/escalations', icon: Shield },
    { label: 'Credential Allocation', path: '/admin/credentials', icon: KeyRound },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { label: 'Statistics', path: '/admin/statistics', icon: BarChart3 },
  ],
};

export function Navigation({ role }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const items = navItems[role] || [];

  return (
    <nav className="w-72 border-r border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full blur-2xl animate-float-delay"></div>
      
      {/* Brand */}
      <div className={cn("mb-12 relative z-10", animations.fadeIn)}>
        <div className="flex items-center gap-4 mb-4 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 animate-glow">
              <Shield className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground via-blue-600 to-foreground bg-clip-text text-transparent tracking-tight group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">ProofPals</h2>
          </div>
        </div>
        <div className="flex items-center gap-3 pl-1">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-primary animate-ping"></div>
          </div>
          <p className="text-xs text-muted-foreground font-semibold capitalize tracking-wider">{role} Portal</p>
          <Zap className="h-3 w-3 text-primary animate-pulse" />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="space-y-2 relative z-10">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'group flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-sm font-medium transition-all duration-300 relative overflow-hidden',
                animations.hoverScale,
                animations.fadeIn,
                isActive
                  ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-primary shadow-lg border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:shadow-md'
              )}
              style={{animationDelay: `${index * 100}ms`}}
            >
              {/* Active indicator line */}
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary via-blue-500 to-primary rounded-r-full"></div>
              )}
              
              {/* Background hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className={cn(
                "relative flex items-center justify-center",
                isActive && "animate-pulse"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                  isActive ? "text-primary drop-shadow-sm" : "text-muted-foreground/70 group-hover:text-foreground"
                )} />
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-primary/30 blur-lg -z-10 animate-pulse"></div>
                )}
              </div>
              
              <span className={cn(
                "truncate flex-1 relative z-10 transition-all duration-300",
                isActive ? "font-semibold" : "group-hover:font-medium"
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="flex items-center gap-1 relative z-10">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="h-1 w-1 rounded-full bg-primary/60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer decoration */}
      <div className={cn("mt-12 pt-6 border-t border-border/40 relative z-10", animations.fadeIn)} style={{animationDelay: '0.8s'}}>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 border border-border/30 p-4 group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <Sparkles className="h-4 w-4 text-primary/80 animate-pulse" />
              <div className="absolute inset-0 h-4 w-4 text-primary animate-ping opacity-30"></div>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Anonymous & Secure
            </p>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent"></div>
            <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
