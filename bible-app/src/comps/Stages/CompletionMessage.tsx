import { Button } from "../Button"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"

interface Props {
  percentage: number
  handleReset: () => void
  stageDetails: {
    id: string
    goal: string
    stagePercentage: number
    stageNavigate: string
    nextStage: string
  }
  handleLearnVerse: () => void
}
const CompletionMessage = ({ percentage, handleReset, stageDetails, handleLearnVerse }: Props) => {
  const navigate = useNavigate()
  const handleProgression = () => {
    if (stageDetails.stagePercentage === 100) {
      console.log("Learning verse")
      handleLearnVerse()
    } else {
      navigate(stageDetails?.stageNavigate)
      console.log("Navigating")
    }
  }

  if (percentage >= stageDetails.stagePercentage) {
    return (
      <>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="visible"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -50 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-full p-5 text-2xl text-white font-Inter"
        >
          <div className="grid place-content-center h-full w-full gap-4">
            <div className="text-center">
              <span className="">
                Nice work! You got <span className="text-green-500">{percentage.toFixed(2)}</span>%
              </span>
            </div>

            <div className="flex w-full gap-4">
              <Button variant={"glass2"} onClick={handleReset} className="text-center w-40 text-2xl">
                Retry
              </Button>
              <Button onClick={() => handleProgression()} variant={"glass3"} className="w-40 text-2xl ">
                {stageDetails?.nextStage}
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    )
  } else if (percentage < stageDetails.stagePercentage) {
    return (
      <>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: -50 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="w-full p-5 text-2xl text-white"
        >
          <div className="grid place-content-center h-full w-full gap-2">
            <div className="text-center">
              <span className="">
                You got <span className="text-red-500">{percentage.toFixed(2)}</span>%... You need{" "}
                {stageDetails.stagePercentage}% or better to proceed.
              </span>
            </div>
            <div className="text-center"></div>
            <div className="flex w-full ">
              <Button variant={"glass2"} onClick={handleReset} className="text-center w-full text-2xl">
                Retry
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    )
  }
}

export default CompletionMessage
