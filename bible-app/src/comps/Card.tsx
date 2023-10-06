import { forwardRef } from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "../utils/utils"

const cardVariants = cva("relative grid place-items-center", {
  variants: {
    variant: {
      default: "bg-white",
      outline: "bg-white",
      glass1: "bg-scarlet-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border-2 shadow-2xl",
      glass2: "bg-blueGray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border-2 shadow-2xl",
      glass3: "bg-blue-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border-2 shadow-2xl",
    },
    size: {
      default: "h-1/2 w-1/2 p-10",
      md: "h-full w-full p-3",
      lg: "h-[100vh] w-[100vw]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
//extends these objects to any React.Component that is specified ex. "div"
interface CardProps extends React.ComponentPropsWithRef<"div">, VariantProps<typeof cardVariants> {}

//...props catched all attributes that are unwanted other than the ones we want.
const Card = forwardRef<HTMLDivElement, CardProps>(({ className, size, variant, ...props }, cardRef) => {
  //forwardRef allows us to target these functions on any element but also gives us type saftey.

  return <div ref={cardRef} className={cn(cardVariants({ variant, size, className }))} {...props} />
})

export { Card, cardVariants }
