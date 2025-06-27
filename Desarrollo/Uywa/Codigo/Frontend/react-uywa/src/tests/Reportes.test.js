import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Reportes from '../pages/ReportesMod';

// --- MOCKS ---
// Mock de fetch para simular las llamadas a la API
global.fetch = jest.fn();

// Mock de react-router-dom para simular la navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock de los datos de reportes para las pruebas
const mockReports = [
  { id: 1, usuario: { nombre: 'Ana' }, animal_nombre: 'Perro', estado: 'pendiente', descripcion: 'Perro perdido', evidencia_imagen: 'img1.jpg', reporte_detallado: null },
  { id: 2, usuario: { nombre: 'Luis' }, animal_nombre: 'Gato', estado: 'aprobado', descripcion: 'Gato abandonado', evidencia_imagen: null, reporte_detallado: null },
  { id: 3, usuario: { nombre: 'Marta' }, animal_nombre: 'Ave', estado: 'rechazado', descripcion: 'Ave herida', evidencia_imagen: 'img3.jpg', reporte_detallado: 'Información insuficiente' },
  { id: 4, usuario: { nombre: 'Carlos' }, animal_nombre: 'Perro', estado: 'pendiente', descripcion: 'Perro abandonado', evidencia_imagen: 'img4.jpg', reporte_detallado: null },
  { id: 5, usuario: { nombre: 'Luisa' }, animal_nombre: 'Gato', estado: 'aprobado', descripcion: 'Gato perdido', evidencia_imagen: 'img5.jpg', reporte_detallado: null },
  { id: 6, usuario: { nombre: 'Pedro' }, animal_nombre: 'Conejo', estado: 'pendiente', descripcion: 'Conejo encontrado', evidencia_imagen: 'img6.jpg', reporte_detallado: null },
  { id: 7, usuario: { nombre: 'Julia' }, animal_nombre: 'Perro', estado: 'pendiente', descripcion: 'Perro herido', evidencia_imagen: 'img7.jpg', reporte_detallado: null },
  { id: 8, usuario: { nombre: 'Ana' }, animal_nombre: 'Serpiente', estado: 'pendiente', descripcion: 'Serpiente avistada', evidencia_imagen: 'img8.jpg', reporte_detallado: null },
  { id: 9, usuario: { nombre: 'Luis' }, animal_nombre: 'Pez', estado: 'pendiente', descripcion: 'Pez fuera del agua', evidencia_imagen: 'img9.jpg', reporte_detallado: null },
  { id: 10, usuario: { nombre: 'Marta' }, animal_nombre: 'Pez', estado: 'pendiente', descripcion: 'Otro pez', evidencia_imagen: 'img10.jpg', reporte_detallado: null },
  { id: 11, usuario: { nombre: 'Felipe' }, animal_nombre: 'León', estado: 'pendiente', descripcion: 'León avistado', evidencia_imagen: 'img11.jpg', reporte_detallado: null },
];

