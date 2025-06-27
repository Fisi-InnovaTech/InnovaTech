import React from 'react';
import { render } from '@testing-library/react';
import Cuadro from '../pages/EventosBuscar';

test('renders Cuadro component with search fields and button', () => {
  const { getByText, getByLabelText } = render(<Cuadro />);
  
  const searchText = getByText('Buscar eventos');
  expect(searchText).toBeInTheDocument();

  const dateField = getByLabelText('Fecha');
  const categoryField = getByLabelText('Categoría');
  const placeField = getByLabelText('Lugar');
  expect(dateField).toBeInTheDocument();
  expect(categoryField).toBeInTheDocument();
  expect(placeField).toBeInTheDocument();

  const searchButton = getByText('Buscar');
  expect(searchButton).toBeInTheDocument();
});
