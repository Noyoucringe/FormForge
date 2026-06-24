import React from 'react';
import Button from './Button';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="ff-modal-backdrop" role="presentation">
      <section aria-modal="true" className="ff-modal" role="dialog">
        <header className="ff-modal-header">
          <h2>{title}</h2>
          <Button onClick={onClose} title="Close modal" variant="ghost">
            Close
          </Button>
        </header>
        <div className="ff-modal-body">{children}</div>
      </section>
    </div>
  );
};

export default Modal;
