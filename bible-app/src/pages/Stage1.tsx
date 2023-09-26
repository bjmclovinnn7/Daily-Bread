import { useVerseContext } from "../utils/VerseContext"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import { HiChevronLeft } from "react-icons/Hi"
import React, { useEffect, useState, useCallback, useRef } from "react"
import PieChart from "../comps/PieChart"

const Stage1 = () => {
  const navigate = useNavigate()
  const { selectedVerse } = useVerseContext()
  const [userInput, setUserInput] = useState("")
  const verseWordArray = selectedVerse?.text.split(" ") || []
  const cleanedUpVerseArray = verseWordArray.map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctWordArray, setCorrectWordArray] = useState<boolean[]>([])
  const totalWordsRef = useRef(cleanedUpVerseArray.length)
  const correctWords = correctWordArray.filter((correct) => correct === true).length
  const incorrectWords = correctWordArray.filter((correct) => correct === false).length
  const percentage = (correctWords / totalWordsRef.current) * 100

  const processInput = (value: string) => {
    if (activeWordIndex >= totalWordsRef.current) {
      console.log("Finished")
      return
    }

    if (activeWordIndex === totalWordsRef.current - 1 && userInput === "Completed") {
      // Do not allow further input after reaching the last word
      return
    }

    if (value.endsWith(" ")) {
      if (activeWordIndex === totalWordsRef.current - 1) {
        console.log("Finished")
        setUserInput("Completed")
      } else {
        setUserInput("")
        setActiveWordIndex((index) => index + 1) // Increment after updating correctWordArray
      }
      const inputWord = value.trim()
      const cleanedInputWord = inputWord.replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters

      setCorrectWordArray((prevCorrectArray) => {
        const updatedCorrectArray = [...prevCorrectArray]
        updatedCorrectArray[activeWordIndex] =
          cleanedInputWord.toLowerCase() === cleanedUpVerseArray[activeWordIndex].toLowerCase()
        return updatedCorrectArray
      })
    } else {
      // Append characters to userInput while typing.
      setUserInput(value)
    }
  }

  interface Props {
    text: string
    active: boolean
    correct: any
  }

  const Word = React.memo(({ text, active, correct }: Props) => {
    if (correct === true) {
      return <span className="font-bold text-green-700">{text}</span>
    }

    if (correct === false) {
      return <span className="font-bold text-red-700">{text}</span>
    }

    if (active) {
      return <span className="font-bold text-yellow-400">{text}</span>
    }
    return <span>{text}</span>
  })

  return (
    <>
      <div className="h-[100vh] w-[100vw]">
        <motion.button
          onClick={() => navigate("/salvation")}
          whileTap={{ scale: 1.05 }}
          className="absolute inset-0 h-fit w-fit"
        >
          <HiChevronLeft className=" text-6xl" />
        </motion.button>
        <h1 className="h-20 grid place-content-center text-3xl font-bold">Stage 1</h1>
        <div className="p-5 space-y-10">
          <div className="grid place-content-center">
            <span className="text-3xl font-bold">{selectedVerse?.id}</span>
          </div>
          <div className="grid place-content-center gap-5">
            <div className="flex flex-wrap gap-1 text-2xl">
              {verseWordArray?.map((word, index) => (
                <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
              ))}
            </div>

            <input
              className="w-full border-2 rounded-3xl text-black text-xl"
              type="text"
              value={userInput}
              onChange={(e) => processInput(e.target.value)}
            />
          </div>
          <div className="grid place-content-center text-xl">{`Percentage Correct: ${percentage.toFixed(1)}%`}</div>
          <div className="grid place-content-center p-2"></div>
        </div>
      </div>
    </>
  )
}
export default Stage1
