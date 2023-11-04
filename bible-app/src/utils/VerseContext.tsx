import { createContext, useContext, useState, ReactNode } from "react"

interface SelectedVerse {
  id: string
  category: string
  translations: {
    NIV: string
    ESV: string
    KJV: string
  }
}

interface VerseContextType {
  selectedVerse: SelectedVerse | null
  saveSelectedVerse: (selectedVerse: SelectedVerse) => void
  currentCategory: string
  saveCurrentCategory: (category: string) => void
  translation: string
  saveTranslation: (translation: string) => void
  changeLearnMethods: (oneLetterMode: boolean) => void
  oneLetterMode: boolean
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
  const [selectedVerse, setSelectedVerse] = useState<SelectedVerse | null>(() => {
    const saved = localStorage.getItem("selectedVerse")
    const initialValue = saved ? JSON.parse(saved) : null // Initialize to null if not found

    return initialValue
  })
  const [currentCategory, setCurrentCategory] = useState(() => {
    const saved = localStorage.getItem("currentCategory")
    const initialValue = saved ? JSON.parse(saved) : "" // Initialize to null if not found

    return initialValue
  })
  const [translation, setTranslation] = useState(() => {
    const saved = localStorage.getItem("translation")
    const initialValue = saved ? JSON.parse(saved) : "NIV" // Initialize to null if not found

    return initialValue
  })
  const [oneLetterMode, setOneLetterMode] = useState(() => {
    const saved = localStorage.getItem("oneWordMode")
    const initialValue = saved ? JSON.parse(saved) : false // Initialize to null if not found
    return initialValue
  })

  const changeLearnMethods = () => {
    setOneLetterMode(!oneLetterMode)
  }

  const saveTranslation = (translation: string) => {
    setTranslation(translation)
    localStorage.setItem("translation", JSON.stringify(translation))
  }

  const saveSelectedVerse = (selectedVerse: SelectedVerse) => {
    setSelectedVerse(selectedVerse)
    localStorage.setItem("selectedVerse", JSON.stringify(selectedVerse))
  }
  const saveCurrentCategory = (currentCategory: string) => {
    setCurrentCategory(currentCategory)
    localStorage.setItem("currentCategory", JSON.stringify(currentCategory))
  }

  const contextValue: VerseContextType = {
    translation,
    saveTranslation,
    selectedVerse,
    saveSelectedVerse,
    saveCurrentCategory,
    currentCategory,
    changeLearnMethods,
    oneLetterMode,
  }
  return <VerseContext.Provider value={contextValue}>{children}</VerseContext.Provider>
}
