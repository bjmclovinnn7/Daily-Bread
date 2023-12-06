import { useState, useEffect } from "react"
import { FaTrophy, FaUserFriends, FaUser, FaBookOpen } from "react-icons/fa"
import Categories from "./Categories/Categories"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"
import { motion, AnimatePresence } from "framer-motion"
import Copyright from "../comps/Copyright"
import PwaPrompt from "../comps/PwaPrompt"
import { detect } from "detect-browser"
import { colRefUsers } from "../utils/firebase"
import { getDocs } from "firebase/firestore"

interface DeferredPrompt extends Event {
  prompt: () => void
  userChoice: Promise<{
    outcome: "accepted" | "dismissed"
  }>
}

const Home = () => {
  const { userData, photo } = useUserContext()
  const navigate = useNavigate()
  const { saveTranslation, translation } = useVerseContext()
  const learnedVersesCount = userData.learnedVerses ? userData?.learnedVerses?.length : 0
  const [showPwaInstallPrompt, setShowPwaInstallPrompt] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedTranslation, setSelectedTranslation] = useState(translation)
  const [pwaPrompt, setPwaPrompt] = useState<DeferredPrompt | null>(null)
  const [categoryOpened, setCategoryOpened] = useState(false)

  const handleTranslationSelect = (translation: string) => {
    setSelectedTranslation(translation)
    saveTranslation(translation)

    setShowDropdown(false)
  }

  const handlePwaInstall = () => {
    if (pwaPrompt) {
      pwaPrompt.prompt()
      pwaPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          console.log("Installed")
          setShowPwaInstallPrompt(false)
        } else {
          console.log("Cancelled.")
          setShowPwaInstallPrompt(false)
        }
      })
    }
  }

  async function getAllDocuments() {
    try {
      const snapshot = await getDocs(colRefUsers)
      const documents: any = []

      snapshot.forEach((doc: any) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      console.log(documents)
    } catch (error) {
      console.error("Error getting documents: ", error)
      throw error
    }
  }

  useEffect(() => {
    const browser = detect()

    if (browser && browser?.name === "chrome") {
      let deferredPrompt

      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault()
        deferredPrompt = event as DeferredPrompt
        if (deferredPrompt) {
          setShowPwaInstallPrompt(true) // Your customized install prompt
          setPwaPrompt(deferredPrompt)
        } else {
          console.log("Alredy installed or not available. ")
        }
      })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {})
    }
  }, [])

  return (
    <>
      {showPwaInstallPrompt && (
        <PwaPrompt setShowPwaInstallPrompt={setShowPwaInstallPrompt} handlePwaInstall={handlePwaInstall} />
      )}
      <div className="h-full w-full relative">
        <div className="h-[10vh] w-full fixed flex justify-between items-center bg-black text-white text-xl p-5 z-20">
          <div className="flex justify-center items-center gap-4 ">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer font-Inter bg-[#4F4F4F] rounded-lg p-1 px-2 flex items-center justify-center gap-2"
            >
              <FaBookOpen />
              {selectedTranslation}
            </button>
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
                  transition={{ staggerChildren: 0.13, ease: "easeIn" }}
                  className="absolute top-[100%] left-5 right-5 w-ffull h-fit bg-white border-2 text-2xl font-Inter rounded-xl"
                >
                  {["NIV", "ESV", "KJV", "NKJV"].map((translationOption) => (
                    <motion.li
                      key={translationOption}
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -10 },
                      }}
                      className={`${
                        selectedTranslation === translationOption ? "bg-[#4F4F4F] text-white" : "bg-white text-black"
                      }  p-4 text-center rounded-xl`}
                      onClick={() => handleTranslationSelect(translationOption)}
                    >
                      {translationOption}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}

            <button
              onClick={() => navigate("/learned")}
              className="flex justify-center items-center gap-2 bg-[#4F4F4F] rounded-lg p-1 px-2"
            >
              <div>{learnedVersesCount}</div>
              <FaTrophy className="text-yellow-500" />
            </button>

            <button
              onClick={() => navigate("/friends")}
              className="flex justify-center items-center gap-2 bg-[#4F4F4F] rounded-lg p-1 px-2"
            >
              <span>{userData?.friends?.length}</span>
              <FaUserFriends className="h-7 w-7" />
            </button>
          </div>
          <button onClick={() => navigate("/profile")}>
            {photo ? (
              <img src={photo} alt="User Photo" className="h-14 rounded-full  bg-[#4F4F4F]" />
            ) : (
              <FaUser className="" />
            )}
          </button>
        </div>

        <div className="category pt-[10vh] h-[100vh] w-full overflow-y-auto p-4 bg-black relative">
          <button onClick={() => getAllDocuments()} className="text-white">
            Check
          </button>
          <div className="grid max-w-[1000px] mx-auto pt-2 pb-4">
            <div className="container w-full text-2xl md:text-3xl lg:text-4xl flex justify-between items-center">
              <span className=" font-Inter text-white font-semibold">
                Welcome, {userData && userData.displayName ? userData.displayName.split(" ")[0] + "." : " "}
              </span>
              {/* <div className="font-header">
                <span className="text-yellow-500">{userData?.experience}</span> <span className="text-white ">XP</span>
              </div> */}
            </div>
            <h2 className=" text-sm md:text-base lg:text-lg text-white font-Inter pl-2">
              {categoryOpened ? "Click a verse to start learning." : "Select a category to view verses."}
            </h2>
          </div>

          <Categories setCategoryOpened={setCategoryOpened} categoryOpened={categoryOpened} />
          <Copyright />
        </div>
      </div>
    </>
  )
}

export default Home
