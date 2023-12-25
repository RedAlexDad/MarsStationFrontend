import "./GeographicalObjectCard.sass";
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "../../../assets/mock.png";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useToken} from "../../../hooks/useToken.ts";
import {useDispatch} from "react-redux";
import {updateID_draft} from "../../../store/GeographicalObject.ts";
import {updateMarsStationDraftData} from "../../../store/MarsStationDraft.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "@mui/material";
import {
    ApiGeographicalObjectIdCreateServiceInTaskPostRequest,
    ApiGeographicalObjectIdDeleteDeleteRequest,
    GeographicalObjectApi
} from "../../../../swagger/generated-code";

export default function GeographicalObjectCard({geographical_object, setUpdateTriggerParent}: {
    geographical_object: GeographicalObject;
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>;
}) {
    const dispatch = useDispatch();
    const {is_moderator, is_authenticated} = useAuth();
    const {access_token} = useToken();
    const [photoUrl, setPhotoUrl] = useState('');

    const get_photo = async () => {
        // Получаем ID географического объекта
        const geographicalObjectId = geographical_object?.id;
        if (geographicalObjectId === undefined || geographicalObjectId === null) {
            console.error('ID географического объекта не определено.');
            return;
        }
        const api = new GeographicalObjectApi();
        try {
            const response: Blob = await api.apiGeographicalObjectIdImageGet({
                id: geographicalObjectId,
            });
            if (response) {
                const blob = response as Blob;
                const url = URL.createObjectURL(blob);
                setPhotoUrl(url);
            } else {
                setPhotoUrl(mockImage);
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            setPhotoUrl(mockImage);
        }
    };

    const addGeographicalObjectInMarsStation = async () => {
        try {
            const api = new GeographicalObjectApi();
            const requestParameters: ApiGeographicalObjectIdCreateServiceInTaskPostRequest = {
                id: geographical_object.id,
                authorization: access_token,
            };
            const response = await api.apiGeographicalObjectIdCreateServiceInTaskPost(requestParameters);

            console.log("Успешно! Отправлена услуга на заявку!", response);

            dispatch(updateID_draft(response.idDraft));
            dispatch(updateMarsStationDraftData({
                geographical_object: response.geographicalObject,
                location: response.location,
            }));
        } catch (error) {
            console.error("Ошибка отправления!\n", error);
        }
    };

    const deleteGeographicalObject = async () => {
        try {
            const api = new GeographicalObjectApi();
            const requestParameters: ApiGeographicalObjectIdDeleteDeleteRequest = {
                id: geographical_object.id,
                authorization: access_token,
            };
            await api.apiGeographicalObjectIdDeleteDelete(requestParameters);
            // console.log("Успешно! Услуга удалена!");
            setUpdateTriggerParent(true);
        } catch (error) {
            console.error("Ошибка удаления!\n", error);
        }
    };

    useEffect(() => {
        get_photo();
    }, [geographical_object.id]);

    return (
        <div className="card-wrapper">
            <Link to={`/geographical_object/${geographical_object.id}/`}
                  style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="preview">
                    <img
                        src={photoUrl}
                        alt=""
                    />
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
                </div>
            </Link>
            <div className="card-content">
                {!is_moderator && is_authenticated && (
                    <div style={{textAlign: 'center', marginTop: '0px', zIndex: '1'}}>
                        <Button variant="contained"
                                color="secondary"
                                onClick={addGeographicalObjectInMarsStation}
                        >
                            Добавить в полет
                        </Button>
                    </div>
                )}
                {is_moderator && (
                    <>
                        <div style={{textAlign: 'center', marginTop: '0px', zIndex: '1'}}>
                            <Button variant="contained"
                                    color="secondary"
                                    onClick={deleteGeographicalObject}
                            >
                                Удалить
                            </Button>
                        </div>
                        <Link to={`/geographical_object/${geographical_object.id}/edit/`}
                              style={{textDecoration: 'none', color: 'inherit'}}>
                            <div style={{textAlign: 'center', marginTop: '0px', zIndex: '1'}}>
                                <Button variant="contained"
                                        color="info"
                                >
                                    Редактировать
                                </Button>
                            </div>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
        ;
};
