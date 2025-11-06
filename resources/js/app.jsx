import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { route } from "ziggy-js"; // <-- 1. TAMBAHKAN IMPORT INI

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            // Saya ubah ke pola standar yang lebih rapi, ini sudah mencakup semua folder
            import.meta.glob("./Pages/**/*.jsx", { eager: true })
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // <-- 2. TAMBAHKAN KONFIGURASI ROUTE DI SINI
        //    Kita ambil data 'ziggy' dari initial props yang dikirim middleware
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
