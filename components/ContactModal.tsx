import React from 'react';
import { motion } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="main-grid w-full max-w-7xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="col-start-5 col-span-4 text-2xl font-light text-black text-left">
          Contact
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactModal;
