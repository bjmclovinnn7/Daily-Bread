import { useVerseContext } from "../../utils/VerseContext"
import { useUserContext } from "../../utils/UserContext"
import { useNavigate } from "react-router"
import { FaTrophy } from "react-icons/fa"
import verseData from "../../utils/Verses.json"

interface Verse {
  id: string
  category: string
  translations: {
    NIV: string
    ESV: string
    KJV: string
  }
}

const AllVerses = () => {
  const { saveSelectedVerse, currentCategory, translation } = useVerseContext()
  const { userData } = useUserContext()
  const navigate = useNavigate()

  const filteredVerses = verseData.filter((verse: Verse) => {
    return verse.category === currentCategory.toLowerCase()
  })

  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }

  return (
    <div className="h-screen w-full">
      <button onClick={() => navigate("/")} className="absolute inset-0 h-fit w-fit">
        Back
      </button>
      <h1 className="h-20 grid place-content-center text-4xl">{currentCategory.toLowerCase()}</h1>
      <div className="space-y-5 p-5 grid place-content-center">
        {filteredVerses.map((verse: Verse) => (
          <div
            onClick={() => handleClick(verse)}
            key={verse.id}
            className="text-black max-w-[600px] border-2 p-2 bg-slate-300 shadow-2xl rounded-3xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{verse.id}</h2>
              {userData && userData.learnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                <FaTrophy className="text-orange-500 text-2xl" />
              ) : null}
            </div>

            <p className="text-xl">{verse.translations[translation as keyof typeof verse.translations]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllVerses
