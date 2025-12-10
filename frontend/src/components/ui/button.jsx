import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium uppercase tracking-widest transition-fast focus-visible:outline-none focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-none",
  {
    variants: {
      variant: {
        default: "bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-instant",
        destructive: "bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-instant",
        outline: "border-2 border-black bg-transparent hover:bg-black hover:text-white transition-instant",
        secondary: "bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-instant",
        ghost: "hover:underline transition-instant",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6 py-2 text-xs",
        lg: "h-14 px-10 py-4 text-sm",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }