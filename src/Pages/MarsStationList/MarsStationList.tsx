import "./MarsStationList.sass"
import {useEffect, useState} from "react";
import {DOMEN} from "../../Consts";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";
import {useDispatch, useSelector} from "react-redux";
import {updateMarsStation} from "../../store/MarsStation.ts";
import SearchBar from "./SearchBarStatusTask/SearchBarStatusTask.tsx";
import {RootState} from "../../store/store.ts";
import moment from 'moment';
import {useNavigate} from 'react-router-dom';
import SearchDateForm from "./SearchDateForm/SearchDateForm.tsx";
import {DataGrid} from '@mui/x-data-grid';
import {Button} from "@mui/material";

const MarsStationListPage = () => {
    const {access_token} = useToken()
    const {is_moderator} = useAuth()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // Данные
    const MarsStation = useSelector((state: RootState) => state.mars_station.data);

    // Фильтрация
    const status_task = useSelector((state: RootState) => state.search.status_task);
    const date = useSelector((state: RootState) => state.search.date);
    const date_before = date.date_before;
    const date_after = date.date_after;

    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(false);

    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);

    const searchMarsStation = async () => {
        // Если уже идет загрузка, не допускаем дополнительных запросов
        if (loading) {
            return <p>Loading...</p>;
        }
        // Установим состояние загрузки в true перед запросом
        setLoading(true);
        const params = new URLSearchParams({
            status_task: status_task.length > 0 ? status_task.filter(s => s !== '5').join(',') : (is_moderator ? '2, 3, 4' : '1, 2, 3, 4'),
            date_form_before: date.date_before,
            date_form_after: date.date_after,
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
                setLoading(false);
                // console.log(response.data.results)
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    useEffect(() => {
        searchMarsStation();
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [date_before, date_after, parentUpdateTrigger]);

    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70, headerClassName: 'bold-header'},
        {field: 'type_status', headerName: 'Тип статуса', width: 200, headerClassName: 'bold-header'},
        {
            field: 'date_create',
            headerName: 'Дата создания',
            width: 150,
            renderCell: (params: any) => moment(params.value).format('YYYY-MM-DD'),
        },
        {
            field: 'date_form',
            headerName: 'Дата формирования',
            width: 150,
            renderCell: (params: any) => moment(params.value).format('YYYY-MM-DD'),
        },
        {
            field: 'date_close',
            headerName: 'Дата закрытия',
            width: 150,
            renderCell: (params: any) => moment(params.value).format('YYYY-MM-DD'),
        },
        ...(is_moderator
                ? [
                    {
                        field: 'employee',
                        headerName: 'Пользователь',
                        width: 250,
                        renderCell: (params: any) => params.value.full_name,
                    },
                    {
                        field: 'moderator',
                        headerName: 'Модератор',
                        width: 250,
                        renderCell: (params: any) => params.value.full_name,
                    }
                ]
                : [
                    {
                        field: 'moderator',
                        headerName: 'Модератор',
                        width: 250,
                        renderCell: (params: any) => params.value.full_name,
                    }
                ]
        ),
        {
            field: 'status_task',
            headerName: 'Статус заявки',
            width: 150,
            renderCell: (params: any) => {
                const statusColors: any = {
                    'Черновик': 'secondary',
                    'В работе': 'warning',
                    'Завершена': 'success',
                    'Отменена': 'error',
                };
                const color = statusColors[params.value];
                return <Button variant="outlined" color={color}>{params.value}</Button>;
            },
        },
    ];

    const handleRowClick = (params: any) => {
        const id = params.row.id;
        navigate(`/mars_station/${id}/`);
    };

    return (
        <div className="cards-list-wrapper">
            <div className="top">
                <SearchBar
                    status_task={status_task}
                    setUpdateTriggerParent={handleUpdateTrigger}
                />
                <SearchDateForm
                    setUpdateTriggerParent={handleUpdateTrigger}
                />
            </div>
            <DataGrid
                style={{opacity: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'rgba(255, 255, 255, 1)', fontSize: '15px'}}
                columns={columns}
                rows={MarsStation}
                onRowClick={handleRowClick}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
            />
        </div>
    );
};

export default MarsStationListPage;