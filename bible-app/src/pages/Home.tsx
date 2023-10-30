import { Link } from "react-router-dom"
import { HiUserCircle } from "react-icons/Hi"
import { FaTrophy } from "react-icons/fa6"
import { FaUserFriends } from "react-icons/fa"
import Categories from "./Categories/Categories"
import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const { userLearnedVerses } = useUserContext()
  const navigate = useNavigate()

  const learnedVersesCount = userLearnedVerses ? userLearnedVerses.length : 0

  return (
    <>
      <div className="h-full w-full relative">
        <div className="h-[10vh] w-full fixed flex justify-between items-center bg-white text-2xl p-5 z-20">
          <div>NIV</div>
          <button onClick={() => navigate("/learned")} className="flex justify-center items-center gap-2">
            <span>{learnedVersesCount}</span>
            <FaTrophy className="text-orange-500 h-6 w-6" />
          </button>
          <button onClick={() => navigate("/friends")}>
            <FaUserFriends className="h-8 w-8" />
          </button>

          <div>
            <Link to="/profile">
              <HiUserCircle className="pointer-events-none text-black h-10 w-10" />
            </Link>
          </div>
        </div>
        <div className="category pt-[12vh] h-screen w-full overflow-y-auto p-3">
          <Categories />
        </div>
      </div>
    </>
  )
}

export default Home
