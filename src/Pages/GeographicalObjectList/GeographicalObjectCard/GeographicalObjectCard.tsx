import "./GeographicalObjectCard.sass";
import axios from "axios";
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "/src/assets/mock.png";
import {DOMEN} from "../../../Consts.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useToken} from "../../../hooks/useToken.ts";
import {useDispatch, useSelector} from "react-redux";
import {updateID_draft} from "../../../store/GeographicalObject.ts";
import {updateMarsStationDraft, updateMarsStationDraftGeographical} from "../../../store/MarsStationDraft.ts";
import {RootState} from "../../../store/store.ts";
import {Dispatch, SetStateAction, useCallback, useEffect} from "react";

const GeographicalObjectCard = ({geographical_object, isMock, setUpdateTriggerParent}: {
    geographical_object: GeographicalObject;
    isMock: boolean;
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>;
}) => {
    const dispatch = useDispatch();
    const id_draft: number = useSelector((state: RootState) => state.geographical_object.id_draft);
    const {is_moderator, is_authenticated} = useAuth();
    const {access_token} = useToken();

    const addGeographicalObjectInMarsStation = useCallback(async () => {
        try {
            const url = `${DOMEN}api/geographical_object/${geographical_object.id}/create_service_in_task/`;
            const headers = {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            };

            const response = await axios.post(url, {}, { headers });
            console.log("Успешно! Отправлена услуга на заявку!", response.data);
            dispatch(updateID_draft(response.data.id_draft));
            dispatch(updateMarsStationDraftGeographical(response.data.geographical_object || []));
        } catch (error) {
            console.error("Ошибка отправления!\n", error);
        }
    }, [dispatch, access_token, geographical_object.id, setUpdateTriggerParent]);

    const deleteGeographicalObject = useCallback(async () => {
        try {
            const url = `${DOMEN}api/geographical_object/${geographical_object.id}/delete/`;
            const headers = {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            };

            await axios.delete(url, { headers });
            console.log("Успешно! Услуга удалена!");
            setUpdateTriggerParent(true);
        } catch (error) {
            console.error("Ошибка удаления!\n", error);
        }
    }, [access_token, geographical_object.id, setUpdateTriggerParent]);


    // const marsStationDraft = useCallback(async () => {
    //     if (id_draft !== -1) {
    //         try {
    //             const url = `${DOMEN}api/mars_station/${id_draft}/`;
    //             const response = await axios.get(url, {
    //                 headers: {
    //                     "Content-type": "application/json; charset=UTF-8",
    //                     authorization: access_token,
    //                 },
    //             });
    //             dispatch(updateMarsStationDraft(response.data));
    //             // console.log(response.data.geographical_object)
    //             // dispatch(updateMarsStationDraftGeographical(response.data));
    //         } catch (error) {
    //             console.error("Ошибка!\n", error);
    //         }
    //     }
    // }, [dispatch, id_draft, access_token]);

    // Получение значение черновой заявки
    // useEffect(() => {
    //     marsStationDraft();
    // }, [id_draft, marsStationDraft]);

    // TODO: Выбрать подходущую кнопку с MUI, учти, что они должны быть разными
    return (
        <div className="card-wrapper">
            <div className="preview">
                <img src={isMock ? mockImage : geographical_object.photo} alt="" />
            </div>
            <div className="card-content">
                {is_moderator && (
                    <div className="content-top">
                        <h3>ID: {geographical_object.id}</h3>
                    </div>
                )}
                <div className="content-top">
                    <h3 className="title">{geographical_object.feature}</h3>
                </div>
                <div className="content-bottom">
                    <Link to={`/geographical_object/${geographical_object.id}`}>Посмотреть</Link>
                </div>
                {!is_moderator && is_authenticated && (
                    <div className="content-bottom">
                        <button onClick={addGeographicalObjectInMarsStation}>Выбрать</button>
                    </div>
                )}
                {is_moderator && (
                    <div className="content-bottom">
                        <button onClick={deleteGeographicalObject}>Удалить</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeographicalObjectCard;
