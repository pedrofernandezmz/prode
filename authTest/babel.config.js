module.exports = function (api) {
    api.cache(true); // Habilita el caching para mejorar el rendimiento
    return {
      presets: ['babel-preset-expo'], // Usa el preset de Expo para Babel
    };
  };