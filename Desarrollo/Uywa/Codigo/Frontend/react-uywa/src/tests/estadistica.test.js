import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import  { MONTH_NAMES, CHARTERS } from '../pages/google/EstadisticaAlertUI';
import { BrowserRouter } from 'react-router-dom';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

global.fetch = jest.fn();


describe('Constantes y Estados Iniciales', () => {
    test('debería tener las constantes MONTH_NAMES correctamente definidas', () => {
      expect(MONTH_NAMES).toEqual([
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ]);
    });

    test('debería tener las constantes CHARTERS correctamente definidas', () => {
        expect(CHARTERS).toEqual([
          { id: 'date', label: 'Reportes por Fechas' },
          { id: 'animal', label: 'Reportes por Animales' },
          { id: 'region', label: 'Reportes por Region' },
          { id: 'comparison', label: 'Comparación de Reportes' }
        ]);
      });

  test('debería inicializar los estados correctamente', () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    // Verificar que el estado inicial del gráfico es 'date'
    expect(screen.getByDisplayValue('date')).toBeInTheDocument();
    
    // Verificar que el año inicial es el actual
    const currentYear = new Date().getFullYear();
    expect(screen.getByDisplayValue(currentYear.toString())).toBeInTheDocument();
  });
});

describe('Efectos y Llamadas API', () => {
  const mockReports = [
    {
      id: 1,
      animal_nombre: 'Anaconda',
      fecha_creacion: '2023-01-15T00:00:00.000Z',
      estado: 'aprobado',
      region: 'Lima'
    }
  ];

  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url.includes('alertsByYear')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReports)
        });
      }
      if (url.includes('latestAlerts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockReports[0]])
        });
      }
      return Promise.reject(new Error('URL no mockeada'));
    });
  });

  test('debería llamar a alertsByYear al montar', async () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('alertsByYear')
      );
    });
  });

  test('debería llamar a latestAlerts al montar', async () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://innovatech-ztzv.onrender.com/alertas/latestAlerts'
      );
    });
  });

  test('debería manejar errores en fetchReports', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Error de red')));
    console.error = jest.fn();

    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error al conectarse al back:', expect.any(Error));
    });
  });

  test('debería manejar errores en fetchLatestReports', async () => {
    fetch.mockImplementationOnce((url) => 
      url.includes('latestAlerts') 
        ? Promise.reject(new Error('Error de red')) 
        : Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );
    console.error = jest.fn();

    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error al conectarse al back:', expect.any(Error));
    });
  });
});

describe('Transformación de Datos', () => {
  const mockReports = [
    {
      id: 1,
      animal_nombre: 'Anaconda',
      fecha_creacion: '2023-01-15T00:00:00.000Z',
      estado: 'aprobado',
      region: 'Lima'
    },
    {
      id: 2,
      animal_nombre: 'Boa',
      fecha_creacion: '2023-02-20T00:00:00.000Z',
      estado: 'rechazado',
      region: 'Arequipa'
    }
  ];

  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockReports)
    });
  });

  test('debería transformar datos para filteredData', async () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Verificar que se procesaron los datos para el gráfico por fechas
      expect(screen.getByText('Fechas Reports')).toBeInTheDocument();
    });
  });

  test('debería transformar datos para animalData', async () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    // Cambiar a gráfico por animales
    fireEvent.change(screen.getByLabelText('Gráfico Estadístico'), {
      target: { value: 'animal' }
    });

    await waitFor(() => {
      expect(screen.getByText('Animal Reports')).toBeInTheDocument();
    });
  });

  test('debería transformar datos para regionData', async () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    // Cambiar a gráfico por regiones
    fireEvent.change(screen.getByLabelText('Gráfico Estadístico'), {
      target: { value: 'region' }
    });

    await waitFor(() => {
      expect(screen.getByText('Region Reports')).toBeInTheDocument();
    });
  });

  test('debería transformar datos para aprobadoData y rechazadoData', async () => {
    render(
      <BrowserRouter>
        <EstadisticaUI />
      </BrowserRouter>
    );

    // Cambiar a gráfico de comparación
    fireEvent.change(screen.getByLabelText('Gráfico Estadístico'), {
      target: { value: 'comparison' }
    });

    await waitFor(() => {
      expect(screen.getByText('Aprobados')).toBeInTheDocument();
      expect(screen.getByText('Rechazados')).toBeInTheDocument();
    });
  });
});