describe('Reportes Component', () => {
  beforeEach(() => {
    // Limpia los mocks antes de cada test
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  // --- RENDERING & INITIAL FETCH ---
  test('renders the component and fetches reports on mount', async () => {
    // Mockea la respuesta exitosa de la API
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
    });

    render(<Reportes />);

    // Verifica que el componente se renderiza con el mensaje de "cargando" si existiera,
    // o simplemente con los elementos de la UI
    expect(screen.getByText(/Buscar por usuario, animal o descripción/i)).toBeInTheDocument();
    
    // Espera a que la llamada a la API termine y la tabla se llene
    await waitFor(() => {
      // Verifica que fetch fue llamado una vez al montar el componente
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://innovatech-ztzv.onrender.com/alertas/allalerts');
      
      // Verifica que la tabla se renderiza con los datos
      expect(screen.getByText('Ana')).toBeInTheDocument();
      expect(screen.getByText('Luis')).toBeInTheDocument();
      expect(screen.getByText('Perro')).toBeInTheDocument();
      expect(screen.getByText('Gato')).toBeInTheDocument();
      expect(screen.getByText('pendiente')).toBeInTheDocument();
    });
  });

  test('displays an error snackbar if fetching reports fails', async () => {
    // Mockea una respuesta de error de la API
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Reportes />);

    // Espera a que el error de fetch se procese y el snackbar aparezca
    await waitFor(() => {
      expect(screen.getByText('Error al obtener los reportes')).toBeInTheDocument();
    });
    
    // Simula cerrar el snackbar para cubrir el handler
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByText('Error al obtener los reportes')).not.toBeInTheDocument();
  });

  test('shows "No se encontraron reportes" when API returns empty data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Reportes />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText('No se encontraron reportes')).toBeInTheDocument();
    });
    
    // Simula hacer clic en "Mostrar todos"
    fireEvent.click(screen.getByRole('button', { name: /Mostrar todos/i }));
    // Verifica que el campo de búsqueda y el filtro se limpien
    expect(screen.getByLabelText(/Buscar/i)).toHaveValue('');
    expect(screen.getByLabelText(/Estado/i)).toHaveTextContent('Todos');
  });

  // --- SEARCH, FILTER & PAGINATION ---
  test('filters reports by search term and filter state', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReports,
    });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Simula escribir en el campo de búsqueda
    const searchInput = screen.getByLabelText(/Buscar/i);
    fireEvent.change(searchInput, { target: { value: 'ana' } });
    expect(searchInput).toHaveValue('ana');

    // Simula cambiar el filtro de estado a 'pendiente'
    fireEvent.mouseDown(screen.getByLabelText(/Estado/i));
    fireEvent.click(screen.getByText('Pendiente'));
    expect(screen.getByLabelText(/Estado/i)).toHaveTextContent('Pendiente');

    // Simula hacer clic en el botón de búsqueda
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));
    
    // Verifica que los resultados estén filtrados correctamente
    // Ahora solo debería mostrar los reportes de 'Ana' que están 'pendiente'
    expect(screen.getByText('Perro perdido')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Serpiente avistada')).toBeInTheDocument();
    expect(screen.queryByText('Gato abandonado')).not.toBeInTheDocument();
    expect(screen.queryByText('Luis')).not.toBeInTheDocument();
    
    // Verifica que el snackbar no aparezca
    expect(screen.queryByText('No se encontraron reportes')).not.toBeInTheDocument();
  });

  test('shows a snackbar when no search results are found', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByLabelText(/Buscar/i);
    fireEvent.change(searchInput, { target: { value: 'XYZ_NO_EXISTE' } });

    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    await waitFor(() => {
        expect(screen.getByText('No se encontraron reportes con los criterios seleccionados')).toBeInTheDocument();
    });
  });

  test('changes pagination page and uses "Ir a la página"', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Asumiendo 10 reportes por página, la página 2 debería mostrar el reporte 11 (León)
    const paginationButton = screen.getByRole('button', { name: /Go to page 2/i });
    fireEvent.click(paginationButton);
    
    // Verifica que la página actual ha cambiado
    expect(screen.getByText('León')).toBeInTheDocument();
    expect(screen.queryByText('Perro perdido')).not.toBeInTheDocument();

    // Simula ir a una página específica
    const goToPageInput = screen.getByLabelText(/Ir a la página:/i);
    fireEvent.change(goToPageInput, { target: { value: '1' } });
    expect(goToPageInput).toHaveValue(1);

    fireEvent.click(screen.getByRole('button', { name: 'Ir' }));
    
    // Verifica que regresa a la primera página
    await waitFor(() => {
      expect(screen.getByText('Perro perdido')).toBeInTheDocument();
      expect(screen.queryByText('León')).not.toBeInTheDocument();
    });
    
    // Test for invalid page number
    fireEvent.change(goToPageInput, { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ir' }));
    expect(screen.getByText('Número de página inválido')).toBeInTheDocument();
  });

  // --- ROW EXPANSION & DETAILS ---
  test('expands and collapses a report row to show details', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Encuentra el botón de visibilidad del primer reporte
    const expandButton = screen.getAllByRole('button', { name: 'visibility' })[0];
    fireEvent.click(expandButton);

    // Espera a que la sección de detalles se expanda
    await waitFor(() => {
        expect(screen.getByText('Descripción:')).toBeInTheDocument();
        expect(screen.getByText('Perro perdido')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Perro' })).toHaveAttribute('src', 'img1.jpg');
    });

    // Simula el error de carga de imagen para cubrir el onError handler
    const image = screen.getByRole('img', { name: 'Perro' });
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
    
    // Verifica que los botones de acción están visibles para un reporte pendiente
    expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument();

    // Colapsa la fila de nuevo
    fireEvent.click(expandButton);
    await waitFor(() => {
      expect(screen.queryByText('Descripción:')).not.toBeInTheDocument();
    });
  });

  test('displays rejection reason for a rejected report', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Expande el reporte rechazado (ID 3)
    const expandButton = screen.getAllByRole('button', { name: 'visibility' })[2];
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText('Motivo de rechazo:')).toBeInTheDocument();
      expect(screen.getByText('Información insuficiente')).toBeInTheDocument();
      
      // Verifica que los botones de acción no están visibles para un reporte rechazado
      expect(screen.queryByRole('button', { name: /Aceptar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Rechazar/i })).not.toBeInTheDocument();
    });
  });

  // --- STATE CHANGE & DIALOGS ---
  test('can approve a pending report', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports }); // Initial fetch
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // changeState fetch
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Expande el primer reporte pendiente
    fireEvent.click(screen.getAllByRole('button', { name: 'visibility' })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument());

    // Haz clic en "Aceptar"
    fireEvent.click(screen.getByRole('button', { name: /Aceptar/i }));

    // Espera a que la llamada a la API de cambio de estado se complete
    await waitFor(() => {
      // Verifica que fetch fue llamado de nuevo para cambiar el estado
      expect(fetch).toHaveBeenCalledTimes(2);
      // Verifica que el estado en la interfaz ha cambiado a "aprobado"
      expect(screen.getByText('aprobado')).toBeInTheDocument();
      // Verifica que el snackbar de éxito aparece
      expect(screen.getByText('Estado cambiado a aprobado')).toBeInTheDocument();
    });
  });

  test('can reject a pending report with a selected reason', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports }); // Initial fetch
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // changeState fetch
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Expande el primer reporte pendiente
    fireEvent.click(screen.getAllByRole('button', { name: 'visibility' })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument());
    
    // Haz clic en "Rechazar" para abrir el diálogo
    fireEvent.click(screen.getByRole('button', { name: /Rechazar/i }));
    
    // Verifica que el diálogo se abre
    expect(screen.getByText('Motivo de Rechazo')).toBeInTheDocument();

    // Selecciona una razón
    const reasonSelect = screen.getByLabelText(/Seleccione un motivo/i);
    fireEvent.mouseDown(reasonSelect);
    fireEvent.click(screen.getByText('Imagen no válida'));

    // Verifica que el botón de confirmar rechazo no esté deshabilitado
    const confirmButton = screen.getByRole('button', { name: /Confirmar Rechazo/i });
    expect(confirmButton).toBeEnabled();

    // Haz clic en "Confirmar Rechazo"
    fireEvent.click(confirmButton);

    // Espera a que la llamada a la API de cambio de estado se complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      const fetchBody = JSON.parse(fetch.mock.calls[1][1].body);
      expect(fetchBody.estado).toBe('rechazado');
      expect(fetchBody.reporte_detallado).toBe('Imagen no válida');
      expect(screen.getByText('Estado cambiado a rechazado')).toBeInTheDocument();
      expect(screen.queryByText('Motivo de Rechazo')).not.toBeInTheDocument(); // Dialog should close
    });
  });
  
  test('can reject a pending report with a custom reason', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports }); // Initial fetch
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // changeState fetch
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getAllByRole('button', { name: 'visibility' })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Rechazar/i }));
    
    // Selecciona la razón "Otro"
    fireEvent.mouseDown(screen.getByLabelText(/Seleccione un motivo/i));
    fireEvent.click(screen.getByText('Otro'));
    
    // Verifica que el campo de texto de motivo personalizado aparece
    const customReasonInput = screen.getByLabelText(/Especifique el motivo/i);
    expect(customReasonInput).toBeInTheDocument();

    // Verifica que el botón de confirmar está deshabilitado hasta que se ingresa texto
    const confirmButton = screen.getByRole('button', { name: /Confirmar Rechazo/i });
    expect(confirmButton).toBeDisabled();
    
    // Escribe un motivo personalizado
    fireEvent.change(customReasonInput, { target: { value: 'Motivo de prueba' } });
    expect(confirmButton).toBeEnabled(); // Should now be enabled

    // Haz clic en "Confirmar Rechazo"
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      const fetchBody = JSON.parse(fetch.mock.calls[1][1].body);
      expect(fetchBody.reporte_detallado).toBe('Motivo de prueba');
    });
  });

  test('shows an error if state change API call fails', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports }); // Initial fetch
    fetch.mockResolvedValueOnce({ ok: false, status: 500 }); // changeState fetch error
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    
    fireEvent.click(screen.getAllByRole('button', { name: 'visibility' })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Aceptar/i }));

    await waitFor(() => {
      expect(screen.getByText('Error al cambiar el estado')).toBeInTheDocument();
    });
  });
  
  test('closes reject dialog with "Cancelar" button', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    
    fireEvent.click(screen.getAllByRole('button', { name: 'visibility' })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Rechazar/i }));
    
    // Verifica que el diálogo se abre
    expect(screen.getByText('Motivo de Rechazo')).toBeInTheDocument();

    // Haz clic en Cancelar
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    
    // Verifica que el diálogo se cierra
    await waitFor(() => {
      expect(screen.queryByText('Motivo de Rechazo')).not.toBeInTheDocument();
    });
  });

  test('navigates back to the moderator panel', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockReports });
    render(<Reportes />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Encuentra y haz clic en el botón "Volver al panel"
    const backButton = screen.getByRole('button', { name: /Volver al panel/i });
    fireEvent.click(backButton);

    // Verifica que la función navigate fue llamada con la ruta correcta
    expect(mockNavigate).toHaveBeenCalledWith('/moderador');
  });
});