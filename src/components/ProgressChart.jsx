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

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8000"   // your local backend
  : "https://techfluent.onrender.com";  // deployed backend


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
      .get(`${BASE_URL}/api/get_interview_progress/`, {
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
        <h2 className="text-xl font-bold">Progress Chart Not Available</h2>
      </div>
    );
  }

  const labels = data.map((entry) => entry.date);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Fluency",
        data: data.map((entry) => Number(entry.fluency)),
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
      {
        label: "Grammar",
        data: data.map((entry) => Number(entry.grammar)),
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
      {
        label: "Content Structure",
        data: data.map((entry) => Number(entry.content_structure)),
        borderColor: "rgba(255, 206, 86, 1)",
        fill: false,
      },
      {
        label: "Accuracy",
        data: data.map((entry) => Number(entry.accuracy)),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "Vocabulary",
        data: data.map((entry) => Number(entry.vocabulary)),
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
      {
        label: "Coherence",
        data: data.map((entry) => Number(entry.coherence)),
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
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          },
        },
      },
    },
  };

  return (
    <section className="w-full px-4 mt-8 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Interview Skill Progress Over Time
      </h2>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] max-w-6xl h-[400px] bg-white rounded-lg shadow-md p-4">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </section>
  );
}

export default ProgressChart;
