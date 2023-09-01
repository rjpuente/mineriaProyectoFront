import React, { Component } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import './SuspiciousActivityScreen.css'; 

class SuspiciusActivityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actividades: [],
      fechaFiltro: '',
      categoriaFiltro: '',
    };
  }

  componentDidMount() {
    this.cargarActividades();
  }

  cargarActividades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/actividades-sospechosas');
      
      // Verificar si response.data es un objeto
      if (typeof response.data === 'object' && Object.keys(response.data).length > 0) {
        const actividades = Object.values(response.data).map((actividad) => {
          let categoria;
          switch (actividad.categoria) {
            case 0:
              categoria = 'Abuso';
              break;
            case 1:
              categoria = 'Asalto';
              break;
            case 2:
              categoria = 'Peleas';
              break;
            case 4:
            case 5:
              categoria = 'Robo';
              break;
            case 7:
              categoria = 'Vandalismo';
              break;
            default:
              categoria = 'Desconocido';
              break;
          }
          return {
            fecha: actividad.fecha,
            categoria,
          };
        });
        this.setState({ actividades });
      } else {
        console.error('La respuesta de la API no es un objeto con valores:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener las actividades', error);
    }
  };

  filtrarActividades = () => {
    const { fechaFiltro, categoriaFiltro } = this.state;
    const actividadesFiltradas = this.state.actividades.filter((actividad) => {
      if (fechaFiltro) {
        const fechaActividadParte = actividad.fecha.split(' ')[0]; // Obtiene la parte de la fecha
        if (fechaActividadParte !== fechaFiltro) {
          return false;
        }
      }
      if (categoriaFiltro && actividad.categoria !== categoriaFiltro) {
        return false;
      }
      return true;
    });
    return actividadesFiltradas;
  };
  

  descargarExcel = () => {
    const actividadesFiltradas = this.filtrarActividades();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Actividades Sospechosas');
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Categoría', key: 'categoria', width: 15 },
    ];

    actividadesFiltradas.forEach((actividad) => {
      worksheet.addRow(actividad);
    });

    const buffer = workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'actividades_sospechosas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  render() {
    const actividadesFiltradas = this.filtrarActividades();
    return (
      <div className="container">
        <h1>Actividades Sospechosas</h1>
        <div className="filter-container">
          <div className="filter-item">
            <label>Fecha:</label>
            <input
              type="text"
              value={this.state.fechaFiltro}
              onChange={(e) => this.setState({ fechaFiltro: e.target.value })}
              className="input-style"
            />
          </div>
          <div className="filter-item">
            <label>Categoría:</label>
            <input
              type="text"
              value={this.state.categoriaFiltro}
              onChange={(e) => this.setState({ categoriaFiltro: e.target.value })}
              className="input-style"
            />
          </div>
        </div>
        <ul>
          {actividadesFiltradas.map((actividad, index) => (
            <li key={index} className="activity-item">
              {actividad.fecha} - {actividad.categoria}
            </li>
          ))}
        </ul>
        <button onClick={this.descargarExcel} className="download-button">
          Descargar Excel
        </button>
      </div>
    );
  }
}

export default SuspiciusActivityScreen;
