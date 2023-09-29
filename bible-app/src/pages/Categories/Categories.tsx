import { useNavigate } from "react-router"
import { useVerseContext } from "../../utils/VerseContext"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

// Define a type or interface for your verse data
interface Verse {
  id: string
  category: string
  text: string
}

// Create a separate component for filtered verses
const FilteredVerses = ({ verses, category, animate }: { verses: Verse[]; category: string; animate: boolean }) => {
  const navigate = useNavigate()
  const { saveSelectedVerse } = useVerseContext()
  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={animate ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0, height: "0px" },
          show: { opacity: 1, height: "250px" },
        }}
        className={`flex md:lg:block md:lg:overflow-hidden overflow-auto gap-5`}
      >
        {verses
          .filter((verse: Verse) => verse.category === category.toLowerCase())
          .map((verse: Verse) => (
            <section key={verse.id} className="w-full h-full p-5 " onClick={() => handleClick(verse)}>
              <div className="border-2 h-full w-[65vw] rounded-2xl p-3 md:lg:overflow-hidden bg-blueGray-200">
                <h1 className="text-xl w-full font-bold">{verse.id}</h1>
                <div className="verseText text-xl">{verse.text}</div>
              </div>
            </section>
          ))}
      </motion.div>
    </AnimatePresence>
  )
}

const Categories = () => {
  const navigate = useNavigate()
  const { verses } = useVerseContext()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const categories = ["Salvation", "Prayer", "Praise", "Faith", "Love"]

  const handleClick = (category: string) => {
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [category]: !prevOpenCategories[category],
    }))
  }

  return (
    <>
      <div className="grid place-content-center gap-5">
        {categories.map((category, index) => (
          <div key={index} className="bg-white overflow-hidden">
            <button
              onClick={() => handleClick(category)}
              className={`w-full flex justify-between items-center p-3 bg-black text-white`}
            >
              <span className="h-full text-2xl font-bold">{category}</span>
              <motion.span
                onClick={() => navigate(`/${category.toLowerCase()}`)}
                initial={false}
                animate={{ opacity: openCategories[category] ? 1 : 0 }}
                transition={{ ease: "easeIn", delay: 0.2 }}
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
