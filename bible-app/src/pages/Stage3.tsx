import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import React, { useState, useRef } from "react"
import { Button } from "../comps/Button"
import { colRefUsers } from "../utils/firebase"
import { getDoc, updateDoc, doc } from "firebase/firestore"
import { useUserContext } from "../utils/UserContext"
import { FaTrophy } from "react-icons/fa"
import { PiNumberCircleThreeFill, PiArrowRight, PiCheckCircleFill } from "react-icons/pi"
import { FaXmark } from "react-icons/fa6"
import HintMessage from "../comps/HintMessage"
import { motion } from "framer-motion"

const Stage3 = () => {
  const stageDetails = {
    id: "Stage 3",
    goal: "If you get all of the words correct, you will get your mastery trophy! If you don't, you'll need totry again. You got this!",
  }
  const navigate = useNavigate()
  const { selectedVerse, translation, changeLearnMethods, oneLetterMode, hintsOn } = useVerseContext()
  const [showInstructions, setShowInstructions] = useState(hintsOn)
  const { userData } = useUserContext()
  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])
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

  interface UserLearnedVerses {
    id: string
    translation: string
    learned: boolean
    timeStamp: string
    category: string
  }

  const handleLearnVerse = async () => {
    console.log("Creating learnedVerse Doc")
    const userId = userData?.uid
    const userLearnedVersesRef = doc(colRefUsers, userId)

    try {
      if (selectedVerse) {
        // Retrieve the user's document
        const userDoc = await getDoc(userLearnedVersesRef)

        if (userDoc.exists()) {
          // Get the existing user data
          const userData = userDoc.data()

          // Check if userData has a learnedVerses array; if not, create an empty array
          const learnedVerses = userData?.learnedVerses || []

          // Check if the verse is already in the array
          const verseExists = learnedVerses.some((verse: UserLearnedVerses) => verse.id === selectedVerse?.id)

          if (!verseExists) {
            // Add the new verse to the learnedVerses array
            learnedVerses.push({
              id: selectedVerse?.id,
              learned: true,
              translation: translation,
              timeStamp: new Date(),
              category: selectedVerse?.category,
            })

            // Update the user's document with the modified learnedVerses array
            await updateDoc(userLearnedVersesRef, {
              learnedVerses,
            })

            console.log("Selected verse saved successfully.")
            navigate("/")
          } else {
            console.log("Verse is already learned.")
            navigate("/")
          }
        } else {
          console.log("User document does not exist.")
          navigate("/")
        }
      } else {
        console.log("No selected verse to learn.")
        navigate("/")
      }
    } catch (error) {
      console.error("Error saving or updating the selected verse:", error)
      navigate("/")
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
    //remove the largest words to make the user have to remember them
    const replaceHiddenWords = (text: string) => {
      for (let i = 0; i < text.length; i++) {
        if (text.length >= 0) {
          return "?"
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
      return <span className="font-bold text-yellow-500 animate-pulse">{replaceHiddenWords(text)}</span>
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
      if (percentage >= 100) {
        return (
          <>
            <div className="absolute inset-0 h-screen w-full bg-[#444444] p-5 text-white text-4xl">
              <div className="grid place-content-center h-1/2 w-full gap-4">
                <div className="text-center text-3xl">
                  You got <span className="text-green-500">{percentage.toFixed(2)}</span>%{" "}
                </div>
                <div className="text-center text-2xl">
                  Nice work! You've achieved mastery of <span className="font-bold">{selectedVerse?.id}</span>.
                </div>
                <div className="grid place-content-center p-6">
                  <div className="flex justify-center items-center gap-4">
                    <span className="text-5xl font-bold">+1</span>
                    <FaTrophy className="text-yellow-500 h-12 w-12" />
                  </div>
                </div>

                <Button onClick={() => handleLearnVerse()} variant={"glass3"} className="w-full text-2xl">
                  Home
                </Button>
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
                <div className="text-center">You need 100% for mastery!</div>
                <div className="flex w-full gap-4">
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
      <div className="fixed h-screen w-full p-4  bg-[#444444] text-white">
        <div className="text-3xl md:text-4xl lg:text-5xl relative flex justify-between items-center gap-8">
          <button onClick={() => navigate("/all_verses")} className="h-fit w-1/5">
            <FaXmark />
          </button>
          <div className="flex items-center justify-center w-3/5">
            <PiCheckCircleFill className="text-green-500" />
            <PiArrowRight className="text-2xl w-10" />
            <PiCheckCircleFill className="text-green-500 " />
            <PiArrowRight className="text-2xl w-10" />
            <PiNumberCircleThreeFill className="text-yellow-500 animate-pulse" />
          </div>
          <div className="text-end h-fit w-1/5">{`${percentage.toFixed(1)}%`}</div>
        </div>
        <div className="max-w-2xl mx-auto text-2xl md:text-3xl lg:text-4xl pt-4">
          <div className="flex justify-between items-center px-2 md:py-4 lg:py-8">
            <span className="font-bold">{selectedVerse?.id}</span>
          </div>
          <div className="px-2">
            <div className="grid gap-2 md:gap-4 lg:gap-8">
              <div className="flex flex-wrap justify-center gap-x-2 text-lg md:text-2xl lg:text-3xl">
                {verseWordArray?.map((word, index) => (
                  <Word key={index} text={word} active={index === activeWordIndex} correct={correctArray[index]} />
                ))}
              </div>

              <input
                className="w-full h-8 lg:h-10 text-black text-xl"
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
              className=" absolute bottom-10 right-10 left-10 text-base rounded-full"
            >
              Show Instructions
            </button>
          </div>
        </div>
      </div>
      <HintMessage
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
        stageDetails={stageDetails}
      />
      <CompletionMessage />
    </>
  )
}
export default Stage3
