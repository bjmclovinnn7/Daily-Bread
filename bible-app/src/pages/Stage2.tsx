import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import { HiChevronLeft } from "react-icons/Hi"
import React, { useState, useRef } from "react"
import { Button } from "../comps/Button"

const Stage2 = () => {
  const navigate = useNavigate()
  const { selectedVerse } = useVerseContext()

  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])
  const [oneLetterMode, setOneLetterMode] = useState(false)

  const verseWordArray = selectedVerse?.text.split(" ") || []
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
      return <span className="font-bold text-green-700">{text}</span>
    }

    if (correct === false) {
      return <span className="font-bold text-red-700">{text}</span>
    }

    if (active) {
      return <span className="font-bold text-yellow-400">{replaceHiddenWords(text)}</span>
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
            <div className="grid place-content-center absolute inset-0 h-screen w-full bg-white p-5 text-3xl gap-10">
              <div className="text-center">
                You got <span className="text-green-600">{percentage.toFixed(2)}</span>%{" "}
              </div>
              <div className="text-center">Nice work!</div>

              <Button onClick={() => navigate("/stage3")} variant={"glass3"} className="w-full text-2xl">
                Next Stage
              </Button>
              <Button variant={"glass2"} onClick={handleReset} className="text-center w-full text-2xl">
                Retry
              </Button>
            </div>
          </>
        )
      } else {
        return (
          <>
            <div className="grid place-content-center absolute inset-0 h-screen w-full bg-white p-5 text-3xl gap-10">
              <div className="text-center ">
                You got <span className="text-red-400">{percentage.toFixed(2)}</span>%{" "}
              </div>
              <div className="text-center font-bold">You need 90% or better to move on.</div>
              <Button variant={"glass2"} onClick={handleReset} className="text-center w-full text-2xl">
                Retry
              </Button>
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
      <div className="h-screen w-full grid p-10">
        <div className="max-w-[600px] h-fit  ">
          <button onClick={() => navigate("/all_verses")} className="absolute inset-0 h-fit w-fit">
            <HiChevronLeft className=" text-6xl" />
          </button>
          <h1 className="h-20 grid place-content-center text-4xl ">Stage 2</h1>
          <div className="flex justify-center items-center gap-2">
            <span className="text-3xl font-bold">{selectedVerse?.id}</span>
          </div>
          <div className="p-3 space-y-10">
            <div className="grid place-content-center gap-5">
              <div className="flex flex-wrap gap-1 text-2xl">
                {verseWordArray?.map((word, index) => (
                  <Word key={index} text={word} active={index === activeWordIndex} correct={correctArray[index]} />
                ))}
              </div>

              <input
                className="w-full h-10 text-black text-xl bg-slate-300"
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
        <div className="flex flex-wrap gap-1 text-xl">{}</div>
      </div>
      <CompletionMessage />
    </>
  )
}
export default Stage2
