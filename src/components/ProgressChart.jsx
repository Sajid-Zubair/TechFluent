
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function ProgressChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    axios
      .get("http://localhost:8000/api/get_interview_progress/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Progress chart fetch error:", err);
        setError("Failed to load chart data.");
      });
  }, []);

  if (error) {
    return (
      <div className="text-red-500 font-semibold mt-4 text-center">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
            <div className="text-center py-6 text-gray-600">
              <h2 className="text-xl font-bold">Progess Chart Not Available</h2>
            </div>
    );
  }

  const labels = data.map((entry) => entry.date);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Fluency",
        data: data.map((entry) => entry.fluency),
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
      {
        label: "Grammar",
        data: data.map((entry) => entry.grammar),
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
      {
        label: "Content Structure",
        data: data.map((entry) => entry.content_structure),
        borderColor: "rgba(255, 206, 86, 1)",
        fill: false,
      },
      {
        label: "Accuracy",
        data: data.map((entry) => entry.accuracy),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "Vocabulary",
        data: data.map((entry) => entry.vocabulary),
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
      {
        label: "Coherence",
        data: data.map((entry) => entry.coherence),
        borderColor: "rgba(255, 159, 64, 1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <section className="w-full px-4 mt-8 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Interview Skill Progress Over Time
      </h2>

      {/* Responsive horizontal scroll on small screens */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] max-w-6xl h-[400px] bg-white rounded-lg shadow-md p-4">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </section>
  );
}

export default ProgressChart;
