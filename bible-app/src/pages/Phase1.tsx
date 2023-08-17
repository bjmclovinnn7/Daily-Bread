import React, { useState, useEffect, useRef } from "react"
import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { Link } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"

const Phase1 = () => {
  const { verseData } = useVerseContext()
  const verseArray = verseData.verse.split(" ")
  const [count, setCount] = useState(0)
  const [word, setWord] = useState(verseArray[count])

  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(verseArray.length).fill(null)
  )

  const handleLetterCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.id)
    const inputRef = inputRefs.current[index]

    if (inputRef && inputRef.value === word.slice(0, inputRef.value.length)) {
      console.log("Good job!")
      setCount(count + 1)
      setWord(verseArray[count])
      console.log(count)
      console.log(word)
    }
  }

  return (
    <>
      <div className="p-5">
        <Card size={"lg"} variant={"default"} className="p-10">
          <div className="bg-black text-white w-fit text-center rounded-2xl font-bold text-4xl p-2">
            Phase 1
          </div>

          <div className="flex items-center justify-center h-60 text-3xl">
            {verseData.verse}
          </div>
          <div className="h-20 w-full bg-white flex justify-center gap-2 text-xl">
            {verseArray.map((word, index) => (
              <div key={index} className="flex justify-center items-center">
                <input
                  className="bg-red-300 w-2"
                  id={`${index}`}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleLetterCheck(e)}
                ></input>
                {word.slice(1)}
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full h-fit">
            <Button
              size={"default"}
              variant={"glass"}
              whileHover={{ scale: 1.1 }}
            >
              <Link to="/random">Go Back</Link>
            </Button>
            <Button
              size={"default"}
              variant={"glass"}
              whileHover={{ scale: 1.1 }}
            >
              Phase 2
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Phase1
