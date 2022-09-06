const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}'
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                custom: ['Montserrat', ...defaultTheme.fontFamily.sans],
            },
        },
        screens: {
            'xxs': '335px',
            'xs': '475px',
            ...defaultTheme.screens,
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
