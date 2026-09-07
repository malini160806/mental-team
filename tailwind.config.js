/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#14142b',
        indigo: {
          650: '#4f46e5',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,20,43,0.04), 0 12px 28px -12px rgba(79,70,229,0.18)',
        card: '0 1px 3px rgba(20,20,43,0.05), 0 8px 20px -10px rgba(20,20,43,0.10)',
      },
      backgroundImage: {
        'app-gradient':
          'radial-gradient(1200px 600px at 8% -10%, #d7f7e9 0%, rgba(215,247,233,0) 55%), radial-gradient(1000px 700px at 95% 0%, #e6e3ff 0%, rgba(230,227,255,0) 50%), linear-gradient(180deg, #fbfbff 0%, #f4f3ff 100%)',
      },
    },
  },
  plugins: [],
}

