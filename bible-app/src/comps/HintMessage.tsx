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
        <div className="h-full bg-black text-white p-4 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90">
          <div className="grid gap-4">
            <div className="text-white text-2xl">Instructions:</div>

            <h2 className=" text-xl">There are two modes. Full word and first letter.</h2>
            <h2 className=" text-xl">
              Full Word: requires you to type out the entire word. Don't worry about special characters. Just type the
              word or number and press space.
            </h2>
            <h2 className=" text-xl">
              First Letter: only requires you to type the first letter of each word or first number.
            </h2>
            <span className="text-2xl ">{stageDetails?.id}</span>
            <h2 className=" text-xl">{stageDetails?.goal}</h2>

            <Button
              variant={"secondary"}
              size={"none"}
              className="absolute bottom-5 right-5 left-5 h-10"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  } else return
}

export default HintMessage
