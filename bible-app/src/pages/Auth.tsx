import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent, useEffect } from "react" // Import ChangeEvent and FormEvent
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, colRefUsers } from "../utils/firebase"
import { useUserContext } from "../utils/UserContext"
const Auth = () => {
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { userData } = useUserContext()

  const handleGoogleSignUp = async () => {
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

  const handleEmailSignUp = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Handling Email Sign-up")
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      alert(error)
      return
    }
    try {
      const currentUser = await createUserWithEmailAndPassword(auth, email, password)
      await createUserDoc(currentUser)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (userData) {
      navigate("/")
    } else {
      return
    }
  }, [userData])

  const createUserDoc = async (currentUser: any) => {
    console.log("Creating User Document")
    const userDocRef = doc(colRefUsers, currentUser.user.uid)
    //check if the user has a frist and last name and combine to make displayName
    let displayName = ""
    if (firstName && lastName) {
      displayName = firstName + " " + lastName
    }
    // user used google and just use displayName
    else {
      displayName = currentUser.user.displayName
    }
    await setDoc(userDocRef, {
      displayName: displayName,
      email: currentUser.user.email,
      uid: currentUser.user.uid,
      createdOn: new Date(),
      learnedVerses: [],
      friends: [],
    })
  }

  return (
    <>
      <div className="h-screen w-full grid place-content-center p-10 bg-[#444444] text-white">
        <div className="text-center text-3xl md:text-4xl lg:text-5xl font-header p-4">Sign Up</div>

        <form
          onSubmit={handleEmailSignUp}
          className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl grid gap-3 "
        >
          <div className="text-xl font-bold">
            <label>First Name</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setfirstName(e.target.value)
              }}
              required
            ></input>
            <label>Last Name</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setlastName(e.target.value)
              }}
              required
            ></input>

            <label>Email</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
              }}
              required
            ></input>
            <label>Password</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
              }}
              required
            ></input>
            <label>Password Confirmation</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full text-black"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value)
              }}
              required
            ></input>
          </div>
          <div className="flex justify-center items-center p-7">
            <Button variant={"glass3"} className="w-40 font-bold">
              Sign-up
            </Button>
          </div>
        </form>
        <div className="grid pt-6">
          <button
            onClick={handleGoogleSignUp}
            className=" border-2 flex bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl"
          >
            <div className="border-r-2 p-2 text-4xl">
              <FcGoogle />
            </div>
            <span className="w-full text-center h-full flex justify-center items-center font-bold text-xl">
              Continue with Google
            </span>
          </button>
        </div>
        <div className="p-5 space-x-2 text-center text-xl">
          <button className="">
            <Link to="/login" className="grid">
              <span>Already have an account?</span>
              <span className="font-bold">Login.</span>
            </Link>
          </button>
        </div>
      </div>
    </>
  )
}

export default Auth
