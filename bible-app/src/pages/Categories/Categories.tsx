import { useNavigate } from "react-router"
import { useVerseContext } from "../../utils/VerseContext"
import { useState } from "react"
import { motion } from "framer-motion"
import { useUserContext } from "../../utils/UserContext"
import { FaTrophy } from "react-icons/fa6"
import verseData from "../../utils/Verses.json"
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
  const { saveSelectedVerse, saveCurrentCategory, translation } = useVerseContext()
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
      className={`flex overflow-auto gap-5 border-t-2 border-gray-500 md:lg:max-w-[1000px]`}
    >
      {verseData
        .filter((verse: SelectedVerse) => verse.category === category.toLowerCase())
        .map((verse: SelectedVerse, index) => (
          <section key={index} className="w-full h-full p-5" onClick={() => handleLearnClick(verse)}>
            <div
              className={`h-full w-60 md:w-80 lg:w-96 rounded-3xl p-3 md:lg:overflow-hidden bg-[#444444] shadow-lg shadow-black`}
            >
              <div className="flex justify-center items-center">
                <h1 className="text-xl font-bold w-full text-white">{verse.id}</h1>

                {userData.learnedVerses &&
                userData.learnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                  <FaTrophy className=" text-yellow-500 text-2xl" />
                ) : (
                  ""
                )}
              </div>

              <div className="verseText text-xl text-white">
                {verse.translations[translation as keyof typeof verse.translations]}
              </div>
            </div>
          </section>
        ))}
    </motion.div>
  )
}

const Categories = () => {
  const navigate = useNavigate()
  const { saveCurrentCategory } = useVerseContext()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const verseCategories = ["top 100", "salvation", "prayer", "praise", "faith", "love"]
  // const bookCategories = ["All Books", "Old Testament", "New Testament"]

  const handleClick = (category: string) => {
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
      <div className="grid place-content-center gap-5 overscroll-auto pb-4">
        {verseCategories.map((category, index) => (
          <div key={index} className="bg-white overflow-hidden rounded-3xl ">
            <button onClick={() => handleClick(category)} className={`w-full flex justify-between items-center p-3`}>
              <span className="h-full text-2xl md:text-3xl lg:text-4xl text-black font-header">{category}</span>
              <motion.span
                onClick={() => handleSeeAll(category)}
                initial={false}
                animate={{ opacity: openCategories[category] ? 1 : 0 }}
                transition={{ ease: "easeIn", duration: 0.3 }}
                className="text-xl md:text-2xl lg:text-3xl text-black font-header"
              >
                {openCategories[category] ? "See All" : ""}
              </motion.span>
            </button>
            <FilteredVerses category={category} animate={openCategories[category]} />
          </div>
        ))}

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
