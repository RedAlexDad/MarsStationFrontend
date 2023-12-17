import "./MarsStationList.sass"
import {useEffect, useState} from "react";
import {DOMEN} from "../../Consts";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";
import {useDispatch, useSelector} from "react-redux";
import {updateMarsStation, updatePagination} from "../../store/MarsStation.ts";
import {FaAnglesLeft, FaAnglesRight} from "react-icons/fa6";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import SearchBar from "./SearchBarStatusTask/SearchBarStatusTask.tsx";
import {RootState} from "../../store/store.ts";
import { Table, Tag } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import MaterialUIPickers from "./SearchDateForm/SearchDateForm.tsx";
import Pagination from "../../Components/Header/Pagination/Pagination.tsx";

const MarsStationListPage = () => {
    const {access_token} = useToken()
    const {is_moderator} = useAuth()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const MarsStation = useSelector((state: RootState) => state.mars_station.data);
    const status_task = useSelector((state: RootState) => state.search.status_task);
    // Для пагинации
    const pagination = useSelector((state: RootState) => state.mars_station.pagination);
    const currentPage = pagination?.currentPage;
    const totalPages = pagination?.totalPages;
    const count = pagination?.count;
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(false);
    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);

    const searchMarsStation = async (currentPage: number) => {
        // Если уже идет загрузка, не допускайте дополнительных запросов
        if (loading) {
            return <p>Loading...</p>;
        }
        // Установим состояние загрузки в true перед запросом
        setLoading(true);
        // let status_task: status_task.length > 0 ? status_task.filter(s => s !== '5').join(';') : (is_moderator ? '2; 3; 4' : '1; 2; 3; 4')
        // console.log(test)
        const params = new URLSearchParams({
            page: currentPage.toString(),
            // status_task: is_moderator ? '2; 3; 4' : '1; 2; 3; 4',
            status_task: status_task.length > 0 ? status_task.filter(s => s !== '5').join(','): (is_moderator ? '2, 3, 4' : '1, 2, 3, 4'),
        });
        const url = `${DOMEN}api/mars_station/?${params}`;
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
            signal: new AbortController().signal,
            // timeout: requestTime,
        })
            .then(response => {
                dispatch(updateMarsStation([...response.data.results]));
                // Обновление данных пагинации
                dispatch(
                    updatePagination({
                        currentPage: currentPage,
                        totalPages: Math.ceil(response.data.count / 10),
                        count: response.data.count,
                    })
                );
                setLoading(false);
                // console.log(response.data.results)
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    const handlePageChange = (newPage: any) => {
        dispatch(updatePagination({ currentPage: newPage, totalPages, count }));
        searchMarsStation(newPage);
    };

    useEffect(() => {
        searchMarsStation(currentPage);
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [currentPage, parentUpdateTrigger]);

    useEffect(() => {
        setLoading(false);
    }, [currentPage, totalPages, count]);

    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Тип статуса',
            dataIndex: 'type_status',
            key: 'type_status',
            render: (type_status: any) => (type_status ? type_status : '-'),
        },
        {
            title: 'Дата создания',
            dataIndex: 'date_create',
            key: 'date_create',
            render: (text: string) => (text ? moment(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Дата формирования',
            dataIndex: 'date_form',
            key: 'date_form',
            render: (text: string) => (text ? moment(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Дата закрытия',
            dataIndex: 'date_close',
            key: 'date_close',
            render: (text: string) => (text ? moment(text).format('YYYY-MM-DD') : '-'),
        },
        {
            title: 'Модератор',
            dataIndex: 'moderator',
            key: 'moderator',
            render: (moderator: string) => (moderator.full_name ? moderator.full_name : '-'),
        },
        {
            title: 'Статус задачи',
            dataIndex: 'status_task',
            key: 'status_task',
            render: (text: string) => {
                const statusColors = {
                    'Черновик': 'blue',
                    'В работе': 'orange',
                    'Завершена': 'green',
                    'Отменена': 'red',
                };
                const color = statusColors[text] || 'gray';
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    const handleRowClick = (record: any) => {
        // Здесь record представляет собой данные строки
        // Вы можете использовать record.id или другой ключ, чтобы получить ID
        const id = record.id;
        console.log(id)
        // Выполнить переход к другому компоненту, используя ID
        navigate(`/mars_station/${id}/`);
    };

    // TODO: Переделать таблицу под MUI библиотеки
    return (
        <div className="cards-list-wrapper">
            <div className="top">
                <SearchBar
                    status_task={status_task}
                    setUpdateTriggerParent={handleUpdateTrigger}
                />
                <MaterialUIPickers/>
            </div>
            <Table
                columns={columns}
                dataSource={MarsStation}
                onRow={(record: any, rowIndex: any) => ({
                    onClick: () => handleRowClick(record),
                })}
                pagination={false}
            />

            {count > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default MarsStationListPage;