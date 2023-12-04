import "./MarsStation.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {DOMEN, requestTime} from "../../Consts";
import {MarsStation} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";
import {useDispatch} from "react-redux";
import {clearID_draft} from "../../store/IdDraftMarsMtation.ts";

const MarsStationPage = ({selectedMarsStation, setSelectedMarsStation}: {
    selectedMarsStation: MarsStation | undefined,
    setSelectedMarsStation: Dispatch<MarsStation | undefined>
}) => {
    const dispatch = useDispatch();

    const {id_geographical_object, id_mars_station} = useParams<{
        id_geographical_object: string;
        id_mars_station: string
    }>();
    const {is_moderator} = useAuth()
    const {access_token} = useToken()
    const [updateTrigger, setUpdateTrigger] = useState(false);

    useEffect(() => {
        getMarsStation()
        if (updateTrigger) {
            // Вызываем код или обновление, которое должно произойти после успешного удаления
            // Например, здесь можно обновить список географических объектов или выполнить другие действия
            setUpdateTrigger(false);
        }
    }, [updateTrigger])

    if (id_geographical_object == undefined && id_mars_station == undefined) {
        return;
    }

    const getMarsStation = async () => {
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
                console.log(mars_station)
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    const push_mars_station = (value: number) => {
        const url = `${DOMEN}api/mars_station/${id_mars_station}/update_by_user/`;
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

    const check_mars_station = (value: number) => {
        const url = `${DOMEN}api/mars_station/${id_mars_station}/update_by_admin/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        const data = {status_task: value, status_mission: 2}
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

    // Абсолютный путь для ссылки
    const marsStationPath = `/mars_station/${id_mars_station}`;

    return (
        <div className="page-details-wrapper">
            <Link className="return-link" to="/mars_station">
                Назад
            </Link>
            {/*@ts-ignore*/}
            {!is_moderator && selectedMarsStation?.status_task === "Черновик" && (
                <div className="button-agree">
                    <button onClick={() => push_mars_station(2)}>Отправить</button>
                </div>
            )}
            {/*@ts-ignore*/}
            {!is_moderator && selectedMarsStation?.status_task === "Черновик" && (
                <div className="button-reject">
                    <button onClick={() => push_mars_station(5)}>Удалить</button>
                </div>
            )}
            {/*@ts-ignore*/}
            {is_moderator && selectedMarsStation?.status_task === "В работе" && (
                <div className="button-accept">
                    <button onClick={() => check_mars_station(3)}>Принять и завершить</button>
                </div>
            )}
            {/*@ts-ignore*/}
            {is_moderator && selectedMarsStation?.status_task === "В работе" && (
                <div className="button-reject">
                    <button onClick={() => check_mars_station(4)}>Отменить</button>
                </div>
            )}
            <div className="right">
                <div className="info-container">
                    <h2 className="name"> Номер заявки: {selectedMarsStation?.id}</h2>
                    <h2 className="name"> Тип заявки: {selectedMarsStation?.type_status}</h2>
                    <br/>
                    <span className="type">Тип статуса заявки: {selectedMarsStation?.status_task}</span>
                    <span className="type">Тип статуса миссии: {selectedMarsStation?.status_mission}</span>
                    <span className="size">Дата создания заявки: {selectedMarsStation?.date_create} </span>
                    <span className="size">Дата формирования заявки: {selectedMarsStation?.date_form} </span>
                    <span className="size">Дата закрытия заявки: {selectedMarsStation?.date_close} </span>
                    <br/>
                    <h2> Модератор</h2>
                    {/*@ts-ignore*/}
                    <span className="size">ФИО модератра: {selectedMarsStation?.moderator.full_name} </span>
                    {/*@ts-ignore*/}
                    <span className="size">Должность: {selectedMarsStation?.moderator.post} </span>
                    {/*@ts-ignore*/}
                    <span className="size">Название организации: {selectedMarsStation?.moderator.name_organization} </span>
                    {/*@ts-ignore*/}
                    <span className="size">Адрес: {selectedMarsStation?.moderator.address} </span>
                    <br/>
                    <h2> Транспорт</h2>
                    {/*ФОТО ТУТ ПОТОМ ПРИЛОЖИТЬ*/}
                    {/*@ts-ignore*/}
                    <span className="describe"> Название: {selectedMarsStation?.transport.name} </span>
                    {/*@ts-ignore*/}
                    <span className="describe"> Тип: {selectedMarsStation?.transport.type} </span>
                    {/*@ts-ignore*/}
                    <span className="describe"> Описание: {selectedMarsStation?.transport.describe} </span>
                    <br/>
                    <h2> Географические объекты</h2>
                    <div className="cards-list-wrapper">
                        <div className="bottom">
                            {/*@ts-ignore*/}
                            {selectedMarsStation?.geographical_object.map((geoObject, index) => (
                                <div className="card-wrapper">
                                    <div className="card-content">
                                        <div className="content-top">
                                            <h3 className="title"> {geoObject.feature} </h3>
                                        </div>
                                        <div className="content-bottom">
                                            <Link to={`${marsStationPath}/geographical_object/${geoObject.id}`}>
                                                Посмотреть
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarsStationPage;