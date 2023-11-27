import "./MarsStation.sass"
import {Dispatch, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import {DOMEN, requestTime} from "../../Consts";
import {MarsStation} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";

const MarsStationPage = ({selectedMarsStation, setSelectedMarsStation}: {
    selectedMarsStation: MarsStation | undefined,
    setSelectedMarsStation: Dispatch<MarsStation | undefined>
}) => {
    const {id} = useParams<{ id: string }>();
    const {access_token} = useToken()

    useEffect(() => {
        fetchData()
    }, [])

    if (id == undefined) {
        return;
    }

    const fetchData = async () => {
        try {
            const response = await fetch(`${DOMEN}api/mars_station/${id}/`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'authorization': access_token
                },
                signal: AbortSignal.timeout(requestTime)
            });

            if (!response.ok) {
                return;
            }

            const mars_station: MarsStation = await response.json()

            setSelectedMarsStation(mars_station)

        } catch (error) {
            console.log(error)
        }
    };

    // Абсолютный путь для ссылки
    const marsStationPath = `/mars_station/${id}`;

    return (
        <div className="page-details-wrapper">
            <Link className="return-link" to="/mars_station">
                Назад
            </Link>
            <div className="right">
                <div className="info-container">
                    <h2 className="name"> Номер заявки: {selectedMarsStation?.id} </h2>
                    <span className="type">Тип статуса заявки: {selectedMarsStation?.type_status}</span>
                    <span className="size">Дата создания заявки: {selectedMarsStation?.date_create} </span>
                    <span className="size">Дата формирования заявки: {selectedMarsStation?.date_create} </span>
                    <span className="size">Дата закрытия заявки: {selectedMarsStation?.date_create} </span>
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