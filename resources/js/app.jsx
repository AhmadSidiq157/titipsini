import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { route } from "ziggy-js"; // <-- 1. IMPORT ZIGGY

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            // --- INI PERBAIKAN UTAMA ---
            // Pola glob yang benar untuk membaca semua sub-folder
            import.meta.glob("./Pages/**/*.jsx", { eager: true })
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // <-- 2. KONFIGURASI ZIGGY ---
        const ziggyProps = props.initialPage.props.ziggy;
        if (ziggyProps) {
            route(undefined, undefined, undefined, ziggyProps);
        }
        // --- Akhir tambahan ---

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
