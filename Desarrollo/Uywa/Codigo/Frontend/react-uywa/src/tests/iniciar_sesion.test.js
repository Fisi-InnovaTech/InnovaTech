/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignInSide from '../components/Login/InicioSesion';
import { BrowserRouter } from 'react-router-dom';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

global.fetch = jest.fn();
window.localStorage = {
  setItem: jest.fn(),
};

describe('Componente SignInSide', () => {
  const mockSuccessResponse = {
    status: 200,
    user: {
      id: 1,
      nombre: 'Test User',
      correo: 'test@example.com',
      insignia: 'beginner'
    },
    token: 'mock-token'
  };

  const mockErrorResponse = {
    status: 401,
    message: 'Invalid credentials'
  };

  beforeEach(() => {
    fetch.mockClear();
    window.localStorage.setItem.mockClear();
  });

  test('renderiza correctamente el formulario de login', () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Ingresar como moderador')).toBeInTheDocument();
  });

  test('permite cambiar entre login normal y de moderador', () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    const checkbox = screen.getByLabelText('Ingresar como moderador');
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('valida el formato del email', () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Correo');
    
    // Email inválido
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    expect(screen.getByText('Correo no válido')).toBeInTheDocument();

    // Email válido
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    expect(screen.queryByText('Correo no válido')).not.toBeInTheDocument();
  });

  test('valida la longitud de la contraseña', () => {
    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText('Contraseña');
    
    // Contraseña corta
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    expect(screen.getByText('Contraseña no válida')).toBeInTheDocument();

    // Contraseña válida
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(screen.queryByText('Contraseña no válida')).not.toBeInTheDocument();
  });

  describe('Login de usuario normal', () => {
    test('maneja login exitoso', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      });

      render(
        <BrowserRouter>
          <SignInSide />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Correo'), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), { 
        target: { value: 'password123' } 
      });

      fireEvent.click(screen.getByText('Iniciar Sesión'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://innovatech-ztzv.onrender.com/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123'
            })
          })
        );

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'UW-logged-session',
          JSON.stringify({
            id: 1,
            nombre: 'Test User',
            email: 'test@example.com',
            insignias: 'beginner',
            token: 'mock-token'
          })
        );
      });
    });

    test('maneja login fallido', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      });

      render(
        <BrowserRouter>
          <SignInSide />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Correo'), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), { 
        target: { value: 'wrongpassword' } 
      });

      fireEvent.click(screen.getByText('Iniciar Sesión'));

      await waitFor(() => {
        expect(screen.getByText('Error, Intente de nuevo')).toBeInTheDocument();
      });
    });
  });

  describe('Login de moderador', () => {
    test('maneja login de moderador exitoso', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      });

      render(
        <BrowserRouter>
          <SignInSide />
        </BrowserRouter>
      );

      // Activar modo moderador
      fireEvent.click(screen.getByLabelText('Ingresar como moderador'));

      fireEvent.change(screen.getByLabelText('Correo'), { 
        target: { value: 'mod@example.com' } 
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), { 
        target: { value: 'modpassword' } 
      });

      fireEvent.click(screen.getByText('Iniciar Sesión'));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'https://innovatech-ztzv.onrender.com/auth/login-moderator',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: 'mod@example.com',
              password: 'modpassword'
            })
          })
        );

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'UW-mod-logged-session',
          JSON.stringify({
            id: 1,
            nombre: 'Test User',
            email: 'test@example.com',
            token: 'mock-token'
          })
        );
      });
    });

    test('maneja login de moderador fallido', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockErrorResponse)
      });

      render(
        <BrowserRouter>
          <SignInSide />
        </BrowserRouter>
      );

      // Activar modo moderador
      fireEvent.click(screen.getByLabelText('Ingresar como moderador'));

      fireEvent.change(screen.getByLabelText('Correo'), { 
        target: { value: 'mod@example.com' } 
      });
      fireEvent.change(screen.getByLabelText('Contraseña'), { 
        target: { value: 'wrongpassword' } 
      });

      fireEvent.click(screen.getByText('Iniciar Sesión'));

      await waitFor(() => {
        expect(screen.getByText('Error, Intente de nuevo')).toBeInTheDocument();
      });
    });
  });

  test('maneja errores de red', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Correo'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), { 
      target: { value: 'password123' } 
    });

    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(screen.getByText('Error, Intente de nuevo')).toBeInTheDocument();
    });
  });

  test('cierra el diálogo de error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockErrorResponse)
    });

    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(screen.getByText('Error, Intente de nuevo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Continuar'));
    expect(screen.queryByText('Error, Intente de nuevo')).not.toBeInTheDocument();
  });

  test('cierra el diálogo de éxito y redirige', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSuccessResponse)
    });

    delete window.location;
    window.location = { href: '' };

    render(
      <BrowserRouter>
        <SignInSide />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(screen.getByText('Usuario logueado correctamente')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Continuar'));
    expect(window.location.href).toBe('/');
  });
});