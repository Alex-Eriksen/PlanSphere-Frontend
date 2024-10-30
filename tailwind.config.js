/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            screens: {
                "nav-breakpoint": "1100px",
                "max-screen": "1900px",
                "breakpoint-ipad-screen": "1285px",
                "breakpoint-small-desktop-screen": "1411px",
                "screen-800": "800px",
            },
            fontFamily: {
                cerebri: ["Cerebri Sans", "Open Sans", "Arial", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "var(--color-primary)",
                    10: "var(--color-primary) / 0.1",
                    60: "var(--color-primary) / 0.6",
                    80: "var(--color-primary) / 0.8",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    50: "var(--color-secondary) / 0.5",
                },
                warning: {
                    DEFAULT: "var(--clr-warning)",
                    50: "var(--clr-warning-light)",
                },
                error: {
                    DEFAULT: "var(--clr-error)",
                    50: "#A1343440",
                    100: "#A13434",
                    200: "#C7393C",
                    300: "#F1664B",
                },
                success: {
                    DEFAULT: "var(--clr-success)",
                    25: "#34903240",
                    50: "#77C7A1",
                    100: "#34903212",
                    dark: "#2E8140",
                },
                status: {
                    completed: {
                        DEFAULT: "var(--clr-status-completed)",
                        light: "var(--clr-status-completed-light)",
                        200: "#177E53",
                    },
                    inProcess: {
                        DEFAULT: "var(--clr-status-in-process)",
                        light: "var(--clr-status-in-process-light)",
                        dark: "#B47831",
                    },
                    available: {
                        DEFAULT: "var(--clr-status-available)",
                        light: "var(--clr-status-available-light)",
                    },
                    notActive: {
                        DEFAULT: "var(--clr-status-not-active)",
                        light: "var(--clr-status-not-active-light)",
                    },
                },
                black: {
                    DEFAULT: "#000",
                    50: "#F9F9F9",
                    100: "#F2F2F2",
                    200: "#E9E9E9",
                    300: "#D9D9D9",
                    400: "#B5B5B5",
                    500: "#959595",
                    600: "#6D6D6D",
                    700: "#595959",
                },
                event: {
                    draft: {
                        DEFAULT: "var(--clr-event-draft-status)",
                        50: "#FAF1A380",
                    },
                    privateViewing: {
                        DEFAULT: "var(--clr-event-private-viewing-status)",
                        50: "#FFCBA480",
                    },
                    private: {
                        DEFAULT: "var(--clr-event-private-event-status)",
                        50: "#7B68EE80",
                    },
                    public: {
                        DEFAULT: "var(--clr-event-public-event-status)",
                        50: "#7BAFD480",
                    },
                },
                "progress-bar": "var(--clr-progress-bar)",
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities }) {
            matchUtilities({
                "r-screen": (value) => ({
                    "min-height": `calc(100dvh - ${value})`,
                }),
            });
        }),
    ],
}
