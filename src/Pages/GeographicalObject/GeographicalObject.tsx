import "./GeographicalObject.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {GeographicalObjectsMock} from "../../Consts";
import {GeographicalObject} from "../../Types";
import mockImage from "/src/assets/mock.png"
import LoadingAnimation from "../../Components/Loading.tsx";
import {GeographicalObjectApi} from "../../../swagger/generated-code/apis/GeographicalObjectApi.ts";
import {GeographicalObjectSerializer} from "../../../swagger/generated-code";

export default function GeographicalObjectPage({selectedGeographicalObject, setSelectedGeographicalObject}: {
    selectedGeographicalObject: GeographicalObject | undefined,
    setSelectedGeographicalObject: Dispatch<GeographicalObject | undefined>
}) {
    const {id_geographical_object} = useParams<{ id_geographical_object?: string }>();
    const [photoUrl, setPhotoUrl] = useState<string>('');
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);

    if (id_geographical_object === undefined) {
        return;
    }

    const CreateMock = () => {
        setSelectedGeographicalObject(
            GeographicalObjectsMock.find((service: GeographicalObject) => service?.id === parseInt(id_geographical_object))
        );
    };

    useEffect(() => {
        GetGeographicalObhectID();
        get_photo();
    }, [])

    useEffect(() => {
    }, [loading]);

    const get_photo = async () => {
        setLoading(true);
        const api = new GeographicalObjectApi();
        try {
            const response: Blob = await api.apiGeographicalObjectIdImageGet({
                id: parseInt(id_geographical_object),
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
        } finally {
            setLoading(false);
        }
    };

    const GetGeographicalObhectID = async () => {
        const api = new GeographicalObjectApi();
        api.apiGeographicalObjectIdGet({id: parseInt(id_geographical_object)})
            .then((response) => {
                const geographicalObject: GeographicalObjectSerializer = response as GeographicalObjectSerializer;
                // @ts-ignore
                setSelectedGeographicalObject(geographicalObject);
            })
            .catch((error) => {
                console.error('Ошибка запроса:', error);
                CreateMock();
            })
            .finally(() => {
                setLoading(false)
            });
    };

    return (
        <>
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="page-details-wrapper">
                <Link className="return-link" to="/geographical_object/">
                    Назад
                </Link>
                <div className="left">
                    {photoUrl !== '' ? (
                        <img src={photoUrl} alt=""/>
                    ) : (
                        <div>Загрузка изображения...</div>
                    )}
                </div>
                <div className="right">
                    <div className="info-container">
                        <h2 className="name">{selectedGeographicalObject?.feature}</h2>
                        <br/>
                        <span className="type">Тип местности: {selectedGeographicalObject?.type}</span>
                        <br/>
                        <span className="size">Площадь: {selectedGeographicalObject?.size}</span>
                        <br/>
                        <span className="describe"> Описание: {selectedGeographicalObject?.describe}</span>
                    </div>
                </div>
            </div>
        </>
    )
}