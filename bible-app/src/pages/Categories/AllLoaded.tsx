import { useState } from "react"
import { useVerseContext } from "../../utils/VerseContext"
import { useUserContext } from "../../utils/UserContext"
import { useNavigate } from "react-router"
import { FaTrophy } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"

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
  const { saveSelectedVerse, currentCategory, translation, verseData } = useVerseContext()
  const { userData } = useUserContext()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVerses = verseData.filter((verse: Verse) => {
    return verse.category === currentCategory && verse.id.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  return (
    <div className="h-screen w-full p-4 overflow-auto bg-black font-Inter">
      <div className="relative block text-center text-3xl md:text-4xl lg:text-5xl text-white">
        <button onClick={() => navigate("/")} className="absolute inset-0">
          <FaXmark className="" />
        </button>
        <h1 className=" text-center font-Inter font-bold">{currentCategory}</h1>
      </div>

      <div className="gap-4 pt-4 grid place-content-center max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-white w-full mt-4 p-2 text-2xl rounded "
        />
        <h1 className=" md:text-xl lg:text-2xl text-white font-Inter">Click a verse to begin memorizing it.</h1>

        {filteredVerses.map((verse: Verse, index) => (
          <div onClick={() => handleClick(verse)} key={index} className="text-black border p-4 bg-white rounded-lg">
            <div className="flex justify-between items-center ">
              <h2 className="text-xl md:text-2xl lg:text-3xl">{verse.id}</h2>
              {userData && userData.learnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                <FaTrophy className="text-yellow-500 text-2xl mr-2" />
              ) : null}
            </div>
            <p className="md:text-lg lg:text-lg ">
              {verse.translations[translation as keyof typeof verse.translations]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllVerses
