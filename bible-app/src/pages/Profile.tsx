import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
import { Button } from "../comps/Button"
import { HiChevronLeft } from "react-icons/Hi"
import { motion } from "framer-motion"
const Profile = () => {
  const { userData, logOut } = useUserContext()
  const navigate = useNavigate()
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

  return (
    <>
      <div className="h-screen w-full grid bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60">
        <div className=" p-10">
          <div className="text-5xl w-full text-center font-bold text-white pb-5 border-b-2">Profile</div>
          <motion.button
            onClick={() => navigate("/")}
            whileTap={{ scale: 1.05 }}
            className="absolute inset-0 h-fit w-fit text-white"
          >
            <HiChevronLeft className=" text-6xl" />
          </motion.button>
          <div className="grid place-content-start gap-5 p-5 w-full">
            <div className=" text-white">
              <div className="text-3xl font-bold">{userData ? userData.userName : "No user signed in."}</div>
              <div className="text-black">
                {userData ? (userData.firstName + " " + userData.lastName).toUpperCase() : ""}
              </div>
            </div>
            <div className=" text-white">
              <span className="text-3xl font-bold">Learned</span>
              <div className="text-black">
                {userData ? userData.versesLearned : "You haven't learned any verses yet."}
              </div>
            </div>

            <div className=" text-white">
              <span className="text-3xl font-bold">Friends</span>
              <div className="text-black">{userData ? userData.friends : "You haven't added any friends."}</div>
            </div>
          </div>
          <Button variant={"glass3"} className="w-full border rounded-2xl" onClick={() => handleLogOut()}>
            Log out
          </Button>
        </div>
      </div>
    </>
  )
}
export default Profile
