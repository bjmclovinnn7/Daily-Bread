import { useVerseContext } from "../../utils/VerseContext"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { HiChevronLeft } from "react-icons/Hi"
import { useNavigate } from "react-router"

// Define a type or interface for your verse data
interface Verse {
  id: string
  category: string
  text: string
}

const AllVerses = () => {
  const { verses, saveSelectedVerse, currentCategory, getAllVerses } = useVerseContext()
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
    <div className="text-white h-screen w-full bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60">
      <motion.button onClick={() => navigate("/")} whileTap={{ scale: 1.05 }} className="absolute inset-0 h-fit w-fit">
        <HiChevronLeft className="text-6xl" />
      </motion.button>
      <h1 className="h-20 grid place-content-center text-4xl font-header">{currentCategory.toLowerCase()}</h1>
      <div className="space-y-5 p-5 grid place-content-center">
        {filteredVerses.map((verse: Verse) => (
          <motion.div
            whileTap={{ scale: 1.05 }}
            onClick={() => handleClick(verse)}
            key={verse.id}
            className=" text-black  max-w-[600px] border-2 p-2 bg-white shadow-2xl rounded-3xl"
          >
            <h2 className="text-2xl font-bold">{verse.id}</h2>
            <p className="text-xl">{verse.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AllVerses
