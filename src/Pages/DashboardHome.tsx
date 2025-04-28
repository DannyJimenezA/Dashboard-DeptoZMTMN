import { useEffect, useState } from 'react';
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
import ApiService from '../Components/ApiService';
import ApiRoutes from '../Components/ApiRoutes';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Solicitud {
  id: number;
  Date: string;
  status: 'Pendiente' | 'Aprobada' | 'Denegada';
}

export default function DashboardHome() {
  const [solicitudes, setSolicitudes] = useState<Record<string, Solicitud[]>>({});
  const [loading, setLoading] = useState(true);
  const [anioSeleccionado, setAnioSeleccionado] = useState<string>('todos');
  const [mesSeleccionado, setMesSeleccionado] = useState<string>('todos');

  const tipos = ['citas', 'denuncias', 'concesiones','prorrogas', 'expedientes',  'precarios', 'planos'] as const;

  useEffect(() => {
    const fetchAllSolicitudes = async () => {
      try {
        const solicitudesPorTipo: Record<string, Solicitud[]> = {};

        await Promise.all(
          tipos.map(async (tipo) => {
            const data = await ApiService.get<Solicitud[]>(ApiRoutes[tipo]);
            solicitudesPorTipo[tipo] = data;
          })
        );

        setSolicitudes(solicitudesPorTipo);
      } catch (error) {
        console.error('Error cargando solicitudes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSolicitudes();
  }, []);

  const añosDisponibles = Array.from(
    new Set(
      Object.values(solicitudes)
        .flat()
        .map((sol) => {
          if (!sol.Date) return null;
          const fecha = new Date(sol.Date);
          return isNaN(fecha.getTime()) ? null : fecha.getFullYear();
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

  const filtrarSolicitudes = (solicitudes: Solicitud[], tipo: string) => {
    return solicitudes.filter((sol) => {
      let fecha: Date;
  
      if (tipo === 'citas' && (sol as any).availableDate?.date) {
        fecha = new Date((sol as any).availableDate.date);  // 👈 Tomar el campo correcto
      } else {
        fecha = new Date((sol as any).Date); // Normalmente usar `Date`
      }
  
      if (isNaN(fecha.getTime())) return false; // 🚫 Ignorar si la fecha no es válida
  
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
        backgroundColor: '#fbbf24', // Amarillo
      },
      {
        label: 'Aprobadas',
        data: dataGraficada.map((d) => d.aprobadas),
        backgroundColor: '#10b981', // Verde
      },
      {
        label: 'Denegadas',
        data: dataGraficada.map((d) => d.denegadas),
        backgroundColor: '#ef4444', // Rojo
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

  if (loading) return <p className="text-gray-500 p-4">Cargando resumen...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Resumen de Solicitudes</h1>

      {/* Filtros */}
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

        {/* <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          {mesesDisponibles.map((mes) => (
            <option key={mes.value} value={mes.value}>
              {mes.label}
            </option>
          ))}
        </select> */}
        <select
  value={mesSeleccionado}
  onChange={(e) => setMesSeleccionado(e.target.value)}
  className="border border-gray-300 rounded p-2"
  disabled={anioSeleccionado === 'todos'} // 🚨 Se desactiva si no se ha elegido año
>
  {mesesDisponibles.map((mes) => (
    <option key={mes.value} value={mes.value}>
      {mes.label}
    </option>
  ))}
</select>

      </div>

      {/* Tarjetas de conteo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {dataGraficada.map(({ tipo, pendientes, aprobadas, denegadas }) => (
          <div key={tipo} className="bg-white rounded shadow p-4 text-center">
            <p className="text-sm uppercase text-gray-500">{tipo}</p>
            {/* <p className="text-lg font-semibold text-yellow-500">🕒 {pendientes}</p>
            <p className="text-lg font-semibold text-green-600">✔️ {aprobadas}</p>
            <p className="text-lg font-semibold text-red-500">❌ {denegadas}</p> */}
            <p className="text-lg font-semibold text-black-500"> {pendientes + aprobadas + denegadas}</p>
          </div>
        ))}
        <div className="bg-blue-500 text-white rounded shadow p-4 flex flex-col items-center justify-center">
          <p className="text-sm uppercase">Total Solicitudes</p>
          <p className="text-2xl font-bold">{totalSolicitudes}</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Distribución Comparativa</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
