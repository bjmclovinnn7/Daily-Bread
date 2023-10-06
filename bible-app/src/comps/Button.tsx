import { forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva("h-fit w-fit flex justify-center items-center rounded-lg text-xl", {
  variants: {
    variant: {
      default: "border-2 bg-white border-black",
      outline1: "border bg-scarlet-300",
      outline2: "border bg-blue-800",
      outline3: "border bg-blueGray-700",
      glass1: "bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-3xl border",
      glass2: "bg-scarlet-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
      glass3: "bg-blueGray-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 shadow-xl border",
    },
    size: {
      default: "p-2",
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

const Button = forwardRef<HTMLButtonElement, ButtonMotionProps>(({ className, size, variant, ...props }, buttonRef) => {
  return <motion.button ref={buttonRef} className={cn(buttonVariants({ variant, size, className }))} {...props} />
})

export { Button, buttonVariants }
