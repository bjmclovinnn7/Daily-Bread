import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"
import React, { useState, useRef } from "react"
import { colRefUsers } from "../utils/firebase"
import { getDoc, updateDoc, doc } from "firebase/firestore"
import { useUserContext } from "../utils/UserContext"

import HintMessage from "../comps/HintMessage"
import { motion } from "framer-motion"
import CompletionMessage from "../comps/Stages/CompletionMessage"
import Stage3FinalCompletion from "../comps/Stage3FinalCompletion"
import LetterMode from "../comps/Stages/LetterMode"
import { FaArrowLeft } from "react-icons/fa"

import Copyright from "../comps/Copyright"
import { FaRegCircleQuestion } from "react-icons/fa6"

const Stage3 = () => {
  const navigate = useNavigate()
  const { selectedVerse, translation, changeLearnMethods, oneLetterMode, hintsOn } = useVerseContext()
  const [showInstructions, setShowInstructions] = useState(hintsOn)
  const [showCompletionMessage, setShowCompletionMessage] = useState(false)
  const [showFinalCompletionMessage, setShowFinalCompletionMessage] = useState(false)
  const [userExperience, setUserExperience] = useState(0)
  const { userData } = useUserContext()
  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [correctArray, setCorrectArray] = useState<boolean[]>([])

  const handleNavigate = () => {
    window.history.go(-1)
  }

  const stageDetails = {
    id: "Stage 3",
    goal: "If you get all of the words correct, you will get your mastery trophy! If you don't, you'll need totry again. You got this!",
    stagePercentage: 100,
    stageNavigate: "/",
    nextStage: "Home",
  }
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
    const userRef = doc(colRefUsers, userId)

    try {
      if (selectedVerse) {
        // Retrieve the user's document
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          // Get the existing user data
          const userData = userDoc.data()

          // Check if userData has a learnedVerses array; if not, create an empty array
          const learnedVerses = userData?.learnedVerses || []

          // Check if the verse is already in the array
          const verseExistsIndex = learnedVerses.findIndex((verse: UserLearnedVerses) => verse.id === selectedVerse?.id)

          if (verseExistsIndex === -1) {
            // Verse doesn't exist in learnedVerses array

            // Add the new verse to the learnedVerses array
            setShowFinalCompletionMessage(true)

            learnedVerses.push({
              id: selectedVerse?.id,
              learned: true,
              translation: translation,
              timeStamp: new Date(),
              category: selectedVerse?.category,
            })

            const updatedExperience = userData?.experience || 0
            const newExperience = updatedExperience + 10
            setUserExperience(10)

            // Update the user's experience
            await updateDoc(userRef, {
              learnedVerses,
              experience: newExperience,
            })

            setTimeout(() => navigate("/"), 5000)
          } else {
            // Verse exists in learnedVerses array
            const existingVerse = learnedVerses[verseExistsIndex]

            interface timeStamp {
              seconds: number
              nanoseconds: number
            }
            // Check if the existing verse's timeStamp is today
            const handleTimeStamp = (timeStamp: timeStamp) => {
              const oldDate = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)

              const oldReadableDate = oldDate.toLocaleDateString()

              const newDate = new Date().toLocaleDateString()

              if (newDate === oldReadableDate) {
                return true
              } else {
                return false
              }
            }

            const today = new Date()

            if (handleTimeStamp(existingVerse.timeStamp)) {
              console.log("Verse has already been reviewed today.")
              setUserExperience(0)
              setShowFinalCompletionMessage(true)

              setTimeout(() => navigate("/"), 5000)
              return
            } else {
              // Update the user's experience with +1 for re-learning an already known verse
              const updatedExperience = userData?.experience || 0
              const newExperience = updatedExperience + 1

              setUserExperience(1)
              setShowFinalCompletionMessage(true)

              // Update the existing verse's timeStamp to the current date
              existingVerse.timeStamp = today

              // Update the user's document with the modified learnedVerses array
              await updateDoc(userRef, {
                learnedVerses,
                experience: newExperience,
              })

              setTimeout(() => navigate("/"), 5000)
            }
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
        if (text.length >= 0) {
          return "?"
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
    setShowFinalCompletionMessage(false)
  }

  return (
    <>
      <div className="fixed inset-0 h-screen w-full p-4 bg-black text-white font-Inter">
        <div className="text-3xl md:text-4xl lg:text-5xl relative flex justify-between items-center gap-8">
          <button onClick={() => handleNavigate()} className="h-fit w-1/5">
            <FaArrowLeft />
          </button>
          <button onClick={() => setShowInstructions(!showInstructions)} className="">
            <FaRegCircleQuestion className="text-3xl" />
          </button>
        </div>
        <div className="py-4 max-w-2xl mx-auto">
          <span className="font-Inter text-sm">1 of 3</span>
          <div className="relative w-full bg-white h-4 rounded-full">
            <span className="absolute w-1/3 h-full bg-correct-1 rounded-full"></span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto text-2xl md:text-3xl lg:text-4xl ">
          <div>
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
                handleLearnVerse={handleLearnVerse}
              />
            )}
            <LetterMode oneLetterMode={oneLetterMode} changeLearnMethods={changeLearnMethods} />
            <div className="absolute bottom-4 right-5 left-5 rounded-full">
              <Copyright />
            </div>
          </div>
        </div>
      </div>
      {showFinalCompletionMessage && <Stage3FinalCompletion userExperience={userExperience} />}

      <HintMessage
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
        stageDetails={stageDetails}
      />
    </>
  )
}
export default Stage3
