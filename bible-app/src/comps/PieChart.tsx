import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

function PieChart({ chartData }: any) {
  ChartJS.defaults.font.size = 20
  ChartJS.defaults.color = "black"
  ChartJS.defaults.font.weight = "bold"
  return (
    <Pie
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "left",
            labels: {
              usePointStyle: true,
            },
          },
        },
      }}
    />
  )
}
export default PieChart
