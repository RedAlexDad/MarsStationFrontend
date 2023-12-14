import "./GeographicalObjectList.sass"
import SearchBar from "./SearchBar/SearchBar";
import {useEffect, useState} from "react";
import GeographicalObjectCard from "./GeographicalObjectCard/GeographicalObjectCard";
import {GeographicalObjectsMock, requestTime, DOMEN} from "../../Consts";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {updateGeographicalObject, updatePagination} from "../../store/GeographicalObject.ts";
import {useToken} from "../../hooks/useToken.ts";
import {updateID_draft} from "../../store/MarsStation.ts";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import {FaAnglesLeft, FaAnglesRight} from "react-icons/fa6";
import {RootState} from "@reduxjs/toolkit/query";

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
    const [loading, setLoading] = useState<boolean>(false);
    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);

    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
    };

    const searchGeographicalObject = async (currentPage: number) => {
        // Если уже идет загрузка, не допускайте дополнительных запросов
        if (loading) {
            return <p>Loading...</p>;
        }
        // Установим состояние загрузки в true перед запросом
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
                dispatch(updateID_draft(response.data.id_draft_service));
                // Обновление данных пагинации
                dispatch(
                    updatePagination({
                        currentPage: currentPage,
                        totalPages: Math.ceil(response.data.count / 5),
                        count: response.data.count,
                    })
                );
                setLoading(false);
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
                createMock();
                setLoading(false);
                return;
            });
    };

    const createMock = () => {
        setIsMock(true);
        dispatch(updateGeographicalObject(GeographicalObjectsMock));
    }

    const lastPage = () => {
        if (currentPage < totalPages) {
            dispatch(updatePagination({currentPage: totalPages, totalPages, count}));
            searchGeographicalObject(totalPages);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            dispatch(updatePagination({currentPage: currentPage + 1, totalPages, count}));
            searchGeographicalObject(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            dispatch(updatePagination({currentPage: currentPage - 1, totalPages, count}));
            searchGeographicalObject(currentPage - 1);
        }
    };

    const initalPage = () => {
        if (currentPage > 1) {
            dispatch(updatePagination({currentPage: 1, totalPages, count}));
            searchGeographicalObject(1);
        }
    };

    useEffect(() => {
        searchGeographicalObject(currentPage);
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [feature, currentPage, parentUpdateTrigger]);

    useEffect(() => {
        setLoading(false);
    }, [currentPage, totalPages, count]);

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
            <div className="top">
                <SearchBar
                    feature={feature}
                />
            </div>
            <div className="bottom">
                {cards}
            </div>

            {count > 0 && totalPages > 1 && (
                <div className="pagination-container">
                    <button className="pagination-button" onClick={() => initalPage()}
                            disabled={currentPage === 1 || loading}>
                        <FaAnglesLeft/>
                    </button>

                    <button className="pagination-button" onClick={() => previousPage()}
                            disabled={currentPage === 1 || loading}>
                        <FaAngleLeft/>
                    </button>

                    <span className="pagination-current-page">{currentPage}</span>

                    <button className="pagination-button" onClick={() => nextPage()}
                            disabled={currentPage === totalPages || loading}>
                        <FaAngleRight/>
                    </button>

                    <button className="pagination-button" onClick={() => lastPage()}
                            disabled={currentPage === totalPages || loading}>
                        <FaAnglesRight/>
                    </button>
                </div>
            )}
        </div>
    )
}

export default GeographicalObjectListPage;