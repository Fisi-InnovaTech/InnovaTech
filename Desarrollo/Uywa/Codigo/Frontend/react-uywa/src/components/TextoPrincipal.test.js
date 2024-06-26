import React from 'react';
import { render } from '@testing-library/react';
import TextoCarrusel from './TextoPrincipal';

describe('TextoCarrusel Component', () => {
  test('renders with correct image', () => {
    const { getByAltText } = render(<TextoCarrusel />);
    const imageElement = getByAltText('green iguana');
    expect(imageElement).toBeInTheDocument();
  });
});
