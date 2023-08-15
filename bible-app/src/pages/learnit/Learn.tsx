import { Card } from "../../comps/Card"
import { Button } from "../../comps/Button"
import { Link } from "react-router-dom"
import { useVerseContext } from "../../utils/VerseContext"

const Learn = () => {
  const { verseData, setVerseData } = useVerseContext()

  const popUpMessage = () => {
    window.alert("Lets learn this!") //create a pop-up element or useAniamte() to allow this message to enter the Div. Mention the strategies, progress, and trophies.
  }

  setTimeout(popUpMessage, 3000)

  return (
    <>
      <div className="p-5">
        <Card size={"lg"} variant={"default"} className="p-10">
          <div className="bg-black text-white w-fit text-center rounded-2xl font-bold text-4xl p-2">
            Phase 1
          </div>
          <div className="w-full h-full rounded-2xl ">
            <div className="flex items-center justify-center text-3xl h-20 ">
              {verseData.name +
                " " +
                verseData.chapter +
                ":" +
                verseData.versecount}
            </div>
            <div className="flex items-center justify-center h-60 text-3xl">
              {verseData.verse}
            </div>
          </div>
          <div className="flex justify-between w-full h-fit">
            <Button
              size={"default"}
              variant={"glass"}
              whileHover={{ scale: 1.1 }}
            >
              <Link to="/">Go Back</Link>
            </Button>
            <Button
              size={"default"}
              variant={"glass"}
              whileHover={{ scale: 1.1 }}
            >
              Phase 2
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
export default Learn
