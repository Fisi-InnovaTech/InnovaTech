
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertForm, { 
  MAX_FILE_SIZE_MB, 
  MAX_DESCRIPTION_LENGTH, 
  MIN_DESCRIPTION_LENGTH, 
  VALID_FILE_TYPES,
  ANIMAL_OPTIONS,
  DEPARTMENT_OPTIONS 
} from '../pages/RealizarAlerta';

describe('Configuración y constantes', () => {
  test('debería tener las constantes de configuración correctas', () => {
    expect(MAX_FILE_SIZE_MB).toBe(5);
    expect(MAX_DESCRIPTION_LENGTH).toBe(1000);
    expect(MIN_DESCRIPTION_LENGTH).toBe(30);
    expect(VALID_FILE_TYPES).toEqual(['image/jpeg', 'image/png']);
  });

  test('debería tener las opciones de animales correctas', () => {
    expect(ANIMAL_OPTIONS).toBeInstanceOf(Array);
    expect(ANIMAL_OPTIONS.length).toBeGreaterThan(0);
    expect(ANIMAL_OPTIONS[0]).toHaveProperty('id');
    expect(ANIMAL_OPTIONS[0]).toHaveProperty('value');
    expect(ANIMAL_OPTIONS[0]).toHaveProperty('animal');
  });

  test('debería tener las opciones de departamentos correctas', () => {
    expect(DEPARTMENT_OPTIONS).toBeInstanceOf(Array);
    expect(DEPARTMENT_OPTIONS.length).toBeGreaterThan(0);
    expect(DEPARTMENT_OPTIONS[0]).toHaveProperty('id');
    expect(DEPARTMENT_OPTIONS[0]).toHaveProperty('value');
    expect(DEPARTMENT_OPTIONS[0]).toHaveProperty('departamento');
  });
});

describe('Estados iniciales', () => {
  beforeEach(() => {
    // Mock localStorage para simular usuario logueado
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 1, nombre: 'TestUser' }));
  });

  test('debería inicializar los estados correctamente', () => {
    render(<AlertForm />);
    
    // Verificar estados iniciales
    expect(screen.getByRole('button', { name: /Seleccione un animal/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
    
    // Verificar que el checkbox de anónimo está marcado por defecto
    const checkbox = screen.getByLabelText(/Enviar de forma anónima/i).querySelector('input[type="checkbox"]');
    expect(checkbox).toBeChecked();
  });

  test('debería manejar el estado de autenticación', () => {
    // Simular usuario no logueado
    Storage.prototype.getItem = jest.fn(() => null);
    
    render(<AlertForm />);
    
    // Verificar que muestra el diálogo de autenticación
    expect(screen.getByText('Acceso Requerido')).toBeInTheDocument();
  });

  test('debería manejar el estado de archivo seleccionado', () => {
    render(<AlertForm />);
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    // Verificar que el estado se actualiza
    expect(screen.getByAltText('Previsualización')).toBeInTheDocument();
  });

  test('debería manejar el estado de descripción', () => {
    render(<AlertForm />);
    
    const descriptionText = 'Esta es una descripción de prueba';
    const textarea = screen.getByRole('textbox');
    
    fireEvent.change(textarea, { target: { value: descriptionText } });
    
    // Verificar que el estado se actualiza
    expect(textarea).toHaveValue(descriptionText);
  });

  test('debería manejar el estado de ubicación', () => {
    render(<AlertForm />);
    
    // Simular cambio de ubicación a través del mock del mapa
    const MapaMock = require('../components/Mapa/MapaVisualizar');
    act(() => {
      MapaMock.mockCallbacks.setLatitud(-12.0464);
      MapaMock.mockCallbacks.setLongitud(-77.0428);
    });
    
    // Verificar que no muestra error de ubicación
    expect(screen.queryByText('Seleccione una ubicación válida')).not.toBeInTheDocument();
  });

  test('debería manejar el estado de envío', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success' }),
    });
    
    render(<AlertForm />);
    
    // Llenar formulario mínimo para enviar
    fireEvent.change(screen.getByRole('textbox'), { 
      target: { value: 'Descripción con más de 30 caracteres para pasar validación' } 
    });
    
    fireEvent.mouseDown(screen.getByRole('button', { name: /Seleccione un animal/i }));
    fireEvent.click(screen.getByText(ANIMAL_OPTIONS[0].animal));
    
    const MapaMock = require('../components/Mapa/MapaVisualizar');
    act(() => {
      MapaMock.mockCallbacks.setLatitud(-12.0464);
      MapaMock.mockCallbacks.setLongitud(-77.0428);
    });
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });
    
    fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
    
    // Verificar que muestra el estado de carga
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
    
    await waitFor(() => {
      // Verificar que muestra el diálogo de éxito
      expect(screen.getByText('Alerta Enviada')).toBeInTheDocument();
    });
  });
});

