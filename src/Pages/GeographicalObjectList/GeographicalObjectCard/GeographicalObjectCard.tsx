import "./GeographicalObjectCard.sass";
import axios from "axios";
import {GeographicalObject} from "../../../Types";
import {Link} from "react-router-dom";
import mockImage from "../../../assets/mock.png";
import {DOMEN, requestTime} from "../../../Consts.ts";
import {useAuth} from "../../../hooks/useAuth.ts";
import {useToken} from "../../../hooks/useToken.ts";
import {useDispatch} from "react-redux";
import {updateID_draft} from "../../../store/GeographicalObject.ts";
import {updateMarsStationDraftData} from "../../../store/MarsStationDraft.ts";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {Button} from "@mui/material";

const GeographicalObjectCard = ({geographical_object, isMock, setUpdateTriggerParent}: {
    geographical_object: GeographicalObject;
    isMock: boolean;
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>;
}) => {
    const dispatch = useDispatch();
    const {is_moderator, is_authenticated} = useAuth();
    const {access_token} = useToken();
    const [photoUrl, setPhotoUrl] = useState('');

    const get_photo = async () => {
        if (geographical_object.id === -1 || geographical_object.id === undefined) {
            return
        }
        const url: string = `http://127.0.0.1:8000/api/geographical_object/${geographical_object.id}/image/`
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            signal: new AbortController().signal,
            timeout: requestTime,
        })
            .then(() => {
                setPhotoUrl(url)
            })
            .catch(() => {
                setPhotoUrl(mockImage)
            })
    };

    const addGeographicalObjectInMarsStation = useCallback(async () => {
        try {
            const url = `${DOMEN}api/geographical_object/${geographical_object.id}/create_service_in_task/`;
            const headers = {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            };

            const response = await axios.post(url, {}, {headers});
            console.log("Успешно! Отправлена услуга на заявку!", response.data);
            dispatch(updateID_draft(response.data.id_draft));
            dispatch(updateMarsStationDraftData({
                geographical_object: response.data.geographical_object || [],
                location: response.data.location || [],
            }));
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

            await axios.delete(url, {headers});
            console.log("Успешно! Услуга удалена!");
            setUpdateTriggerParent(true);
        } catch (error) {
            console.error("Ошибка удаления!\n", error);
        }
    }, [access_token, geographical_object.id, setUpdateTriggerParent]);

    useEffect(() => {
        get_photo();
    }, [geographical_object.id]);

    return (
        <div className="card-wrapper">
            <Link to={`/geographical_object/${geographical_object.id}`}
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
                            В корзинку
                        </Button>
                    </div>
                )}
                {is_moderator && (
                    <div style={{textAlign: 'center', marginTop: '0px', zIndex: '1'}}>
                        <Button variant="contained"
                                color="secondary"
                                onClick={deleteGeographicalObject}
                        >
                            Удалить
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
        ;
};

export default GeographicalObjectCard;
