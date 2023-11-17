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
        <div className="relative flex justify-between items-center">
          <button onClick={() => navigate("/")} className="">
            <FaXmark className="text-3xl" />
          </button>
          <span className="text-3xl text-white text-center">Learned</span>
          <div className="flex items-center gap-2">
            <span>{userData.learnedVerses.length}</span>
            <FaTrophy className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="p-2">
          <div className="text-black">
            <div className="p-2 grid w-full">
              {userData ? (
                <ul className="space-y-2">
                  {userData.learnedVerses.map((verse) => (
                    <button
                      onClick={() => handleReview(verse.id)}
                      key={verse.id}
                      className="border-2 bg-white shadow-2xl rounded-3xl p-2 text-start w-full"
                    >
                      <span className="block text-2xl font-bold">{verse.id}</span>
                      <span className="block">{verse.translations}</span>
                      <span>{handleTimeStamp(verse.timeStamp)}</span>
                    </button>
                  ))}
                </ul>
              ) : (
                "You haven't learned any verses yet."
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Learned
