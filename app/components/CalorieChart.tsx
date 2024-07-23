import { Line } from 'react-chartjs-2';
import { ChartData } from 'chart.js/auto';

interface CalorieChartProps {
  data: ChartData<'line'>;
}

const CalorieChart: React.FC<CalorieChartProps> = ({ data }) => (
  <div>
    <Line data={data} />
  </div>
);

export default CalorieChart;
