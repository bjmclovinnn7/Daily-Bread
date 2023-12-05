import { motion } from "framer-motion"

interface Props {
  setShowPwaInstallPrompt: (item: boolean) => void
  handlePwaInstall: () => void
}
const PwaPrompt = ({ setShowPwaInstallPrompt, handlePwaInstall }: Props) => {
  return (
    <>
      <div className="absolute grid inset-0 place-content-center bg-black bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 z-50 p-6 font-Inter">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { opacity: 1, x: 0 },
            hidden: { opacity: 1, x: -50 },
          }}
          className="bg-white p-4 rounded-2xl grid gap-4 text-black"
        >
          <div className="text-2xl">Install App</div>
          <h1 className="text-lg">
            For the best user experience, install the app to your homescreen. No app store. No dowload. No Hassle.
          </h1>
          <div className="flex justify-between items-center">
            <button className="border-2 p-2 rounded-2xl bg-gray-200 " onClick={() => setShowPwaInstallPrompt(false)}>
              Dismiss
            </button>
            <button className="border-2 p-2 rounded-2xl bg-gray-200" onClick={() => handlePwaInstall()}>
              Install
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
export default PwaPrompt
