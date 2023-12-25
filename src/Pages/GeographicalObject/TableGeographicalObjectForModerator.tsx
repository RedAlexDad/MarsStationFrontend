import {GeographicalObjectsMock} from "../../Consts.ts";
import {Link} from "react-router-dom";
import {useToken} from "../../hooks/useToken.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";
import SearchBar from "../GeographicalObjectList/SearchBar/SearchBar.tsx";
import LoadingAnimation from "../../Components/Loading.tsx";
import {useEffect, useState} from "react";
import {
    updateGeographicalObject,
    updatePagination,
} from "../../store/GeographicalObject.ts";
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Paper,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import mockImage from "../../assets/mock.png";
import Pagination from "../../Components/Header/Pagination/Pagination.tsx";
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Typography from "@mui/material/Typography";
import {
    ApiGeographicalObjectGetRequest,
    ApiGeographicalObjectIdDeleteDeleteRequest,
    GeographicalObjectApi
} from "../../../swagger/generated-code";

export default function TableGeographicalObjectForModerator() {
    const {access_token} = useToken()

    const dispatch = useDispatch()
    const GeographicalObject = useSelector((state: RootState) => state.geographical_object.data);
    const feature = useSelector((state: RootState) => state.search.feature);
    // Для пагинации
    const pagination = useSelector((state: RootState) => state.geographical_object.pagination);
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;
    const count = pagination.count;
    const countItem = pagination.countItem;
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);
    // Для фото
    const [photoUrlsMap, setPhotoUrlsMap] = useState<Record<number, string>>({});

    const searchGeographicalObject = async (currentPage: number) => {
        setLoading(true);
        const api = new GeographicalObjectApi();
        const requestParameters: ApiGeographicalObjectGetRequest = {
            authorization: access_token,
            page: currentPage.toString(),
            status: 'True',
            feature: feature,
        };
        api.apiGeographicalObjectGet(requestParameters)
            .then((response) => {
                // console.log("Успешно!", response.data);
                dispatch(updateGeographicalObject([...response.results]));
                // Обновление данных пагинации
                dispatch(
                    updatePagination({
                        currentPage: currentPage,
                        totalPages: Math.ceil(response.count / 5),
                        count: response.count,
                    })
                );
                setLoading(true);
            })
            .catch((error) => {
                console.error("Ошибка!\n", error);
                dispatch(updateGeographicalObject(GeographicalObjectsMock));
                setLoading(true);
                return;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Получить фотки
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
                return url;
            } else {
                return mockImage;
            }
        } catch (error) {
            // console.error('Error fetching image:', error);
            return mockImage;
        } finally {
            setLoading(false);
        }
    };

    // Загрузка фото
    const loadPhotos = async () => {
        setLoading(true);
        try {
            const newPhotoUrlsMap: Record<number, string> = {};
            await Promise.all(
                GeographicalObject.map(async (obj: any) => {
                    const url: string = await get_photo(obj.id);
                    newPhotoUrlsMap[obj.id] = url;
                })
            );
            setPhotoUrlsMap(newPhotoUrlsMap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteGeographicalObject = async (id_geographical_object: number) => {
        try {
            const api = new GeographicalObjectApi();
            const requestParameters: ApiGeographicalObjectIdDeleteDeleteRequest = {
                id: id_geographical_object,
                authorization: access_token,
            };
            await api.apiGeographicalObjectIdDeleteDelete(requestParameters);
            // console.log("Успешно! Услуга удалена!");
            setParentUpdateTrigger(true);
        } catch (error) {
            console.error("Ошибка удаления!\n", error);
        }
    };

    const handlePageChange = (newPage: any) => {
        dispatch(updatePagination({currentPage: newPage, totalPages, count}));
        searchGeographicalObject(newPage,);
    };

    useEffect(() => {
        loadPhotos();
    }, [GeographicalObject]);

    useEffect(() => {
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [parentUpdateTrigger]);

    useEffect(() => {
        searchGeographicalObject(currentPage);
    }, [feature, currentPage, countItem, parentUpdateTrigger]);


    useEffect(() => {
        if (countItem) {
            searchGeographicalObject(currentPage);
        }
    }, [countItem, currentPage]);


    return (
        <div className="cards-list-wrapper">
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="top">
                <SearchBar
                    feature={feature}
                />
                <Typography variant="body1" mx={2}></Typography>

                <Link to={`/geographical_object/add/`}
                      style={{textDecoration: 'none', color: 'inherit'}}>
                    <Button
                        variant="outlined"
                        style={{color: 'white', borderColor: 'white'}}
                    >
                        Добавить новый географический объект
                        <Typography variant="body1" mx={2}></Typography>
                        <AddBoxIcon
                            style={{color: 'white', borderColor: 'white'}}
                        />
                    </Button>
                </Link>
            </div>
            {GeographicalObject[0] && GeographicalObject[0].id !== -1 &&
                <TableContainer
                    component={Paper}
                    sx={{height: 'auto', overflow: 'auto', backgroundColor: 'transparent', boxShadow: 'none', background: 'rgba(255, 255, 255, 0)'}}
                >
                    <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>ID</TableCell>
                                <TableCell
                                    style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Изображение</TableCell>
                                <TableCell
                                    style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Название</TableCell>
                                <TableCell
                                    style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Площадь</TableCell>
                                <TableCell
                                    style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Тип</TableCell>
                                {/*<TableCell*/}
                                {/*    style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Описание</TableCell>*/}
                                <TableCell
                                    style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>Удаление</TableCell>
                                <TableCell
                                    style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>Редактирование</TableCell>
                                <TableCell
                                    style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>Просмотр</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {GeographicalObject.map((obj) => (
                                <TableRow key={obj.id}>
                                    <TableCell style={{fontSize: '18px', color: 'white'}}>{obj.id}</TableCell>
                                    <TableCell style={{fontSize: '18px', color: 'white'}}>
                                        <img
                                            src={photoUrlsMap[obj.id]}
                                            alt={obj.feature}
                                            style={{width: '50px', height: '50px'}}
                                        />
                                    </TableCell>
                                    <TableCell style={{fontSize: '18px', color: 'white'}}>{obj?.feature}</TableCell>
                                    <TableCell style={{fontSize: '18px', color: 'white'}}>{obj?.size}</TableCell>
                                    <TableCell style={{fontSize: '18px', color: 'white'}}>{obj?.type}</TableCell>
                                    {/*<TableCell style={{fontSize: '18px', color: 'white'}}>{obj?.describe}</TableCell>*/}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            style={{color: 'white', borderColor: 'white'}}
                                            onClick={() => deleteGeographicalObject(obj?.id)}
                                        >
                                            <DeleteIcon/>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/geographical_object/${obj?.id}/edit/`}
                                              style={{textDecoration: 'none', color: 'inherit'}}>
                                            <Button
                                                variant="outlined"
                                                style={{color: 'white', borderColor: 'white'}}
                                            >
                                                <EditIcon/>
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/geographical_object/${obj?.id}/`}
                                              style={{textDecoration: 'none', color: 'inherit'}}>
                                            <Button
                                                variant="outlined"
                                                style={{color: 'white', borderColor: 'white'}}
                                            >
                                                <RemoveRedEyeIcon/>
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {count > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    )
};
