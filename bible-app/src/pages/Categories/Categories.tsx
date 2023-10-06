import { useNavigate } from "react-router"
import { useVerseContext } from "../../utils/VerseContext"
import { useState } from "react"
import { motion } from "framer-motion"

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
    <motion.div
      initial={false}
      animate={animate ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, height: "0px" },
        show: { opacity: 1, height: "250px" },
      }}
      className={`flex overflow-auto gap-5 border-t-2`}
    >
      {verses
        .filter((verse: Verse) => verse.category === category.toLowerCase())
        .map((verse: Verse) => (
          <section key={verse.id} className="w-full h-full p-5 " onClick={() => handleClick(verse)}>
            <div className=" h-full w-60 md:w-80 lg:w-96 rounded-3xl p-3 md:lg:overflow-hidden bg-white">
              <h1 className="text-lg w-full font-header">{verse.id}</h1>
              <div className="verseText text-xl">{verse.text}</div>
            </div>
          </section>
        ))}
    </motion.div>
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
      <div className="grid place-content-center gap-5 overscroll-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-2xl rounded-3xl"
          >
            <button onClick={() => handleClick(category)} className={`w-full flex justify-between items-center p-3`}>
              <span className="h-full text-3xl font-header text-white">{category}</span>
              <motion.span
                onClick={() => navigate(`/${category.toLowerCase()}`)}
                initial={false}
                animate={{ opacity: openCategories[category] ? 1 : 0 }}
                transition={{ ease: "easeIn", duration: 0.3 }}
                className="text-xl font-header text-black"
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
