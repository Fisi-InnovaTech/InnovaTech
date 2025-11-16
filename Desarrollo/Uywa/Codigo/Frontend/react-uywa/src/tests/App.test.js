import { render } from '@testing-library/react';
import App from '../App';

test('renders app without crashing', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.App')).toBeInTheDocument();
});