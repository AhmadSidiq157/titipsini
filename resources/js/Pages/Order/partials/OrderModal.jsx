import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import axios from "axios";
import { Loader2, PackageOpen } from "lucide-react";

// Import Steps
import StepForm from "./Steps/Step1_Form";
import StepPayment from "./Steps/Step2_Payment";
import StepSuccess from "./Steps/Step3_Success";

// Loading Screen
const StepLoading = () => (
    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
            <PackageOpen className="w-16 h-16 text-emerald-600 relative z-10 animate-bounce" />
        </div>
        <h3 className="mt-6 text-lg font-bold text-gray-800">
            Menyiapkan Pesanan...
        </h3>
        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
            Sedang mengambil detail produk dan promo terbaru untuk Anda.
        </p>
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mt-6" />
    </div>
);

export default function OrderModal({ show, onClose, product, productType }) {
    const [step, setStep] = useState("loading");
    const [productData, setProductData] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]); // State untuk tanggal penuh
    const [orderData, setOrderData] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        if (show && product) {
            setStep("loading");
            setBlockedDates([]); // Reset tanggal

            const type =
                productType === "moving_package" ? "moving_package" : "service";

            axios
                .get(route("order.create", { type, id: product.id }))
                .then((res) => {
                    setProductData({
                        product: res.data.product,
                        productModelClass: res.data.productModelClass,
                    });

                    // Simpan blockedDates dari API Backend jika ada
                    if (res.data.blockedDates) {
                        setBlockedDates(res.data.blockedDates);
                    } else {
                        setBlockedDates([]);
                    }

                    setTimeout(() => setStep("form"), 500);
                })
                .catch((err) => {
                    console.error(err);
                    alert("Gagal memuat data layanan. Silakan coba lagi.");
                    onClose();
                });
        }
    }, [show, product]);

    const renderStep = () => {
        switch (step) {
            case "form":
                return productData ? (
                    <StepForm
                        product={productData.product}
                        productModelClass={productData.productModelClass}
                        blockedDates={blockedDates}
                        onFormSubmit={(newOrder) => {
                            setOrderData(newOrder);
                            setStep("payment");
                        }}
                    />
                ) : (
                    <StepLoading />
                );

            case "payment":
                return (
                    <StepPayment
                        order={orderData}
                        onPaymentSubmit={(status) => {
                            setOrderStatus(status);
                            setStep("success");
                        }}
                    />
                );

            case "success":
                return (
                    <StepSuccess
                        orderId={orderData?.id}
                        initialStatus={orderStatus}
                        onClose={onClose}
                    />
                );

            default:
                return <StepLoading />;
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            {renderStep()}
        </Modal>
    );
}
