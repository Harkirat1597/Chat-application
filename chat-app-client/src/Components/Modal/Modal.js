import React from "react";
import './Modal.css';

const Modal = ({ children, className, closeModal, ...rest }) => {
    const handleClick = (e) => {
        e.preventDefault();
        if (e.target.closest(".modal")) return;
        return closeModal();
    }

    return (
        <div className="modal-overlay" onClick={handleClick}>
            <div className={`modal ${className}`} {...rest}>
                {children}
            </div>
        </div>
    )
}

Modal.Header = ({ children, className, ...rest }) => {
    return <div className={`modal-header ${className}`} {...rest}> {children} </div>
}

Modal.Header.CloseButton = ({ className, closeModal, ...rest }) => {
    return <button className={`modal-close-btn ${className}`} {...rest} onClick={closeModal} > &#x274C; </button>
}

Modal.Header.Title = ({ children, className, ...rest }) => {
    return <h2 className={`modal-title ${className}`} {...rest}> {children} </h2>
}

Modal.Body = ({ children, className, ...rest }) => {
    return <div className={`modal-body ${className}`} {...rest}> {children} </div>
}

Modal.Footer = ({ children, className, ...rest }) => {
    return <div className={`modal-footer ${className}`} {...rest}> {children} </div>
}

export default Modal;