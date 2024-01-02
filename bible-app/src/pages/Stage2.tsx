import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import React, { useState, useRef } from "react"
import HintMessage from "../comps/HintMessage"
import { motion } from "framer-motion"
import CompletionMessage from "../comps/Stages/CompletionMessage"
import LetterMode from "../comps/Stages/LetterMode"
import { FaArrowLeft } from "react-icons/fa"
import { FaRegCircleQuestion } from "react-icons/fa6"
import Copyright from "../comps/Copyright"
const Stage2 = () => {
  const stageDetails = {
    id: "Stage 2",
    goal: "If you get over 90% of the words correct, you will move on to the next stage. If you don't, you'll need to try again!",
    stagePercentage: 90,
    stageNavigate: "/stage3",
    nextStage: "Stage 3",
  }
  const navigate = useNavigate()
  const { selectedVerse, translation, oneLetterMode, changeLearnMethods, hintsOn } = useVerseContext()
  const [showInstructions, setShowInstructions] = useState(hintsOn)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])
  const verseId = selectedVerse?.id ?? ""
  const formattedVerseId = verseId.replace(/[:-]/g, " ").split(" ")
  const translationText = selectedVerse?.translations[translation as keyof typeof selectedVerse.translations] ?? ""
  const verseWordArray =
    verseId
      .replace(/[:-]/g, " ")
      .concat(" " + translationText)
      .split(" ") || []
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
      return
    }

    if (activeWordIndex === totalWordsRef.current - 1 && userInput === "Completed") {
      // Do not allow another input after reaching the last word
      return
    }
    if (value === " ") {
      // Ignore space character
      return
    }

    if (value.endsWith(" ")) {
      if (activeWordIndex === totalWordsRef.current - 1) {
        setUserInput("Completed")
        setShowCompletionMessage(true)
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

    if (value === " ") {
      // Ignore space character
      return
    }

    if (value.length === 1) {
      if (activeWordIndex === totalWordsRef.current - 1) {
        console.log("Finished")
        setUserInput("Completed")
        setShowCompletionMessage(true)
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
      return <span className=" text-green-500">{text}</span>
    }

    if (correct === false) {
      return <span className=" text-red-500">{text}</span>
    }

    if (active) {
      return <span className="font-bold text-yellow-500 animate-pulse">{replaceHiddenWords(text)}</span>
    }
    return <span>{replaceHiddenWords(text)}</span>
  })

  const handleReset = () => {
    setActiveWordIndex(0)
    setUserInput("")
    setCorrectArray(Array(cleanedUpVerseArray.length).fill(null))
    setShowCompletionMessage(false)
  }

  return (
    <>
      <div className="fixed inset-0 h-screen w-full p-4 bg-black text-white font-Inter">
        <div className="text-3xl md:text-4xl lg:text-5xl relative flex justify-between items-center gap-8">
          <button onClick={() => navigate("/stage1")} className="h-fit w-1/5">
            <FaArrowLeft />
          </button>

          <button onClick={() => setShowInstructions(!showInstructions)} className="">
            <FaRegCircleQuestion className="text-3xl" />
          </button>
        </div>
        <div className="py-4 max-w-2xl mx-auto">
          <span className="font-Inter text-sm">2 of 3</span>
          <div className="relative w-full bg-white h-4 rounded-full">
            <span className="absolute w-2/3 h-full bg-correct-1 rounded-full"></span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto text-2xl md:text-3xl lg:text-4xl pt-4">
          <div className="px-2">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: -50 },
              }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="grid gap-2 md:gap-4 lg:gap-8"
            >
              <div className="text-xl md:text-2xl lg:text-3xl py-4 w-full">
                {/* Title section for first 3 or 4 elements */}
                <div className="flex flex-wrap gap-1">
                  {verseWordArray?.slice(0, formattedVerseId.length).map((word, index) => (
                    <React.Fragment key={index}>
                      <Word text={word} active={index === activeWordIndex} correct={correctArray[index]} />

                      {index === (formattedVerseId.length === 5 ? 2 : 1) ? <span className="font-bold">:</span> : null}
                      {index === (formattedVerseId.length === 5 ? 3 : 2) && formattedVerseId.length > 3 ? (
                        <span className="font-bold">-</span>
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
                {/* Text section for the rest of the elements */}
                <div className="flex flex-wrap gap-x-2 text-sm md:text-lg lg:text-xl py-4">
                  {verseWordArray?.slice(formattedVerseId.length).map((word, index) => (
                    <Word
                      key={index + formattedVerseId.length} // Add 4 or 3 to differentiate keys
                      text={word}
                      active={index + formattedVerseId.length === activeWordIndex} // Adjust active index
                      correct={correctArray[index + formattedVerseId.length]} // Adjust correct index
                    />
                  ))}
                </div>
              </div>

              <input
                className="w-full p-4 h-10 lg:h-12 text-black bg-white text-base"
                type="text"
                placeholder={`${oneLetterMode ? "Type the 1st letter..." : "Type the full word..."}`}
                value={userInput}
                onChange={(e) => handleSwitch(e.target.value)}
                autoFocus={false}
              />
            </motion.div>
            {showCompletionMessage && (
              <CompletionMessage
                percentage={percentage}
                handleReset={handleReset}
                stageDetails={stageDetails}
                handleLearnVerse={() => null}
              />
            )}
            <LetterMode oneLetterMode={oneLetterMode} changeLearnMethods={changeLearnMethods} />

            <div className="absolute bottom-4 right-5 left-5 rounded-full">
              <Copyright />
            </div>
          </div>
        </div>
      </div>

      <HintMessage
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
        stageDetails={stageDetails}
      />
    </>
  )
}
export default Stage2
