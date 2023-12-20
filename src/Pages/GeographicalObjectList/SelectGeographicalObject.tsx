import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {DOMEN, requestTime} from "../../Consts.ts";
import axios from "axios";
import {updateMarsStationDraftData} from "../../store/MarsStationDraft.ts";
import {useToken} from "../../hooks/useToken.ts";
import {Button, ButtonGroup} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useEffect, useState} from "react";
import LoadingAnimation from "../../Components/Loading.tsx";
import mockImage from "../../assets/mock.png";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';

export default function SelectGeographicalObject({setShowSelectGeographicalObject}: { setShowSelectGeographicalObject: (value: boolean) => void }) {
    const dispatch = useDispatch();
    const {access_token} = useToken();
    // Количество выбранных заявок
    const count = useSelector((state: RootState) => state.mars_station_draft.geographical_object.length);
    const MarsStaionDraft = useSelector((state: RootState) => state.mars_station_draft);
    const GeographicalObjects = MarsStaionDraft.geographical_object;
    const Locations = MarsStaionDraft.location;
    const [photoUrlsMap, setPhotoUrlsMap] = useState<Record<number, string>>({});
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Определение переменной для отслеживания изменений фото
    const [photoUpdateCounter, setPhotoUpdateCounter] = useState(0);

    // Создаем объект, где ключ - это id_geographical_object, а значение - сам объект geographical_object
    const geographicalObjectMap: any = {};
    GeographicalObjects.forEach((geoObject) => {
        geographicalObjectMap[geoObject.id] = geoObject;
    });
    const sortedLocations = [...Locations].sort((a, b) => a.sequence_number - b.sequence_number);

    useEffect(() => {
        loadPhotos();
    }, [Locations, photoUpdateCounter]);

    useEffect(() => {
    }, [loading])

    // Получить фотки
    const get_photo = async (id_geographical_object: number) => {
        setLoading(true);
        const url: string = `http://127.0.0.1:8000/api/geographical_object/${id_geographical_object}/image/`;
        try {
            await axios.get(url, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                signal: new AbortController().signal,
                timeout: requestTime,
            });
            return url;
        } catch {
            console.log(mockImage);
            return mockImage;
        } finally {
            setLoading(false);
        }
    };

    // Загрузка фото
    const loadPhotos = async () => {
        if (Locations?.length) {
            setLoading(true);
            try {
                const newPhotoUrlsMap: Record<number, string> = {};
                await Promise.all(
                    Locations.map(async (location: any) => {
                        const obj = geographicalObjectMap[location.id_geographical_object];
                        const url = await get_photo(obj.id);
                        newPhotoUrlsMap[obj.id] = url;
                    })
                );
                setPhotoUrlsMap(newPhotoUrlsMap);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

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
        const url = `${DOMEN}api/location/${id_location}/mars_station/${id_mars_station}/update/`;
        const data = {direction: direction}
        await axios.put(url, data, {
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
                // Увеличиваем счетчик для изменения фото
                setPhotoUpdateCounter(prevCounter => prevCounter + 1);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    const [checked, setChecked] = React.useState<boolean>(count > 0);
    useEffect(() => {
        setChecked(count > 0);
        console.log(checked)
    }, [count]);

    useEffect(() => {
        if (!checked) {
            setShowSelectGeographicalObject(false);
        } else {
            setShowSelectGeographicalObject(true);
        }
    }, [checked, setShowSelectGeographicalObject]);

    return (
        <>
            {count > 0 && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 80,
                        right: 10,
                        zIndex: 1,
                    }}
                >
                    <Slide
                        direction="left"
                        in={checked}
                        mountOnEnter
                        unmountOnExit
                    >
                        <Paper sx={{m: 1, width: 800, height: 315, border: '5px solid #C3602AFF'}} elevation={4}>
                            {loading && <LoadingAnimation isLoading={loading}/>}
                            <Typography id="modal-modal-title" variant="h6" component="h2"
                                        sx={{border: '10px solid #fff'}}>
                                Количество выбранных услуг: {count}
                            </Typography>
                            <TableContainer component={Paper} sx={{maxHeight: '250px', overflow: 'auto'}}>
                                <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>ID</TableCell>
                                            <TableCell
                                                style={{fontSize: '18px', fontWeight: 'bold'}}>Изображение</TableCell>
                                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>Название
                                                географического
                                                объекта</TableCell>
                                            <TableCell style={{fontSize: '18px', fontWeight: 'bold'}}>Типы</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedLocations.map((location: any) => (
                                            <TableRow key={location.sequence_number}>
                                                <TableCell>{location.sequence_number}</TableCell>
                                                <TableCell>
                                                    <img
                                                        src={photoUrlsMap[location.id_geographical_object]}
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
                        </Paper>
                    </Slide>
                </Box>
            )}
        </>
    );
}