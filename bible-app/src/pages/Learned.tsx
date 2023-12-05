import { useState, ChangeEvent } from "react"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { FaTrophy, FaArrowLeft } from "react-icons/fa"
import LearnedVerseCard from "../comps/LearnedVerseCard"
import { useVerseContext } from "../utils/VerseContext"
import verseData from "../utils/Verses.json"

const Learned = () => {
  const { userData } = useUserContext()
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { saveSelectedVerse, saveCurrentCategory } = useVerseContext()

  // Define state variables for filters
  const [selectedCategory, setSelectedCategory] = useState("") // State for category filter
  const [selectedTranslation, setSelectedTranslation] = useState("") // State for translation filter

  const handleVerseCardClick = (verseId: string) => {
    const newVerse = verseData.filter((verse) => verse.id === verseId)
    saveCurrentCategory(newVerse[0].category)
    saveSelectedVerse(newVerse[0])
    setOpen(!open)
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value)
  }

  const handleTranslationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTranslation(event.target.value)
  }

  const filteredVerses = userData
    ? userData.learnedVerses.filter(
        (verse) =>
          verse.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedCategory ? verse.category === selectedCategory : true) &&
          (selectedTranslation ? verse.translation === selectedTranslation : true)
        // Add more conditions for filtering by date learned if applicable
      )
    : []

  return (
    <>
      <div
        className={`h-screen w-full relative overflow-auto bg-black text-white p-4 font-Inter ${
          open ? "" : " bg-black bg-clip-padding backdrop-filter bg-opacity-70"
        } transition-all duration-500`}
      >
        <div className="relative flex justify-between items-center ">
          <button onClick={() => navigate("/")} className="">
            <FaArrowLeft className="text-3xl md:text-4xl lg:text-5xl" />
          </button>
          <span className="text-3xl md:text-4xl lg:text-5xl text-white text-center font-Inter">Learned</span>
          <div className="flex items-center gap-2 text-3xl md:text-4xl lg:text-5xl">
            <span>{userData.learnedVerses.length}</span>
            <FaTrophy className="text-yellow-500" />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <input
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="bg-white w-full mt-4 p-2 text-2xl rounded-lg max-w-2xl mx-auto text-black"
          />
        </div>
        <div className="flex justify-between items-center mt-4 text-black max-w-2xl mx-auto md:justify-center md:gap-8">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-white p-2 text-xl rounded-lg md:w-full"
          >
            <option value="">All Categories</option>
            <option value="top 100">Top 100</option>
            <option value="salvation">Salvation</option>
            <option value="prayer">Prayer</option>
            <option value="praise">Praise</option>
            <option value="faith">Faith</option>
            <option value="love">Love</option>
          </select>

          <select
            value={selectedTranslation}
            onChange={handleTranslationChange}
            className="bg-white p-2 text-xl rounded-lg md:w-full"
          >
            <option value="">All Translations</option>
            <option value="NIV">NIV</option>
            <option value="NKJV">NKJV</option>
            <option value="ESV">ESV</option>
            <option value="KJV">KJV</option>
          </select>
          {/* Additional dropdowns for date learned filter if needed */}
        </div>
        <h1 className=" md:text-xl lg:text-2xl text-white mt-4 block max-w-2xl mx-auto">Click verse for details</h1>
        <div className="grid pt-4 sm:grid-cols-2 max-w-2xl mx-auto text-white gap-2">
          {filteredVerses.length > 0 ? (
            filteredVerses.map((verse) => (
              <button
                onClick={() => handleVerseCardClick(verse.id)}
                key={verse.id}
                className="text-center flex items-center justify-between gap-4 px-4 md:text-xl lg:text-2xl  w-full rounded-lg p-4 bg-[#4F4F4F]"
              >
                <div className="grid">
                  <span className=" text-lg md:text-xl lg:text-2xl">{verse.id}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center">No matching verses found.</div>
          )}
        </div>
        <LearnedVerseCard open={open} setOpen={setOpen} />
      </div>
    </>
  )
}

export default Learned
