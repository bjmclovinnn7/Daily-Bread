import { Card } from "../comps/Card"
import { Link } from "react-router-dom"
import {
  HiSparkles,
  HiHeart,
  HiSearch,
  HiSun,
  HiUserCircle,
} from "react-icons/Hi"
import { HiFire } from "react-icons/Hi"
import Random from "./Random"

const Home = () => {
  return (
    <>
      <div className="relative">
        <div className="h-[15vh] w-full fixed flex justify-between items-center bg-white text-3xl p-5">
          <div>NIV</div>
          <div className="flex justify-center items-center">
            <span>5</span>
            <HiFire className=" text-orange-500" />
          </div>
          <div>Trophy</div>
          <div>Settings</div>
        </div>
        <div className="fixed top-[15vh] h-[70vh] w-full overflow-hidden scroll-smooth bg-blueGray-100">
          <section
            id="today"
            className="h-full grid place-content-center snap-center"
          >
            Verse of the day.
          </section>
          <section
            id="search"
            className="h-full grid place-content-center snap-center"
          >
            Search Comp
          </section>
          <section
            id="popular"
            className="h-full grid place-content-center snap-center"
          >
            Popular Comp
          </section>
          <section
            id="random"
            className="h-full grid place-content-center snap-center"
          >
            <Random />
          </section>
        </div>

        <div className="h-[15vh] flex fixed bottom-0 w-full justify-between items-center p-5 bg-white">
          <Card size={"lg"} variant={"glass3"} className="gap-3">
            <Link to="/profile">
              <HiUserCircle className="pointer-events-none text-white text-4xl" />
            </Link>
          </Card>
          <Card size={"lg"} variant={"glass1"} className="gap-3">
            <a href="#today">
              <HiSun className="pointer-events-none text-white text-4xl" />
            </a>
          </Card>
          <Card size={"lg"} variant={"glass3"} className="gap-3">
            <a href="#search">
              <HiSearch className="pointer-events-none text-white text-4xl" />
            </a>
          </Card>

          <Card size={"lg"} variant={"glass2"} className="gap-3">
            <a href="#popular">
              <HiHeart className="pointer-events-none text-white text-4xl" />
            </a>
          </Card>

          <Card size={"lg"} variant={"glass1"} className="gap-3">
            <a href="#random">
              <HiSparkles className=" text-white pointer-events-none text-4xl" />
            </a>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Home
