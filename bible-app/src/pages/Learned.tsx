import { useUserContext } from "../utils/UserContext"
// import { useVerseContext } from "../utils/VerseContext"
import { useNavigate } from "react-router"

const Learned = () => {
  const { userData } = useUserContext()
  // const { saveSelectedVerse } = useVerseContext()
  const navigate = useNavigate()

  // interface SelectedVerse {
  //   id: string
  //   category: string
  //   translation: {
  //     NIV: string
  //     KJV: string
  //     ESV: string
  //   }
  // }

  // const handleReview = (verseId: string) => {
  //   // Retrieve the selected verse data from local storage
  //   const verses: SelectedVerse[] = JSON.parse(localStorage.getItem("verses") || "[]")
  //   const selectedVerseData: SelectedVerse = verses.find((verse) => verse.id === verseId);

  //   if (selectedVerseData) {
  //     // Call the saveSelectedVerse function with the selected verse data
  //     saveSelectedVerse(selectedVerseData)
  //     navigate("/stage3")
  //   } else {
  //     console.error(`Verse with ID ${verseId} not found in local storage.`)
  //   }
  // }

  return (
    <>
      <div className="h-screen w-full">
        <div className="flex justify-center items-center p-4">
          <button onClick={() => navigate("/")} className="w-1/4 flex justify-center items-center">
            <span className="text-2xl">Home</span>
          </button>

          <div className="text-2xl text-center w-1/2">Learned</div>
          <button className="text-2xl w-1/4">Edit</button>
        </div>
        <div className="p-2">
          <div className="">
            <div className="p-2 grid w-full">
              {userData ? (
                <ul className="space-y-2">
                  {userData.learnedVerses.map((verse) => (
                    <button
                      // onClick={() => handleReview(verse.id)}
                      key={verse.id}
                      className="border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-2xl rounded-3xl p-2 text-start w-full"
                    >
                      <span className="block text-2xl font-bold">{verse.id}</span>
                      <span>Learned: {verse.learned ? "Yes" : "No"}</span>
                    </button>
                  ))}
                </ul>
              ) : (
                "You haven't learned any verses yet."
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Learned
