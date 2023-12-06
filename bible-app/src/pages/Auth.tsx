import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent } from "react" // Import ChangeEvent and FormEvent
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDoc, getDocs, serverTimestamp, query, where } from "firebase/firestore"
import { auth, colRefUsers } from "../utils/firebase"

interface UserData {
  uid: string
  displayName: string
  email: string
  password: string
  firstName: string
  lastName: string
  confirmedPassword: string
}

const Auth = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData>({
    uid: "",
    displayName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmedPassword: "",
  })
  const [showFirstStep, setShowFirstStep] = useState(true)
  const [showSecondStep, setShowSecondStep] = useState(false)
  const [showThirdStep, setShowThirdStep] = useState(false)
  const [userName, setUserName] = useState("")
  const [error, setError] = useState("")
  const [emailSignUpSuccess, setEmaiSignUpSucces] = useState(false)

  const handleFirstStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (userData.firstName && userData.lastName) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        displayName: `${prevUserData.firstName} ${prevUserData.lastName}`,
      }))
      setShowFirstStep(false)
      setShowSecondStep(true)
      clearError()
    } else {
      setError("First and last name are required.")
    }
  }

  const handleSecondStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    if (userData.password !== userData.confirmedPassword) {
      setError("Passwords do not match")
      return
    }
    try {
      const newUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      setUserData((prevUserData) => ({ ...prevUserData, uid: newUser.user.uid }))
      setShowSecondStep(false)
      setShowThirdStep(true)
      setEmaiSignUpSucces(true)
    } catch (err) {
      if (!userData.email || !userData.password) {
        setError("Please provide an email/password.")
      } else {
        setError("Email already in use. Please try logging in or use a different email.")
      }
    }
  }

  const handleThirdStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    if (!userName) {
      setError("No username provided.")
      return
    }
    try {
      const usernameAvailable = await checkUserName()
      if (usernameAvailable) {
        await createUserDoc()
        navigate("/")
      }
    } catch (err) {
      setError("Error creating account.")
    }
  }

  const createUserDoc = async () => {
    const userDocRef = doc(colRefUsers, userData.uid)
    const timeStamp = serverTimestamp()
    await setDoc(userDocRef, {
      displayName: userData.displayName,
      uid: userData.uid,
      createdOn: timeStamp,
      learnedVerses: [],
      friends: [],
      experience: 0,
      userName: userName,
    })
  }

  const checkUserName = async () => {
    const querySnapshot = await getDocs(query(colRefUsers, where("userName", "==", userName)))
    if (querySnapshot.empty) {
      console.log(`UserName: ${userName} is available.`)
      return true
    } else {
      setError(`Username ${userName} already exists`)
      return false
    }
  }

  const clearError = () => {
    setError("")
  }

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const currentUser = await signInWithPopup(auth, provider)
      const userUid = currentUser.user.uid
      const currentUserRef = doc(colRefUsers, userUid)
      const userDoc = await getDoc(currentUserRef)
      if (userDoc.exists()) {
        console.log("User already exists")
      } else {
        await createUserDoc()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="h-screen w-full grid place-content-center p-10 bg-black text-white font-Inter">
        <div className="text-center text-3xl md:text-4xl lg:text-5xl p-4"> Sign Up</div>
        {/* First step form */}
        {showFirstStep && (
          <form
            onSubmit={handleFirstStep}
            className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl grid gap-3"
          >
            <div className="text-xl">
              <label>First Name</label>
              <input
                value={userData.firstName}
                className="border-2 border-gray-300 rounded-sm w-full text-white"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, firstName: e.target.value })}
                required
              />
              <label>Last Name</label>
              <input
                value={userData.lastName}
                className="border-2 border-gray-300 rounded-sm w-full text-white"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-center items-center p-7">
              <Button variant={"glass3"} className="w-40">
                Next
              </Button>
            </div>
            <div className="block text-red-500 text-center">{error}</div>
          </form>
        )}

        {/* Second step form */}
        {showSecondStep && (
          <form
            onSubmit={handleSecondStep}
            className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl grid gap-3"
          >
            <div className="text-xl">
              <label>Email</label>
              <input
                value={userData.email}
                className="border-2 border-gray-300 rounded-sm w-full text-white"
                type="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, email: e.target.value })}
                required
              />
              <label>Password</label>
              <input
                value={userData.password}
                className="border-2 border-gray-300 rounded-sm w-full text-white"
                type="password"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, password: e.target.value })}
                required
              />
              <label>Password Confirmation</label>
              <input
                value={userData.confirmedPassword}
                className="border-2 border-gray-300 rounded-sm w-full text-white"
                type="password"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserData({ ...userData, confirmedPassword: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-center items-center gap-4 p-7">
              <Button variant={"glass3"} className="w-40">
                Sign-up
              </Button>
            </div>
            <div className="block text-red-500 text-center">{error}</div>
          </form>
        )}

        {/* Third step form */}
        {showThirdStep && (
          <form
            onSubmit={handleThirdStep}
            className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl grid gap-3"
          >
            {emailSignUpSuccess && (
              <div className="p-2 grid gap-2">
                <div className="block text-xl">Account Creation Successful</div>
                <span>Please select a username.</span>
              </div>
            )}
            <div className="text-xl">
              <label>UserName</label>
              <input
                value={userName}
                className="border-2 border-gray-300 rounded-sm w-full text-white"
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center items-center gap-4 p-7">
              <Button variant={"glass3"} className="w-full">
                Sign-up
              </Button>
            </div>
            <div className="block text-red-500 text-center">{error}</div>
          </form>
        )}

        <div className="grid pt-6">
          <button
            onClick={handleGoogleSignUp}
            className=" border-2 flex bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl"
          >
            <div className="border-r-2 p-2 text-4xl">
              <FcGoogle />
            </div>
            <span className="w-full text-center h-full flex justify-center items-center text-xl">
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
