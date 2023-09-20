import { createContext, useContext, useState, ReactNode } from "react"
import { colRefCategories, colRefVerses } from "./firebase"
import { getDoc, doc } from "firebase/firestore"

interface VerseContextType {
  getCategories: () => void
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
  const [categories, setCategories] = useState<any>(null)

  const getCategories = () => {
    console.log("getting categories.")
    console.log(getDoc(doc(colRefCategories, "selfControl")))
    let docs = "hey"
    setCategories(docs)
    localStorage.setItem("categories", JSON.stringify(categories))
  }

  const contextValue: VerseContextType = {
    getCategories,
  }

  return (
    <VerseContext.Provider value={contextValue}>
      {children}
    </VerseContext.Provider>
  )
}
