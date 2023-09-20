import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { useState, ChangeEvent, FormEvent } from "react" // Import ChangeEvent and FormEvent
import { useUserContext } from "../utils/UserContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { signIn } = useUserContext()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      await signIn(email, password)
      navigate("/profile")
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
        console.log(error)
      }
    }
  }

  return (
    <>
      <div className="h-screen w-screen">
        <Card size={"lg"} variant={"outline"}>
          <Card size={"lg"} variant={"outline"}>
            <form onSubmit={handleSubmit} className="max-w-[400px] p-5">
              <div className="text-center text-3xl h-20">Login</div>
              <div className="">
                <label>Email</label>
                <input
                  className="border-2 border-gray-300 rounded-sm w-full"
                  type="email"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    // Use ChangeEvent<HTMLInputElement> for the event type
                    setEmail(e.target.value)
                  }}
                  required
                ></input>
                <label>Password</label>
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
              <div className="flex justify-center items-center p-10">
                <Button>Login</Button>
              </div>
            </form>
            <div className="space-x-2">
              <span>Need to create an account?</span>
              <button className="text-blue-500">
                <Link to="/auth">Create account</Link>
              </button>
            </div>
          </Card>
        </Card>
      </div>
    </>
  )
}

export default Login
