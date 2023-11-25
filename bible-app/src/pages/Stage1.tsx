import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import React, { useState, useRef, useEffect } from "react"
import { Button } from "../comps/Button"
import {
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
  PiArrowRight,
  // PiPlayFill,
  // PiStopFill,
  // PiSpeakerSimpleNone,
  // PiSpeakerSimpleHigh,
} from "react-icons/pi"
import { FaXmark } from "react-icons/fa6"
import { motion } from "framer-motion"
import HintMessage from "../comps/HintMessage"

const Stage1 = () => {
  const stageDetails = {
    id: "Stage 1",
    goal: "If you get over 90% of the words correct, you will move on to the next stage. If you don't, you'll need to try again!",
  }
  const navigate = useNavigate()
  const { selectedVerse, translation, changeLearnMethods, oneLetterMode, hintsOn } = useVerseContext()
  const [showInstructions, setShowInstructions] = useState(hintsOn)
  const [userInput, setUserInput] = useState("")
  const [utterance, setUtterance] = useState(false)
  const formatString = (id: string) => {
    let idArr = id.split(" ")
    let formattedArr = []

    for (let x = 0; x < idArr.length; x++) {
      if (idArr[x].includes(":") || idArr[x].includes("-")) {
        let splitItems = idArr[x].split(/(:|-)/).filter((item: any) => item !== "") // Split by ':' or '-' and filter out empty strings
        formattedArr.push(...splitItems)
      } else {
        formattedArr.push(idArr[x])
      }
    }

    let finalArray = []
    let index = 0

    while (index < formattedArr.length) {
      let current = formattedArr[index]

      if (/^[a-zA-Z0-9]+$/.test(current)) {
        let combined = current

        while (index + 1 < formattedArr.length && !/^[a-zA-Z0-9]+$/.test(formattedArr[index + 1])) {
          combined += formattedArr[index + 1]
          index++
        }

        finalArray.push(combined)
      } else {
        finalArray.push(current)
      }

      index++
    }

    return finalArray.join(" ")
  }

  const verseWordArray =
    selectedVerse?.translations[translation as keyof typeof selectedVerse.translations]
      .concat(" " + formatString(selectedVerse?.id))
      .split(" ") || []

  const cleanedUpVerseArray = verseWordArray.map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])
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
      // Do not allow further input after reaching the last word
      return
    }
    if (value === " ") {
      // Ignore space character
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

    if (value === " ") {
      // Ignore space character
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
      return <span className="font-bold text-green-500">{text}</span>
    }

    if (correct === false) {
      return <span className="font-bold text-red-500">{text}</span>
    }

    if (active) {
      return <span className="font-bold text-yellow-500 animate-pulse">{text}</span>
    }
    return <span>{text}</span>
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
              <div className="grid place-content-center h-1/2 w-full gap-4">
                <div className="text-center">
                  <span>You got </span>
                  <span className="text-green-600">{percentage.toFixed(2)}</span>%,
                </div>
                <div className="text-center">Nice work!</div>
                <div className="flex w-full gap-4">
                  <Button variant={"glass2"} onClick={handleReset} className="text-center w-40 text-2xl">
                    Retry
                  </Button>
                  <Button onClick={() => navigate("/stage2")} variant={"glass3"} className="w-40 text-2xl">
                    Stage 2
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
              <div className="grid place-content-center h-1/2 w-full gap-4">
                <div className="text-center">
                  <span>You got </span>
                  <span className="text-red-500">{percentage.toFixed(2)}</span>%,
                </div>
                <div className="text-center">90% or better is needed.</div>
                <div className="flex w-full ">
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

  const textToSpeech = () => {
    const text = verseWordArray
    const synth = window.speechSynthesis

    if (text && synth) {
      const utterance = new SpeechSynthesisUtterance(text.toString())

      synth.speak(utterance)
      utterance.onend = () => {
        setUtterance(!utterance)
      }
    } else {
      alert("Something went wrong.")
    }
  }

  useEffect(() => {
    if (utterance) {
      textToSpeech()
    } else {
      window.speechSynthesis.cancel()
      setUtterance(false)
    }
  }, [utterance])

  return (
    <>
      <div className="fixed h-screen w-full p-4  bg-[#444444] text-white">
        <div className="text-3xl md:text-4xl lg:text-5xl relative flex justify-between items-center gap-8 ">
          <button onClick={() => navigate("/")} className="h-fit w-1/5">
            <FaXmark />
          </button>

          <div className="flex items-center justify-center w-3/5">
            <PiNumberCircleOneFill className="text-yellow-500 animate-pulse" />
            <PiArrowRight className=" w-10" />
            <PiNumberCircleTwoFill className="text-red-500" />
            <PiArrowRight className="w-10" />
            <PiNumberCircleThreeFill className="text-red-500" />
          </div>
          <div className="text-end h-fit w-1/5">{`${percentage.toFixed(1)}%`}</div>
        </div>
        <div className="max-w-2xl mx-auto text-2xl md:text-3xl lg:text-4xl pt-4">
          <div className="flex justify-between items-center px-2 md:py-4 lg:py-8">
            <span className="font-bold">{selectedVerse?.id}</span>
            {/* <button onClick={() => setUtterance(!utterance)} className="text-2xl">
              {utterance ? (
                <div className="flex items-center">
                  <PiSpeakerSimpleNone />
                  <PiStopFill className="text-red-500" />
                </div>
              ) : (
                <div className="flex items-center">
                  <PiSpeakerSimpleHigh />
                  <PiPlayFill className="text-green-500" />
                </div>
              )}
            </button> */}
          </div>
          <div className="px-2">
            <div className="grid place-content-center gap-2 md:gap-4 lg:gap-8">
              <div className="flex flex-wrap gap-x-2 text-lg md:text-2xl lg:text-3xl">
                {verseWordArray?.map((word, index) => (
                  <Word key={index} text={word} active={index === activeWordIndex} correct={correctArray[index]} />
                ))}
              </div>

              <input
                className="w-full h-8 lg:h-10 text-black "
                type="text"
                placeholder={`${oneLetterMode ? "1st Letter" : "Full Word"}`}
                value={userInput}
                onChange={(e) => handleSwitch(e.target.value)}
                autoFocus={false}
              />
            </div>
            <div className="p-2 flex justify-center items-center gap-4 text-xl">
              <span>1st Letter</span>
              <div
                className={`  flex  ${
                  oneLetterMode ? "justify-start " : "justify-end "
                }  p-2 rounded-full w-20 bg-[#696969]`}
                onClick={() => changeLearnMethods(!oneLetterMode)}
              >
                <motion.div
                  className={` ${
                    oneLetterMode ? "bg-gray-200" : "bg-gray-400"
                  } rounded-full text-black px-4 grid place-content-center w-1/2 h-8`}
                  layout
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
              </div>
              <span>Full Word</span>
            </div>

            <button
              onClick={() =>
                setTimeout(() => {
                  setShowInstructions(!showInstructions)
                }, 300)
              }
              className="absolute bottom-10 right-10 left-10 text-base rounded-full"
            >
              Show Instructions
            </button>
          </div>
        </div>
      </div>
      <CompletionMessage />
      <HintMessage
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
        stageDetails={stageDetails}
      />
    </>
  )
}
export default Stage1
