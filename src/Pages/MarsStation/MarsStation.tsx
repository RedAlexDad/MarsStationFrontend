import "./MarsStation.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {DOMEN, requestTime} from "../../Consts";
import {GeographicalObject, MarsStation, Location} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";
import {useDispatch} from "react-redux";
import {clearID_draft} from "../../store/GeographicalObject.ts";
import {cleanDraft, updateMarsStationDraftData} from "../../store/MarsStationDraft.ts";
import mockImage from "../../assets/mock.png";
import DeleteIcon from "@mui/icons-material/Delete";
import {Button, ButtonGroup, TextField} from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LoadingAnimation from "../../Components/Loading.tsx";
// import MultipleSelectTransport from "./MultipleSelectTransport.tsx";

const MarsStationPage = ({selectedMarsStation, setSelectedMarsStation}: {
    selectedMarsStation: MarsStation | undefined,
    setSelectedMarsStation: Dispatch<MarsStation | undefined>
}) => {
    const {id_mars_station} = useParams<{
        id_mars_station: string
    }>();

    if (id_mars_station == undefined) {
        return;
    }

    const dispatch = useDispatch();
    const {is_moderator} = useAuth()
    const {access_token} = useToken()
    const [updateTrigger, setUpdateTrigger] = useState(false);

    // Редактирование заявок
    const [edit, setEdit] = useState<boolean>(false);
    const [editedTypeStatus, setEditedTypeStatus] = useState(selectedMarsStation?.type_status || '');
    // const [selectedTransports, setSelectedTransports] = useState<number[]>([]);
    const [photoUrlsMap, setPhotoUrlsMap] = useState<Record<number, string>>({});
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Определение переменной для отслеживания изменений фото
    const [photoUpdateCounter, setPhotoUpdateCounter] = useState(0);

    const handleChangeStatus = (type_status: string) => {
        setEditedTypeStatus(type_status);
    };

    // const handleTransportsChange = (selectedIds: number[]) => {
    //     setSelectedTransports(selectedIds);
    // };

    // Данные
    const GeographicalObjects: GeographicalObject[] | undefined = selectedMarsStation?.geographical_object;
    const Locations: Location[] | undefined = selectedMarsStation?.location;
    // const [transports, setTransports] = useState([]);

    // Создаем объект, где ключ - это id_geographical_object, а значение - сам объект geographical_object
    let geographicalObjectMap: any = {};
    if (GeographicalObjects) {
        // Создаем объект, где ключ - это id_geographical_object, а значение - сам объект geographical_object
        GeographicalObjects.forEach((geoObject) => {
            geographicalObjectMap[geoObject.id] = geoObject;
        });
    }
    let sortedLocations: Location[] = [];
    if (Locations) {
        sortedLocations = [...Locations].sort((a, b) => a.sequence_number - b.sequence_number);
    }
    // console.log(sortedLocations)

    useEffect(() => {
        getMarsStation()
        if (updateTrigger) {
            // Вызываем код или обновление, которое должно произойти после успешного удаления
            // Например, здесь можно обновить список географических объектов или выполнить другие действия
            setUpdateTrigger(false);
        }
    }, [updateTrigger])

    useEffect(() => {
        loadPhotos();
    }, [Locations, photoUpdateCounter]);

    useEffect(() => {
    }, [loading]);


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

    // Проверяем, есть ли у selectedMarsStation транспорты при первом рендере
    // useEffect(() => {
    //     if (selectedMarsStation && selectedMarsStation.transport) {
    //         const initialTransports = selectedMarsStation.transport.map(transport => transport.id);
    //         setSelectedTransports(initialTransports);
    //     }
    //     console.log(selectedTransports)
    //     console.log(selectedMarsStation)
    // }, [selectedMarsStation]);

    const getMarsStation = async () => {
        setLoading(true);
        const url = `${DOMEN}api/mars_station/${id_mars_station}/`;
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
            timeout: requestTime,
        })
            .then(response => {
                const mars_station: MarsStation = response.data;
                setSelectedMarsStation(mars_station);
                // console.log(mars_station)
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const push_mars_station = () => {
        const url = `${DOMEN}api/mars_station/${id_mars_station}/update_by_user/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        axios.put(url, {}, {headers})
            .then(response => {
                console.log("Успешно! Заявка отправлена!", response.data);
                setUpdateTrigger(true);
                dispatch(clearID_draft());
                dispatch(cleanDraft());
            })
            .catch(error => {
                console.error("Ошибка отправки!\n", error);
            });
    };

    const delete_mars_station = () => {
        const url = `${DOMEN}api/mars_station/${id_mars_station}/delete/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        axios.delete(url, {headers})
            .then(response => {
                console.log("Успешно! Заявка удалена!", response.data);
                setUpdateTrigger(true);
                dispatch(clearID_draft());
                dispatch(cleanDraft());
            })
            .catch(error => {
                console.error("Ошибка отправки!\n", error);
            });
    };

    const check_mars_station = (value: number) => {
        const url = `${DOMEN}api/mars_station/${id_mars_station}/update_by_admin/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        const data = {status_task: value}
        axios.put(url, data, {headers})
            .then(response => {
                console.log("Успешно! Заявка отправлена!", response.data);
                setUpdateTrigger(true);
                dispatch(clearID_draft());
            })
            .catch(error => {
                console.error("Ошибка отправки!\n", error);
            });
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
                setUpdateTrigger(true);
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
                setUpdateTrigger(true);
                // Увеличиваем счетчик для изменения фото
                setPhotoUpdateCounter(prevCounter => prevCounter + 1);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    const save_mars_station = async () => {
        const url = `${DOMEN}api/mars_station/${id_mars_station}/update/`;
        const data = {...selectedMarsStation}
        data.type_status = editedTypeStatus;
        // data.transport = selectedTransports.map(selectedId => {
        //     const foundTransport = transports.find(transport => transport.id === selectedId);
        //     return foundTransport || {}; // Если не найден транспорт, возвращаем пустой объект
        // });
        await axios.put(url, data, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
        })
            .then(response => {
                console.log("Успешно обновлены черновой заявки!", response.data);
                setUpdateTrigger(true);
                setEdit(false);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    // const getTransports = async () => {
    //     const url = `${DOMEN}api/transport/`;
    //     await axios.get(url, {
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8",
    //             authorization: access_token,
    //         },
    //     })
    //         .then(response => {
    //             console.log("Успешно получены все транспорты!", response.data);
    //             setTransports(response.data)
    //         })
    //         .catch(error => {
    //             console.error("Ошибка!\n", error);
    //         })
    // };

    // Абсолютный путь для ссылки
    const marsStationPath = `/mars_station/${id_mars_station}/`;

    return (
        <>
            {loading && <LoadingAnimation isLoading={loading}/>}

            <div className="page-details-wrapper">
                <Link className="return-link" to="/mars_station">
                    Назад
                </Link>
                {!is_moderator && selectedMarsStation?.status_task === "Черновик" && (
                    <div className="button-agree">
                        <button onClick={() => push_mars_station()}>Отправить</button>
                    </div>
                )}
                {!edit && !is_moderator && selectedMarsStation?.status_task === "Черновик" && (
                    <div className="button-edit">
                        <button onClick={() => {
                            setEdit(true);
                            // getTransports();
                        }}>Редактировать
                        </button>
                    </div>
                )}
                {edit && !is_moderator && selectedMarsStation?.status_task === "Черновик" && (
                    <div className="button-edit">
                        <button onClick={() => save_mars_station()}>Сохранить</button>
                    </div>
                )}
                {!is_moderator && selectedMarsStation?.status_task === "Черновик" && (
                    <div className="button-reject">
                        <button onClick={() => delete_mars_station()}>Удалить</button>
                    </div>
                )}
                {is_moderator && selectedMarsStation?.status_task === "В работе" && (
                    <div className="button-accept">
                        <button onClick={() => check_mars_station(3)}>Принять и завершить</button>
                    </div>
                )}
                {is_moderator && selectedMarsStation?.status_task === "В работе" && (
                    <div className="button-reject">
                        <button onClick={() => check_mars_station(4)}>Отменить</button>
                    </div>
                )}

                <div className="right">
                    <div className="info-container">
                        <h2 className="name"> Номер заявки: {selectedMarsStation?.id}</h2>
                        <br/>
                        {!edit &&
                            <h2 className="name"> Тип заявки: {selectedMarsStation?.type_status}</h2>
                        }
                        {edit &&
                            <TextField
                                type="text"
                                id="outlined-basic"
                                label="Тип заявки"
                                variant="outlined"
                                autoComplete="type_status"
                                value={editedTypeStatus}
                                onChange={(e) => handleChangeStatus(e.target.value)}
                                sx={{
                                    '& input, & label, & .MuiIconButton-label': {color: 'white'},
                                    maxWidth: '500px',
                                }}
                            />
                        }
                        <br/>
                        <span className="type">Тип статуса заявки: {selectedMarsStation?.status_task}</span>
                        <span className="type">Тип статуса миссии: {selectedMarsStation?.status_mission}</span>
                        <span className="size">Дата создания заявки: {selectedMarsStation?.date_create} </span>
                        <span className="size">Дата формирования заявки: {selectedMarsStation?.date_form} </span>
                        <span className="size">Дата закрытия заявки: {selectedMarsStation?.date_close} </span>
                        <br/>
                        <h2> Модератор</h2>
                        <span className="size">
                      ФИО модератора: {(selectedMarsStation?.moderator as {
                            full_name?: string
                        })?.full_name || 'Нет данных'}
                    </span>
                        <span
                            className="size">Должность: {(selectedMarsStation?.moderator as {
                            post?: string
                        })?.post || 'Нет данных'}</span>
                        <span
                            className="size">Название организации: {(selectedMarsStation?.moderator as {
                            name_organization?: string
                        })?.name_organization || 'Нет данных'}</span>
                        <span
                            className="size">Адрес: {(selectedMarsStation?.moderator as {
                            address?: string
                        })?.address || 'Нет данных'}</span>
                        <br/>
                        {/*<h2> Транспорт</h2>*/}
                        {/*{!edit && selectedTransports.length > 0 && (*/}
                        {/*    <>*/}
                        {/*            <span className="describe">*/}
                        {/*                Тип: {selectedTransports.map((selectedId: number, index: number) => {*/}
                        {/*                const foundTransport = transports.find((transport: { id: number, type?: string }) => transport.id === selectedId);*/}
                        {/*                return (foundTransport?.type || 'Нет данных') + (index < selectedTransports.length - 1 ? ', ' : ''); // Добавляем запятую после каждого типа, кроме последнего*/}
                        {/*            })}*/}
                        {/*            </span>*/}
                        {/*        <br/>*/}
                        {/*    </>*/}
                        {/*)}*/}
                        {/*{edit &&*/}
                        {/*    <MultipleSelectTransport*/}
                        {/*        transports={transports}*/}
                        {/*        selectedTransports={selectedTransports}*/}
                        {/*        onChange={handleTransportsChange}*/}
                        {/*    />*/}
                        {/*}*/}
                        <h2> Географические объекты</h2>
                        <div className="cards-list-wrapper">
                            <div className="bottom">
                                {sortedLocations?.map((location: any, index: number) => (
                                    <div key={index} className="card-wrapper">
                                        <Link
                                            to={`${marsStationPath}/geographical_object/${geographicalObjectMap[location.id_geographical_object].id}/`}
                                            style={{textDecoration: 'none', color: 'inherit'}}>
                                            <div className="preview">
                                                <img
                                                    src={photoUrlsMap[location.id_geographical_object]}
                                                    // src={photoUrls[index]}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="card-content">
                                                <div className="content-top">
                                                    <h3 className="title"> {geographicalObjectMap[location.id_geographical_object].feature} </h3>
                                                </div>
                                            </div>
                                        </Link>
                                        {edit && selectedMarsStation?.status_task === "Черновик" && (
                                            <div className="card-content"
                                                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <ButtonGroup orientation="horizontal">

                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => put_location_and_mars_station(location.id, location.id_mars_station, 'up')}
                                                    >
                                                        <KeyboardArrowLeftIcon/>
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => delete_location_and_mars_station(location.id, location.id_mars_station)}
                                                    >
                                                        <DeleteIcon/>
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => put_location_and_mars_station(location.id, location.id_mars_station, 'down')}
                                                    >
                                                        <KeyboardArrowRightIcon/>
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MarsStationPage;