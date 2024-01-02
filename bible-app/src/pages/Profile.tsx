import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { FaClock, FaUserFriends, FaTrophy, FaPlus, FaArrowLeft, FaFlask, FaUser } from "react-icons/fa"
import { cn } from "../utils/utils"
import Achievements from "../comps/Achievements"
import achievementData from "../utils/AchievementData.json"
import { useEffect, useState } from "react"
import { FaShield } from "react-icons/fa6"
import { Button } from "../comps/Button"

const Profile = () => {
  const { userData, logOut, photo } = useUserContext()
  const [rankColor, setRankColor] = useState("")
  const [userRank, setUserRank] = useState("")
  const navigate = useNavigate()
  const [seeAchievements, setSeeAchievements] = useState(false)

  const handleLogOut = async () => {
    try {
      await logOut()
      navigate("/login")
      console.log("You are logged out. ")
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message)
      }
    }
  }

  interface timeStamp {
    seconds: number
    nanoseconds: number
  }

  useEffect(() => {
    let newRankColor = ""
    let rankTitle = ""

    if (userData?.experience) {
      if (userData?.experience >= 500 && userData?.experience < 1000) {
        newRankColor = "text-[#c0c0c0]"
        rankTitle = "Silver"
      } else if (userData?.experience >= 1000) {
        newRankColor = "text-[#FFD700]"
        rankTitle = "Gold"
      } else {
        newRankColor = "text-[#CD7F32]"
        rankTitle = "Bronze"
      }

      setRankColor(newRankColor)
      setUserRank(rankTitle)
    } else {
      setRankColor("text-[#CD7F32]")
      setUserRank("Bronze")
    }
    // No return statement is necessary here
  }, [userData?.experience]) // Add userData?.experience to the dependency array

  const handleTimeStamp = (timeStamp: timeStamp) => {
    if (timeStamp) {
      const date = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)
      const readableDate = date.toLocaleDateString()
      return readableDate
    } else {
      return "No Date."
    }
  }

  useEffect(() => {
    console.log(userData)
  }, [])

  return (
    <>
      <div className="h-full w-full bg-black p-4 overflow-auto font-Inter ">
        <div className="h-10">
          <div className="relative block text-center text-white">
            <button onClick={() => navigate("/")} className="absolute inset-0">
              <FaArrowLeft className="text-3xl md:text-4xl lg:text-5xl" />
            </button>
            {/* <span className="text-3xl md:text-4xl lg:text-5xl text-white text-center">Profile</span> */}
          </div>
        </div>

        <section className="text-white pt-4 max-w-2xl mx-auto">
          <div className="flex justify-between">
            <div className="profile">
              <div className="flex justify-between items-center w-full">
                <div className="text-2xl md:text-3xl lg:text-4xl">{userData?.displayName}</div>
              </div>
              <div className="flex items-center gap-2 justify-start">
                <FaUser className="" />
                <span className="text-white">{userData.userName}</span>
              </div>
              <div className="flex justify-start gap-2 items-center">
                <span>
                  <FaClock className="" />
                </span>
                <span>Joined {handleTimeStamp(userData.createdOn)}</span>
              </div>

              {/* <div className="flex items-center gap-2 justify-start">
                <MdMail className="" />
                <span className="">{userData?.email || "N/a"}</span>
              </div> */}
            </div>
            <div className="flex justify-center w-fit h-20">
              <img className="rounded-full border border-black" src={photo}></img>
            </div>
          </div>
          <div className="grid pt-8">
            <Button onClick={() => navigate("/friends")} variant={"primary"}>
              <FaPlus className="text-sm md:text-base lg:text-lg" />
              <span>Add Friends</span>
            </Button>
          </div>
        </section>
        <section className="text-white py-4 max-w-2xl mx-auto">
          <div className="Statistics ">
            <h1 className="text-xl md:text-2xl lg:text-3xl pb-2">Statistics</h1>
            <div className="grid grid-cols-2 place-content-center gap-4">
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded p-2">
                  <div className="grid place-content-center w-1/4">
                    <FaUserFriends className="text-blue-700 text-2xl" />
                  </div>
                  <div className="grid w-3/4">
                    <span className="">{userData?.friends.length || 0}</span>
                    <span>Following</span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded p-2">
                  <div className="grid place-content-center w-1/4">
                    <FaTrophy className="text-yellow-500 text-2xl" />
                  </div>
                  <div className="grid w-3/4">
                    <span className="">{userData?.learnedVerses.length || 0}</span>
                    <span>Memorized </span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded p-2">
                  <div className="grid place-content-center w-1/4">
                    <FaFlask className="text-green-500 text-2xl" />
                  </div>

                  <div className="grid w-3/4">
                    <span className="">{userData?.experience || 0}</span>
                    <span>Total XP</span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded p-2">
                  <div className="grid place-content-center w-1/4">
                    <FaShield className={cn(`text-2xl ${rankColor}`)} />
                  </div>

                  <div className="grid w-3/4">
                    <div className={` ${rankColor}`}>{userRank}</div>
                    <span>Rank</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="text-white max-w-2xl mx-auto">
          <div className="Acheivements ">
            <div className="flex justify-between items-center">
              <div className="text-xl md:text-2xl lg:text-3xl pb-2 flex justify-center gap-2">
                <span>Acheivements</span>
              </div>
              <button onClick={() => setSeeAchievements(true)}>View All</button>
            </div>

            <div className="max-h-[350px] overflow-hidden">
              <Achievements
                achievements={achievementData}
                seeAchievements={seeAchievements}
                setSeeAchievements={setSeeAchievements}
                learnedVerses={userData.learnedVerses}
                experience={userData.experience}
              />
            </div>
          </div>
        </section>
        <div className="pt-4 grid">
          {seeAchievements ? (
            ""
          ) : (
            <Button variant={"secondary"} className="max-w-2xl mx-auto" onClick={() => handleLogOut()}>
              Log out
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
export default Profile
