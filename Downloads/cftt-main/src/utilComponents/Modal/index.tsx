import React , { ReactChildren, ReactChild } from 'react';
import { Modal as ReactstrapModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './modal.scss';

interface propsObject {
    show: boolean,
    onClosed?: () => any;
    title: string;
    toggle: any;
    footer?: JSX.Element;
    children?: ReactChild | ReactChildren;
    className?: string;
    dialogClassName?: string;
    fullscreen?: boolean;
}
const Modal = ({ show, onClosed, title, toggle, footer, children, dialogClassName, ...rest }: propsObject):JSX.Element  => {
    return (
        <ReactstrapModal
            backdrop="static"
            centered={true}
            isOpen={show}
            keyboard={false}
            onClosed={onClosed}
            dialogClassName= {dialogClassName?? ''}
            {...rest}
        >
            <ModalHeader toggle={toggle ? toggle : ''}>{title ? title : 'Modal title'}</ModalHeader>

            <ModalBody>
                <div className="modal-body-content">{children}</div>
            </ModalBody>

            {footer && (
                <>
                    <ModalFooter>{footer}</ModalFooter>
                </>
            )}
        </ReactstrapModal>
    );
};

export default Modal;
