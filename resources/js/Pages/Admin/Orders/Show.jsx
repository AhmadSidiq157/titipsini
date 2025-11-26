// resources/js/Pages/Admin/Orders/Show.jsx

import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";

// IMPORT SEMUA DARI FILE KOMPONEN
import {
    getStatusLabel,
    OrderStepper,
    OrderDetailsBox,
    PaymentVerificationBox,
    CourierAssignmentBox,
    StorageStatusBox,
    TrackingHistoryBox,
    CopyButton,
} from "./OrderComponents";

export default function Show({ auth, order, couriers }) {
    const { flash } = usePage().props;
    const details = order.user_form_details || {};
    const needsPickup = details.delivery_method === "pickup";

    const canAssignCourier =
        needsPickup &&
        [
            "awaiting_verification",
            "verified",
            "ready_for_pickup",
            "processing",
        ].includes(order.status);

    return (
        <AdminLayout user={auth.user} header={null}>
            <Head title={`Detail Order #${order.id}`} />
            <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
                {/* --- HEADER --- */}
                <div className="bg-white/90 border-b border-gray-200 sticky top-0 z-30 backdrop-blur-lg px-4 md:px-8 py-4 shadow-sm transition-all">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center w-full md:w-auto">
                            <Link
                                href={route("admin.orders.index")}
                                className="p-2 mr-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors group"
                            >
                                <ArrowRight
                                    size={20}
                                    className="rotate-180 group-hover:-translate-x-1 transition-transform"
                                />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-black text-gray-800 tracking-tight">
                                        Order #{order.id}
                                    </h2>
                                    <CopyButton
                                        text={`#${order.id}`}
                                        label="Salin ID"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                    {new Date(order.created_at).toLocaleString(
                                        "id-ID",
                                        {
                                            dateStyle: "full",
                                            timeStyle: "short",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            {details.phone && (
                                <a
                                    href={`https://wa.me/${details.phone
                                        .replace(/^0/, "62")
                                        .replace(/\D/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                                    title="Hubungi via WhatsApp"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            )}
                            <div className="h-8 w-px bg-gray-300 mx-1"></div>
                            <span
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                                    order.status === "awaiting_verification"
                                        ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                                        : order.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                            >
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- STEPPER --- */}
                <OrderStepper status={order.status} needsPickup={needsPickup} />

                {/* --- BODY CONTENT --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {flash.success && (
                        <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-4 rounded-2xl flex items-center shadow-sm animate-in slide-in-from-top-2">
                            <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <Check className="w-5 h-5 text-emerald-700" />
                            </div>
                            <p className="font-medium">{flash.success}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* KIRI */}
                        <div className="xl:col-span-7 space-y-6">
                            <OrderDetailsBox order={order} />
                        </div>
                        {/* KANAN */}
                        <div className="xl:col-span-5 space-y-6">
                            {order.status === "awaiting_verification" && (
                                <PaymentVerificationBox order={order} />
                            )}
                            {canAssignCourier && (
                                <CourierAssignmentBox
                                    order={order}
                                    couriers={couriers}
                                />
                            )}
                            <StorageStatusBox order={order} />
                            <TrackingHistoryBox order={order} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
