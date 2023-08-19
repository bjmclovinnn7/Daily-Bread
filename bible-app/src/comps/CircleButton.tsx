import { forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { HiSparkles } from "react-icons/Hi"

const buttonVariants = cva(
  "h-fit w-fit flex justify-center items-center rounded-full text-xl",
  {
    variants: {
      variant: {
        default: "border bg-serenity-100",
        outline1: "border bg-serenity-100",
        outline2: "border bg-freesia-300",
        outline3: "border bg-midnightBlue-400",
        glass1:
          "bg-serenity-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
        glass2:
          "bg-freesia-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
        glass3:
          "bg-midnightBlue-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
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

const CircleButton = forwardRef<HTMLButtonElement, ButtonMotionProps>(
  ({ className, size, variant, ...props }, buttonRef) => {
    return (
      <motion.button
        ref={buttonRef}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        <HiSparkles className="stroke-black stroke-1 pointer-events-none" />
      </motion.button>
    )
  }
)

export { CircleButton, buttonVariants }
