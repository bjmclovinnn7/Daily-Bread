import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent } from "react" // Import ChangeEvent and FormEvent
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDoc, getDocs, serverTimestamp, query, where } from "firebase/firestore"
import { auth, colRefUsers } from "../utils/firebase"

interface UserData {
  uid: string
  displayName: string
  email: string
  userName: string
}

const Login = () => {
  const [email, setEmail] = useState("")
  const [userData, setUserData] = useState<UserData>({
    uid: "",
    displayName: "",
    email: "",
    userName: "",
  })
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [getUserName, setGetUserName] = useState(false)
  const [errorMessage, setErrorMessage] = useState<any>()
  const navigate = useNavigate()

  // useEffect(() => {
  //   if (userData) {
  //     navigate("/")
  //   } else {
  //     return
  //   }
  // }, [userData])

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const currentUser = await signInWithPopup(auth, provider)
      const googleUid = currentUser.user.uid
      const googleDisplayName = currentUser?.user?.displayName || ""
      const googleEmail = currentUser.user.email || ""

      const currentUserRef = doc(colRefUsers, googleUid)
      const userDoc = await getDoc(currentUserRef)
      let googleUserData = userDoc.data()
      const googleUserName = googleUserData?.displayName || ""
      if (userDoc.exists() && googleUserName) {
        console.log("User already exists")
        navigate("/")
      } else {
        setUserData({
          displayName: googleDisplayName,
          uid: currentUser.user.uid,
          email: googleEmail,
          userName: googleUserName,
        })
        //prompt userName selection and account creation.
        setGetUserName(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleThirdStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage("")
    if (!userData) {
      setErrorMessage("No username provided.")
      return
    }
    try {
      const usernameAvailable = await checkUserName()
      if (usernameAvailable) {
        await createUserDoc()
        navigate("/")
      }
    } catch (err) {
      setErrorMessage("Error creating account.")
    }
  }

  const checkUserName = async () => {
    const querySnapshot = await getDocs(query(colRefUsers, where("userName", "==", userName)))
    if (querySnapshot.empty) {
      console.log(`UserName: ${userName} is available.`)
      return true
    } else {
      setErrorMessage(`Username ${userName} already exists`)
      return false
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const currentUser = await signInWithEmailAndPassword(auth, email, password)
      const emailUserUid = currentUser.user.uid
      const emailUserDisplayName = currentUser?.user?.displayName || ""
      const emailUserEmail = currentUser.user.email || ""

      const currentUserRef = doc(colRefUsers, emailUserUid)
      const userDoc = await getDoc(currentUserRef)
      let googleUserData = userDoc.data()
      const emailUserName = googleUserData?.displayName || ""
      if (userDoc.exists() && emailUserName) {
        console.log("User already exists")
        navigate("/")
      } else {
        setUserData({
          displayName: emailUserDisplayName,
          uid: currentUser.user.uid,
          email: emailUserEmail,
          userName: emailUserName,
        })
        //prompt userName selection and account creation.
        setGetUserName(true)
      }
    } catch (error: any) {
      console.log(error)
      setErrorMessage(error.toString())
      setError(true)
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

  return (
    <>
      <div className="h-screen w-full grid place-content-center p-10 bg-black text-white font-Inter">
        <div className="text-center text-5xl md:text-6xl lg:text-7xl p-4">Login.</div>

        {<div className="bg-red-600 text-white">{errorMessage}</div>}
        {getUserName ? (
          <form
            onSubmit={handleThirdStep}
            className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl grid gap-3"
          >
            <div className="p-2 grid gap-2">
              <span>Please select a username.</span>
            </div>

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
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl"
          >
            <div className="text-2xl">
              <label className="">Email</label>
              <input
                className="border-2 border-gray-300 rounded-sm w-full text-black"
                type="email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  // Use ChangeEvent<HTMLInputElement> for the event type
                  setEmail(e.target.value)
                }}
                required
              ></input>
              <label className="">Password</label>
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
        )}
        <div className="grid pt-6">
          <button
            onClick={() => handleGoogleLogin()}
            className=" border-2 flex bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-xl rounded-xl"
          >
            <div className="border-r-2 p-2 text-4xl">
              <FcGoogle />
            </div>
            <span className="w-full text-center h-full flex justify-center items-center text-xl">
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
