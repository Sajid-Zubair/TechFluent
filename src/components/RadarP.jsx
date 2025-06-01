import React from 'react'

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function RadarP({ ratings }) {
  // ✅ Construct the radar chart data dynamically from props
  const data = {
    labels: ['Fluency', 'Content Structure', 'Accuracy', 'Grammar', 'Vocabulary', 'Coherence'],
    datasets: [
      {
        label: 'Rating',
        data: [
          ratings.fluency,
          ratings.content_structure,
          ratings.accuracy,
          ratings.grammar,
          ratings.vocabulary,
          ratings.coherence
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1
        },
        pointLabels: {
          font: {
            size: 14
          },
          color: '#000'
        }
      }
    }
  };

  return (
    <div className="flex flex-row justify-center items-center mt-10">
      <div style={{ width: '450px', height: '450px' }} className="ml-64 flex flex-col justify-center items-center">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}

export default RadarP;
