import { motion } from "framer-motion"

interface Props {
  someProp: boolean
  changeProp: () => void
}

const SlideButton = ({ someProp, changeProp }: Props) => {
  return (
    <div className="flex justify-between items-center gap-8 p-4">
      <h1 className=" text-xl">Help & Hints:</h1>
      <div
        className={`  flex  ${someProp ? "justify-start " : "justify-end "}  p-2 rounded-full w-20 bg-[#696969]`}
        onClick={() => changeProp()}
      >
        <motion.div
          className={` ${
            someProp ? "bg-green-600" : "bg-red-400"
          } rounded-full text-black px-4 grid place-content-center w-1/2 h-8`}
          layout
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          whileHover={{ scale: 1.2 }}
        ></motion.div>
      </div>
    </div>
  )
}
export default SlideButton
