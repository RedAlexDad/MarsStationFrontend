import "./GeographicalObjectCard.sass"
import axios from "axios";
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "/src/assets/mock.png"
import {DOMEN} from "../../../Consts.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useToken} from "../../../hooks/useToken.ts";
import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {updateID_draft} from "../../../store/IdDraftMarsMtation.ts";

const GeographicalObjectCard = ({geographical_object, isMock}: {
    geographical_object: GeographicalObject,
    isMock: boolean
}) => {
    const dispatch = useDispatch();

    const img = geographical_object.photo

    const {is_moderator, is_authenticated} = useAuth()
    const {access_token} = useToken()
    const [updateTrigger, setUpdateTrigger] = useState(false);

    useEffect(() => {
        if (updateTrigger) {
            // Вызываем код или обновление, которое должно произойти после успешного удаления
            // Например, здесь можно обновить список географических объектов или выполнить другие действия
            setUpdateTrigger(false);
        }
    }, [updateTrigger]);

    const add_geographical_object_in_mars_station = () => {
        const url = `${DOMEN}api/geographical_object/${geographical_object.id}/create_service_in_task/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        axios.post(url, {}, {headers})
            .then(response => {
                console.log("Успешно! Отправлена услуга на заявку!", response.data);
                dispatch(updateID_draft(response.data.id_draft));
                setUpdateTrigger(true);
            })
            .catch(error => {
                console.error("Ошибка отправления!\n", error);
            });
    };

    const delete_geographical_object = () => {
        const url = `${DOMEN}api/geographical_object/${geographical_object.id}/update/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        const data = {...geographical_object, status: false}
        axios.put(url, data, {headers})
            .then(response => {
                console.log("Успешно! Услуга удалена!", response.data);
                setUpdateTrigger(true);
            })
            .catch(error => {
                console.error("Ошибка удаления!\n", error);
            });
    };

    return (
        <div className="card-wrapper">
            <div className="preview">
                <img src={isMock ? mockImage : img} alt=""/>
            </div>
            <div className="card-content">
                {is_moderator &&
                    <div className="content-top">
                        <h3> ID: {geographical_object.id} </h3>
                    </div>
                }
                <div className="content-top">
                    <h3 className="title"> {geographical_object.feature} </h3>
                </div>
                <div className="content-bottom">
                    <Link to={`/geographical_object/${geographical_object.id}`}>
                        Посмотреть
                    </Link>
                </div>
                {!is_moderator && is_authenticated &&
                    <div className="content-bottom">
                        <button onClick={add_geographical_object_in_mars_station}>Выбрать</button>
                    </div>
                }
                {is_moderator &&
                    <div className="content-bottom">
                        <button onClick={delete_geographical_object}>Удалить</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default GeographicalObjectCard;