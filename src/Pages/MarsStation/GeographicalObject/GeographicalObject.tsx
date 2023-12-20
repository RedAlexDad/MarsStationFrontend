import "./GeographicalObject.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {DOMEN, requestTime} from "../../../Consts";
import {GeographicalObject} from "../../../Types";
import mockImage from "/src/assets/mock.png"
import axios from "axios";
import LoadingAnimation from "../../../Components/Loading.tsx";

export default function GeographicalObjectPageForMarsStation({selectedGeographicalObject, setSelectedGeographicalObject}: {
    selectedGeographicalObject: GeographicalObject | undefined,
    setSelectedGeographicalObject: Dispatch<GeographicalObject | undefined>
}) {
    const {id_geographical_object, id_mars_station} = useParams<{
        id_geographical_object: string;
        id_mars_station: string
    }>();
    // Ссылка на получение изображение
    const [photoUrl, setPhotoUrl] = useState<string>('');
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);

    if (id_geographical_object == undefined && selectedGeographicalObject?.id == undefined) {
        return;
    }

    useEffect(() => {
        getGeographicalObject();
        get_photo();
    }, [])

    useEffect(() => {
    }, [loading]);

    const get_photo = async () => {
        setLoading(true);
        const url: string = `http://127.0.0.1:8000/api/geographical_object/${id_geographical_object}/image/`
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
                setPhotoUrl(mockImage);
            })
            .finally(() => {
                setLoading(false);
            })
    };


    const getGeographicalObject = async () => {
        const url = `${DOMEN}api/geographical_object/${id_geographical_object}/`;
        await axios.get(url, {
            timeout: requestTime,
        })
            .then(response => {
                const geographical_object: GeographicalObject = response.data;
                setSelectedGeographicalObject(geographical_object);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <>
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="page-details-wrapper">
                <Link className="return-link" to={`/mars_station/${id_mars_station}/`}>
                    Назад
                </Link>
                <div className="left">
                    <img src={photoUrl} alt=""/>
                </div>
                <div className="right">
                    <div className="info-container">
                        <h2 className="name">{selectedGeographicalObject?.feature}</h2>
                        <br/>
                        <span className="type">Тип местности: {selectedGeographicalObject?.type}г</span>
                        <br/>
                        <span className="size">Площадь: {selectedGeographicalObject?.size}</span>
                        <br/>
                        <span className="describe"> {selectedGeographicalObject?.describe}</span>
                    </div>
                </div>
            </div>
        </>
    )
}