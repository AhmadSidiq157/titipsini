import React from "react";
import { usePage } from "@inertiajs/react";

export default function ApplicationLogo(props) {
    // Mengambil data 'settings' dari props global
    const { settings } = usePage().props;

    // Menentukan sumber logo secara dinamis
    // Jika admin sudah upload logo (settings.site_logo ada), gunakan itu.
    // Jika tidak, gunakan logo default.
    const logoSrc = settings?.site_logo
        ? `/storage/${settings.site_logo}`
        : "/images/logo.jpg";

    return <img {...props} src={logoSrc} alt="Logo Aplikasi" />;
}
