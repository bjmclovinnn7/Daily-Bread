import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react"

interface VerseContextType {
  verseData: {
    name: string
    chapter: string
    versecount: string
    verse: string
  }
  setVerseData: Dispatch<
    SetStateAction<{
      name: string
      chapter: string
      versecount: string
      verse: string
    }>
  >
}

const VerseContext = createContext<VerseContextType | undefined>(undefined)

// ...

export function useVerseContext() {
  const context = useContext(VerseContext)
  if (context === undefined) {
    throw new Error("useVerseContext must be used within a VerseProvider")
  }
  return context
}

export function VerseProvider({ children }: { children: ReactNode }) {
  const [verseData, setVerseData] = useState({
    name: "",
    chapter: "",
    versecount: "",
    verse: "",
  })

  const contextValue: VerseContextType = {
    verseData,
    setVerseData,
  }

  return (
    <VerseContext.Provider value={contextValue}>
      {children}
    </VerseContext.Provider>
  )
}

// ...
