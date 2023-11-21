import { useVerseContext } from "../../utils/VerseContext"
import { useUserContext } from "../../utils/UserContext"
import { useNavigate } from "react-router"
import { FaTrophy } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"
import verseData from "../../utils/Verses.json"

interface Verse {
  id: string
  category: string
  translations: {
    NIV: string
    ESV: string
    KJV: string
    NKJV: string
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
    <div className="h-screen w-full p-4 overflow-auto bg-[#444444]">
      <div className="relative block text-center text-3xl md:text-4xl lg:text-5xl text-white">
        <button onClick={() => navigate("/")} className="absolute inset-0">
          <FaXmark className="" />
        </button>
        <h1 className=" text-center font-header">{currentCategory.toLowerCase()}</h1>
      </div>
      <div className="gap-4 p-4 grid place-content-center max-w-2xl mx-auto">
        {filteredVerses.map((verse: Verse) => (
          <div
            onClick={() => handleClick(verse)}
            key={verse.id}
            className="text-black border-2 p-4 bg-white shadow-2xl rounded-3xl"
          >
            <div className="flex justify-between items-center ">
              <h2 className="text-2xl font-bold">{verse.id}</h2>
              {userData && userData.learnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                <FaTrophy className="text-yellow-500 text-2xl mr-2" />
              ) : null}
            </div>

            <p className="text-xl ">{verse.translations[translation as keyof typeof verse.translations]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllVerses
