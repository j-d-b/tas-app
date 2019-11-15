import React, { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import './Modal.scss';

const Modal = ({ title, isOpen, closeModal, onClosed, maxWidth = 600, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('style', 'overflow: hidden; position: fixed;');
    } else {
      document.body.removeAttribute('style');
    }
  }, [isOpen]);

  return (
    <div>
      <CSSTransition in={isOpen} classNames="modal-backdrop" timeout={300} unmountOnExit>
        <div className="modal-backdrop"></div>
      </CSSTransition>

      <CSSTransition in={isOpen} classNames="modal" timeout={300} onExited={() => onClosed && onClosed()} unmountOnExit>
        <div className="modal" tabIndex="-1" role="dialog" onClick={closeModal}>
          <div className="modal-dialog" style={{ maxWidth }} role="document" aria-label={title}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-content__close-row">
                <div className="modal-content__close-icon" aria-label="close" onClick={closeModal}>✕</div>
              </div>
              <div className="modal-content__content">{children}</div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default Modal;