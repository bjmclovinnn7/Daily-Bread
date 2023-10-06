import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent } from "react" // Import ChangeEvent and FormEvent
import { useUserContext } from "../utils/UserContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Auth = () => {
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { createUser } = useUserContext()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Use FormEvent<HTMLFormElement> for the event type
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      console.log(error)
      return
    }

    try {
      await createUser(firstName, lastName, userName, email, password)
      navigate("/")
    } catch (e) {
      if (e instanceof Error) {
        // Check if 'e' is an instance of Error
        setError(e.message)
        console.log(e.message)
      }
    }
  }

  return (
    <>
      <div className="h-screen w-full grid place-content-center bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60 p-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-2xl rounded-3xl grid gap-3"
        >
          <div className="text-center text-5xl md:text-6xl lg:text-7xl font-header text-white ">Sign Up</div>
          <div className="text-2xl text-white font-bold">
            <label>First Name</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setfirstName(e.target.value)
              }}
              required
            ></input>
            <label>Last Name</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setlastName(e.target.value)
              }}
              required
            ></input>
            <label>User Name</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUserName(e.target.value)
              }}
              required
            ></input>
            <label>Email</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
              }}
              required
            ></input>
            <label>Password</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
              }}
              required
            ></input>
            <label>Password Confirmation</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(e.target.value)
              }}
              required
            ></input>
          </div>
          <div className="flex justify-center items-center p-7">
            <Button variant={"glass3"} className="w-40 text-white font-bold">
              Sign-up
            </Button>
          </div>
        </form>

        <div className="p-5 space-x-2 text-center text-white text-xl">
          <button className="text-white">
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
