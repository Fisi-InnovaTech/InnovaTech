const dayjs = jest.requireActual('dayjs'); // Carga el módulo real

// Añade la función `extend` simulada
dayjs.extend = () => {}; 

module.exports = dayjs;