import Modal from '@mui/material/Modal';
import {ModalContent} from "./ModalContent.tsx";

export function GeographicalObjectModal({isOpen, handleClose, count}: {
    isOpen: boolean;
    handleClose: () => void;
    count: number;
}) {
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalContent count={count} handleClose={handleClose}/>
        </Modal>
    );
}