import { useVerseContext } from "../../utils/VerseContext"
import { useUserContext } from "../../utils/UserContext"
import { useEffect } from "react"
import { HiChevronLeft } from "react-icons/Hi"
import { useNavigate } from "react-router"
import { FaTrophy } from "react-icons/fa6"

// Define a type or interface for your verse data
interface Verse {
  id: string
  category: string
  text: string
}

const AllVerses = () => {
  const { verses, saveSelectedVerse, currentCategory, getAllVerses } = useVerseContext()
  const { userLearnedVerses } = useUserContext()
  const navigate = useNavigate()
  useEffect(() => {
    getAllVerses()
  }, [])

  const filteredVerses = verses.filter((verse: Verse) => verse.category === currentCategory.toLowerCase())

  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }

  return (
    <div className=" h-screen w-full">
      <button onClick={() => navigate("/")} className="absolute inset-0 h-fit w-fit">
        <HiChevronLeft className="text-6xl" />
      </button>
      <h1 className="h-20 grid place-content-center text-4xl">{currentCategory.toLowerCase()}</h1>
      <div className="space-y-5 p-5 grid place-content-center">
        {filteredVerses.map((verse: Verse) => (
          <div
            onClick={() => handleClick(verse)}
            key={verse.id}
            className=" text-black  max-w-[600px] border-2 p-2 bg-slate-300 shadow-2xl rounded-3xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{verse.id}</h2>
              {
                userLearnedVerses && userLearnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                  <FaTrophy className=" text-orange-500 text-2xl" />
                ) : null // or you can use a placeholder like "null"
              }
            </div>

            <p className="text-xl">{verse.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllVerses
