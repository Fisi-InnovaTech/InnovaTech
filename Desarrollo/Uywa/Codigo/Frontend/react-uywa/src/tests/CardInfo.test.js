import React from 'react';
import { render, screen } from '@testing-library/react';
import CardsInformation from '../components/cards/CardInfo';
import { Typography } from '@mui/material';

describe('CardsInformation Component', () => {
  const icon = <Typography variant="h1">🔥</Typography>;
  const numero = "42";
  const contenido = "This is a test content.";

  test('renders CardsInformation component with props', () => {
    render(<CardsInformation icono={icon} numero={numero} contenido={contenido} />);

    const cardElement = screen.getByTestId('card-info');
    expect(cardElement).toBeInTheDocument();

    const iconElement = screen.getByText('🔥');
    expect(iconElement).toBeInTheDocument();

    const numeroElement = screen.getByText(numero);
    expect(numeroElement).toBeInTheDocument();

    const contenidoElement = screen.getByText(contenido);
    expect(contenidoElement).toBeInTheDocument();
  });
});
