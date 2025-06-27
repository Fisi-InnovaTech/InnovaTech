import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerAlertaGoogle from '../pages/VerAlertaGoogle';
import dayjs from 'dayjs';

// --- MOCKS ---
// 1. Mock the Mapa component to prevent rendering issues with external libraries (e.g., Leaflet/Google Maps)
jest.mock('../components/Mapa/MapaMarks', () => {
  const MockMapa = ({ markerData, onMarkerClick }) => (
    <div data-testid="mock-map">
      {markerData.map(marker => (
        <div key={marker.id} data-testid={`marker-${marker.id}`} onClick={() => onMarkerClick(marker)}>
          Marker {marker.id}
        </div>
      ))}
    </div>
  );
  return MockMapa;
});

// 2. Mock the useMediaQuery hook to control the 'isMobile' state in tests
jest.mock('@mui/material/useMediaQuery');
import useMediaQuery from '@mui/material/useMediaQuery';

// 3. Mock the fetch API to control API responses
global.fetch = jest.fn();

// 4. Mock window.localStorage to test user role
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 5. Mock console.error to avoid noise in the test output
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({

  AdapterDayjs: jest.fn().mockImplementation(() => ({
  })),
}));

// Helper function to mock a successful fetch response
const mockFetchSuccess = (data) => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
};

// Helper function to mock a failed fetch response
const mockFetchError = (status = 500) => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: status,
    json: () => Promise.resolve({ message: 'Internal Server Error' }),
  });
};

// Mock date data
const mockMarkerData = [
  { id: 1, lat: 10, lng: 20, animal_nombre: 'Zorro costeño', descripcion: 'Visto en la playa', evidencia_imagen: 'zorro.jpg', fecha_creacion: '2025-06-25T12:00:00Z', region: 'Lima', estado: 'Pendiente', nombre_reportante: 'Usuario 1' },
  { id: 2, lat: 30, lng: 40, animal_nombre: 'Rana acuática', descripcion: 'En un estanque', evidencia_imagen: null, fecha_creacion: '2025-06-26T14:00:00Z', region: 'Puno', estado: 'Aprobado', nombre_reportante: 'Usuario 2' },
];

