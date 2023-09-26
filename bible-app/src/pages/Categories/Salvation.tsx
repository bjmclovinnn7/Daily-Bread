import { useVerseContext } from "../../utils/VerseContext"
import { motion } from "framer-motion"
import { HiChevronLeft } from "react-icons/Hi"
import { useNavigate } from "react-router"
// Define a type or interface for your verse data
interface Verse {
  id: string
  category: string
  text: string
}

const SalvationVerses = () => {
  const { verses, saveSelectedVerse } = useVerseContext()
  const navigate = useNavigate()
  // Filter the verses to include only those in the "Salvation" category
  const salvationVerses = verses.filter(
    (verse: Verse) => verse.category === "salvation"
  )

  const handleClick = (verse: Verse) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }

  return (
    <div className="text-black h-[100vh] w-[100vw] bg-white">
      <motion.button
        onClick={() => navigate("/")}
        whileTap={{ scale: 1.05 }}
        className="absolute inset-0 h-fit w-fit"
      >
        <HiChevronLeft className=" text-6xl" />
      </motion.button>
      <h1 className="h-20 grid place-content-center text-3xl font-bold">
        Salvation Verses
      </h1>
      <div className="space-y-5 p-5">
        {salvationVerses.map((verse: Verse) => (
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

export default SalvationVerses
