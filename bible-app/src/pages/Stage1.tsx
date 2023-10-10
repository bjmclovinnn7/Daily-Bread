import { useVerseContext } from "../utils/VerseContext"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import { HiChevronLeft } from "react-icons/Hi"
import React, { useState, useRef } from "react"
import { Button } from "../comps/Button"

const Stage1 = () => {
  const navigate = useNavigate()
  const { selectedVerse } = useVerseContext()
  const [userInput, setUserInput] = useState("")

  const verseWordArray = selectedVerse?.text.split(" ") || []
  const cleanedUpVerseArray = verseWordArray.map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])
  const totalWordsRef = useRef(cleanedUpVerseArray.length)
  const correctWords = correctArray.filter((correct) => correct === true).length
  // const incorrectWords = correctArray.filter((correct) => correct === false).length
  const percentage = (correctWords / totalWordsRef.current) * 100
  const [oneLetterMode, setOneLetterMode] = useState(false)

  const handleSwitch = (value: string) => {
    if (!oneLetterMode) {
      processInput(value)
    } else {
      processInputOneWord(value)
    }
  }

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
        setActiveWordIndex((index) => index + 1) // Increment after updating correctArray
      }
      const inputWord = value.trim()
      const cleanedInputWord = inputWord.replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters

      setCorrectArray((prevCorrectArray) => {
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

  const processInputOneWord = (value: string) => {
    if (activeWordIndex >= totalWordsRef.current) {
      console.log("Finished")
      return
    }

    if (activeWordIndex === totalWordsRef.current - 1 && userInput === "Completed") {
      // Do not allow further input after reaching the last word
      return
    }

    if (value.length === 1) {
      if (activeWordIndex === totalWordsRef.current - 1) {
        console.log("Finished")
        setUserInput("Completed")
      } else {
        setUserInput("")
        setActiveWordIndex((index) => index + 1) // Increment after updating correctArray
      }
      const inputWord = value.trim()
      const cleanedInputWord = inputWord.replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters

      const firstLetterInput = cleanedInputWord[0].toLowerCase()
      const firstLetterVerse = cleanedUpVerseArray[activeWordIndex][0].toLowerCase()

      setCorrectArray((prevCorrectArray) => {
        const updatedCorrectArray = [...prevCorrectArray]
        updatedCorrectArray[activeWordIndex] = firstLetterInput === firstLetterVerse
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
      <div className="h-screen w-full grid bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60 p-10">
        <div className="max-w-[600px] h-fit  text-white">
          <motion.button
            onClick={() => navigate("/")}
            whileTap={{ scale: 1.05 }}
            className="absolute inset-0 h-fit w-fit"
          >
            <HiChevronLeft className=" text-6xl" />
          </motion.button>
          <h1 className="h-20 grid place-content-center text-3xl font-bold">Stage 1</h1>
          <div className="flex justify-center items-center gap-2">
            <span className="text-3xl font-bold">{selectedVerse?.id}</span>
          </div>
          <div className="p-3 space-y-10">
            <div className="grid place-content-center gap-5">
              <div className="flex flex-wrap gap-1 text-xl">
                {verseWordArray?.map((word, index) => (
                  <Word key={index} text={word} active={index === activeWordIndex} correct={correctArray[index]} />
                ))}
              </div>

              <input
                className="w-full h-10 text-black text-xl"
                type="text"
                value={userInput}
                onChange={(e) => handleSwitch(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center gap-4 font-bold">
              <Button
                variant={"glass3"}
                onClick={() => setOneLetterMode(!oneLetterMode)}
                className="w-fit p-2 border-2 border-white rounded-full bg-blueGray-300"
              >
                {oneLetterMode ? "1st Letter" : "Full Word"}
              </Button>
              <div className="text-center text-xl">{`Correct: ${percentage.toFixed(1)}%`}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Stage1
