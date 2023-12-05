import { Button } from "./Button"

interface Props {
  showInstructions: boolean
  setShowInstructions: (item: boolean) => void
  stageDetails: {
    id: string
    goal: string
  }
}
const HintMessage = ({ showInstructions, setShowInstructions, stageDetails }: Props) => {
  if (showInstructions) {
    return (
      <div className="absolute inset-0 z-20 font-Inter">
        <div className="grid place-content-center h-full bg-black px-8 gap-4 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90">
          <div className="text-white text-3xl">Instructions:</div>

          <h2 className="text-white text-xl ">There are two modes. Full word and first letter.</h2>
          <h2 className="text-white text-xl ">
            Full Word: requires you to type out the entire word. Don't worry about special characters. Just type the
            word or number and press space.
          </h2>
          <h2 className="text-white text-xl ">
            First Letter: only requires you to type the first letter of each word or first number.
          </h2>
          <span className="text-2xl text-white">{stageDetails?.id}</span>
          <h2 className="text-white text-xl ">{stageDetails?.goal}</h2>

          <h2 className=" text-xl text-orange-500">
            You can turn off instructions permanentaly in your profile settings.
          </h2>

          <Button
            variant={"glass1"}
            onClick={() => setShowInstructions(!showInstructions)}
            className=" text-white rounded-2xl w-full"
          >
            Dismiss
          </Button>
        </div>
      </div>
    )
  } else return
}

export default HintMessage
