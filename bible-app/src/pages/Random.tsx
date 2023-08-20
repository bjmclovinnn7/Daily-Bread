import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"

const baseURL = "http://localhost:8080/random"

const Random = () => {
  const { verseData, setVerseData } = useVerseContext() // Use the verse context

  function getRandomVerse() {
    axios
      .get(baseURL)
      .then((response) => {
        setVerseData({
          name: response.data.name,
          chapter: response.data.chapter,
          versecount: response.data.versecount,
          verse: response.data.verse,
        })
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    getRandomVerse()
  }, [])

  return (
    <>
      <div className="p-4 h-[100vh]">
        <Card size={"lg"} variant={"glass1"} className="">
          <div className=" text-white text-center rounded-2xl font-bold text-4xl">
            Random
          </div>
          <div className="h-[70vh] rounded-2xl space-y-5 bg-scarlet-100 p-2 text-white">
            <div className="text-center text-3xl font-bold">
              {verseData.name +
                " " +
                verseData.chapter +
                ":" +
                verseData.versecount}
            </div>
            <div className="text-start text-3xl">{verseData.verse}</div>
          </div>
          <div className="flex justify-between w-full h-fit">
            <Button
              size={"default"}
              variant={"outline1"}
              whileHover={{ scale: 1.1 }}
            >
              <Link to="/learn">Learn Verse</Link>
            </Button>
            <Button
              size={"default"}
              variant={"outline1"}
              onClick={getRandomVerse}
              whileHover={{ scale: 1.1 }}
            >
              New Verse
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Random
