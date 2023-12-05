import { motion, AnimatePresence } from "framer-motion"
import { useVerseContext } from "../utils/VerseContext"
import { useUserContext } from "../utils/UserContext"
import verseData from "../utils/Verses.json"
import { useNavigate } from "react-router"
import { FaCheck, FaHeart, FaTrash } from "react-icons/fa"
import { FaCircleInfo, FaXmark } from "react-icons/fa6"
import { useState } from "react"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

interface UserLearnedVerses {
  id: string
  translation: string
  learned: boolean
  category: string
  timeStamp: {
    seconds: number
    nanoseconds: number
  }
}

interface UserData {
  uid: string
  email: string
  displayName: string
  createdOn: {
    seconds: number
    nanoseconds: number
  }
  learnedVerses: UserLearnedVerses[]
  friends: UserData[]
  experience: number
}

const LearnedVerseCard = ({ open, setOpen }: Props) => {
  const { saveSelectedVerse, saveCurrentCategory, selectedVerse } = useVerseContext()
  const { userData, userFriends, saveSelectedFriend, getUpdatedFriendData } = useUserContext()
  const [showInfoMessage, setShowInfoMessage] = useState(false)
  const navigate = useNavigate()

  const handleDone = () => {
    setShowInfoMessage(false)
    setOpen(!open)
  }

  const handleNavigateToFriend = (friendData: UserData) => {
    console.log(friendData.displayName)
    saveSelectedFriend(friendData)
    getUpdatedFriendData(friendData)
    navigate("/friendProfile")
  }

  interface timeStamp {
    seconds: number
    nanoseconds: number
  }

  const handleTimeStamp = (timeStamp: timeStamp) => {
    if (timeStamp) {
      const date = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)
      const readableDate = date.toLocaleDateString()
      return readableDate
    } else {
      return "No Date."
    }
  }

  const friendLearnedVerse = userFriends.filter((friend) =>
    friend.learnedVerses.some((verse) => verse.id === selectedVerse?.id && verse.learned === true)
  )

  function getDate14DaysAfter(timeStamp: timeStamp) {
    // Extract seconds and nanoseconds from the provided object
    const { seconds, nanoseconds } = timeStamp
    // Convert seconds to milliseconds and add nanoseconds converted to milliseconds
    const milliseconds = seconds * 1000 + nanoseconds / 1e6
    // Create a new Date object with the given milliseconds
    const givenDate = new Date(milliseconds)
    // Calculate 14 days in milliseconds
    const fourteenDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000
    // Add 14 days to the given date
    const date14DaysAfter = new Date(givenDate.getTime() + fourteenDaysInMilliseconds)
    // Get day, month, and year from the date
    const day = date14DaysAfter.getDate()
    const month = date14DaysAfter.getMonth() + 1 // Months are zero-indexed, so add 1
    const year = date14DaysAfter.getFullYear()
    // Format the date to DD/MM/YYYY
    const formattedDate = `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`

    return formattedDate
  }

  function getDaysUntilDate30DaysAfter(timeStamp: timeStamp) {
    // Extract seconds and nanoseconds from the provided object
    const { seconds, nanoseconds } = timeStamp
    // Convert seconds to milliseconds and add nanoseconds converted to milliseconds
    const milliseconds = seconds * 1000 + nanoseconds / 1e6
    // Create a Date object with the given milliseconds
    const givenDate = new Date(milliseconds)
    // Calculate 14 days in milliseconds
    const fourteenDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000
    // Calculate the date 14 days after the given date
    const date14DaysAfter = new Date(givenDate.getTime() + fourteenDaysInMilliseconds)
    // Get the current date
    const currentDate = new Date()
    // Calculate the difference in milliseconds between the current date and the date 14 days after
    const timeDifference = date14DaysAfter.getTime() - currentDate.getTime()
    // Convert milliseconds to days
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24))
    console.log(handleDaysLeftColor(daysDifference))
    return daysDifference
  }

  const handleDaysLeftColor = (days: number) => {
    console.log(days)
    if (days >= 30) {
      return "text-green-500"
    } else if (days < 30 && days > 5) {
      return "text-orange-500"
    } else if (days <= 5) {
      return "text-red-500"
    }
  }

  const currentUserVerse = userData.learnedVerses.filter((verse) => verse.id === selectedVerse?.id)

  const handleReview = (verseId: string) => {
    // Retrieve the selected verse data from local storage
    const newVerse = verseData.filter((verse) => verse.id === verseId)
    if (newVerse.length > 0) {
      saveCurrentCategory(newVerse[0].category)
      saveSelectedVerse(newVerse[0])
      navigate("/stage3")
    } else {
      console.error(`Verse with ID ${verseId} not found in local storage.`)
    }
  }
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate={`${open ? "hidden" : "visible"}`}
          exit="hidden"
          variants={{
            visible: { opacity: 1, y: 0, x: 0 },
            hidden: { opacity: 0, y: 500 },
          }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 bg-black text-white font-Inter ${
            open ? "pointer-events-none z-10" : ""
          } max-w-2xl mx-auto `}
        >
          <div className={`h-screen w-screen p-4 max-w-2xl mx-auto `}>
            <div className="relative text-center flex items-center justify-center">
              <button className="absolute inset-0" onClick={handleDone}>
                <FaXmark className="text-3xl md:text-4xl lg:text-5xl" />
              </button>
              <span className="text-2xl md:text-3xl lg:text-4xl text-white text-center">Verse Details</span>
            </div>
            <div>
              {currentUserVerse &&
                currentUserVerse.map((verse) => (
                  <div key={verse.id} className="grid rounded-xl p-4 gap-4 md:text-xl lg:text-2xl">
                    <div className="grid">
                      <span className=" text-2xl md:text-3xl lg:text-4xl font-bold">{verse.id}</span>

                      <span>Category: {verse?.category?.toUpperCase()}</span>
                      <span>Translation: {verse.translation}</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Status</h1>
                        <button onClick={() => setShowInfoMessage(!showInfoMessage)}>
                          <FaCircleInfo className="text-blue-300" />
                        </button>
                      </div>

                      <span>
                        Learned On: <span className="text-green-500">{handleTimeStamp(verse.timeStamp)}</span>
                      </span>
                      <div>
                        Verse will be lost on <span className="">{getDate14DaysAfter(verse.timeStamp)}</span>
                      </div>
                      <p>
                        You have{" "}
                        <span className={handleDaysLeftColor(getDaysUntilDate30DaysAfter(verse.timeStamp))}>
                          {getDaysUntilDate30DaysAfter(verse.timeStamp)}{" "}
                        </span>
                        days left
                      </p>
                    </div>

                    <div className="flex justify-center items-center gap-4 text-base">
                      <button
                        onClick={() => handleReview(verse.id)}
                        className="flex place-content-center items-center border-2 p-2 rounded-xl gap-2 bg-[#444444]"
                      >
                        <FaCheck className="text-3xl text-green-500" />
                        <span>Review</span>
                      </button>
                      <button className="flex place-content-center items-center border-2 p-2 rounded-xl gap-2 bg-[#444444]">
                        <FaTrash className="text-3xl text-gray-500" />
                      </button>
                      <button className="flex place-content-center items-center border-2 p-2 rounded-xl gap-2 bg-[#444444]">
                        <FaHeart className="text-3xl text-red-500" />
                        <div>Favorite</div>
                      </button>
                    </div>
                    {friendLearnedVerse.length > 0 ? (
                      <div className="text-white w-full">
                        <h1 className=" p-2">Friends who also know this:</h1>
                        <div className="grid grid-cols-2 gap-2">
                          {friendLearnedVerse.map((friend, index) => (
                            <button
                              className=" border  p-1 bg-[#444444]"
                              onClick={() => handleNavigateToFriend(friend)}
                              key={index}
                            >
                              <div>{friend.displayName}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                ))}
            </div>
          </div>
          {showInfoMessage && (
            <div
              className={`absolute inset-0 grid place-content-center font-Inter  ${
                showInfoMessage ? " bg-black bg-clip-padding backdrop-filter bg-opacity-60" : ""
              }  p-4 max-w-2xl mx-auto`}
            >
              <motion.div
                initial="hidden"
                animate={`${open ? "hidden" : "visible"}`}
                exit="hidden"
                variants={{
                  visible: { opacity: 1, y: 0, x: 0 },
                  hidden: { opacity: 0, y: 50 },
                }}
                className="bg-white w-full h-fit text-black p-6 rounded-xl mx-auto font-Inter"
              >
                <div className="relative text-center flex items-center justify-center">
                  <button className="absolute inset-0 text-lg" onClick={() => setShowInfoMessage(!showInfoMessage)}>
                    <FaXmark />
                  </button>
                  <span className="text-center text-xl">How it works</span>
                </div>
                <div className="font-Inter">
                  <p>
                    To help users keep verses memorized, learned verses will be lost if they are not reviewed within the
                    30 day period. Your experience will not be lost. All you need to do is review it to keep the trophy.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
export default LearnedVerseCard
