// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      container: {
        center: true, // Центрирование контейнера
        padding: '1rem', // Отступы по умолчанию
        screens: {
          sm: '100%', // На малых экранах контейнер занимает всю ширину
          md: '100%', // На средних экранах контейнер занимает всю ширину
          lg: '1024px', // На больших экранах контейнер ограничен 1024px
          xl: '1256px', // На очень больших экранах контейнер ограничен 1280px
        },
      },
      colors: {
        blue: {
          dark: "var(--color-blue-dark)",
          light: "var(--color-blue-light)",
          subtle: "var(--color-blue-subtle)",
        },
        red: {
          30: "var(--color-red-30)",
          20: "var(--color-red-20)",
          10: "var(--color-red-10)",
          subtle: "var(--color-red-subtle)",
        },
        black: "var(--color-black)",
        gray: {
          30: "var(--color-gray-30)",
          20: "var(--color-gray-20)",
          10: "var(--color-gray-10)",
          line: "var(--color-gray-line)",
          bg: "var(--color-gray-bg)",
          subtle: "var(--color-gray-bg-subtle)",
          hover: "var(--color-gray-hover)",
        },
      },

    },
  },
  plugins: [],
}
