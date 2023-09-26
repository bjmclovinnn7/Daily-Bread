import { useNavigate } from "react-router"
import { useVerseContext } from "../../utils/VerseContext"

// Define a type or interface for your verse data
interface Verse {
  id: string
  category: string
  text: string
}

const Salvation = () => {
  const navigate = useNavigate()
  const { verses } = useVerseContext()
  const categories = ["Salvation", "Prayer", "Praise"]

  return (
    <>
      <div className="absolute inset-0 p-2 grid place-content-center overflow-hidden">
        <div className="w-[100vw] text-xl overscroll-contain overflow-auto p-5 space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="bg-white">
              <button
                onClick={() => navigate(`/${category.toLowerCase()}`)}
                className={`text-start w-full h-[5vh] flex justify-between items-center p-5 bg-blueGray-200`}
              >
                <span className="h-full text-2xl font-bold grid place-content-center">
                  {category}
                </span>
                <span>See All</span>
              </button>
              <div className="relative flex h-full overflow-auto snap-x snap-mandatory">
                {verses !== null &&
                  verses
                    .filter(
                      (verse: Verse) =>
                        verse.category === category.toLowerCase()
                    )
                    .map(
                      (
                        verse: Verse // Specify the type of verse as Verse
                      ) => (
                        <section
                          className="grid place-content-center p-5 snap-center"
                          key={verse.id}
                        >
                          <h1 className="text-xl font-bold w-full">
                            {verse.id}
                          </h1>
                          <p className="w-[80vw]">{verse.text}</p>
                        </section>
                      )
                    )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Salvation
