import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent, useEffect } from "react" // Import ChangeEvent and FormEvent
import { useUserContext } from "../utils/UserContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { signIn, userData } = useUserContext()

  useEffect(() => {
    if (userData) {
      navigate("/")
    }
  }, [userData])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      await signIn(email, password)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
        console.log(error)
      }
    }
  }

  return (
    <>
      <div className="h-screen w-full grid place-content-center bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60 p-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] p-5 border-2 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 shadow-2xl rounded-3xl"
        >
          <div className="text-center text-5xl md:text-6xl lg:text-7xl font-header text-white ">Login.</div>
          <div className="text-2xl">
            <label className="text-white font-bold">Email</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="email"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // Use ChangeEvent<HTMLInputElement> for the event type
                setEmail(e.target.value)
              }}
              required
            ></input>
            <label className="text-white font-bold">Password</label>
            <input
              className="border-2 border-gray-300 rounded-sm w-full"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // Use ChangeEvent<HTMLInputElement> for the event type
                setPassword(e.target.value)
              }}
              required
            ></input>
          </div>
          <div className="flex justify-center items-center p-7">
            <Button variant={"glass3"} className="w-40 text-white text-2xl">
              Login
            </Button>
          </div>
        </form>
        <div className="p-5 space-x-2 text-center text-white text-xl">
          <button className="text-white">
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
