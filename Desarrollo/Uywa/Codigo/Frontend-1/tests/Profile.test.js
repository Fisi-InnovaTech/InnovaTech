import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from '../src/pages/Profile';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const renderWithTheme = (component) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Profile Component', () => {
  it('renders the profile information correctly', () => {
    renderWithTheme(<Profile />);
    
    expect(screen.getByText('Brayan Llacza Valeta')).toBeInTheDocument();
    expect(screen.getByText('Doctor')).toBeInTheDocument();
    expect(screen.getByText('Doctor y diseñador gráfico amante de los animales')).toBeInTheDocument();
  });

  it('renders the contact information correctly', () => {
    renderWithTheme(<Profile />);
    
    expect(screen.getByText('Correo:')).toBeInTheDocument();
    expect(screen.getByText('brayan@llacza.com')).toBeInTheDocument();
    expect(screen.getByText('Rango:')).toBeInTheDocument();
    expect(screen.getByText('Dotero Senior')).toBeInTheDocument();
    expect(screen.getByText('Contribuciones:')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('renders the reports table correctly', () => {
    renderWithTheme(<Profile />);
    
    expect(screen.getByText('Mis reportes')).toBeInTheDocument();
    expect(screen.getByText('Anaconda')).toBeInTheDocument();
    expect(screen.getByText('Cotorra')).toBeInTheDocument();
    expect(screen.getByText('Rana del Titicaca')).toBeInTheDocument();
  });

  it('renders the achievements correctly', () => {
    renderWithTheme(<Profile />);
    
    expect(screen.getByText('Mis Logros')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido a Uywa')).toBeInTheDocument();
    expect(screen.getByText('Primeros Pasos')).toBeInTheDocument();
    expect(screen.getByText('Amante de los animales')).toBeInTheDocument();
    expect(screen.getByText('Guardián de la naturaleza')).toBeInTheDocument();
    expect(screen.getByText('Protector de la biósfera')).toBeInTheDocument();
  });
});
