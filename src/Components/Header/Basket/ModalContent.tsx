import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store.ts";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import {DOMEN} from "../../../Consts.ts";
import axios from "axios";
import {updateMarsStationDraftData} from "../../../store/MarsStationDraft.ts";
import {useToken} from "../../../hooks/useToken.ts";
import {Button, ButtonGroup} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
};

export function ModalContent({handleClose, count}: {
    handleClose: () => void;
    count: number;
}) {
    const dispatch = useDispatch();
    const {access_token} = useToken();

    const MarsStaionDraft = useSelector((state: RootState) => state.mars_station_draft);
    const GeographicalObjects = MarsStaionDraft.geographical_object;
    const Locations = MarsStaionDraft.location;

    // Создаем объект, где ключ - это id_geographical_object, а значение - сам объект geographical_object
    const geographicalObjectMap: any = {};
    GeographicalObjects.forEach((geoObject) => {
        geographicalObjectMap[geoObject.id] = geoObject;
    });
    const sortedLocations = [...Locations].sort((a, b) => a.sequence_number - b.sequence_number);

    const delete_location_and_mars_station = async (id_location: number, id_mars_station: number) => {
        const url = `${DOMEN}api/location/${id_location}/mars_station/${id_mars_station}/delete/`;
        await axios.delete(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
        })
            .then(response => {
                console.log("Успешно удалено с черновой заявки!", response.data);
                dispatch(updateMarsStationDraftData({
                    geographical_object: response.data.geographical_object || [],
                    location: response.data.location || [],
                }));
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    const put_location_and_mars_station = async (id_location: number, id_mars_station: number, direction: string) => {
        const url = `${DOMEN}api/location/${id_location}/mars_station/${id_mars_station}/direction/${direction}/update/`;
        await axios.put(url, {}, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
        })
            .then(response => {
                console.log("Успешно обновлены черновой заявки!", response.data);
                dispatch(updateMarsStationDraftData({
                    geographical_object: response.data.geographical_object || [],
                    location: response.data.location || [],
                }));
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    return (
        <Box sx={style}>
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleClose}
                sx={{position: 'absolute', top: 5, right: 20}}
            >
                <CloseIcon/>
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Данные о географическом объекте. Количество выбранных услуг: {count}
            </Typography>
            <TableContainer component={Paper} sx={{maxHeight: '400px', overflow: 'auto'}}>
                <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>ID</TableCell>
                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>Изображение</TableCell>
                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>Название географического
                                объекта</TableCell>
                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>Типы</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedLocations.map((location) => (
                            <TableRow key={location.sequence_number}>
                                <TableCell>{location.sequence_number}</TableCell>
                                <TableCell>
                                    <img
                                        src={geographicalObjectMap[location.id_geographical_object]?.photo}
                                        alt={geographicalObjectMap[location.id_geographical_object]?.feature}
                                        style={{width: '50px', height: '50px'}}
                                    />
                                </TableCell>
                                <TableCell>{geographicalObjectMap[location.id_geographical_object]?.feature}</TableCell>
                                <TableCell>{geographicalObjectMap[location.id_geographical_object]?.type}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => delete_location_and_mars_station(location.id, location.id_mars_station)}
                                    >
                                        <DeleteIcon/>
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <ButtonGroup orientation="vertical">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => put_location_and_mars_station(location.id, location.id_mars_station, 'up')}
                                        >
                                            <KeyboardArrowUpIcon/>
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => put_location_and_mars_station(location.id, location.id_mars_station, 'down')}
                                        >
                                            <KeyboardArrowDownIcon/>
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}