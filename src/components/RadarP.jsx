
import React from 'react';
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
            size: 12
          },
          color: '#000'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
      <section className="flex justify-center items-center mt-10 w-full z-10">
        <div
          className="w-full px-4 max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl aspect-square"
          style={{ maxHeight: '450px', margin: '0 auto' }}
        >
          <Radar data={data} options={options} />
        </div>
      </section>
  );
}

export default RadarP;
