import Random from "./Random"
import Popular from "./Popular"
import Search from "./Search"

const Home = () => {
  return (
    <>
      <div className="h-full flex justify-center items-center p-5">
        <Random />
        {/* <Popular />
        <Search /> */}
      </div>
    </>
  )
}
export default Home
