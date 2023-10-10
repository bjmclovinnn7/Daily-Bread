import { useVerseContext } from "../../utils/VerseContext"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { HiChevronLeft } from "react-icons/Hi"
import { useNavigate } from "react-router"

// Define a type or interface for your verse data
interface Verse {
  id: string
  category: string
  text: string
}

const AllVerses = () => {
  const { verses, saveSelectedVerse, currentCategory } = useVerseContext()
  const navigate = useNavigate()
  const [currentVerses, setCurrentVerses] = useState<Verse[]>([])

  useEffect(() => {
    // Filter the verses whenever currentCategory changes
    const filteredVerses = verses.filter((verse: Verse) => verse.category === currentCategory.toLowerCase())
    setCurrentVerses(filteredVerses)
  }, [])

  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }

  return (
    <div className="text-black h-[100vh] w-[100vw] bg-white">
      <motion.button onClick={() => navigate("/")} whileTap={{ scale: 1.05 }} className="absolute inset-0 h-fit w-fit">
        <HiChevronLeft className="text-6xl" />
      </motion.button>
      <h1 className="h-20 grid place-content-center text-3xl font-bold">{currentCategory}</h1>
      <div className="space-y-5 p-5">
        {currentVerses.map((verse: Verse) => (
          <motion.div
            whileTap={{ scale: 1.05 }}
            onClick={() => handleClick(verse)}
            key={verse.id}
            className="grid place-content-center border-2 p-2 rounded-2xl"
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
