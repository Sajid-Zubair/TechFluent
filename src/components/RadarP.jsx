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

export const data = {
  labels: ['Fluency', 'Content Structure', 'Vocabulary', 'Accuracy', 'Coherence', 'Relevance'],
  datasets: [
    {
      label: 'Rating',
      data: [8.6, 9, 4, 9,7,5],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

function RadarP() {
  return (
    <div className="flex flex-row justify-center items-center mt-10">
        <div style={{ width: '450px', height: '450px' }} className="ml-64 flex flex-col justify-center items-center">
            <Radar options={
              {
                scales: {
                  r:{
                    pointLabels: {
                      font: {
                        size: 14
                      },
                      color: '#000'
                    }
                  }
              }
            } 
          }data={data} />
        </div>
    </div>
  )
}

export default RadarP
