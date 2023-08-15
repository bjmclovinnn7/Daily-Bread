import { forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva(
  "h-fit w-fit flex justify-center items-center rounded-2xl text-xl",
  {
    variants: {
      variant: {
        default: "bg-blue-400",
        outline: "border bg-red-300",
        glass:
          "bg-blue-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
      },
      size: {
        default: "p-3",
        md: "p-6",
        lg: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonMotionProps = ButtonProps & HTMLMotionProps<"button">

interface ButtonProps
  extends React.ComponentPropsWithRef<"button">,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonMotionProps>(
  ({ className, size, variant, ...props }, buttonRef) => {
    return (
      <motion.button
        ref={buttonRef}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

export { Button, buttonVariants }
