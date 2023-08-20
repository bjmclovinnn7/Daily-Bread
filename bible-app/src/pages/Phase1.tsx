import React, { useState, useEffect, useRef } from "react"
import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { Link } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"
import PieChart from "../comps/PieChart"
import { cn } from "../utils/utils"

const Phase1 = () => {
  const { verseData } = useVerseContext()
  const verseArray = verseData.verse.split(" ")
  const [count, setCount] = useState(0)
  const answerKey = verseArray.map((word) => word[0])
  const [incorrect, setIncorrect] = useState(0)
  const [correct, setCorrect] = useState(0)
  const wrongRef = useRef(0)
  const rightRef = useRef(0)

  // Define a state variable to manage the background color for each input
  const [inputBackground, setInputBackground] = useState<string[]>(
    Array(verseArray.length).fill("bg-white")
  )

  // Define the type for inputRefs using React.RefObject
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  for (let i = 0; i < verseArray.length; i++) {
    inputRefs.current[i] = null // Initialize as null
  }

  useEffect(() => {
    // Focus on the first input element when the component loads
    inputRefs.current[0]?.focus()
  }, [])

  const handleLetterCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputValue = e.target.value
    const currentAnswer = answerKey[index]

    const newBackground = [...inputBackground] // Create a copy of the background state array

    if (inputValue === currentAnswer) {
      newBackground[index] = "bg-green"
      setCorrect(correct + 1)
      rightRef.current++

      // If there are more words to check, move to the next input
      if (index < verseArray.length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // Update the count
      setCount(count + 1)

      console.log("Correct!")
      console.log(`You've gotten ${rightRef.current} right so far!`)
    } else if (inputValue !== "" && inputValue !== currentAnswer) {
      newBackground[index] = "bg-red-500"
      console.log("Incorrect...")
      setIncorrect(incorrect + 1)
      wrongRef.current++
      console.log(`You've gotten ${wrongRef.current} wrong so far!`)
    }

    setInputBackground(newBackground) // Update the background color array
  }

  // Define a custom component to display when the user finishes
  const CompletionMessage = () => {
    const percentage = Math.floor(((correct - incorrect) / correct) * 100)
    const completionData = {
      labels: ["Correct", "Incoorect"],
      datasets: [
        {
          data: [correct, incorrect],
          backgroundColor: ["rgb(54, 210, 75", "rgb(225, 82, 82)"],
        },
      ],
    }

    let redo = `You got ${percentage}%! Please try again!`

    let success = `Congrats on finishing Phase One with ${percentage}%`

    return (
      <div className="absolute p-3 inset-0">
        <Card size={"lg"} variant={"default"} className="relative ">
          <div className="text-center text-3xl lg:text-6xl font-bold text-white">
            {percentage > 80 ? success : redo}
          </div>

          <div className="lg:grid lg:grid-cols-2 w-full h-full">
            <div className="grid place-content-center space-y-32">
              some stuff here
            </div>
            <div className="">
              <div className="relative h-full w-full">
                <PieChart chartData={completionData} />
              </div>
              <Button
                size={"md"}
                variant={"glass1"}
                className="w-full"
                whileHover={{ scale: 1.1 }}
              >
                <Link to="/random">Go Back</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="h-[100vh] w-full p-5">
        <Card size={"lg"} variant={"default"} className="h-full">
          <div className="text-white rounded-2xl font-bold text-4xl">
            Phase 1
          </div>

          <div className="flex flex-wrap justify-center items-center h-60 text-2xl">
            {verseData.verse}
          </div>
          <div className="w-full flex flex-wrap gap-1 text-2xl">
            {verseArray.map((word, index) => (
              <div key={index} className="flex justify-center items-center">
                <input
                  className={cn(`${inputBackground[index]} w-6 h-6`)}
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)} // Assign the ref
                  onChange={(e) => handleLetterCheck(e, index)} // Pass the index
                ></input>
                {word.slice(1)}
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full h-fit">
            <Button
              size={"default"}
              variant={"glass3"}
              whileHover={{ scale: 1.1 }}
            >
              <Link to="/random">Go Back</Link>
            </Button>
            <Button
              size={"default"}
              variant={"glass3"}
              whileHover={{ scale: 1.1 }}
            >
              Phase 2
            </Button>
          </div>
        </Card>
      </div>

      {/* Conditionally render the completion message */}
      {count === verseArray.length && <CompletionMessage />}
    </>
  )
}

export default Phase1
