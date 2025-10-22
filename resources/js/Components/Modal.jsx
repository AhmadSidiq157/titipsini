import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
    children,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl",
    }[maxWidth];

    return (
        <AnimatePresence>
            {show && (
                // Wrapper utama modal, sekarang fixed dan menutupi semua
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={close}
                    />

                    {/* Konten Modal */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 30, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                        }}
                        // Tambahkan max-h-screen, flex-col, dan overflow-hidden
                        className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col overflow-hidden`}
                    >
                        {/* Wrapper untuk konten yang bisa di-scroll */}
                        <div className="overflow-y-auto">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
