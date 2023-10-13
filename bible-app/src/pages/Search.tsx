import { Card } from "../comps/Card"
import { Button } from "../comps/Button"
const Search = () => {
  return (
    <>
      <Card size={"default"} variant={"default"} className="text-4xl gap-4">
        <div className="bg-white w-full flex justify-center items-center rounded-2xl font-header">Search</div>
        <div className="bg-white w-full h-32 flex justify-center items-center rounded-2xl">Verse Goes Here</div>
        <div className="flex justify-between w-full">
          <Button>Learn Verse</Button>
          <Button>New Verse</Button>
        </div>
      </Card>
    </>
  )
}
export default Search
