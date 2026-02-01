/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'iron-gold': '#C5A059',
                'iron-black': '#1A1A1A',
                'iron-gray': '#F3F4F6',
            }
        },
    },
    plugins: [],
}
