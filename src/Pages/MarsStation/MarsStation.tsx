import "./MarsStation.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {STATUS_MISSIONS, STATUS_TASKS} from "../../Consts";
import {GeographicalObject, MarsStation, Location, Transport} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {useDispatch} from "react-redux";
import {clearID_draft} from "../../store/GeographicalObject.ts";
import {cleanDraft, updateMarsStationDraftData} from "../../store/MarsStationDraft.ts";
import mockImage from "../../assets/mock.png";
import {TextField} from "@mui/material";
import LoadingAnimation from "../../Components/Loading.tsx";
import MultipleSelectTransport from "./MultipleSelectTransport.tsx";
import TableGeographicalObject from "./TableGeographicalObject.tsx";
import {
    ApiLocationIdLocationMarsStationIdMarsStationUpdatePutOperationRequest,
    ApiLocationIdLocationMarsStationPkMarsStationDeleteDeleteRequest,
    ApiTransportGetRequest, DELETEMarsStationRequest,
    GeographicalObjectApi,
    GETMarsStationRequest, LocationApi,
    MarsStationApi,
    MarsStationSerializerDetailToJSON, PUTMarsStationBYADMINOperationRequest,
    PUTMarsStationBYUSERRequest,
    PUTMarsStationRequest,
    TransportApi,
} from "../../../swagger/generated-code";

export default function MarsStationPage({selectedMarsStation, setSelectedMarsStation}: {
    selectedMarsStation: MarsStation | undefined,
    setSelectedMarsStation: Dispatch<MarsStation | undefined>
}) {
    const {id_mars_station} = useParams<{
        id_mars_station: string
    }>();

    if (id_mars_station == undefined) {
        return;
    }

    const dispatch = useDispatch();
    const {is_authenticated, is_moderator} = useAuth()
    const {access_token} = useToken()
    const [updateTrigger, setUpdateTrigger] = useState(false);

    // Редактирование заявок
    const [editedTypeStatus, setEditedTypeStatus] = useState(selectedMarsStation?.type_status || '');
    const [photoUrlsMap, setPhotoUrlsMap] = useState<Record<number, string>>({});
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Определение переменной для отслеживания изменений фото
    const [photoUpdateCounter, setPhotoUpdateCounter] = useState(0);
    // Транспорт
    const [selectedTransports, setSelectedTransports] = useState<any>();

    const handleChangeStatus = (type_status: string) => {
        setEditedTypeStatus(type_status);
    };

    const handleTransportsChange = (selectedIds: any) => {
        setSelectedTransports(selectedIds);
    };

    // Данные
    const GeographicalObjects: GeographicalObject[] | undefined = selectedMarsStation?.geographical_object;
    const Locations: Location[] | undefined = selectedMarsStation?.location;
    const [transports, setTransports] = useState<Transport[] | undefined>([])

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

    useEffect(() => {
        getMarsStation();
        getTransports();
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
        setTransports(transports);
    }, [transports]);

    useEffect(() => {
    }, [loading]);


    // Получить фотки
    const get_photo = async (id_geographical_object: any) => {
        setLoading(true);
        const api = new GeographicalObjectApi();
        try {
            const response: Blob = await api.apiGeographicalObjectIdImageGet({
                id: id_geographical_object,
            });
            if (response) {
                const blob = response as Blob;
                const url = URL.createObjectURL(blob);
                return url;
            } else {
                return mockImage;
            }
        } catch (error) {
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
                        const url: string = await get_photo(obj.id);
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

    const getMarsStation = async () => {
        const api = new MarsStationApi();
        const requestParameters: GETMarsStationRequest = {
            id: parseInt(id_mars_station),
            authorization: access_token,
        };
        await api.gETMarsStation(requestParameters)
            .then((response) => {
                // Преобразование данных
                const transformedResponse = MarsStationSerializerDetailToJSON(response);
                setSelectedMarsStation(transformedResponse);
            })
            .catch((error) => {
                console.error("Ошибка!\n", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const push_mars_station = () => {
        const api = new MarsStationApi();
        const requestParameters: PUTMarsStationBYUSERRequest = {
            id: parseInt(id_mars_station),
            authorization: access_token,
        };
        api.pUTMarsStationBYUSER(requestParameters)
            .then(() => {
                // console.log("Успешно! Заявка отправлена!", response.data);
                setUpdateTrigger(true);
                dispatch(clearID_draft());
                dispatch(cleanDraft());
            })
            .catch((error) => {
                console.error("Ошибка отправки!\n", error);
            });
    };

    const delete_mars_station = () => {
        const api = new MarsStationApi();
        const requestParameters: DELETEMarsStationRequest = {
            id: parseInt(id_mars_station),
            authorization: access_token,
        };
        api.dELETEMarsStation(requestParameters)
            .then(() => {
                // console.log("Успешно! Заявка удалена!", response.data);
                setUpdateTrigger(true);
                dispatch(clearID_draft());
                dispatch(cleanDraft());
            })
            .catch(error => {
                console.error("Ошибка отправки!\n", error);
            });
    };

    const check_mars_station = (value: number) => {
        const api = new MarsStationApi();
        const requestParameters: PUTMarsStationBYADMINOperationRequest = {
            id: parseInt(id_mars_station),
            authorization: access_token,
            pUTMarsStationBYADMINRequest: {statusTask: value},
        };
        api.pUTMarsStationBYADMIN(requestParameters)
            .then(() => {
                // console.log("Успешно! Заявка отправлена!", response.data);
                setUpdateTrigger(true);
                dispatch(clearID_draft());
            })
            .catch(error => {
                console.error("Ошибка отправки!\n", error);
            });
    };

    const delete_location_and_mars_station = async (id_location: number, id_mars_station: number) => {
        const api = new LocationApi();
        const requestParameters: ApiLocationIdLocationMarsStationPkMarsStationDeleteDeleteRequest = {
            idLocation: id_location,
            pkMarsStation: id_mars_station,
            authorization: access_token,
        };
        await api.apiLocationIdLocationMarsStationPkMarsStationDeleteDelete(requestParameters)
            .then((response) => {
                // console.log("Успешно удалено с черновой заявки!", response.data);
                dispatch(updateMarsStationDraftData({
                    geographical_object: response.geographicalObject || [],
                    location: response.location || [],
                }));
                setUpdateTrigger(true);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    const put_location_and_mars_station = async (id_location: number, id_mars_station: number, direction: string) => {
        const api = new LocationApi(); // Замените YourApiClassName на фактическое имя вашего класса API
        const requestParameters: ApiLocationIdLocationMarsStationIdMarsStationUpdatePutOperationRequest = {
            idLocation: id_location,
            idMarsStation: id_mars_station,
            authorization: access_token,
            apiLocationIdLocationMarsStationIdMarsStationUpdatePutRequest: {direction: direction},
        };
        await api.apiLocationIdLocationMarsStationIdMarsStationUpdatePut(requestParameters)
            .then((response) => {
                // console.log("Успешно обновлены черновой заявки!", response.data);
                dispatch(updateMarsStationDraftData({
                    geographical_object: response.geographicalObject || [],
                    location: response.location || [],
                }));
                setUpdateTrigger(true);
                // Увеличиваем счетчик для изменения фото
                setPhotoUpdateCounter(prevCounter => prevCounter + 1);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            })
    };

    const save_mars_station = () => {
        const api = new MarsStationApi();
        const requestParameters: PUTMarsStationRequest = {
            id: parseInt(id_mars_station),
            authorization: access_token,
            marsStationSerializer: {
                typeStatus: editedTypeStatus,
                idTransport: selectedTransports,
            },
        };
        api.pUTMarsStation(requestParameters)
            .then(() => {
                // console.log("Успешно обновлены черновой заявки!", response);
                setUpdateTrigger(true);
                push_mars_station();
            })
            .catch((error) => {
                console.error("Ошибка!\n", error);
            });
    };

    const getTransports = async () => {
        const api = new TransportApi(); // Замените YourApiClassName на фактическое имя вашего класса API
        const requestParameters: ApiTransportGetRequest = {}; // Укажите необходимые параметры запроса, если есть

        api.apiTransportGet(requestParameters)
            .then((response) => {
                // console.log("Успешно получены все транспорты!", response);
                // @ts-ignore
                setTransports(response);
            })
            .catch((error) => {
                console.error("Ошибка!\n", error);
            });
    };


    return (
        <>
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="page-details-wrapper">
                <Link className="return-link" to="/mars_station/">
                    Назад
                </Link>
                {is_authenticated && STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "Черновик" && (
                    <div className="button-agree">
                        <button onClick={() => {
                            save_mars_station();
                        }}>Отправить
                        </button>
                    </div>
                )}
                {is_authenticated && STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "Черновик" && (
                    <div className="button-reject">
                        <button onClick={() => delete_mars_station()}>Удалить</button>
                    </div>
                )}
                {is_moderator && STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "В работе" && (
                    <div className="button-accept">
                        <button onClick={() => check_mars_station(3)}>Принять и завершить</button>
                    </div>
                )}
                {is_moderator && STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "В работе" && (
                    <div className="button-reject">
                        <button onClick={() => check_mars_station(4)}>Отменить</button>
                    </div>
                )}

                <div className="right">
                    <div className="info-container">
                        <h2 className="name"> Номер заявки: {selectedMarsStation?.id}</h2>
                        <br/>
                        {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "Черновик" &&
                            <TextField
                                type="input"
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
                        {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name !== "Черновик" &&
                            <h3 className="type">Тип заявки: {selectedMarsStation?.type_status}</h3>
                        }
                        <br/>
                        <span
                            className="type">Тип статуса заявки: {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name}</span>
                        <span
                            className="type">Тип статуса миссии: {STATUS_MISSIONS.find(status => status.id === selectedMarsStation?.status_mission)?.name}</span>
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
                        <span className="size">Должность: {(selectedMarsStation?.moderator as {
                            post?: string
                        })?.post || 'Нет данных'}
                        </span>
                        <span className="size">Название организации: {(selectedMarsStation?.moderator as {
                            name_organization?: string
                        })?.name_organization || 'Нет данных'}
                        </span>
                        <span className="size">Адрес: {(selectedMarsStation?.moderator as {
                            address?: string
                        })?.address || 'Нет данных'}
                        </span>
                        <br/>
                        <h2> Транспорт</h2>
                        {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name !== "Черновик" &&
                            <span className="type_transport">
                                Тип транспорта: {(selectedMarsStation?.transport?.type) || 'Нет данных'}
                            </span>
                        }
                        {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "Черновик" &&
                            <MultipleSelectTransport
                                transports={transports}
                                selectedTransports={selectedTransports}
                                onChange={handleTransportsChange}
                            />
                        }
                        <h2> Географические объекты</h2>
                        <TableGeographicalObject
                            sortedLocations={sortedLocations}
                            photoUrlsMap={photoUrlsMap}
                            geographicalObjectMap={geographicalObjectMap}
                            selectedMarsStation={selectedMarsStation}
                            deleteLocationAndMarsStation={delete_location_and_mars_station}
                            putLocationAndMarsStation={put_location_and_mars_station}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}