import { Navigate, useLocation } from "react-router-dom"
import { useUserContext } from "./UserContext"
import { ReactNode, useEffect, useState } from "react"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userData } = useUserContext()
  const location = useLocation()
  const [intendedPath, setIntendedPath] = useState("")

  useEffect(() => {
    if (!userData) {
      setIntendedPath(location.pathname)
    }
  }, [userData, location.pathname])

  if (!userData) {
    return <Navigate to={`/login?redirect=${intendedPath}`} />
  }

  return <>{children}</>
}

export default ProtectedRoute
