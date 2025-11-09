import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning"
  size?: "default" | "sm" | "lg" | "icon"
}

const buttonVariants = {
  variant: {
    default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md",
    warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
    link: "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
  },
  size: {
    default: "h-10 px-6 py-2.5 text-sm font-medium",
    sm: "h-8 px-4 py-2 text-sm font-medium",
    lg: "h-12 px-8 py-3 text-base font-medium",
    icon: "h-10 w-10 p-0"
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Variant styles
          buttonVariants.variant[variant],
          // Size styles
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

