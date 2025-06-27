import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimalCardInformation from '../components/Informacion/AnimalCards';
import PropTypes from 'prop-types';

// Define un conjunto de props de prueba para usar en los tests
const mockProps = {
  imgAnimal: 'https://example.com/images/cat.jpg',
  textAlter: 'A beautiful cat',
  title: 'Gato Doméstico',
  description: 'Un mamífero carnívoro de la familia de los félidos, a menudo domesticado.',
};

describe('AnimalCardInformation', () => {

  // Test 1: Verifica que el componente se renderice y muestre todas las props correctamente
  test('renders the component with all props correctly', () => {
    render(<AnimalCardInformation {...mockProps} />);

    // Verifica que la imagen se renderiza con el src y el alt text correctos
    const image = screen.getByRole('img', { name: mockProps.textAlter });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.imgAnimal);

    // Verifica que el título y la descripción se muestren en la tarjeta
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();

    // Verifica que el botón 'Ver más' esté presente
    expect(screen.getByRole('button', { name: /ver más/i })).toBeInTheDocument();
  });

  // Test 2: Verifica que las áreas de acción sean funcionales (haciendo clic)
  test('CardActionArea and "Ver más" button are clickable', () => {
    render(<AnimalCardInformation {...mockProps} />);

    // El CardActionArea se comporta como un botón para accesibilidad.
    const cardActionArea = screen.getByRole('button', { name: mockProps.title });
    const viewMoreButton = screen.getByRole('button', { name: /ver más/i });

    // Disparamos un evento de clic en ambas áreas.
    // Aunque no hay un handler `onClick` definido en el componente,
    // el test verifica que el evento se puede disparar sin errores,
    // cubriendo esa parte del código.
    fireEvent.click(cardActionArea);
    fireEvent.click(viewMoreButton);
    
    // El test pasará si no se lanza ningún error al hacer clic.
    expect(cardActionArea).toBeInTheDocument(); // Verificamos que el elemento sigue en el DOM
    expect(viewMoreButton).toBeInTheDocument(); // Verificamos que el elemento sigue en el DOM
  });
  
  // Test 3: Verifica la validación de PropTypes
  test('should log a warning if a required prop is missing', () => {
    // Mockeamos console.error para capturar el warning de PropTypes
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Renderizamos el componente sin la prop 'title'
    render(<AnimalCardInformation imgAnimal="" textAlter="" description="" />);

    // Verificamos que se haya llamado a console.error con el mensaje de advertencia
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Warning: Failed prop type: The prop `title` is marked as required in `AnimalCardInformation`'),
      expect.anything()
    );

    // Restauramos el mock para no afectar otros tests
    mockConsoleError.mockRestore();
  });
});