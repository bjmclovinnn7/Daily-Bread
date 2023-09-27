import { Card } from "../comps/Card"
import { Link } from "react-router-dom"
import { HiSparkles, HiHeart, HiSearch, HiSun, HiUserCircle } from "react-icons/Hi"
import { HiFire } from "react-icons/Hi"

import Categories from "./Categories/Categories"

const Home = () => {
  return (
    <>
      <div className="relative">
        <div className="h-[10vh] w-full fixed flex justify-between items-center bg-white text-3xl p-5">
          <div>NIV</div>
          <div className="flex justify-center items-center">
            <span>5</span>
            <HiFire className=" text-orange-500" />
          </div>
          <div>Trophy</div>
          <div>Settings</div>
        </div>
        <div className="fixed top-[10vh] h-[75vh] w-full bg-blueGray-100 overflow-auto">
          <Categories />
        </div>

        <div className="h-[15vh] flex fixed bottom-0 w-full justify-between items-center p-5 bg-white">
          <Card size={"lg"} variant={"glass3"} className="gap-3">
            <Link to="/profile">
              <HiUserCircle className="pointer-events-none text-white text-4xl" />
            </Link>
          </Card>
          <Card size={"lg"} variant={"glass1"} className="gap-3">
            <HiSun className="pointer-events-none text-white text-4xl" />
          </Card>
          <Card size={"lg"} variant={"glass3"} className="gap-3">
            <HiSearch className="pointer-events-none text-white text-4xl" />
          </Card>

          <Card size={"lg"} variant={"glass2"} className="gap-3">
            <HiHeart className="pointer-events-none text-white text-4xl" />
          </Card>

          <Card size={"lg"} variant={"glass1"} className="gap-3">
            <HiSparkles className=" text-white pointer-events-none text-4xl" />
          </Card>
        </div>
      </div>
    </>
  )
}

export default Home
