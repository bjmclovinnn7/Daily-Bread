import { useEffect, useState } from "react"
import { FaTrophy, FaUserFriends } from "react-icons/fa"
import Categories from "./Categories/Categories"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"
import { motion, useAnimate } from "framer-motion"

function useIconAnimation(test: boolean) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(".trophy", test ? { scale: 1.7 } : { scale: 1 }, {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.5,
    })
  }, [test])
  return scope
}

const Home = () => {
  const [test, setTest] = useState(false)
  const scope = useIconAnimation(test)
  const { userData } = useUserContext()
  const navigate = useNavigate()
  const { saveTranslation } = useVerseContext()
  const learnedVersesCount = userData.learnedVerses ? userData?.learnedVerses?.length : 0

  useEffect(() => {
    setTimeout(() => {
      setTest(true)
      setTest(false)
    }, 3000)
  }, [userData.learnedVerses])

  // State to control the dropdown visibility and selected translation
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState("NIV")

  const handleTranslationSelect = (translation: string) => {
    setSelectedTranslation(translation)
    saveTranslation(translation)
    setShowDropdown(false)
  }

  return (
    <>
      <motion.div ref={scope} className="h-full w-full relative">
        <div className="h-[10vh] w-full fixed flex justify-between items-center bg-white text-2xl p-5 z-20 border-b-2">
          <div className="relative">
            {/* Button to toggle the dropdown */}
            <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer font-header">
              {selectedTranslation}
            </div>
            {/* Dropdown menu */}
            {showDropdown && (
              <ul className="absolute top-8 bg-white border border-gray-300 text-2xl grid font-header">
                <li
                  onClick={() => handleTranslationSelect("NIV")}
                  className={`${selectedTranslation === "NIV" ? "bg-gray-400" : ""} border-2 p-4`}
                >
                  NIV
                </li>
                <li
                  onClick={() => handleTranslationSelect("ESV")}
                  className={`${selectedTranslation === "ESV" ? "bg-gray-400" : ""} border-2 p-4`}
                >
                  ESV
                </li>
                <li
                  onClick={() => handleTranslationSelect("KJV")}
                  className={`${selectedTranslation === "KJV" ? "bg-gray-400" : ""} border-2 p-4`}
                >
                  KJV
                </li>
              </ul>
            )}
          </div>
          <motion.button
            initial={{ scale: 1 }}
            onClick={() => navigate("/learned")}
            className="trophy flex justify-center items-center gap-2"
          >
            <div>{test ? "+1" : learnedVersesCount}</div>
            <FaTrophy className="text-orange-500 h-8 w-8" />
          </motion.button>

          <button onClick={() => navigate("/friends")} className="flex justify-center items-center gap-2">
            <span>{userData?.friends?.length}</span>
            <FaUserFriends className="h-8 w-8" />
          </button>

          <button onClick={() => navigate("/profile")}>Profile</button>
        </div>
        <div className="category pt-[12vh] h-screen w-full overflow-y-auto p-3">
          <h1 className="font-header text-3xl pb-4">Welcome, {userData?.displayName.split(" ")[0]}.</h1>
          <Categories />
        </div>
      </motion.div>
    </>
  )
}

export default Home
