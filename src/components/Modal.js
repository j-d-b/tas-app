import React from 'react';

import './Modal.scss';

const Modal = ({ title, isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-dialog" role="dialog" aria-label={title} tabIndex="-1" onClick={e => e.stopPropagation()}>
        <div className="modal-dialog__close" aria-label="close" onClick={closeModal}>╳</div>
        <div className="modal-dialog__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;