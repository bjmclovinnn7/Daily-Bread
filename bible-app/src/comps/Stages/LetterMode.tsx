import { motion } from "framer-motion"

interface Props {
  oneLetterMode: boolean
  changeLearnMethods: () => void
}

const LetterMode = ({ oneLetterMode, changeLearnMethods }: Props) => {
  return (
    <>
      <div className="absolute bottom-20 right-5 left-5 flex justify-center items-center gap-4 text-sm lg:text-base font-Inter">
        <span className={`${oneLetterMode ? "text-yellow-500" : "text-white"} transition-colors duration-500`}>
          1st Letter
        </span>
        <div
          className={`  flex  ${oneLetterMode ? "justify-start " : "justify-end "}  p-2 rounded-full w-20 bg-[#696969]`}
          onClick={() => changeLearnMethods()}
        >
          <motion.div
            className={` bg-gray-200 rounded-full text-black px-4 grid place-content-center w-1/2 h-8`}
            layout
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            whileHover={{ scale: 1.2 }}
          ></motion.div>
        </div>
        <span className={`${oneLetterMode ? "text-white" : "text-yellow-500"}  transition-colors duration-500`}>
          Full Word
        </span>
      </div>
    </>
  )
}
export default LetterMode
