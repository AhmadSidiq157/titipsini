import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Save,
    Facebook,
    Instagram,
    Twitter,
    CheckCircle,
    Loader2,
    PlusCircle,
    Trash2,
    Share2,
    Youtube,
    Linkedin,
    Globe,
} from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

// Fungsi untuk memilih ikon berdasarkan nama platform
const getSocialIcon = (name) => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes("facebook"))
        return <Facebook size={18} className="text-blue-600" />;
    if (lowerCaseName.includes("instagram"))
        return <Instagram size={18} className="text-pink-500" />;
    if (lowerCaseName.includes("twitter"))
        return <Twitter size={18} className="text-sky-500" />;
    if (lowerCaseName.includes("youtube"))
        return <Youtube size={18} className="text-red-600" />;
    if (lowerCaseName.includes("linkedin"))
        return <Linkedin size={18} className="text-blue-700" />;
    return <Globe size={18} className="text-gray-500" />; // Ikon default
};

export default function SocialIndex({ settings, flash }) {
    const { data, setData, post, errors, processing } = useForm({
        social_links: settings.social_links || [],
    });

    const addSocialLink = () => {
        setData("social_links", [...data.social_links, { name: "", url: "" }]);
    };

    const removeSocialLink = (index) => {
        setData(
            "social_links",
            data.social_links.filter((_, i) => i !== index)
        );
    };

    const handleInputChange = (index, field, value) => {
        const updatedLinks = [...data.social_links];
        updatedLinks[index][field] = value;
        setData("social_links", updatedLinks);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"));
    };

    return (
        <AdminLayout header="Pengaturan / Media Sosial">
            <Head title="Media Sosial" />
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
                        <form onSubmit={submit} className="p-8 md:p-10">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-indigo-600" />
                                    Edit Tautan Media Sosial
                                </h2>
                            </div>

                            {flash?.success && (
                                <div className="mb-6 flex items-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span className="font-medium">
                                        {flash.success}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-6">
                                {data.social_links.map((link, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg bg-gray-50/50 relative"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="mt-8">
                                                {getSocialIcon(link.name)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                                <div>
                                                    <InputLabel
                                                        htmlFor={`name_${index}`}
                                                        value="Nama Platform"
                                                    />
                                                    <TextInput
                                                        id={`name_${index}`}
                                                        value={link.name}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="Contoh: TikTok"
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel
                                                        htmlFor={`url_${index}`}
                                                        value="URL Lengkap"
                                                    />
                                                    <TextInput
                                                        id={`url_${index}`}
                                                        type="url"
                                                        value={link.url}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "url",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full"
                                                        placeholder="https://tiktok.com/@username"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSocialLink(index)
                                            }
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {data.social_links.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>
                                            Belum ada media sosial ditambahkan.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={addSocialLink}
                                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    <PlusCircle size={16} className="mr-2" />
                                    Tambah Media Sosial
                                </button>
                            </div>

                            <div className="flex items-center justify-end mt-10 pt-6 border-t border-gray-200">
                                <PrimaryButton
                                    disabled={processing}
                                    className="flex items-center px-5 py-2.5 rounded-xl"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
