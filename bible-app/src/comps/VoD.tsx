import verseData from "../utils/Verses.json"
import { useVerseContext } from "../utils/VerseContext"
import { useState } from "react"
import { FaExpandAlt, FaHeart, FaReadme, FaShare } from "react-icons/fa"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"

interface Vod {
  id: string
  category: string
  translations: {
    NIV: string
    ESV: string
    KJV: string
    NKJV: string
  }
}

interface Props {
  vodIsExpanded: boolean
  setVodIsExpanded: (item: boolean) => void
}

const VoD = ({ vodIsExpanded }: Props) => {
  const navigate = useNavigate()
  const [heartColor, setHeartColor] = useState(() => {
    const saved = localStorage.getItem("heartColor")
    const initialValue = saved ? JSON.parse(saved) : false
    return initialValue
  })

  const { translation, saveSelectedVerse } = useVerseContext()

  function getDayInfo() {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1) // January 1st of the current year
    const millisecondsInDay = 24 * 60 * 60 * 1000 // Number of milliseconds in a day

    // Calculate the difference in milliseconds between today and January 1st
    const differenceInMilliseconds = today.getTime() - startOfYear.getTime()

    // Calculate the day number (add 1 because January 1st should be day 1)
    const dayNumber = Math.floor(differenceInMilliseconds / millisecondsInDay) + 1

    return dayNumber
  }

  const verseOfTheDay: Vod | undefined = verseData[getDayInfo()] //userData.lastLog.number to get today's Vod
  const verseOTD = verseOfTheDay //translations[translation as keyof typeof verseOfTheDay.translations]

  // const handleShareClick = async () => {
  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: "Your Page Title",
  //         text: "Check out this page!",
  //         url: window.location.href,
  //       })
  //       console.log("Successful share")
  //     } else {
  //       // Fallback code if Web Share API is not supported
  //       alert("Sharing is not supported on this device/browser.")
  //     }
  //   } catch (error) {
  //     console.error("Error sharing:", error)
  //   }
  // }

  const copyVerseToClipboard = () => {
    const verseText = `${verseOTD.id}\n${verseOTD.translations[translation as keyof typeof verseOTD.translations]}`
    const pageLink = window.location.href
    const textToCopy = `${verseText}\n${pageLink}`

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Verse and link copied to clipboard:", textToCopy)
        alert("Verse and link copied to clipboard!")
      })
      .catch((error) => {
        console.error("Error copying verse and link to clipboard:", error)
        alert("Failed to copy verse and link to clipboard. Please try again.")
      })
  }

  // Inside your component...
  ;<motion.button whileTap={{ scale: 1.4 }} onClick={copyVerseToClipboard} className="w-fit grid place-content-center">
    Copy Verse and Link
  </motion.button>

  const handleClick = (verse: Vod) => {
    saveSelectedVerse(verse)
    navigate("/stage1")
  }
  const handleHeartColor = () => {
    const updatedHeartColor = !heartColor
    setHeartColor(updatedHeartColor)
    localStorage.setItem("heartColor", JSON.stringify(updatedHeartColor))
  }

  return (
    <motion.div
      className={` ${
        vodIsExpanded ? "absolute inset-0" : "font-Inter rounded-xl p-4 max-w-2xl mx-auto my-8"
      }  bg-[#5c5c5c] z-40 grid place-content-center `}
    >
      <span className="container w-full flex justify-between items-center font-Inter">
        <span className="text-xs">Verse of the day</span>
      </span>
      <div className="rounded-lg grid place-content-center gap-6">
        <span className="text-lg">{verseOTD.id}</span>
        <p>{verseOTD.translations[translation as keyof typeof verseOTD.translations]}</p>
        <div className="flex justify-between mx-8">
          <motion.button
            onClick={() => handleClick(verseOTD)}
            whileTap={{ scale: 1.4 }}
            className="w-fit text-center text-2xl"
          >
            <FaReadme />{" "}
          </motion.button>
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={() => handleHeartColor()}
            className={`w-fit grid place-content-center`}
          >
            <FaHeart className={`${heartColor ? "text-red-500" : ""} text-2xl`} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={copyVerseToClipboard}
            className="w-fit grid place-content-center"
          >
            <FaShare className="text-2xl" />
          </motion.button>
          <motion.button whileTap={{ scale: 1.4 }} className="w-fit grid place-content-center">
            <FaExpandAlt className={`text-2xl ${vodIsExpanded ? "" : ""}rotate-90`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default VoD
