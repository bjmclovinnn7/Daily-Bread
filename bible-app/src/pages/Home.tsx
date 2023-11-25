import { useState } from "react"
import { FaTrophy, FaUserFriends, FaUser } from "react-icons/fa"
import Categories from "./Categories/Categories"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"
import { motion, AnimatePresence } from "framer-motion"
import Copyright from "../comps/Copyright"

const Home = () => {
  const { userData, photo } = useUserContext()
  const navigate = useNavigate()
  const { saveTranslation, translation } = useVerseContext()
  const learnedVersesCount = userData.learnedVerses ? userData?.learnedVerses?.length : 0

  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState(translation)

  const handleTranslationSelect = (translation: string) => {
    setSelectedTranslation(translation)
    saveTranslation(translation)
    setTimeout(() => {
      setShowDropdown(false)
    }, 1000)
  }

  return (
    <>
      <div className="h-full w-full relative">
        <div className="h-[10vh] w-full fixed flex justify-between items-center bg-white text-2xl p-5 z-20 border-b-2">
          <div className="">
            <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer font-header">
              {selectedTranslation}
            </div>
            {showDropdown && (
              <AnimatePresence>
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  transition={{ staggerChildren: 0.3, ease: "easeIn" }}
                  className="absolute top-[100%] left-5 right-5 w-ffull h-fit bg-white border-2 text-2xl font-header rounded-xl"
                >
                  {["NIV", "ESV", "KJV", "NKJV"].map((translationOption) => (
                    <motion.li
                      key={translationOption}
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -10 },
                      }}
                      className={`${
                        selectedTranslation === translationOption ? "bg-gray-400" : ""
                      }  p-4 text-center rounded-xl`}
                      onClick={() => handleTranslationSelect(translationOption)}
                    >
                      {translationOption}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}
          </div>
          <button onClick={() => navigate("/learned")} className="trophy flex justify-center items-center gap-2">
            <div>{learnedVersesCount}</div>
            <FaTrophy className="text-yellow-500 h-8 w-8" />
          </button>

          <button onClick={() => navigate("/friends")} className="flex justify-center items-center gap-2">
            <span>{userData?.friends?.length}</span>
            <FaUserFriends className="h-9 w-9 " />
          </button>

          <button onClick={() => navigate("/profile")}>
            {photo ? (
              <img src={photo} alt="User Photo" className="h-12 rounded-full border border-black" />
            ) : (
              <FaUser className="h-7 w-7 " />
            )}
          </button>
        </div>
        <div className="category pt-[10vh] h-screen w-full overflow-y-auto  p-4 bg-[#444444] relative">
          <div className="p-2 grid place-content-start lg:place-content-center">
            <div className=" md:lg:max-w-[1000px]">
              <h1 className="font-header text-3xl md:text-4xl lg:text-5xl text-white block">
                Welcome, {userData && userData.displayName ? userData.displayName.split(" ")[0] + "." : " "}
              </h1>
              <h2 className=" md:text-xl lg:text-2xl text-[#696969] font-header">
                Select a category to start learning.
              </h2>
            </div>
          </div>

          <Categories />
          <Copyright />
        </div>
      </div>
    </>
  )
}

export default Home
