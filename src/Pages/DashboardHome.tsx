import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useSolicitudesGraficas } from '../context/SolicitudesGraficasContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardHome() {
  const { solicitudes, loadingSolicitudes } = useSolicitudesGraficas();
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>('todos');
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('todos');

  const tipos = ['citas', 'denuncias', 'concesiones', 'prorrogas', 'expedientes', 'precarios', 'planos'] as const;

  const añosDisponibles = Array.from(
    new Set(
      Object.values(solicitudes)
        .flat()
        .map((sol) => {
          const fecha = sol.Date ? new Date(sol.Date) : sol.availableDate ? new Date(sol.availableDate.date) : null;
          return fecha && !isNaN(fecha.getTime()) ? fecha.getFullYear() : null;
        })
        .filter((year): year is number => year !== null)
    )
  ).sort((a, b) => b - a);

  const handleAnioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAnio = e.target.value;
    setAnioSeleccionado(selectedAnio);
    if (selectedAnio === 'todos') {
      setMesSeleccionado('todos');
    }
  };

  const mesesDisponibles = [
    { value: 'todos', label: 'Todos los Meses' },
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  const filtrarSolicitudes = (solicitudesArray: any[], tipo: string) => {
    return solicitudesArray.filter((sol) => {
      let fecha: Date;

      if (tipo === 'citas' && sol.availableDate?.date) {
        fecha = new Date(sol.availableDate.date);
      } else {
        fecha = new Date(sol.Date);
      }

      if (isNaN(fecha.getTime())) return false;

      const año = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;

      const cumpleAnio = anioSeleccionado === 'todos' || año === Number(anioSeleccionado);
      const cumpleMes = mesSeleccionado === 'todos' || mes === Number(mesSeleccionado);

      return cumpleAnio && cumpleMes;
    });
  };

  const dataGraficada = tipos.map((tipo) => {
    const solicitudesFiltradas = filtrarSolicitudes(solicitudes[tipo] || [], tipo);
    const pendientes = solicitudesFiltradas.filter((s) => s.status === 'Pendiente').length;
    const aprobadas = solicitudesFiltradas.filter((s) => s.status === 'Aprobada').length;
    const denegadas = solicitudesFiltradas.filter((s) => s.status === 'Denegada').length;
    return { tipo, pendientes, aprobadas, denegadas };
  });

  const totalSolicitudes = dataGraficada.reduce(
    (acc, tipo) => acc + tipo.pendientes + tipo.aprobadas + tipo.denegadas,
    0
  );

  const chartData = {
    labels: tipos.map((t) => t),
    datasets: [
      {
        label: 'Pendientes',
        data: dataGraficada.map((d) => d.pendientes),
        backgroundColor: '#fbbf24',
      },
      {
        label: 'Aprobadas',
        data: dataGraficada.map((d) => d.aprobadas),
        backgroundColor: '#10b981',
      },
      {
        label: 'Denegadas',
        data: dataGraficada.map((d) => d.denegadas),
        backgroundColor: '#ef4444',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (loadingSolicitudes) return <p className="text-gray-500 p-4">Cargando resumen...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Resumen de Solicitudes</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={anioSeleccionado}
          onChange={handleAnioChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="todos">Todos los Años</option>
          {añosDisponibles.map((año) => (
            <option key={año} value={año}>
              {año}
            </option>
          ))}
        </select>

        <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border border-gray-300 rounded p-2"
          disabled={anioSeleccionado === 'todos'}
        >
          {mesesDisponibles.map((mes) => (
            <option key={mes.value} value={mes.value}>
              {mes.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {dataGraficada.map(({ tipo, pendientes, aprobadas, denegadas }) => (
          <div key={tipo} className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm uppercase text-gray-500">{tipo}</p>
            <p className="text-lg font-semibold text-black-500">
              {pendientes + aprobadas + denegadas}
            </p>
          </div>
        ))}
        <div className="bg-blue-500 text-white rounded shadow p-4 flex flex-col items-center justify-center">
          <p className="text-sm uppercase">Total Solicitudes</p>
          <p className="text-2xl font-bold">{totalSolicitudes}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Distribución Comparativa</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

