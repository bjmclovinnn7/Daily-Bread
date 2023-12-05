import { createContext, useContext, useState, ReactNode } from "react"

interface SelectedVerse {
  id: string
  category: string
  translations: {
    NIV: string
    ESV: string
    KJV: string
    NKJV: string
  }
}

interface VerseContextType {
  selectedVerse: SelectedVerse | null
  saveSelectedVerse: (selectedVerse: SelectedVerse) => void
  currentCategory: string
  saveCurrentCategory: (category: string) => void
  translation: string
  saveTranslation: (translation: string) => void
  changeLearnMethods: () => void
  oneLetterMode: boolean
  changeHints: () => void
  hintsOn: boolean
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
  const [hintsOn, setHintsOff] = useState(() => {
    const saved = localStorage.getItem("hints")
    const initialValue = saved ? JSON.parse(saved) : false // Initialize to null if not found
    return initialValue
  })

  const changeLearnMethods = () => {
    const updatedLearnMethod = !oneLetterMode
    setOneLetterMode(updatedLearnMethod)
    localStorage.setItem("oneWordMode", JSON.stringify(oneLetterMode))
  }

  const changeHints = () => {
    const updatedHintsOn = !hintsOn
    setHintsOff(updatedHintsOn)
    localStorage.setItem("hints", JSON.stringify(updatedHintsOn))
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
    hintsOn,
    changeHints,
  }
  return <VerseContext.Provider value={contextValue}>{children}</VerseContext.Provider>
}
