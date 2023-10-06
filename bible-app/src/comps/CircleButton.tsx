import { forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva("h-fit w-fit flex justify-center items-center rounded-2xl w-full", {
  variants: {
    variant: {
      default: "border",
      outline1: "border bg-scarlet-100",
      outline2: "border bg-blueGray-300",
      outline3: "border bg-blueGray-400",
      glass1: "bg-scarlet-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
      glass2: "bg-blueGray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
      glass3: "bg-blue-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
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
})

type ButtonMotionProps = ButtonProps & HTMLMotionProps<"button">

interface ButtonProps extends React.ComponentPropsWithRef<"button">, VariantProps<typeof buttonVariants> {}

const CircleButton = forwardRef<HTMLButtonElement, ButtonMotionProps>(
  ({ className, size, variant, ...props }, buttonRef) => {
    return <motion.button ref={buttonRef} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  }
)

export { CircleButton, buttonVariants }
