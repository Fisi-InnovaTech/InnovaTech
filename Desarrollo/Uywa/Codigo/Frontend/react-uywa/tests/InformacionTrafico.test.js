import React from 'react';
import { render } from '@testing-library/react';
import Blog from '../src/pages/InformacionTrafico';

test('renders Blog component with correct content', () => {
  const { getAllByAltText, getAllByText } = render(<Blog />);
  
  const cardImages = getAllByAltText(/Animal/);
  expect(cardImages).toHaveLength(5); 

  const cardTitles = getAllByText(/TITULO/);
  expect(cardTitles).toHaveLength(5);

  const cardDescriptions = getAllByText(/Descripcion de la card/);
  expect(cardDescriptions).toHaveLength(5); 
});
