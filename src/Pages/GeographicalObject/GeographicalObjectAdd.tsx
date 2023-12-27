import "../MarsStation/GeographicalObject/GeographicalObject.sass"
import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import LoadingAnimation from "../../Components/Loading.tsx";
import {TextField} from "@mui/material";
import {useToken} from "../../hooks/useToken.ts";
import {
    ApiGeographicalObjectCreatePostRequest,
    ApiGeographicalObjectIdUpdateImagePutRequest,
    GeographicalObjectApi
} from "../../../swagger/generated-code/apis/GeographicalObjectApi.ts";
import {GeographicalObjectSerializer} from "../../../swagger/generated-code/";
import mockImage from "../../assets/mock.png";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import {updateGeographicalObjectEdit} from "../../store/GeographicalObjectEdit.ts";

export default function GeographicalObjectPageAdd() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {access_token} = useToken()
    // Данные
    const selectedGeographicalObject = useSelector((state: RootState) => state.geographical_object_edit);
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(false);
    // Новые данные
    const [formData, setFormData] = useState({
        feature: "",
        type: "",
        size: Number(),
        describe: "",
        status: true
    });
    // Ссылки с фото
    const [photoUrl, setPhotoUrl] = useState<string>('');

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
            createGeographicalObject();
        }
    }, [])

    // Этот блок будет выполняться при каждом обновлении photoUrl
    useEffect(() => {
    }, [photoUrl]);

    useEffect(() => {
    }, [loading]);

    const createGeographicalObject = async () => {
        setLoading(true);
        const api = new GeographicalObjectApi();
        const requestParameters: ApiGeographicalObjectCreatePostRequest = {
            geographicalObjectSerializer: formData,
            authorization: access_token,
        };
        api.apiGeographicalObjectCreatePost(requestParameters)
            .then((response) => {
                const geographicalObject: GeographicalObjectSerializer = response as GeographicalObjectSerializer;
                dispatch(updateGeographicalObjectEdit(geographicalObject));
                // После успешного выполнения запроса, выполняем перенаправление
                navigate(`/geographical_object/${geographicalObject.id}/edit/`);
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
                get_photo()
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false)
            });
    };

    const get_photo = async () => {
        setLoading(true);
        // Получаем ID географического объекта
        const geographicalObjectId = selectedGeographicalObject?.id;
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="page-details-wrapper">
                <Link className="return-link" to={`/geographical_object/`}>
                    Назад
                </Link>
                <div className="return-link" style={{top: '60px', right: '24px'}}>
                    <div className="button-create">
                        <button onClick={() => createGeographicalObject()}>Сохранить и добавить фото</button>
                    </div>
                </div>
                <div className="right">
                    <h2>Создайте новый географический объект</h2>
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
                                   width: '800px'
                               }}
                           />
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}