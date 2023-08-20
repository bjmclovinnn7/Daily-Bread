import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { Link } from "react-router-dom"
import { CircleButton } from "../comps/CircleButton"
import { HiSparkles, HiHeart, HiSearch } from "react-icons/Hi"

const Home = () => {
  return (
    <>
      <div className="grid place-content-center gap-4 h-[100vh]">
        <Card size={"lg"} variant={"glass1"} className="gap-3">
          <div className="text-2xl text-white bg-blueGray-700 rounded-xl font-bold text-center border-2 border-white p-2">
            Get a Random Verse!
          </div>
          <Link to="/random">
            <CircleButton
              size={"lg"}
              variant={"outline1"}
              whileHover={{ scale: 1.1, color: "rgb(250, 204, 21)" }}
              className="text-white text-6xl"
            >
              <HiSparkles className="stroke-black stroke-1 pointer-events-none" />
            </CircleButton>
          </Link>
        </Card>

        <Card size={"lg"} variant={"glass2"} className="gap-3">
          <div className="text-2xl text-white bg-blueGray-700 rounded-xl font-bold text-center border-2 border-white p-2 bg-yellow">
            Get a Random Verse!
          </div>
          <Link to="/popular">
            <CircleButton
              size={"lg"}
              variant={"glass2"}
              whileHover={{ scale: 1.1, color: "rgb(250, 204, 21)" }}
              className="text-white text-6xl"
            >
              <HiHeart className="pointer-events-none stroke-black stroke-1" />
            </CircleButton>
          </Link>
        </Card>

        <Card size={"lg"} variant={"glass3"} className="gap-3">
          <div className="text-2xl text-white bg-blueGray-700 rounded-xl font-bold text-center border-2 border-white p-2">
            Get a Random Verse!
          </div>
          <Link to="/search">
            <CircleButton
              size={"lg"}
              variant={"glass3"}
              whileHover={{ scale: 1.1, color: "rgb(250, 204, 21)" }}
              className="text-6xl text-white"
            >
              <HiSearch className="pointer-events-none stroke-black stroke-1" />
            </CircleButton>
          </Link>
        </Card>
      </div>
    </>
  )
}
export default Home
