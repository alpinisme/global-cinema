import React, { ReactPortal } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { createPortal } from 'react-dom';
import styles from './Modal.scss';

const Modal = (): ReactPortal | null => {
    const root = document.getElementById('modal-root');

    if (!root) {
        throw new Error('Modal root missing from document');
    }

    const modal = useModal();

    if (!modal.isOpen) {
        return null;
    }

    return createPortal(
        <div className={styles.container} onClick={() => modal.toggle()}>
            <div className={styles.dialog}>{modal.children}</div>
        </div>,
        root
    );
};

export default Modal;
