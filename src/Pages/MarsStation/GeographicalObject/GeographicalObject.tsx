import "./GeographicalObject.sass"
import {Dispatch, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {GeographicalObject} from "../../../Types";
import mockImage from "/src/assets/mock.png"
import LoadingAnimation from "../../../Components/Loading.tsx";
import {GeographicalObjectApi, GeographicalObjectSerializer} from "../../../../swagger/generated-code";

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
                // @ts-ignore
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
        // @ts-ignore
        api.apiGeographicalObjectIdGet({id: parseInt(id_geographical_object)})
            .then((response) => {
                const geographicalObject: GeographicalObjectSerializer = response as GeographicalObjectSerializer;
                // @ts-ignore
                setSelectedGeographicalObject(geographicalObject);
            })
            .catch((error) => {
                console.error('Ошибка запроса:', error);
            })
            .finally(() => {
                setLoading(false)
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