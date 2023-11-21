import { useUserContext } from "../utils/UserContext"
import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import { FaTrophy, FaXmark } from "react-icons/fa6"
import verseData from "../utils/Verses.json"

const Learned = () => {
  const { userData } = useUserContext()
  const { saveSelectedVerse, saveCurrentCategory } = useVerseContext()
  const navigate = useNavigate()

  const handleReview = (verseId: string) => {
    // Retrieve the selected verse data from local storage
    const newVerse = verseData.filter((verse) => verse.id === verseId)
    if (newVerse) {
      console.log(newVerse)
      // Call the saveSelectedVerse function with the selected verse data
      saveCurrentCategory(newVerse[0].category)
      saveSelectedVerse(newVerse[0])
      navigate("/stage3")
    } else {
      console.error(`Verse with ID ${newVerse} not found in local storage.`)
    }
  }

  interface timeStamp {
    seconds: number
    nanoseconds: number
  }

  const handleTimeStamp = (timeStamp: timeStamp) => {
    if (timeStamp) {
      const date = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)
      const readableDate = date.toLocaleDateString()
      return readableDate
    } else {
      return "No Date."
    }
  }

  return (
    <>
      <div className="h-screen w-full bg-[#444444] text-white p-4">
        <div className="relative flex justify-between items-center ">
          <button onClick={() => navigate("/")} className="">
            <FaXmark className="text-3xl md:text-4xl lg:text-5xl" />
          </button>
          <span className="text-3xl md:text-4xl lg:text-5xl text-white text-center font-header">Learned</span>
          <div className="flex items-center gap-2 text-3xl md:text-4xl lg:text-5xl">
            <span>{userData.learnedVerses.length}</span>
            <FaTrophy className="text-yellow-500" />
          </div>
        </div>
        <div className="grid pt-4 sm:grid-cols-2 place-content-center max-w-2xl mx-auto text-white gap-2">
          {userData
            ? userData.learnedVerses.map((verse) => (
                <button
                  onClick={() => handleReview(verse.id)}
                  key={verse.id}
                  className="text-center flex items-center justify-between gap-8 px-4 text-2xl border-2 w-full rounded-3xl p-4"
                >
                  <span className="block text-2xl font-bold">{verse.id}</span>
                  <span className="block">{verse.translations}</span>
                  <span>{handleTimeStamp(verse.timeStamp)}</span>
                </button>
              ))
            : "You haven't learned any verses yet."}
        </div>
      </div>
    </>
  )
}

export default Learned
