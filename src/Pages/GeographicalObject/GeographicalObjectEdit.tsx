import "./GeographicalObject.sass"
import {Dispatch, useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {GeographicalObject} from "../../Types";
import mockImage from "/src/assets/mock.png"
import LoadingAnimation from "../../Components/Loading.tsx";
import {useToken} from "../../hooks/useToken.ts";
import {TextField} from "@mui/material";
import {
    ApiGeographicalObjectIdUpdateImagePutRequest, ApiGeographicalObjectIdUpdatePutRequest,
    GeographicalObjectApi,
    GeographicalObjectSerializer
} from "../../../swagger/generated-code";

export default function GeographicalObjectPageEdit({selectedGeographicalObject, setSelectedGeographicalObject}: {
    selectedGeographicalObject: GeographicalObject | undefined,
    setSelectedGeographicalObject: Dispatch<GeographicalObject | undefined>
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {access_token} = useToken()
    // const [selectedGeographicalObject, setSelectedGeographicalObject] = useState<GeographicalObject | undefined>(undefined)
    const {id_geographical_object} = useParams<{ id_geographical_object: string }>();
    // Ссылки с фото
    const [photoUrl, setPhotoUrl] = useState<string>('');
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Новые данные
    const [formData, setFormData] = useState({
        feature: "",
        type: "",
        size: Number(),
        describe: "",
        photo: new Blob([""], { type: "image/jpeg" }),
        status: true
    });
    // Статус для обновления фотки
    const [editPhoto, setEditPhoto] = useState<boolean>(false);

    if (id_geographical_object == undefined) {
        return;
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: field === 'size' ? parseFloat(value) : value,
        }));
    };

    const handleImageUpload = () => {
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            uploadImage(file);
        }
    };

    useEffect(() => {
        if (formData.feature !== "" && formData.type !== "" && formData.size !== null && formData.describe !== "") {
            editGeographicalObject();
        }
    }, [])

    // Этот блок будет выполняться при каждом обновлении photoUrl
    useEffect(() => {
    }, [photoUrl]);

    useEffect(() => {
        GetGeographicalObhectID();
        get_photo(id_geographical_object);
    }, [])


    useEffect(() => {
    }, [loading]);

    const editGeographicalObject = async () => {
        setLoading(true);
        const api = new GeographicalObjectApi();
        const requestParameters: ApiGeographicalObjectIdUpdatePutRequest = {
            id: parseInt(id_geographical_object),
            authorization: access_token,
            geographicalObjectSerializer: formData,
        };
        api.apiGeographicalObjectIdUpdatePut(requestParameters)
            .then((response) => {
                const geographicalObject: GeographicalObjectSerializer = response as GeographicalObjectSerializer;
                // @ts-ignore
                setSelectedGeographicalObject(geographicalObject);
                setEditPhoto(true)
            })
            .catch((error) => {
                console.error('Ошибка запроса:', error);
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const uploadImage = async (imageFile: any) => {
        setLoading(true)
        // Получаем ID географического объекта
        const geographicalObjectId = selectedGeographicalObject?.id;
        if (geographicalObjectId === undefined || geographicalObjectId === null) {
            console.error('ID географического объекта не определено.');
            return;
        }
        const api = new GeographicalObjectApi();
        const requestParameters: ApiGeographicalObjectIdUpdateImagePutRequest = {
            id: geographicalObjectId,
            authorization: access_token,
            photo: imageFile
        };
        api.apiGeographicalObjectIdUpdateImagePut(requestParameters)
            .then(() => {
                get_photo(selectedGeographicalObject?.id)
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const get_photo = async (id_geographical_object: any) => {
        setLoading(true);
        const api = new GeographicalObjectApi();
        try {
            const response: Blob = await api.apiGeographicalObjectIdImageGet({
                id: id_geographical_object,
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
            })
            .finally(() => {
                setLoading(false)
            });
    };

    return (
        <>
            {loading && <LoadingAnimation isLoading={loading}/>}
            {!editPhoto &&
                <div className="page-details-wrapper">
                    <Link className="return-link" to="/geographical_object">
                        Назад
                    </Link>
                    <div className="return-link" style={{top: '60px', right: '24px'}}>
                        <div className="button-create">
                            <button onClick={() => editGeographicalObject()}>Сохранить изменения</button>
                        </div>
                    </div>
                    <div className="left">
                        {photoUrl !== '' ? (
                            <img src={photoUrl} alt=""/>
                        ) : (
                            <div>Загрузка изображения...</div>
                        )}
                    </div>
                    <div className="right">
                        <h2>Редактирование географического объекта</h2>
                        <br/>
                        <div className="info-container">
                            <h2 className="feature">
                                <TextField
                                    type="text"
                                    id="outlined-basic"
                                    label="Название географического объекта"
                                    variant="outlined"
                                    autoComplete="feature"
                                    value={formData.feature || ""}
                                    onChange={(e) => handleChange("feature", e.target.value)}
                                    sx={{
                                        '& input, & label, & .MuiIconButton-label': {color: 'white'},
                                        width: '800px'
                                    }}
                                    placeholder={selectedGeographicalObject?.feature}
                                />
                            </h2>
                            <br/>
                            <span className="type">
                           <TextField
                               type="text"
                               id="outlined-basic"
                               label="Тип"
                               variant="outlined"
                               autoComplete="type"
                               value={formData.type || ""}
                               onChange={(e) => handleChange("type", e.target.value)}
                               sx={{
                                   '& input, & label, & .MuiIconButton-label': {color: 'white'},
                                   width: '800px'
                               }}
                               placeholder={selectedGeographicalObject?.type}
                           />
                        </span>
                            <br/>
                            <span className="size">
                           <TextField
                               type="text"
                               id="outlined-basic"
                               label="Площадь"
                               variant="outlined"
                               autoComplete="size"
                               value={formData.size || ""}
                               onChange={(e) => handleChange("size", e.target.value)}
                               sx={{
                                   '& input, & label, & .MuiIconButton-label': {color: 'white'},
                                   width: '800px'
                               }}
                               placeholder={selectedGeographicalObject?.size !== undefined ? String(selectedGeographicalObject?.size) : undefined}
                           />
                        </span>
                            <br/>
                            <span className="describe">
                           <TextField
                               type="text"
                               id="outlined-basic"
                               label="Описание"
                               variant="outlined"
                               autoComplete="describe"
                               value={formData.describe || ""}
                               onChange={(e) => handleChange("describe", e.target.value)}
                               sx={{
                                   '& input, & label, & .MuiIconButton-label': {color: 'white'},
                                   width: '800px',
                               }}
                               placeholder={selectedGeographicalObject?.describe}
                           />
                        </span>
                        </div>
                    </div>
                </div>
            }
            {editPhoto &&
                <div className="page-details-wrapper">
                    <Link className="return-link" to={`/geographical_object/`} style={{top: '60px'}}>
                        Сохранить и назад к географическим объектам
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
                            <h2 className="name">Название: {selectedGeographicalObject?.feature}</h2>
                            <br/>
                            <span className="type">Тип местности: {selectedGeographicalObject?.type}</span>
                            <br/>
                            <span className="size">Площадь: {selectedGeographicalObject?.size}</span>
                            <br/>
                            <span className="describe"> Описание: {selectedGeographicalObject?.describe}</span>
                        </div>
                    </div>
                    <div className="button-create">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            ref={fileInputRef as React.RefObject<HTMLInputElement>}
                            style={{display: 'none'}}
                        />
                        <button onClick={() => fileInputRef.current && fileInputRef.current.click()}>Выбрать
                            изображение
                        </button>
                    </div>
                </div>
            }
        </>
    )
}