describe('Estados y funciones adicionales', () => {
  beforeEach(() => {
    // Mock localStorage para simular usuario logueado
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 1, nombre: 'TestUser' }));
    global.fetch = jest.fn();
  });

  test('debería manejar correctamente el estado isSubmitting', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success' }),
    });

    render(<AlertForm />);
    
    // Llenar formulario mínimo para enviar
    fireEvent.change(screen.getByRole('textbox'), { 
      target: { value: 'Descripción con más de 30 caracteres para pasar validación' } 
    });
    
    fireEvent.mouseDown(screen.getByRole('button', { name: /Seleccione un animal/i }));
    fireEvent.click(screen.getByText(ANIMAL_OPTIONS[0].animal));
    
    const MapaMock = require('../components/Mapa/MapaVisualizar');
    act(() => {
      MapaMock.mockCallbacks.setLatitud(-12.0464);
      MapaMock.mockCallbacks.setLongitud(-77.0428);
    });
    
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });
    
    fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
    
    // Verificar que isSubmitting se establece en true durante el envío
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
    
    await waitFor(() => {
      // Verificar que isSubmitting vuelve a false después del envío
      expect(screen.getByText('Alerta Enviada')).toBeInTheDocument();
      expect(screen.queryByText('Enviando...')).not.toBeInTheDocument();
    });
  });

  test('debería tener las URLs de API correctas', () => {
    render(<AlertForm />);
    
    // No podemos acceder directamente a las constantes internas del componente,
    // pero podemos verificar que las llamadas a la API usan la URL correcta
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success' }),
    });

    // Llenar y enviar formulario...
    // (código similar al test anterior para llenar el formulario)
    
    fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
    
    expect(global.fetch).toHaveBeenCalledWith(
      'https://innovatech-ztzv.onrender.com/alertas/guardar',
      expect.anything()
    );
  });

  test('useEffect debería verificar la sesión al montar', () => {
    // Caso 1: Usuario no logueado
    Storage.prototype.getItem = jest.fn(() => null);
    render(<AlertForm />);
    expect(screen.getByText('Acceso Requerido')).toBeInTheDocument();
    
    // Caso 2: Usuario logueado
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 1, nombre: 'TestUser' }));
    render(<AlertForm />);
    expect(screen.queryByText('Acceso Requerido')).not.toBeInTheDocument();
  });

  describe('validateForm', () => {
    test('debería validar correctamente el formulario', () => {
      render(<AlertForm />);
      
      // Caso 1: Formulario inválido
      const formIsValid = validateForm();
      expect(formIsValid).toBe(false);
      expect(errors.animal).toBe(true);
      expect(errors.description).toBe(true);
      expect(errors.location).toBe(true);
      expect(errors.file).toBe(true);
      
      // Caso 2: Formulario válido
      // Simular datos válidos
      act(() => {
        setSelectedAnimal(ANIMAL_OPTIONS[0].value);
        setDescription('Descripción válida con más de 30 caracteres');
        setLatitud(-12.0464);
        setLongitud(-77.0428);
        setTosendFile(new File(['dummy'], 'test.png', { type: 'image/png' }));
      });
      
      const validForm = validateForm();
      expect(validForm).toBe(true);
      expect(errors.animal).toBe(false);
      expect(errors.description).toBe(false);
      expect(errors.location).toBe(false);
      expect(errors.file).toBe(false);
    });
  });

  describe('handleFileChange', () => {
    test('debería manejar la selección de archivo correctamente', () => {
      render(<AlertForm />);
      
      const validFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
      
      // Caso 1: Archivo válido
      fireEvent.change(input, { target: { files: [validFile] } });
      expect(screen.getByAltText('Previsualización')).toBeInTheDocument();
      expect(errors.file).toBe(false);
      
      // Caso 2: Tipo de archivo inválido
      const invalidTypeFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      fireEvent.change(input, { target: { files: [invalidTypeFile] } });
      expect(screen.getByText('Formato no válido. Solo se permiten: jpeg, png')).toBeInTheDocument();
      
      // Caso 3: Archivo demasiado grande
      const largeFile = new File(['dummy content'], 'large.png', { 
        type: 'image/png', 
        size: 6 * 1024 * 1024 // 6MB
      });
      fireEvent.change(input, { target: { files: [largeFile] } });
      expect(screen.getByText('El archivo es demasiado grande (Máx. 5MB)')).toBeInTheDocument();
      
      // Caso 4: Ningún archivo seleccionado
      fireEvent.change(input, { target: { files: [] } });
      expect(screen.queryByAltText('Previsualización')).not.toBeInTheDocument();
    });
  });
});
describe('Manejo de archivos y formulario', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 1, nombre: 'TestUser' }));
    global.fetch = jest.fn();
    window.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  describe('handleFileChange', () => {
    test('debería rechazar archivos con formato inválido', () => {
      render(<AlertForm />);
      const invalidFile = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
      
      fireEvent.change(input, { target: { files: [invalidFile] } });
      
      expect(screen.getByText('Formato no válido. Solo se permiten: jpeg, png')).toBeInTheDocument();
      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    });

    test('debería rechazar archivos demasiado grandes', () => {
      render(<AlertForm />);
      const largeFile = new File(['dummy'], 'large.png', { 
        type: 'image/png', 
        size: 6 * 1024 * 1024 // 6MB
      });
      const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
      
      fireEvent.change(input, { target: { files: [largeFile] } });
      
      expect(screen.getByText('El archivo es demasiado grande (Máx. 5MB)')).toBeInTheDocument();
      expect(window.URL.createObjectURL).not.toHaveBeenCalled();
    });

    test('debería aceptar archivos válidos', () => {
      render(<AlertForm />);
      const validFile = new File(['dummy'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
      
      fireEvent.change(input, { target: { files: [validFile] } });
      
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(validFile);
      expect(screen.getByAltText('Previsualización')).toBeInTheDocument();
      expect(screen.queryByText(/Formato no válido|demasiado grande/)).not.toBeInTheDocument();
    });
  });

  describe('handleDescriptionChange', () => {
    test('debería actualizar la descripción dentro del límite', () => {
      render(<AlertForm />);
      const textarea = screen.getByRole('textbox');
      const longText = 'a'.repeat(MAX_DESCRIPTION_LENGTH);
      
      fireEvent.change(textarea, { target: { value: longText } });
      
      expect(textarea).toHaveValue(longText);
    });

    test('no debería permitir descripciones más largas que el máximo', () => {
      render(<AlertForm />);
      const textarea = screen.getByRole('textbox');
      const tooLongText = 'a'.repeat(MAX_DESCRIPTION_LENGTH + 10);
      const validText = 'a'.repeat(MAX_DESCRIPTION_LENGTH);
      
      // Primero establecemos un texto válido
      fireEvent.change(textarea, { target: { value: validText } });
      // Intentamos exceder el límite
      fireEvent.change(textarea, { target: { value: tooLongText } });
      
      expect(textarea).toHaveValue(validText); // No debería cambiar
    });

    test('debería marcar error si la descripción es muy corta', () => {
      render(<AlertForm />);
      const textarea = screen.getByRole('textbox');
      
      fireEvent.change(textarea, { target: { value: 'Texto corto' } });
      
      expect(screen.getByText(`Mínimo ${MIN_DESCRIPTION_LENGTH} caracteres`)).toBeInTheDocument();
    });
  });

  describe('handleCloseAlert y handleCloseFinishAlert', () => {
    test('debería redirigir a login al cerrar alerta de autenticación', () => {
      Storage.prototype.getItem = jest.fn(() => null);
      render(<AlertForm />);
      
      fireEvent.click(screen.getByRole('button', { name: /Entendido/i }));
      
      expect(window.location.href).toBe('/iniciar-sesion');
    });

    test('debería redirigir a realizar-alerta al cerrar alerta de éxito', () => {
      render(<AlertForm />);
      // Simular estado de alerta de éxito
      act(() => {
        setFinishAlert(true);
      });
      
      fireEvent.click(screen.getByRole('button', { name: /Aceptar/i }));
      
      expect(window.location.href).toBe('/realizar-alerta');
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'success' }),
      });
    });

    test('debería enviar el formulario correctamente', async () => {
      render(<AlertForm />);
      
      // Llenar formulario con datos válidos
      fireEvent.change(screen.getByRole('textbox'), { 
        target: { value: 'Descripción válida con más de 30 caracteres' } 
      });
      
      fireEvent.mouseDown(screen.getByRole('button', { name: /Seleccione un animal/i }));
      fireEvent.click(screen.getByText(ANIMAL_OPTIONS[0].animal));
      
      const MapaMock = require('../components/Mapa/MapaVisualizar');
      act(() => {
        MapaMock.mockCallbacks.setLatitud(-12.0464);
        MapaMock.mockCallbacks.setLongitud(-77.0428);
      });
      
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
      fireEvent.change(input, { target: { files: [file] } });
      
      fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Alerta Enviada')).toBeInTheDocument();
      });
    });

    test('debería manejar errores en el envío', async () => {
      global.fetch.mockRejectedValue(new Error('Error de red'));
      
      render(<AlertForm />);
      
      // Llenar formulario con datos válidos (similar al test anterior)
      // ...
      
      fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Error al enviar la alerta. Por favor intente nuevamente')).toBeInTheDocument();
      });
    });

    test('debería enviar datos correctos en FormData', async () => {
      render(<AlertForm />);
      
      // Llenar formulario (similar a pruebas anteriores)
      // ...
      
      fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
      
      await waitFor(() => {
        const [url, options] = global.fetch.mock.calls[0];
        const formData = options.body;
        
        expect(formData.get('es_anonimo')).toBe('true');
        expect(formData.get('animal_nombre')).toBe(ANIMAL_OPTIONS[0].animal);
        // Verificar otros campos del FormData...
      });
    });
  });
});
describe('Manejo de errores y estilos', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 1, nombre: 'TestUser' }));
    global.fetch = jest.fn();
    window.URL.createObjectURL = jest.fn(() => 'mock-url');
  });

  describe('Manejo de errores del servidor', () => {
    test('debería manejar errores del servidor (response.ok = false)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Error interno del servidor' }),
      });

      render(<AlertForm />);
      
      // Llenar formulario con datos válidos
      fireEvent.change(screen.getByRole('textbox'), { 
        target: { value: 'Descripción válida con más de 30 caracteres' } 
      });
      fireEvent.mouseDown(screen.getByRole('button', { name: /Seleccione un animal/i }));
      fireEvent.click(screen.getByText(ANIMAL_OPTIONS[0].animal));
      
      const MapaMock = require('../components/Mapa/MapaVisualizar');
      act(() => {
        MapaMock.mockCallbacks.setLatitud(-12.0464);
        MapaMock.mockCallbacks.setLongitud(-77.0428);
      });
      
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText(/Seleccionar archivo/i).querySelector('input[type="file"]');
      fireEvent.change(input, { target: { files: [file] } });
      
      fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Error al enviar la alerta. Por favor intente nuevamente')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enviar Alerta' })).toBeEnabled();
      });
    });

    test('debería resetear estados isSubmitting e isButtonDisabled en finally', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Error de red'));

      render(<AlertForm />);
      
      // Llenar formulario (similar a pruebas anteriores)
      // ...
      
      fireEvent.click(screen.getByRole('button', { name: /Enviar Alerta/i }));
      
      await waitFor(() => {
        expect(screen.queryByText('Enviando...')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enviar Alerta' })).not.toBeDisabled();
      });
    });
  });

  describe('Estilos y UI condicional', () => {
    test('debería aplicar estilos labelName correctamente', () => {
      render(<AlertForm />);
      const label = screen.getByText('EVIDENCIA FOTOGRÁFICA *').parentElement;
      
      expect(label).toHaveStyle('background-color: #FB9678');
      expect(label).toHaveStyle('color: #FFFFFF');
      expect(label).toHaveStyle('text-align: left');
    });

    test('debería cambiar color de CloudUploadIcon cuando hay error en archivo', () => {
      render(<AlertForm />);
      // Forzar estado de error
      act(() => {
        setErrors({...errors, file: true});
      });
      
      const icon = screen.getByTestId('CloudUploadIcon');
      expect(icon).toHaveStyle('color: red');
    });

    test('debería mostrar estilos de error en el botón de subida cuando hay error', () => {
      render(<AlertForm />);
      // Forzar estado de error
      act(() => {
        setErrors({...errors, file: true});
      });
      
      const button = screen.getByRole('button', { name: /Seleccionar archivo/i });
      expect(button).toHaveStyle('background-color: red');
    });

    test('debería limpiar el archivo y marcar error al hacer clic en eliminar', () => {
      render(<AlertForm />);
      // Simular archivo seleccionado
      const file = new File(['dummy'], 'test.png', { type: 'image/png' });
      act(() => {
        setFile('mock-url');
        setTosendFile(file);
      });
      
      fireEvent.click(screen.getByText('✕'));
      
      expect(screen.queryByAltText('Previsualización')).not.toBeInTheDocument();
      expect(screen.getByText(/Formatos aceptados/i)).toHaveStyle('color: red');
    });

    test('debería actualizar estado y limpiar error al seleccionar animal', () => {
      render(<AlertForm />);
      // Forzar estado de error
      act(() => {
        setErrors({...errors, animal: true});
      });
      
      fireEvent.mouseDown(screen.getByRole('button', { name: /Seleccione un animal/i }));
      fireEvent.click(screen.getByText(ANIMAL_OPTIONS[0].animal));
      
      expect(screen.queryByText('Este campo es requerido')).not.toBeInTheDocument();
    });

    test('debería mostrar mensaje de error cuando la ubicación es inválida', () => {
      render(<AlertForm />);
      const MapaMock = require('../components/Mapa/MapaVisualizar');
      
      // Simular error en el mapa
      act(() => {
        MapaMock.mockCallbacks.triggerError();
      });
      
      expect(screen.getByText('Seleccione una ubicación válida')).toBeInTheDocument();
      expect(screen.getByText('Debe seleccionar una ubicación dentro del territorio nacional')).toBeInTheDocument();
    });
  });
});
describe('Renderizado condicional y manejo de UI', () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify({ id: 1, nombre: 'TestUser' }));
    global.fetch = jest.fn();
  });

  test('debería mostrar error de ubicación cuando location es inválida', () => {
    render(<AlertForm />);
    
    // Forzar estado de error de ubicación
    act(() => {
      setErrors({...errors, location: true});
    });
    
    expect(screen.getByText('Seleccione una ubicación válida')).toBeInTheDocument();
  });

  test('debería cambiar el texto de privacidad según isAnonymous', () => {
    render(<AlertForm />);
    
    const checkbox = screen.getByLabelText(/Enviar de forma anónima/i).querySelector('input[type="checkbox"]');
    
    // Estado inicial (anónimo)
    expect(screen.getByText('Tu identidad no será revelada')).toBeInTheDocument();
    
    // Cambiar a no anónimo
    fireEvent.click(checkbox);
    expect(screen.getByText('Tu nombre será visible en la alerta')).toBeInTheDocument();
    
    // Volver a anónimo
    fireEvent.click(checkbox);
    expect(screen.getByText('Tu identidad no será revelada')).toBeInTheDocument();
  });

  test('debería mostrar CircularProgress cuando isSubmitting es true', () => {
    // Forzar estado de envío
    render(<AlertForm />);
    act(() => {
      setIsSubmitting(true);
    });
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
  });

  test('debería cerrar el Snackbar cuando se hace clic en cerrar', async () => {
    render(<AlertForm />);
    
    // Mostrar Snackbar
    act(() => {
      setOpenSnackbar(true);
      setAlertMessage('Mensaje de prueba');
    });
    
    const snackbar = await screen.findByRole('alert');
    const closeButton = within(snackbar).getByRole('button');
    
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('debería cerrar el Snackbar automáticamente después de timeout', async () => {
    jest.useFakeTimers();
    render(<AlertForm />);
    
    // Mostrar Snackbar
    act(() => {
      setOpenSnackbar(true);
      setAlertMessage('Mensaje de prueba');
    });
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Avanzar el tiempo justo antes del timeout
    act(() => {
      jest.advanceTimersByTime(5999);
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Avanzar el tiempo para completar el timeout
    act(() => {
      jest.advanceTimersByTime(1);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });
});