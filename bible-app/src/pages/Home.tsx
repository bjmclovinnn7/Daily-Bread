import { Link } from "react-router-dom"
import { HiUserCircle } from "react-icons/Hi"
import { HiFire } from "react-icons/Hi"

import Categories from "./Categories/Categories"

const Home = () => {
  return (
    <>
      <div className="h-full w-full relative">
        <div className="h-[10vh] w-full fixed flex justify-between items-center bg-white text-3xl p-5 z-20">
          <div>NIV</div>
          <div className="flex justify-center items-center">
            <span>5</span>
            <HiFire className=" text-orange-500" />
          </div>
          <div>Trophy</div>
          <div>
            <Link to="/profile">
              <HiUserCircle className="pointer-events-none text-black h-12 w-12" />
            </Link>
          </div>
        </div>
        <div className="category pt-[12vh] h-screen w-full overflow-y-auto p-3  bg-gradient-to-r from-violet-500/60 to-fuchsia-500/60 -z-10">
          <Categories />
        </div>

        {/* <div className="h-[15vh] flex fixed bottom-0 w-full justify-between items-center p-5 bg-white">
          <Card size={"md"} variant={"glass3"} className="gap-3">
           
          </Card>
          <Card size={"md"} variant={"glass1"} className="gap-3">
            <HiSun className="pointer-events-none text-white text-4xl" />
          </Card>
          <Card size={"md"} variant={"glass3"} className="gap-3">
            <HiSearch className="pointer-events-none text-white text-4xl" />
          </Card>

          <Card size={"md"} variant={"glass2"} className="gap-3">
            <HiHeart className="pointer-events-none text-white text-4xl" />
          </Card>

          <Card size={"md"} variant={"glass1"} className="gap-3">
            <HiSparkles className=" text-white pointer-events-none text-4xl" />
          </Card>
        </div> */}
      </div>
    </>
  )
}

export default Home
