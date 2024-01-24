import { useState, useEffect, lazy, Suspense } from "react"
import { FaTrophy, FaUserFriends, FaUser, FaBookOpen } from "react-icons/fa"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"
import { motion, AnimatePresence } from "framer-motion"
import Copyright from "../comps/Copyright"
import PwaPrompt from "../comps/PwaPrompt"
import { detect } from "detect-browser"

const VoD = lazy(() => import("../comps/VoD"))
const Categories = lazy(() => import("../pages/Categories/Categories"))
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
  const [vodIsExpanded, setVodIsExpanded] = useState(false)

  const handleTranslationSelect = (translation: string) => {
    setSelectedTranslation(translation)
    saveTranslation(translation)

    setShowDropdown(false)
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const dropdownButton = document.getElementById("dropdown-button")
      const dropdownMenu = document.getElementById("dropdown-menu")
      if (dropdownButton && dropdownMenu && dropdownButton.contains(event.target as Node)) {
        setShowDropdown(true)
      } else if (dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    const handleTouch = (event: TouchEvent) => {
      const dropdownButton = document.getElementById("dropdown-button")
      const dropdownMenu = document.getElementById("dropdown-menu")
      if (dropdownButton && dropdownMenu && dropdownButton.contains(event.target as Node)) {
        setShowDropdown(true)
      } else if (dropdownMenu && !dropdownMenu.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("touchstart", handleTouch)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [showDropdown])

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
      window.removeEventListener("beforeinstallprompt", () => { })
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
              id="dropdown-button"
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
                  id="dropdown-menu"
                  transition={{ staggerChildren: 0.13, ease: "easeIn" }}
                  className="dropdown-menu absolute top-[100%] left-5 right-5 w-ffull h-fit bg-white border-2 text-2xl font-Inter rounded-xl lg:w-1/5"
                >
                  {["NIV", "ESV", "KJV", "NKJV"].map((translationOption) => (
                    <motion.li
                      key={translationOption}
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -10 },
                      }}
                      className={`${selectedTranslation === translationOption ? "bg-[#4F4F4F] text-white" : "bg-white text-black"
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

        <div className="category pt-[10vh] h-[100vh] w-full overflow-y-auto p-4 bg-black ">
          <div className="grid max-w-[1000px] mx-auto">
            <div className="container w-full text-2xl md:text-3xl lg:text-4xl flex justify-between items-center">
              <span className=" font-Inter text-white">
                Welcome, {userData && userData.displayName ? userData.displayName.split(" ")[0] + "." : " "}
              </span>
              {/* <div className="font-header">
                <span className="text-yellow-500">{userData?.experience}</span> <span className="text-white ">XP</span>
              </div> */}
            </div>
          </div>
          <Suspense
            fallback={
              <div className="absolute inset-0 grid place-content-center text-2xl bg-transparent">Loading...</div>
            }
          >
            <VoD vodIsExpanded={vodIsExpanded} setVodIsExpanded={setVodIsExpanded} />
            <Categories setCategoryOpened={setCategoryOpened} categoryOpened={categoryOpened} />
            <Copyright />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default Home
