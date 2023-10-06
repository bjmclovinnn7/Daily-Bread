import { useUserContext } from "../utils/UserContext"
import { useNavigate } from "react-router"
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
      <div className="h-[100vh] w-[100vw] bg-white">
        <div className="relative grid place-content-center h-full w-full bg-white">
          <div className="flex justify-between items-center absolute top-5 w-full">
            <div className="text-3xl font-bold text-gray-500 pl-5">Profile</div>
            <button className="h-10 w-20 border rounded-2xl bg-red-300" onClick={() => handleLogOut()}>
              Log out
            </button>
          </div>
          <section className="h-[20vh] w-[80vw] p-2">
            <div className="text-3xl font-bold">{userData ? userData.userName : "No user signed in."}</div>
            <div className="text-gray-500">
              {userData ? (userData.firstName + " " + userData.lastName).toUpperCase() : ""}
            </div>
          </section>
          <section className="h-[20vh] w-[80vw] p-2">
            <span className="text-3xl font-bold">Learned</span>
            <div className="text-gray-500">
              {userData ? userData.versesLearned : "You haven't learned any verses yet."}
            </div>
          </section>

          <section className="h-[20vh] w-[80vw] p-2">
            <span className="text-3xl font-bold">Friends</span>
            <div className="text-gray-500">{userData ? userData.friends : "You haven't added any friends."}</div>
          </section>
        </div>
      </div>
    </>
  )
}
export default Profile
