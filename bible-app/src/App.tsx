import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Home"
import { AnimatePresence } from "framer-motion"
import Learn from "./pages/learnit/Learn"
import { VerseProvider } from "./utils/VerseContext"
function App() {
  return (
    <>
      <VerseProvider>
        <div className="App">
          <AnimatePresence>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
              </Routes>
            </Router>
          </AnimatePresence>
        </div>
      </VerseProvider>
    </>
  )
}

export default App
