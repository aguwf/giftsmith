// NOTE: This Modal uses 'framer-motion' for spring animations. Install it with: yarn add framer-motion
import React, { useEffect, useRef, useState, ReactNode, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  overlayColor?: string;
  size?: "sm" | "md" | "lg" | "xl" | string;
  title?: string; // Deprecated, use <Modal.Title> instead
}

const sizeClassMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const ModalTitle: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</div>
);

const ModalBody: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const ModalFooter: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`pt-2 border-t border-gray-200 dark:border-gray-700 mt-4 flex justify-end gap-2 ${className}`}>{children}</div>
);

const Modal: React.FC<ModalProps> & {
  Title: typeof ModalTitle;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  className = "",
  overlayColor = "bg-black bg-opacity-50 dark:bg-opacity-70",
  size = "lg",
  title, // deprecated
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const modalSize = sizeClassMap[size] || size;
  const childrenWithTitle = title
    ? [<ModalTitle key="modal-title">{title}</ModalTitle>, children]
    : children;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className={`modal-overlay fixed inset-0 z-50 flex items-center justify-center ${overlayColor}`}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{}}
        >
          <motion.div
            ref={modalRef}
            className={`modal-content bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl p-6 w-full relative outline-none ${modalSize} ${className}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            style={{}}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="top-3 right-3 absolute focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 dark:text-gray-400 transition-colors"
                aria-label="Close modal"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            {childrenWithTitle}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

// Custom hook to fetch list of products (custom products)
export function useListProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch("/admin/custom-products")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setProducts(data.products || data.custom_products || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

export default Modal;
