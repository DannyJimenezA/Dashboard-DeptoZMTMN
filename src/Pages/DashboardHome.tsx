// src/Pages/DashboardHome.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardHome() {
  const solicitudes = {
    denuncias: 12,
    concesiones: 7,
    expedientes: 18,
    prórrogas: 5,
  };

  const chartData = {
    labels: Object.keys(solicitudes),
    datasets: [
      {
        label: 'Solicitudes por tipo',
        data: Object.values(solicitudes),
        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Resumen de Solicitudes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(solicitudes).map(([key, value]) => (
          <div key={key} className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm uppercase text-gray-500">{key}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Distribución de Solicitudes</h2>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
