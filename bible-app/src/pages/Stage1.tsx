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

const Stage1 = () => {
  const navigate = useNavigate()
  const { selectedVerse, translation, changeLearnMethods, oneLetterMode, hintsOn } = useVerseContext()
  const [showInstructions, setShowInstructions] = useState(hintsOn)
  const [userInput, setUserInput] = useState("")
  const [utterance, setUtterance] = useState(false)
  const verseWordArray =
    selectedVerse?.translations[translation as keyof typeof selectedVerse.translations].split(" ") || []

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

  const HintMessage = () => {
    if (showInstructions) {
      return (
        <div className="absolute inset-0 z-20 ">
          <div className="grid place-content-center h-full bg-black px-8 gap-4 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80">
            <div className="text-white font-header text-3xl">Stage 1:</div>
            <h1 className="text-white font-bold text-xl ">
              Stage 1 requires you to get every word correct. Simply click on the input field to get started.
            </h1>
            <h2 className="text-white font-bold text-xl ">There are two modes. Full word and first letter.</h2>
            <h2 className="text-white font-bold text-xl ">
              Full word requires you to type out the entire word. Don't worry about special characters. Just type the
              word and press space.{" "}
            </h2>
            <h2 className="text-white font-bold text-xl ">
              First letter only requires you to type the first letter of each word.
            </h2>
            <h2 className="text-white font-bold text-xl ">
              If you get enough words correct, you will move on to the next stage! If you don't, you'll need to try
              again! Good luck!
            </h2>

            <h2 className="font-bold text-xl text-orange-500">
              You can turn off instructions permanentaly in your profile settings.
            </h2>

            <button onClick={() => setShowInstructions(!showInstructions)} className="bg-white text-black rounded-2xl ">
              Dismiss
            </button>
          </div>
        </div>
      )
    } else
      return (
        <div>
          <h1>Turn on Insructions</h1>
        </div>
      )
  }

  return (
    <>
      <div className="h-screen w-full p-4  bg-[#444444] text-white">
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
        <div className="max-w-2xl mx-auto text-2xl md:text-3xl lg:text-4xl">
          <div className="flex justify-between items-center p-4 ">
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
            <div className="grid place-content-center gap-5">
              <div className="flex flex-wrap gap-2">
                {verseWordArray?.map((word, index) => (
                  <Word key={index} text={word} active={index === activeWordIndex} correct={correctArray[index]} />
                ))}
              </div>

              <input
                className="w-full h-10 text-black "
                type="text"
                placeholder={`${oneLetterMode ? "1st Letter" : "Full Word"}`}
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
            <button
              onClick={() =>
                setTimeout(() => {
                  setShowInstructions(!showInstructions)
                }, 300)
              }
              className=" absolute bottom-10 right-10 left-10 text-base rounded-full"
            >
              Show Instructions
            </button>
          </div>
        </div>
      </div>
      <CompletionMessage />
      <HintMessage />
    </>
  )
}
export default Stage1
