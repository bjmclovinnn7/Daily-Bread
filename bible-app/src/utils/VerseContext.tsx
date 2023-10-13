import { createContext, useContext, useState, ReactNode } from "react"
import { colRefVerses } from "./firebase"
import { getDocs } from "firebase/firestore"

interface selectedVerse {
  id: string
  category: string
  text: string
}

interface VerseContextType {
  verses: any[]
  selectedVerse: selectedVerse | null
  saveSelectedVerse: (selectedVerse: selectedVerse) => void
  currentCategory: string
  saveCurrentCategory: (category: string) => void
  getAllVerses: () => void
}
const VerseContext = createContext<VerseContextType | undefined>(undefined)

export function useVerseContext() {
  const context = useContext(VerseContext)
  if (context === undefined) {
    throw new Error("useVerseContext must be used within a VerseProvider")
  }
  return context
}

export function VerseProvider({ children }: { children: ReactNode }) {
  const [verses, setVerses] = useState<any[]>(() => {
    const saved = localStorage.getItem("verses")
    const initialValue = saved ? JSON.parse(saved) : ""
    return [initialValue]
  })
  const [selectedVerse, setSelectedVerse] = useState<selectedVerse | null>(() => {
    const saved = localStorage.getItem("selectedVerse")
    const initialValue = saved ? JSON.parse(saved) : null // Initialize to null if not found

    return initialValue
  })
  const [currentCategory, setCurrentCategory] = useState(() => {
    const saved = localStorage.getItem("currentCategory")
    const initialValue = saved ? JSON.parse(saved) : "" // Initialize to null if not found

    return initialValue
  })

  const saveSelectedVerse = (selectedVerse: selectedVerse) => {
    setSelectedVerse(selectedVerse)
    localStorage.setItem("selectedVerse", JSON.stringify(selectedVerse))
  }
  const saveCurrentCategory = (currentCategory: string) => {
    setCurrentCategory(currentCategory)
    localStorage.setItem("currentCategory", JSON.stringify(currentCategory))
  }

  const getAllVerses = async () => {
    try {
      const savedData = localStorage.getItem("verses")

      if (savedData) {
        // Data is available in local storage, parse and set it
        const parsedData = JSON.parse(savedData)
        setVerses(parsedData)
      } else {
        // Data is not available in local storage, fetch from the database
        const querySnapshot = await getDocs(colRefVerses)
        const versesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setVerses(versesData)
        localStorage.setItem("verses", JSON.stringify(versesData))
      }
    } catch (error) {
      console.error("Error fetching verses:", error)
    }
  }

  const contextValue: VerseContextType = {
    verses,
    selectedVerse,
    saveSelectedVerse,
    saveCurrentCategory,
    currentCategory,
    getAllVerses,
  }
  return <VerseContext.Provider value={contextValue}>{children}</VerseContext.Provider>
}
