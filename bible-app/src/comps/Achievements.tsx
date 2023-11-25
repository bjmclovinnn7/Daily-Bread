import { motion } from "framer-motion"
import { GiScrollQuill, GiTrophy, GiBookmarklet, GiMining, GiSpiralLollipop } from "react-icons/gi"
import { FaArrowLeft } from "react-icons/fa"
import { ReactNode } from "react"

interface UserLearnedVerses {
  id: string
  translations: string
  learned: boolean
  category: string
  timeStamp: {
    seconds: number
    nanoseconds: number
  }
}

interface Props {
  achievements: {
    title: string
    goal: number
    description: string
  }[]
  seeAchievements: boolean
  setSeeAchievements: (item: boolean) => void
  learnedVerses: UserLearnedVerses[]
}

const titleToIcon: { [key: string]: ReactNode } = {
  Legendary: <GiTrophy className="h-20 w-20 text-yellow-500" />,
  Scholar: <GiScrollQuill className="h-20 w-20 text-[#fff5cf]" />,
  Intermediate: <GiBookmarklet className="h-20 w-20 text-[#fac157]" />,
  Novice: <GiMining className="h-20 w-20 text-[#968464]" />,
  Newbie: <GiSpiralLollipop className="h-20 w-20 text-[#ba7ec2]" />,
}

const Achievements = ({ achievements, setSeeAchievements, seeAchievements, learnedVerses }: Props) => {
  return (
    <div
      className={`${seeAchievements ? "absolute inset-0 grid gap-4 overflow-auto" : "grid gap-4"} bg-[#444444] p-4 `}
    >
      {seeAchievements && (
        <div className="relative block text-center h-fit">
          <button onClick={() => setSeeAchievements(false)} className="absolute inset-0">
            <FaArrowLeft className="text-3xl md:text-5xl lg:text-5xl" />
          </button>
          <span className="text-3xl md:text-5xl lg:text-5xl text-white text-center font-bold">Achievements</span>
        </div>
      )}

      {achievements.map((achievement, index) => {
        const progress = (learnedVerses.length / achievement.goal) * 100
        const IconComponent: ReactNode = titleToIcon[achievement.title]

        return (
          <div key={index} className="w-full max-w-2xl mx-auto">
            <div className="border-2 p-4 rounded-xl h-fit">
              <div className="flex justify-center gap-4">
                <div className="grid place-content-center">
                  {IconComponent ? (
                    <div
                      className={`bg-[#696969] rounded-xl ${
                        achievement.goal / learnedVerses.length === 1 ? "bg-[#ffd700] text-[#ad9f59]" : "bg-[#444444]"
                      }`}
                    >
                      {IconComponent}
                    </div>
                  ) : (
                    <div>No Icon Available</div>
                  )}
                </div>

                <div className="grid w-full">
                  <div className="flex justify-between">
                    <h1 className="font-bold text-2xl">{achievement.title}</h1>
                    <span>
                      {learnedVerses.length} / {achievement.goal}
                    </span>
                  </div>
                  <div className="bg-white h-4 ">
                    <motion.div
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{
                        type: "spring",
                        damping: 5,
                        stiffness: 100,
                        delay: 1,
                      }}
                      className={`block h-full w-full z-20 bg-yellow-400 `}
                    ></motion.div>
                  </div>
                  <span>{achievement.description}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Achievements
