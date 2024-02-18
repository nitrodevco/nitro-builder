/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                'top-bar': '#545454',
                'side-bar': '#444444'
            },
            fontFamily: {
                sans: [ 'Rubik', 'sans-serif' ],
            },
            height: {
                'top-bar': '44px',
            },
            maxHeight: {
                '200': '200px'
            },
            zIndex: {
                'popover': '500'
            }
        },
    },
    darkMode: 'class',
    plugins: [
        require('postcss-nested'),
        require('@tailwindcss/forms'),
        require('@headlessui/tailwindcss')({ prefix: 'ui' })
    ],
    content: {
        content: [
            './index.html',
            './src/**/*.{html,js,jsx,ts,tsx}'
        ]
    }
}
