import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <section className="w-full h-[100vh] flex justify-center items-center gap-4 p-6">
        <Card size={"md"} variant={"glass"} className="">
          <div className="grid place-items-center h-full w-full ">
            <div className="text-2xl text-black font-bold text-center">
              Want a challenge? Learn a random verse!
            </div>
            <Button
              size={"lg"}
              variant={"outline"}
              whileHover={{ scale: 1.1 }}
              className="text-3xl font-bold"
            >
              <Link to="/random">Let's go!</Link>
            </Button>
          </div>
        </Card>
        <Card size={"md"} variant={"glass"} className="">
          <Button whileHover={{ scale: 1.1 }}>
            <Link to="/popular">The Essentials!</Link>
          </Button>
        </Card>
        <Card size={"md"} variant={"glass"} className="">
          <Button whileHover={{ scale: 1.1 }}>
            <Link to="/search">Search it!</Link>
          </Button>
        </Card>
      </section>
    </>
  )
}
export default Home
