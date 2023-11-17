import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { Button } from "../comps/Button"
import { FaClock, FaUserFriends, FaTrophy, FaPlus } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"
import { MdMail } from "react-icons/md"
import Achievements from "../comps/Achievements"
import achievementData from "../utils/AchievementData.json"
import { useState } from "react"

const Profile = () => {
  const { userData, logOut, photo } = useUserContext()
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

  const handleTimeStamp = (timeStamp: timeStamp) => {
    if (timeStamp) {
      const date = new Date(timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000)
      const readableDate = date.toLocaleDateString()
      return readableDate
    } else {
      return "No Date."
    }
  }

  return (
    <>
      <div className="h-[100vh] w-full bg-[#444444] p-4 overflow-auto">
        <div className="relative block text-center text-white">
          <button onClick={() => navigate("/")} className="absolute inset-0">
            <FaXmark className="text-3xl" />
          </button>
          <span className="text-3xl text-white text-center font-bold">Profile</span>
        </div>

        <section className="text-white py-4">
          <div className="flex justify-between">
            <div className="profile">
              <div className="flex justify-between items-center w-full">
                <div className="text-2xl font-header">{userData?.displayName}</div>
              </div>
              <div className="flex justify-start gap-2 items-center">
                <span>
                  <FaClock className="" />
                </span>
                <span>Joined {handleTimeStamp(userData.createdOn)}</span>
              </div>
              <div className="flex items-center gap-2 justify-start">
                <MdMail className="" />
                <span className="">{userData?.email}</span>
              </div>
            </div>
            <div className="flex justify-center w-fit">
              <img className="rounded-full border border-black" src={photo}></img>
            </div>
          </div>
          <div className="grid pt-4">
            <button
              onClick={() => navigate("/friends")}
              className="flex h-8 justify-center items-center gap-2 bg-white text-black rounded-full text-xl"
            >
              <FaPlus />
              <span>Add Friends</span>
            </button>
          </div>
        </section>
        <section className="text-white py-4 border-t-2">
          <div className="Statistics ">
            <h1 className="text-2xl font-bold pb-2">Statistics</h1>
            <div className="grid grid-cols-2 place-content-center gap-4 px-4">
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded-xl">
                  <div className="grid place-content-center w-1/4">
                    <FaUserFriends className="text-blue-700 text-2xl" />
                  </div>

                  <div className="grid w-3/4">
                    <span className="font-bold">{userData?.friends.length || 0}</span>
                    <span>Following</span>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-center bg-[#696969] rounded-xl">
                  <div className="grid place-content-center w-1/4">
                    <FaTrophy className="text-yellow-500 text-2xl" />
                  </div>

                  <div className="grid w-3/4">
                    <span className="font-bold">{userData?.learnedVerses.length || 0}</span>
                    <span>Learned </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="text-white py-4 border-t-2">
          <div className="Acheivements ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold pb-2">Acheivements</h1>
              <button onClick={() => setSeeAchievements(true)}>View All</button>
            </div>

            <div className="max-h-[400px] overflow-hidden">
              <Achievements
                achievements={achievementData}
                seeAchievements={seeAchievements}
                setSeeAchievements={setSeeAchievements}
                learnedVerses={userData.learnedVerses}
              />
            </div>
          </div>
        </section>
        <div className="p-4">
          {seeAchievements ? (
            ""
          ) : (
            <Button variant={"glass3"} className="w-full border rounded-2xl text-white" onClick={() => handleLogOut()}>
              Log out
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
export default Profile
