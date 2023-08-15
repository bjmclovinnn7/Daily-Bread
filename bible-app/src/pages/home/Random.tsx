import { Card } from "../../comps/Card"
import { Button } from "../../comps/Button"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useVerseContext } from "../../utils/VerseContext"

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

  return (
    <>
      <Card size={"lg"} variant={"outline"} className="p-10">
        <div className="bg-black text-white w-fit text-center rounded-2xl font-bold text-4xl p-2">
          Random
        </div>
        <div className="w-full h-full rounded-2xl ">
          <div className="flex items-center justify-center text-3xl h-20 ">
            {verseData.name +
              " " +
              verseData.chapter +
              ":" +
              verseData.versecount}
          </div>
          <div className="flex items-center justify-center h-60 text-3xl">
            {verseData.verse}
          </div>
        </div>
        <div className="flex justify-between w-full h-fit">
          <Button
            size={"default"}
            variant={"outline"}
            whileHover={{ scale: 1.1 }}
          >
            <Link to="/learn">Learn Verse</Link>
          </Button>
          <Button
            size={"default"}
            variant={"outline"}
            onClick={getRandomVerse}
            whileHover={{ scale: 1.1 }}
          >
            New Verse
          </Button>
        </div>
      </Card>
    </>
  )
}

export default Random