// --- TEST SUITE ---
describe('VerAlertaGoogle Component', () => {
  // Clear mocks and reset state before each test
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    useMediaQuery.mockReturnValue(false); // Default to desktop view
    mockConsoleError.mockClear();
    // Reset the Jest module cache for the component before each test to ensure a clean state
    jest.resetModules();
  });

  // Restore mocks after all tests
  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  // --- RENDERING & INITIAL STATE ---
  test('renders the component and loads initial markers on mount', async () => {
    mockFetchSuccess(mockMarkerData);
    localStorageMock.getItem.mockReturnValue(null); // Guest user

    render(<VerAlertaGoogle />);

    // Check for the search form
    expect(screen.getByText('Buscar alertas')).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha inicial/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Animal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Buscar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reiniciar/i })).toBeInTheDocument();

    // Check for the loading indicator
    expect(screen.getByText('Cargando datos del mapa...')).toBeInTheDocument();

    // Wait for the API call to complete and the loading indicator to disappear
    await waitFor(() => {
      expect(screen.queryByText('Cargando datos del mapa...')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Check if fetch was called with the correct endpoint
    expect(fetch).toHaveBeenCalledWith('https://innovatech-ztzv.onrender.com/alertas/allmap');

    // Check if the mock map component receives the data
    const map = screen.getByTestId('mock-map');
    expect(map).toBeInTheDocument();
    expect(screen.getAllByTestId(/marker-/i)).toHaveLength(2); // Check markers are rendered
  });

  // --- API CALLS & ERROR HANDLING ---
  test('displays an error message if loading markers fails', async () => {
    mockFetchError(500);
    render(<VerAlertaGoogle />);
    
    // Wait for the API call to fail
    await waitFor(() => {
      // Check if the error snackbar appears
      expect(screen.getByRole('alert')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('Error al cargar los marcadores')).toBeInTheDocument();
    expect(mockConsoleError).toHaveBeenCalled();
  });
  
  test('displays "No se encontraron alertas" message if search returns no data', async () => {
    mockFetchSuccess(mockMarkerData); // Initial load
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    mockFetchSuccess([]); // Search returns empty array
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));
    
    await waitFor(() => {
      // Check for the error message in the Snackbar
      expect(screen.getByText('No se encontraron alertas con los filtros seleccionados')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // --- FORM INTERACTIONS ---
  test('allows changing the date filters', async () => {
    mockFetchSuccess([]); // Initial load
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Simulate changing the 'Fecha final' date
    const fechaFinalInput = screen.getByLabelText(/Fecha final/i);
    // Use fireEvent.change on the input element
    fireEvent.change(fechaFinalInput, { target: { value: '25/07/2025' } });

    // Click the search button
    mockFetchSuccess(mockMarkerData); // Mock the search response
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    // Wait for the API call to be made
    await waitFor(() => {
      // Check that fetch was called a second time
      expect(fetch).toHaveBeenCalledTimes(2);
      // Check if the URL includes the new date.
      const searchUrl = fetch.mock.calls[1][0];
      // Note: The date is sent as YYYY-MM-DD
      expect(searchUrl).toContain('fecha_fin=2025-07-25'); 
      expect(searchUrl).toContain('fecha_ini='); // Check that fecha_ini is also in the URL
    });
  });


  test('allows searching with selected filters', async () => {
    mockFetchSuccess(mockMarkerData); // Initial load
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Select an animal
    await act(async () => {
      fireEvent.mouseDown(screen.getByLabelText(/Animal/i));
    });
    fireEvent.click(screen.getByText('Zorro costeño'));
    
    // Select a region
    await act(async () => {
      fireEvent.mouseDown(screen.getByLabelText(/Región/i));
    });
    fireEvent.click(screen.getByText('Lima'));

    // Mock the search API response with filtered data
    mockFetchSuccess([{ id: 1, lat: 10, lng: 20, animal_nombre: 'Zorro costeño' }]);

    // Click the search button
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    // Wait for the search API call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    // Check if the fetch was called with the correct search parameters
    const searchUrl = fetch.mock.calls[1][0];
    expect(searchUrl).toContain('animal=Zorro%20coste%C3%B1o');
    expect(searchUrl).toContain('region=Lima');
    // Check if the map data was updated
    expect(screen.getAllByTestId(/marker-/i)).toHaveLength(1);
  });

  test('resets filters and reloads all markers when "Reiniciar" is clicked', async () => {
    mockFetchSuccess(mockMarkerData); // Initial load
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Change a filter value
    await act(async () => {
      fireEvent.mouseDown(screen.getByLabelText(/Animal/i));
    });
    fireEvent.click(screen.getByText('Zorro costeño'));

    mockFetchSuccess(mockMarkerData); // Mock API call for reset
    fireEvent.click(screen.getByRole('button', { name: /Reiniciar/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      // Check if the filters are reset to their initial state
      expect(screen.getByLabelText(/Animal/i)).toHaveTextContent('Todos los animales');
    });
  });

  // --- ALERT DIALOG ---
  test('opens the alert dialog when a marker is clicked', async () => {
    mockFetchSuccess(mockMarkerData);
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(screen.getAllByTestId(/marker-/i)).toHaveLength(2));

    // Simulate a marker click
    fireEvent.click(screen.getByTestId('marker-1'));

    // Check if the dialog is visible with the alert details
    expect(screen.getByRole('dialog', { name: /detalles de la alerta/i })).toBeInTheDocument();
    expect(screen.getByText('Zorro costeño')).toBeInTheDocument();
    expect(screen.getByText('Visto en la playa')).toBeInTheDocument();
    expect(screen.getByText('Región: Lima')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cerrar/i })).toBeInTheDocument();
  });
  
  test('closes the alert dialog when the close button is clicked', async () => {
    mockFetchSuccess(mockMarkerData);
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(screen.getAllByTestId(/marker-/i)).toHaveLength(2));

    // Open the dialog
    fireEvent.click(screen.getByTestId('marker-1'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close the dialog
    fireEvent.click(screen.getByRole('button', { name: /Cerrar/i }));

    // Check if the dialog is no longer in the document
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // --- CONDITIONAL RENDERING ---
  test('shows extra user details for a logged-in user', async () => {
    localStorageMock.getItem.mockReturnValue('{"session": "active"}'); // Logged-in user
    mockFetchSuccess(mockMarkerData);
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(screen.getAllByTestId(/marker-/i)).toHaveLength(2));

    // Open the dialog
    fireEvent.click(screen.getByTestId('marker-1'));

    // Check for user-specific content
    expect(screen.getByText('Reportado por: Usuario 1')).toBeInTheDocument();
    expect(screen.queryByText('Inicia sesión para ver más detalles y reportar alertas')).not.toBeInTheDocument();
  });

  test('hides the search panel on mobile when an alert is selected', async () => {
    useMediaQuery.mockReturnValue(true); // Mobile view
    mockFetchSuccess(mockMarkerData);
    render(<VerAlertaGoogle />);
    await waitFor(() => expect(screen.getAllByTestId(/marker-/i)).toHaveLength(2));

    // The search panel should be visible initially on mobile
    expect(screen.getByText('Buscar alertas')).toBeVisible();

    // Open the dialog
    fireEvent.click(screen.getByTestId('marker-1'));

    // The search panel should now be hidden
    expect(screen.queryByText('Buscar alertas')).not.toBeInTheDocument();
  });
});