import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import { VerseProvider } from "./utils/VerseContext"
import Phase1 from "./pages/Phase1"
import { UserContextProvider } from "./utils/UserContext"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import ProtectedRoute from "./utils/ProtectedRoute"

function App() {
  return (
    <>
      <VerseProvider>
        <UserContextProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <Phase1 />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </UserContextProvider>
      </VerseProvider>
    </>
  )
}

export default App
