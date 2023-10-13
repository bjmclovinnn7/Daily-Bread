import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import { VerseProvider } from "./utils/VerseContext"
import { UserContextProvider } from "./utils/UserContext"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import ProtectedRoute from "./utils/ProtectedRoute"
import AllLoaded from "./pages/Categories/AllLoaded"
import Stage1 from "./pages/Stage1"
import Stage2 from "./pages/Stage2"

function App() {
  return (
    <>
      <UserContextProvider>
        <VerseProvider>
          <Router basename="/bible-app-production">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/all_verses" element={<AllLoaded />} />
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
                path="/stage1"
                element={
                  <ProtectedRoute>
                    <Stage1 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stage2"
                element={
                  <ProtectedRoute>
                    <Stage2 />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </VerseProvider>
      </UserContextProvider>
    </>
  )
}

export default App
