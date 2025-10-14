import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-card hover:shadow-elevated",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-card hover:shadow-elevated",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-card hover:shadow-elevated",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-card hover:shadow-elevated",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-primary text-white hover:shadow-glow hover:scale-105 transform shadow-elevated",
        gradient: "bg-gradient-primary text-white hover:opacity-90 shadow-card hover:shadow-elevated",
        easy: "bg-easy text-white hover:bg-easy/90 shadow-card hover:shadow-elevated",
        medium: "bg-medium text-white hover:bg-medium/90 shadow-card hover:shadow-elevated",
        hard: "bg-hard text-white hover:bg-hard/90 shadow-card hover:shadow-elevated",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
