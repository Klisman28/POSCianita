import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { apiGetSales } from '../services/transaction/SaleService';

const Home = () => {
  const salesData = useSelector((state) => state.auth.user);
  const [salesList, setSalesList] = useState([]);

  // Estado para configurar los datos del gráfico
  const [chartData, setChartData] = useState({
    series: [{ name: 'Ventas', data: [] }],
    options: {
      chart: { height: 350, type: 'bar' },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: { categories: [] },
      title: {
        text: `Ventas en el tiempo - ${salesData.username} (${salesData.owner})`,
      },
      colors: ['#D3D3D3'],  // Gris claro para las barras

    },
  });

  // Se ejecuta al montar el componente: llama al endpoint y setea ventas
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await apiGetSales();
        // console.log('Respuesta completa:', response);
        // Tu array de ventas está en response.data.data.sales
        setSalesList(response.data.data.sales);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    fetchSales();
  }, []);

  // Se ejecuta cada vez que cambie salesList para armar los datos del gráfico
  useEffect(() => {
    if (salesList.length > 0) {
      // Agrupar ventas por fecha (dateIssue)
      const ventasPorFecha = salesList.reduce((acumulador, venta) => {
        // Asegúrate de convertir el total a número
        const totalVenta = parseFloat(venta.total || '0');
        const fecha = venta.dateIssue; // "2025-03-17", por ejemplo

        if (!acumulador[fecha]) {
          acumulador[fecha] = 0;
        }
        acumulador[fecha] += totalVenta;
        return acumulador;
      }, {});

      // Obtener las fechas ordenadas y los totales correspondientes
      const fechas = Object.keys(ventasPorFecha).sort(); 
      // (Si "sort()" te ordena alfabéticamente y quieres orden real de fechas,
      //  tendrías que transformarlas a objetos Date y ordenarlas por fecha).
      
      const totales = fechas.map((fecha) => ventasPorFecha[fecha]);

      // Actualizar el estado del gráfico
      setChartData({
        series: [{ name: 'Ventas', data: totales }],
        options: {
          chart: { height: 350, type: 'bar' },
          plotOptions: { bar: { horizontal: false } },
          xaxis: { categories: fechas },
          title: {
            text: `Ventas en el tiempo - ${salesData.username} (${salesData.owner})`,
          },
        },
      });
    }
  }, [salesList, salesData.username, salesData.owner]);

  return (
    <div>
      <h4>
        <p>
          <strong>Bienvenido</strong> {salesData.username}
        </p>
      </h4>
      
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Home;
