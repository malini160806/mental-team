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
          'radial-gradient(900px 600px at 0% 0%, rgba(153,246,228,0.55) 0%, rgba(153,246,228,0) 60%), radial-gradient(900px 700px at 100% 0%, rgba(221,214,254,0.75) 0%, rgba(221,214,254,0) 55%), radial-gradient(800px 600px at 100% 55%, rgba(251,207,232,0.5) 0%, rgba(251,207,232,0) 60%), radial-gradient(900px 600px at 0% 80%, rgba(186,230,253,0.55) 0%, rgba(186,230,253,0) 60%), radial-gradient(700px 500px at 50% 100%, rgba(254,215,170,0.45) 0%, rgba(254,215,170,0) 60%), linear-gradient(180deg, #fcfbff 0%, #f7f5ff 100%)',
      },
    },
  },
  plugins: [],
}

