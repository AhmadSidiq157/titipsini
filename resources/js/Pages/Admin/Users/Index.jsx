import AdminLayout from "@/Layouts/AdminLayout"; // [1] Ganti layout ke AdminLayout
import { Head, Link, usePage } from "@inertiajs/react";

export default function Index({ auth, users }) {
    // Mengambil flash message dari props
    const { flash } = usePage().props;

    // Fungsi helper untuk mengecek apakah user punya role admin
    const isAdmin = (user) => {
        return user.roles.some((role) => role.name === "admin");
    };

    return (
        // [2] Gunakan AdminLayout sebagai pembungkus utama
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            {/* [3] Konten utama sekarang berada di dalam area main */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    {/* Menampilkan notifikasi sukses jika ada */}
                    {flash && flash.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                            {flash.success}
                        </div>
                    )}

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isAdmin(user) ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!isAdmin(user) && (
                                            <Link
                                                href={route(
                                                    "admin.users.makeAdmin",
                                                    { user: user.id }
                                                )}
                                                method="get"
                                                as="button"
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Jadikan Admin
                                            </Link>
                                        )}
                                        {isAdmin(user) &&
                                            user.id !== auth.user.id && (
                                                <Link
                                                    href={route(
                                                        "admin.users.removeAdmin",
                                                        { user: user.id }
                                                    )}
                                                    method="get"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Cabut Admin
                                                </Link>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
