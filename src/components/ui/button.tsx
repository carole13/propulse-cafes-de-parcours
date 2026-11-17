import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Actions principales (s'inscrire, demander une place, envoyer, nous écrire…) :
        // elles grossissent légèrement au survol et « s'enfoncent » au clic, pour signaler
        // clairement l'action à faire. Les actions secondaires (outline, ghost, lien) restent
        // plus sobres : un changement de couleur suffit. Rien ne bouge si l'appareil
        // demande de réduire les animations.
        default:
          "bg-brand-blue text-brand-white hover:shadow-lg motion-safe:hover:scale-[1.05] motion-safe:active:scale-[0.97]",
        yellow:
          "bg-brand-yellow text-brand-blue hover:shadow-lg motion-safe:hover:scale-[1.05] motion-safe:active:scale-[0.97]",
        white:
          "bg-brand-white text-brand-blue hover:shadow-lg motion-safe:hover:scale-[1.05] motion-safe:active:scale-[0.97]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Bouton secondaire sur fond bleu (hero, bandeaux bleus)
        outlineLight:
          "border-2 border-brand-white/60 bg-transparent text-brand-white hover:border-brand-white hover:bg-brand-white hover:text-brand-blue motion-safe:active:scale-[0.97]",
        outline:
          "border-2 border-brand-blue bg-transparent text-brand-blue hover:bg-brand-blue hover:text-brand-white motion-safe:active:scale-[0.97]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-brand-blue hover:bg-brand-mint",
        link: "text-brand-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
