import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { Link } from "react-router-dom"
import { CircleButton } from "../comps/CircleButton"

const Home = () => {
  return (
    <>
      <div className="grid place-content-center gap-4 h-[100vh]">
        <Card size={"lg"} variant={"outline"}>
          <div className="grid place-items-center h-full w-full ">
            <div className="text-2xl text-black font-bold text-center">
              Get a Random Verse!
            </div>
            <Link to="/random">
              <CircleButton
                size={"lg"}
                variant={"outline1"}
                whileHover={{ scale: 1.1, color: "rgb(248, 207, 80)" }}
                className="text-white text-6xl"
              ></CircleButton>
            </Link>
          </div>
        </Card>
        <Card size={"lg"} variant={"outline"}>
          <Button variant={"outline1"} whileHover={{ scale: 1.1 }}>
            <Link to="/popular">The Essentials!</Link>
          </Button>
        </Card>
        <Card size={"lg"} variant={"outline"}>
          <Button variant={"outline1"} whileHover={{ scale: 1.1 }}>
            <Link to="/search">Search it!</Link>
          </Button>
        </Card>
      </div>
    </>
  )
}
export default Home
