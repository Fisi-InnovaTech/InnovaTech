import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';

describe('Home Component', () => {
  test('renders Home component correctly', () => {
    render(<Home />);

    const carouselElement = screen.getByTestId('carousel');
    expect(carouselElement).toBeInTheDocument();

    const cardInfoElements = screen.getAllByTestId('card-info');
    expect(cardInfoElements.length).toBe(3);

    expect(cardInfoElements[0]).toHaveTextContent('9890');
    expect(cardInfoElements[0]).toHaveTextContent('Intervenciones de animales en todo el año');

    expect(cardInfoElements[1]).toHaveTextContent('1830');
    expect(cardInfoElements[1]).toHaveTextContent('Intervenciones en regiones del Perú');

    expect(cardInfoElements[2]).toHaveTextContent('2873');
    expect(cardInfoElements[2]).toHaveTextContent('Ranas acuáticas intervenidas en todo el año');

    const actionAreaCardElement = screen.getByTestId('action-area-card');
    expect(actionAreaCardElement).toBeInTheDocument();
  });
});
