import { motion } from "framer-motion"
import { FaSmileBeam, FaTrophy } from "react-icons/fa"
import { useUserContext } from "../utils/UserContext"

interface Props {
  userExperience: number
}
const Stage3FinalCompletion = ({ userExperience }: Props) => {
  const { userData } = useUserContext()
  const animationDisplay = (experience: number) => {
    if (experience === 10) {
      return (
        <div className="flex justify-center items-center gap-6 font-Inter">
          <span className="text-8xl ">+1</span>
          <FaTrophy className="text-yellow-500 h-28 w-28" />
        </div>
      )
    } else if (experience === 1) {
      return <FaSmileBeam className="text-yellow-500 h-28 w-28" />
    } else {
      return <div className="text-2xl text-center">You already reviewed this verse today! But...</div>
    }
  }
  return (
    <>
      <div className="absolute grid place-content-center gap-4 p-2 h-[100vh] inset-0 bg-black">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { opacity: 1, y: 0, scale: 1 },
            hidden: { opacity: 0, y: -50, scale: 0 },
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex justify-center items-center gap-6 text-white"
        >
          {animationDisplay(userExperience)}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          transition={{ ease: "easeIn", duration: 2.5 }}
          className="text-white grid text-center gap-2 text-4xl"
        >
          <span className="">Great job, {userData.displayName.split(" ")[0]}.</span>
          <span className="">
            + <span className="text-yellow-500">{userExperience}</span> XP
          </span>
        </motion.div>
      </div>
    </>
  )
}
export default Stage3FinalCompletion
