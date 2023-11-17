import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import React, { useState, useRef } from "react"
import { Button } from "../comps/Button"
import { PiNumberCircleTwoFill, PiNumberCircleThreeFill, PiArrowRight, PiCheckCircleFill } from "react-icons/pi"
import { FaXmark } from "react-icons/fa6"
const Stage2 = () => {
  const navigate = useNavigate()
  const { selectedVerse, translation, oneLetterMode, changeLearnMethods } = useVerseContext()

  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])

  const verseWordArray =
    selectedVerse?.translations[translation as keyof typeof selectedVerse.translations].split(" ") || []
  const cleanedUpVerseArray = verseWordArray.map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
  const totalWordsRef = useRef(cleanedUpVerseArray.length)
  const correctWords = correctArray.filter((correct) => correct === true).length
  const percentage = (correctWords / totalWordsRef.current) * 100

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
      // Do not allow another input after reaching the last word
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
    //remove the largest words to make the user have to remember them
    const replaceHiddenWords = (text: string) => {
      for (let i = 0; i < text.length; i++) {
        if (text.length >= 4) {
          return "_"
        } else {
          return text
        }
      }
    }
    if (correct === true) {
      return <span className="font-bold text-green-500">{text}</span>
    }

    if (correct === false) {
      return <span className="font-bold text-red-500">{text}</span>
    }

    if (active) {
      return <span className="font-bold text-yellow-500">{replaceHiddenWords(text)}</span>
    }
    return <span>{replaceHiddenWords(text)}</span>
  })

  const CompletionMessage = () => {
    const handleReset = () => {
      setActiveWordIndex(0)
      setUserInput("")
      setCorrectArray(Array(cleanedUpVerseArray.length).fill(null))
    }

    if (activeWordIndex === totalWordsRef.current - 1 && userInput === "Completed") {
      if (percentage >= 90) {
        return (
          <>
            <div className="absolute inset-0 w-full bg-[#444444] p-5 text-4xl text-white">
              <div className="grid place-content-center h-1/2 w-full gap-2">
                <div className="text-center">
                  <span>You got </span>
                  <span className="text-green-500">{percentage.toFixed(2)}</span>%,
                </div>
                <div className="text-center">Nice work!</div>
                <div className="flex w-full">
                  <Button variant={"glass2"} onClick={handleReset} className="text-center w-40 text-2xl">
                    Retry
                  </Button>
                  <Button onClick={() => navigate("/stage3")} variant={"glass3"} className="w-40 text-2xl">
                    Stage 3
                  </Button>
                </div>
              </div>
            </div>
          </>
        )
      } else {
        return (
          <>
            <div className="absolute inset-0 w-full bg-[#444444] p-5 text-4xl text-white">
              <div className="grid place-content-center h-1/2 w-full gap-2">
                <div className="text-center">
                  <span>You got </span>
                  <span className="text-red-500">{percentage.toFixed(2)}</span>%,
                </div>
                <div className="text-center">90% or better is needed.</div>
                <div className="flex w-full">
                  <Button variant={"glass2"} onClick={handleReset} className="text-center w-full text-2xl">
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          </>
        )
      }
    } else {
      return
    }
  }

  return (
    <>
      <div className="h-screen w-full grid p-4 lg:place-content-center bg-[#444444] text-white">
        <div className="max-w-[600px] h-fit  ">
          <div className="text-4xl flex justify-center items-center gap-8">
            <button onClick={() => navigate("/all_verses")} className="h-fit w-fit">
              <FaXmark />
            </button>
            <div className="flex items-center">
              <PiCheckCircleFill className="text-green-500" />
              <PiArrowRight className="text-2xl w-10" />
              <PiNumberCircleTwoFill className="text-yellow-500 animate-pulse" />
              <PiArrowRight className="text-2xl w-10" />
              <PiNumberCircleThreeFill className="text-red-500" />
            </div>
            <div className="text-center text-2xl w-fit">{`${percentage.toFixed(1)}%`}</div>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-2xl font-bold">{selectedVerse?.id}</span>
          </div>
          <div className="p-4">
            <div className="grid place-content-center gap-5">
              <div className="flex flex-wrap gap-1 text-xl">
                {verseWordArray?.map((word, index) => (
                  <Word key={index} text={word} active={index === activeWordIndex} correct={correctArray[index]} />
                ))}
              </div>

              <input
                className="w-full h-10 text-black text-xl "
                type="text"
                value={userInput}
                onChange={(e) => handleSwitch(e.target.value)}
                autoFocus={false}
              />
            </div>
            <div className="flex justify-center items-center font-bold pt-4">
              <Button
                variant={"glass3"}
                onClick={() => changeLearnMethods(!oneLetterMode)}
                className="w-fit p-2 border-2 border-white rounded-full bg-blueGray-300"
              >
                {oneLetterMode ? "1st Letter" : "Full Word"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CompletionMessage />
    </>
  )
}
export default Stage2
