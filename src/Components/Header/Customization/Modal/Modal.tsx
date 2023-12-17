import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FixedSizeList} from 'react-window';
import {useSelector} from 'react-redux';
import {useEffect, useMemo, useState} from 'react';
import {RootState} from "@reduxjs/toolkit/query";
import BasicTable from "./TableSelectGeographicalObject.tsx";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
};

export default function GeographicalObjectModal() {
    const [open, setOpen] = useState(false);
    const GeographicalObject = useSelector((state: RootState) => state.mars_station_draft.geographical_object);
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);
    console.log("MarsStationDraft:", GeographicalObject);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
    };

    // Следим за изменениями в массиве GeographicalObject
    useEffect(() => {
        if (parentUpdateTrigger) {
            setOpen(false); // Закрыть модальное окно при обновлении
        }
    }, [GeographicalObject, parentUpdateTrigger]);


    return (
        <div>
            <Button onClick={handleOpen}>Открыть модальное окно</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Информация о географических объектах
                    </Typography>
                    <FixedSizeList
                        height={400}
                        width={800}
                        itemSize={46}
                        itemCount={GeographicalObject.length}
                        overscanCount={5}
                    >
                        {useMemo(() => (
                            ({ index, style }) => (
                                <BasicTable key={index} data={GeographicalObject[index]} />
                            )
                        ), [GeographicalObject])}
                    </FixedSizeList>
                </Box>
            </Modal>
        </div>
    );
}