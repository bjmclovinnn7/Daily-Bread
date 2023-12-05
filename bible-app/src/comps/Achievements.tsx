import { motion } from "framer-motion"
import {
  GiScrollQuill,
  GiTrophy,
  GiBookmarklet,
  GiMining,
  GiSpiralLollipop,
  GiBrokenShield,
  GiCheckedShield,
  GiBorderedShield,
} from "react-icons/gi"
import { FaArrowLeft } from "react-icons/fa"
import { ReactNode } from "react"

interface UserLearnedVerses {
  id: string
  translation: string
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
  experience: number
}

const titleToIcon: { [key: string]: ReactNode } = {
  Legendary: <GiTrophy className="h-16 w-16 text-yellow-500" />,
  Scholar: <GiScrollQuill className="h-16 w-16 text-[#fff5cf]" />,
  Intermediate: <GiBookmarklet className="h-16 w-16 text-[#fac157]" />,
  Novice: <GiMining className="h-16 w-16 text-[#968464]" />,
  Newbie: <GiSpiralLollipop className="h-16 w-16 text-[#ba7ec2]" />,
  Gold: <GiBorderedShield className="h-16 w-16 text-[#FFD700]" />,
  Silver: <GiCheckedShield className="h-16 w-16 text-[#c0c0c0]" />,
  Bronze: <GiBrokenShield className="h-16 w-16 text-[#CD7F32]" />,
}

const Achievements = ({ achievements, setSeeAchievements, seeAchievements, learnedVerses, experience }: Props) => {
  return (
    <div className={`${seeAchievements ? "absolute inset-0 grid gap-4 overflow-auto" : "grid gap-4"} bg-black p-4 `}>
      {seeAchievements && (
        <div className="relative block text-center h-fit">
          <button onClick={() => setSeeAchievements(false)} className="absolute inset-0">
            <FaArrowLeft className="text-3xl md:text-5xl lg:text-5xl" />
          </button>
          <span className="text-3xl md:text-5xl lg:text-5xl text-white text-center font-bold">Achievements</span>
        </div>
      )}

      {achievements.map((achievement, index) => {
        const IconComponent: ReactNode = titleToIcon[achievement.title]

        const handleProgressBar = () => {
          let progress
          if (achievement.description.includes("verses")) {
            progress = (learnedVerses.length / achievement.goal) * 100
            return progress
          } else if (achievement.description.includes("XP")) {
            progress = (experience / achievement.goal) * 100
            return progress
          } else {
            progress = 0
            return progress
          }
        }

        const handleGoalType = () => {
          if (achievement.description.includes("verses")) {
            return (
              <span>
                {learnedVerses.length} / {achievement.goal}
              </span>
            )
          } else if (achievement.description.includes("XP")) {
            return (
              <span>
                {experience} / {achievement.goal}
              </span>
            )
          } else {
            return 0
          }
        }

        return (
          <div key={index} className="w-full max-w-2xl mx-auto ">
            <div className="border-2 p-2 rounded-xl h-fit bg-[#444444]">
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
                    {handleGoalType()}
                  </div>
                  <div className="bg-white h-4 ">
                    <motion.div
                      initial={false}
                      animate={{ width: `${handleProgressBar()}%` }}
                      transition={{
                        type: "spring",
                        damping: 5,
                        stiffness: 100,
                        delay: 1,
                      }}
                      className={`block h-full w-full z-20 bg-blue-400 `}
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
