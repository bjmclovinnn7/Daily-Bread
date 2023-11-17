import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent, useEffect } from "react" // Import ChangeEvent and FormEvent
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, colRefUsers } from "../utils/firebase"
import { useUserContext } from "../utils/UserContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<any>()
  const navigate = useNavigate()
  const { userData } = useUserContext()

  useEffect(() => {
    if (userData) {
      navigate("/")
    } else {
      return
    }
  }, [userData])

  const handleGoogleLogin = async () => {
    console.log("Handling Google Sign-up")
    const provider = new GoogleAuthProvider()
    const currentUser = await signInWithPopup(auth, provider)
    const userUid = currentUser.user.uid
    const currentUserRef = doc(colRefUsers, userUid)

    try {
      const userDoc = await getDoc(currentUserRef)
      if (userDoc.exists()) {
        // User already exists, handle it as needed
        console.log("User already exists")
      } else {
        // User doesn't exist, create the user document
        await createUserDoc(currentUser)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setErrorMessage("")
      setError(false)
    } catch (error: any) {
      console.log(error)
      setErrorMessage(error.toString())
      setError(true)
    }
  }

  const createUserDoc = async (currentUser: any) => {
    console.log("Creating User Document")
    const userDocRef = doc(colRefUsers, currentUser.user.uid)
    //check if the user has a frist and last name and combine to make displayName

    await setDoc(userDocRef, {
      displayName: currentUser.user.displayName,
      email: currentUser.user.email,
      uid: currentUser.user.uid,
      createdOn: new Date(),
      learnedVerses: [],
      friends: [],
    })
  }

  return (
    <>
      <div className="h-screen w-full grid place-content-center p-10 bg-[#444444] text-white ">
        <div className="text-center text-5xl md:text-6xl lg:text-7xl font-header p-4">Login.</div>
        {error && <div className="bg-red-600 text-white font-bold">{errorMessage}</div>}
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl"
        >
          <div className="text-2xl">
            <label className=" font-bold">Email</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // Use ChangeEvent<HTMLInputElement> for the event type
                setEmail(e.target.value)
              }}
              required
            ></input>
            <label className="font-bold">Password</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // Use ChangeEvent<HTMLInputElement> for the event type
                setPassword(e.target.value)
              }}
              required
            ></input>
          </div>
          <div className="flex justify-center items-center p-7">
            <Button variant={"glass3"} className="w-40 text-2xl">
              Login
            </Button>
          </div>
        </form>
        <div className="grid pt-6">
          <button
            onClick={() => handleGoogleLogin()}
            className=" border-2 flex bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl"
          >
            <div className="border-r-2 p-2 text-4xl">
              <FcGoogle />
            </div>
            <span className="w-full text-center h-full flex justify-center items-center font-bold text-xl">
              Login with Google
            </span>
          </button>
        </div>
        <div className="p-5 space-x-2 text-center text-xl">
          <button className="">
            <Link to="/auth" className="grid">
              <span>Need an account?</span>
              <span className="font-bold">Sign-up.</span>
            </Link>
          </button>
        </div>
      </div>
    </>
  )
}

export default Login
