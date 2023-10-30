import { useNavigate } from "react-router"
import { useVerseContext } from "../../utils/VerseContext"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useUserContext } from "../../utils/UserContext"
import { FaTrophy } from "react-icons/fa6"

interface Verse {
  id: string
  category: string
  text: string
}

// Create a separate component for filtered verses
const FilteredVerses = ({ verses, category, animate }: { verses: Verse[]; category: string; animate: boolean }) => {
  const navigate = useNavigate()
  const { saveSelectedVerse, getAllVerses, saveCurrentCategory } = useVerseContext()
  const { userLearnedVerses } = useUserContext()

  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    saveCurrentCategory(verse.category)
    navigate("/stage1")
  }

  useEffect(() => {
    getAllVerses()
  }, [])

  return (
    <motion.div
      initial={false}
      animate={animate ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, height: "0px" },
        show: { opacity: 1, height: "250px" },
      }}
      className={`flex overflow-auto gap-5`}
    >
      {verses
        .filter((verse: Verse) => verse.category === category.toLowerCase())
        .map((verse: Verse) => (
          <section key={verse.id} className="w-full h-full p-5 " onClick={() => handleClick(verse)}>
            <div className={`h-full w-60 md:w-80 lg:w-96 rounded-3xl p-3 md:lg:overflow-hidden bg-white`}>
              <div className="flex justify-center items-center">
                <h1 className="text-xl font-bold w-full ">{verse.id}</h1>

                {userLearnedVerses && userLearnedVerses.some((learnedVerse) => learnedVerse.id === verse.id) ? (
                  <FaTrophy className=" text-orange-500 text-2xl" />
                ) : (
                  ""
                )}
              </div>

              <div className="verseText text-xl">{verse.text}</div>
            </div>
          </section>
        ))}
    </motion.div>
  )
}

const Categories = () => {
  const navigate = useNavigate()
  const { verses, saveCurrentCategory } = useVerseContext()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const categories = ["salvation", "prayer", "praise", "faith", "love"]

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
  return (
    <>
      <div className="grid place-content-center gap-5 overscroll-auto">
        {categories.map((category, index) => (
          <div key={index} className="bg-black overflow-hidden rounded-3xl">
            <button
              onClick={() => handleClick(category)}
              className={`w-full flex justify-between items-center p-3 bg-black`}
            >
              <span className="h-full text-3xl text-white">{category}</span>
              <motion.span
                onClick={() => handleSeeAll(category)}
                initial={false}
                animate={{ opacity: openCategories[category] ? 1 : 0 }}
                transition={{ ease: "easeIn", duration: 0.3 }}
                className="text-xl text-white"
              >
                {openCategories[category] ? "See All" : ""}
              </motion.span>
            </button>
            <FilteredVerses verses={verses} category={category} animate={openCategories[category]} />
          </div>
        ))}
      </div>
    </>
  )
}

export default Categories
