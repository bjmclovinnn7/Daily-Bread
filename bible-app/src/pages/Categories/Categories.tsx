import { useNavigate } from "react-router"
import { useVerseContext } from "../../utils/VerseContext"
import { useState } from "react"
import { motion } from "framer-motion"
import { useUserContext } from "../../utils/UserContext"
import { FaTrophy } from "react-icons/fa6"
import { FaArrowRight } from "react-icons/fa"
// import bookData from "../../utils/Biblebooks.json"

interface SelectedVerse {
  id: string
  category: string
  translations: {
    NIV: string
    ESV: string
    KJV: string
    NKJV: string
  }
}

// interface SelectedBooks {
//   book: string
//   title: string
//   category: string
//   subCategory: string
// }

// Create a separate component for filtered verses
const FilteredVerses = ({ category, animate }: { category: string; animate: boolean }) => {
  const navigate = useNavigate()
  const { saveSelectedVerse, saveCurrentCategory, translation, verseData } = useVerseContext()
  const { userData } = useUserContext()

  const handleLearnClick = (verse: SelectedVerse) => {
    saveSelectedVerse(verse)
    saveCurrentCategory(verse.category)
    navigate("/stage1")
  }

  return (
    <motion.div
      initial={false}
      animate={animate ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, height: "0px" },
        show: { opacity: 1, height: "250px" },
      }}
      className={`flex overflow-auto h-full md:lg:max-w-[1000px]`}
    >
      {verseData
        .filter((verse: SelectedVerse) => verse.category === category)
        .map((verse: SelectedVerse, index) => (
          <section
            key={index}
            className={`w-full h-full px-4 pb-4 font-Inter ${animate ? "bg-white" : "bg-[#4F4F4F]"}`}
            onClick={() => handleLearnClick(verse)}
          >
            <div
              className={`h-full w-60 md:w-80 lg:w-96 rounded p-3 md:lg:overflow-hidden ${
                animate ? "bg-white border" : "bg-[#4F4F4F]"
              }`}
            >
              <div className="flex justify-center items-center">
                <h1 className="w-full text-black">{verse.id}</h1>

                {userData.learnedVerses &&
                userData.learnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                  <FaTrophy className=" text-yellow-500 text-2xl" />
                ) : (
                  ""
                )}
              </div>

              <div className="verseText text-black">
                {verse.translations[translation as keyof typeof verse.translations]}
              </div>
            </div>
          </section>
        ))}
    </motion.div>
  )
}

interface Props {
  setCategoryOpened: (item: boolean) => void
  categoryOpened: boolean
}

const Categories = ({ setCategoryOpened, categoryOpened }: Props) => {
  const navigate = useNavigate()
  const { saveCurrentCategory, verseData } = useVerseContext()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const verseCategories = [
    "Top 100",
    "Salvation",
    "Prayer",
    "Praise",
    "Faith",
    "Love",
    "Birth and Youth",
    "Comfort in Sorrow",
    "Creation",
    "Eternal Life",
    "Fellowship",
    "Financial Provision",
    "Forgiveness",
    "Freedom from Sin",
    "Giving",
    "God the Father",
    "Good Works",
    "Healing",
    "Health",
    "Heaven",
    "Hope",
    "Instruction",
    "Instruction for Youth",
    "Instruction for Parents",
    "Jesus",
    "Jesus Saves",
    "Loving God",
    "Marriage",
  ]
  // const bookCategories = ["All Books", "Old Testament", "New Testament"]

  const handleClick = (category: string) => {
    setCategoryOpened(!categoryOpened)
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [category]: !prevOpenCategories[category],
    }))
  }

  const handleSeeAll = (category: string) => {
    saveCurrentCategory(category)
    console.log(category)
    navigate("/all_verses")
  }

  // const handleLearnBooks = (bookCategory: string) => {
  //   if (bookCategory === "All Books") {
  //     const booksToLearn = bookData.map((book) => book["title"])
  //     let booksObject = {
  //       id: bookCategory,
  //       category: "Bible",
  //       text: booksToLearn.join(" "),
  //     }
  //     saveCurrentCategory(bookCategory)
  //     saveSelectedVerse(booksObject)
  //     navigate("/stage1")
  //   }
  // }

  return (
    <>
      <div className="w-full text-2xl md:text-3xl lg:text-4xl font-Inter max-w-[1000px] mx-auto">
        <span>Categories</span>
        <h2 className=" text-sm md:text-base lg:text-lg text-white font-Inter pl-2 pb-2">
          {categoryOpened ? "Click a verse to start learning." : "Select a category to view verses."}
        </h2>
      </div>
      <div className="grid place-content-center gap-5 overscroll-auto pb-4">
        {verseCategories.map((category, index) => {
          const versesInCategory = verseData.filter((verse) => verse.category === category)

          return (
            <div
              key={index}
              className={`${openCategories[category] ? "bg-white" : "bg-[#4F4F4F]"} overflow-hidden rounded-lg h-fit`}
            >
              <button onClick={() => handleClick(category)} className={`w-full flex justify-between items-center p-4`}>
                <div
                  className={`h-full text-lg md:text-xl lg:text-2xl font-Inter text-start grid ${
                    openCategories[category] ? "text-black" : "text-white"
                  }`}
                >
                  <span>{category}</span>
                  <span className=" text-xs">{versesInCategory.length} Verses</span>
                </div>
                <motion.span
                  onClick={() => handleSeeAll(category)}
                  initial={false}
                  animate={{ opacity: openCategories[category] ? 1 : 0 }}
                  className={`md:text-xl lg:text-2xl text-black font-Inter flex justify-center items-center gap-2 ${
                    openCategories[category] ? "" : "pointer-events-none"
                  }`}
                >
                  {openCategories[category] ? (
                    <>
                      <span>See All</span>
                      <FaArrowRight className="text-sm" />
                    </>
                  ) : (
                    ""
                  )}
                </motion.span>
              </button>
              <FilteredVerses category={category} animate={openCategories[category]} />
            </div>
          )
        })}

        {/* <div className="text-3xl font-bold">Memorize the books!</div>
        {bookCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleLearnBooks(category)}
            className=" bg-black rounded-3xl p-3 flex justify-between items-center"
          >
            <span className="h-full text-3xl text-white">{category}</span>
          </button>
        ))} */}
      </div>
    </>
  )
}

export default Categories
