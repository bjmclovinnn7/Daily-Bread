import { Card } from "../comps/Card"
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
      <div className="h-screen w-screen">
        <Card size={"lg"} variant={"outline"}>
          <Card size={"lg"} variant={"outline"}>
            <form onSubmit={handleSubmit} className="max-w-[400px] p-5 border">
              <div className="text-center text-3xl h-20">Sign Up</div>
              <div className="">
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
              <div className="flex justify-center items-center p-10">
                <Button>Sign-up</Button>
              </div>
            </form>
          </Card>

          <div className="space-x-2">
            <span>Already have an account?</span>
            <button className="text-blue-500">
              <Link to="/login">Login</Link>
            </button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Auth
