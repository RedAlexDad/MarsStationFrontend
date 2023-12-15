import "./GeographicalObjectCard.sass"
import axios from "axios";
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "/src/assets/mock.png"
import {DOMEN} from "../../../Consts.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useToken} from "../../../hooks/useToken.ts";
import {useDispatch, useSelector} from "react-redux";
import {updateID_draft} from "../../../store/MarsStation.ts";
import {Dispatch, SetStateAction} from "react";
import { updateMarsStationDraft } from "../../../store/MarsStationDraft.ts";

const GeographicalObjectCard = ({geographical_object, isMock, setUpdateTriggerParent}: {
    geographical_object: GeographicalObject,
    isMock: boolean,
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>;
}) => {
    const dispatch = useDispatch();
    const id_draft = useSelector((state: RootState) => state.mars_station.id_draft);

    const img = geographical_object.photo

    const {is_moderator, is_authenticated} = useAuth()
    const {access_token} = useToken()

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
                setUpdateTriggerParent(true);
            })
            .catch(error => {
                console.error("Ошибка отправления!\n", error);
            });
    };

    const delete_geographical_object = () => {
        const url = `${DOMEN}api/geographical_object/${geographical_object.id}/delete/`;
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            'authorization': access_token
        };
        axios.delete(url, {headers})
            .then(response => {
                console.log("Успешно! Услуга удалена!", response.data);
                setUpdateTriggerParent(true);
            })
            .catch(error => {
                console.error("Ошибка удаления!\n", error);
            });
    };


    const MarsStationDraft = async () => {
        const url = `${DOMEN}api/mars_station/${id_draft}/`;
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
        })
            .then(response => {
                // console.log("Успешно!");
                console.log(response.data);
                dispatch(updateMarsStationDraft(response.data));
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    // Получение значение черновой заявки
    if(id_draft != -1 && id_draft != null) {MarsStationDraft()}

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