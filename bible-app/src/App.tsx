import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { AnimatePresence } from "framer-motion"
import { VerseProvider } from "./utils/VerseContext"
import Random from "./pages/Random"
import Popular from "./pages/Popular"
import Search from "./pages/Search"
import Phase1 from "./pages/Phase1"
function App() {
  return (
    <>
      <VerseProvider>
        <div className="App">
          <AnimatePresence>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/random" element={<Random />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/search" element={<Search />} />
                <Route path="/learn" element={<Phase1 />} />
              </Routes>
            </Router>
          </AnimatePresence>
        </div>
      </VerseProvider>
    </>
  )
}

export default App
