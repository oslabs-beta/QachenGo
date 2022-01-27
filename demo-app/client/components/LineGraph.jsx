import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ metrics, width, height }) => {
  const state = {
    labels: [],
    datasets: [
      {
        label: ' ms',
        fill: false,
        lineTension: 0.35,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: [],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Cache Speed',
      },
      legend: {
        display: false,
      },
    },
  };

  state.labels = metrics.labels;
  state.datasets[0].data = metrics.data;

  return (
    <>
      <Line width={width} height={height} data={state} options={options} />
    </>
  );
};

export default LineGraph;
