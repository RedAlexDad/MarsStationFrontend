import "./GeographicalObjectList.sass"
import SearchBar from "./SearchBar/SearchBar";
import {useEffect, useState} from "react";
import GeographicalObjectCard from "./GeographicalObjectCard/GeographicalObjectCard";
import {GeographicalObjectsMock, requestTime, DOMEN} from "../../Consts";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {updateGeographicalObject, updatePagination} from "../../store/GeographicalObject.ts";
import {useToken} from "../../hooks/useToken.ts";
import {RootState} from "../../store/store.ts";
import Pagination from "../../Components/Header/Pagination/Pagination.tsx";
import LoadingAnimation from "../../Components/Loading.tsx";

const GeographicalObjectListPage = () => {
    const {access_token} = useToken()
    const [isMock, setIsMock] = useState<boolean>(false);

    const dispatch = useDispatch()
    const GeographicalObject = useSelector((state: RootState) => state.geographical_object.data);
    const feature = useSelector((state: RootState) => state.search.feature);
    // Для пагинации
    const pagination = useSelector((state: RootState) => state.geographical_object.pagination);
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;
    const count = pagination.count;
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(true);
    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);

    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
    };

    const searchGeographicalObject = async (currentPage: number) => {
        setLoading(true);
        // Определяем параметры запроса, включая номер страницы и количество объектов на странице
        const params = new URLSearchParams({
            page: currentPage.toString(),
            status: 'True',
            feature: feature,
        });
        const url = `${DOMEN}api/geographical_object/?${params}`
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
            signal: new AbortController().signal,
            timeout: requestTime,
        })
            .then(response => {
                setIsMock(false);
                // console.log("Успешно!", response.data);
                dispatch(updateGeographicalObject([...response.data.results]));
                // Обновление данных пагинации
                dispatch(
                    updatePagination({
                        currentPage: currentPage,
                        totalPages: Math.ceil(response.data.count / 5),
                        count: response.data.count,
                    })
                );
                setLoading(true);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
                createMock();
                setLoading(true);
                return;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const createMock = () => {
        setIsMock(true);
        dispatch(updateGeographicalObject(GeographicalObjectsMock));
    }

    const handlePageChange = (newPage: any) => {
        dispatch(updatePagination({currentPage: newPage, totalPages, count}));
        searchGeographicalObject(newPage);
    };

    useEffect(() => {
        searchGeographicalObject(currentPage);
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [feature, currentPage, parentUpdateTrigger]);

    useEffect(() => {
        if (loading) {
            // Если уже идет загрузка, не допускаем дополнительных запросов
            return;
        }
        // Устанавливаем состояние загрузки в true перед запросом
        setLoading(false);
    }, [currentPage, totalPages, count, loading]);

    useEffect(() => {
    }, [loading]);

    const cards = GeographicalObject.map(geographical_object => (
        <GeographicalObjectCard
            geographical_object={geographical_object}
            key={geographical_object.id}
            isMock={isMock}
            setUpdateTriggerParent={handleUpdateTrigger}
        />
    ))
    return (
        <div className="cards-list-wrapper">
            {loading && <LoadingAnimation isLoading={loading}/>}
            <div className="top">
                <SearchBar
                    feature={feature}
                />
            </div>
            <div className="bottom">
                {cards}
            </div>
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
}

export default GeographicalObjectListPage;