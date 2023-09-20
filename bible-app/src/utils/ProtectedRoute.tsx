import { Navigate } from "react-router"
import { useUserContext } from "./UserContext"
import { ReactNode } from "react" // Import ReactNode

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userData } = useUserContext()

  if (!userData) {
    return <Navigate to="/login" />
  }
  console.log(userData)
  return children
}

export default ProtectedRoute
