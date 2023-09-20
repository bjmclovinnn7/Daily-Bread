import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { Link } from "react-router-dom"
import { useVerseContext } from "../utils/VerseContext"
import { GiWhiteBook } from "react-icons/gi"
import { GrNext } from "react-icons/gr"

const Random = () => {
  const { getCategories } = useVerseContext() // Use the verse context

  return (
    <>
      <div className="h-full p-5 ">
        <Card size={"lg"} variant={"default"} className="h-full">
          <div className="h-[55vh] rounded-2xl space-y-5 p-2 text-black">
            <div>Hey</div>
          </div>
          <div className="flex justify-between w-1/2 p-2">
            <Button
              size={"default"}
              variant={"default"}
              whileHover={{ scale: 1.1 }}
            >
              <Link to="/learn">
                <GiWhiteBook className="text-black h-10 w-10" />
              </Link>
            </Button>
            <Button
              size={"default"}
              variant={"default"}
              onClick={() => getCategories()}
              whileHover={{ scale: 1.1 }}
            >
              <GrNext className="h-10 w-10" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default Random
