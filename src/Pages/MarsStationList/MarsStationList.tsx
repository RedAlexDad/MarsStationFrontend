import "./MarsStationList.sass"
import {useEffect, useState} from "react";
import {STATUS_MISSIONS, STATUS_TASKS} from "../../Consts";
import {useToken} from "../../hooks/useToken.ts";
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
import Typography from "@mui/material/Typography";
import LoadingAnimation from "../../Components/Loading.tsx";
import {
    GETMarsStationListRequest,
    MarsStationApi,
    MarsStationSerializerDetailToJSON,
} from "../../../swagger/generated-code";
import SearchNameEmployee from './SearchNameEmployee/SearchNameEmployee.tsx'


export default function MarsStationListPage() {
    const {access_token} = useToken()
    const {is_moderator} = useAuth()
    const navigate = useNavigate();
    const dispatch = useDispatch()
    // Данные
    const MarsStation = useSelector((state: RootState) => state.mars_station.data);
    // Фильтрация
    const status_task: string[] = useSelector((state: RootState) => state.search.status_task);
    const date = useSelector((state: RootState) => state.search.date);
    const date_before: string = date.date_before;
    const date_after: string = date.date_after;
    const full_name = useSelector((state: RootState) => state.search.full_name);
    // Загрузочный экран
    const [loading, setLoading] = useState<boolean>(false);
    // Cостояние для обновления в основном компоненте (при нажатии)
    const [parentUpdateTrigger, setParentUpdateTrigger] = useState(false);

    const searchMarsStation = async () => {
        try {
            const api = new MarsStationApi();
            const requestParameters: GETMarsStationListRequest = {
                authorization: access_token,
                statusTask: is_moderator ? status_task.length > 0 ? status_task.filter((s: string) => s).join(',') : (is_moderator ? '2, 3, 4' : '2, 3, 4') : '',
                dateFormBefore: is_moderator ? date.date_before : '',
                dateFormAfter: is_moderator ? date.date_after : '',
            };

            const response = await api.gETMarsStationList(requestParameters);
            const transformedData = response.map(item => MarsStationSerializerDetailToJSON(item));
            if (is_moderator) {
                filterFullNameForModerator(transformedData)
            } else {
                filterDataForEmployee(transformedData);
            }
        } catch (error) {
            console.error("Ошибка!\n", error);
        } finally {
            setLoading(false);
        }
    };

    // Функция для фильтрации данных пользователям
    const filterDataForEmployee = (mars_station: any[]) => {
        if (Array.isArray(mars_station)) {
            // Если status_task не определён или не является массивом, установим непустой массив
            const statusTaskArray: string[] = status_task !== undefined && status_task.length > 0 ? status_task : ['2', '3', '4'];
            const filteredData = mars_station.filter(item => {
                // Преобразование строковых дат в объекты Date
                const dateForm = new Date(item.date_form);
                // Преобразование строковых дат в объекты Date
                const dateBefore = date.input_before ? new Date(date.input_before) : null;
                const dateAfter = date.input_after ? new Date(date.input_after) : null;
                // Фильтрация по статусу задачи и датам
                const isStatusMatch = statusTaskArray.includes(item.status_task.toString());
                // Проверка на валидность даты перед сравнением
                const isDateInRange =
                    (!dateBefore || dateForm.getTime() <= dateBefore.getTime()) &&
                    (!dateAfter || dateForm.getTime() >= dateAfter.getTime());

                return isStatusMatch && isDateInRange;
            });
            dispatch(updateMarsStation(filteredData));
        }
    };

    // Функция для фильтрации данных пользователями
    const filterFullNameForModerator = (mars_station: any[]) => {
        if (Array.isArray(mars_station)) {
            const filteredData = mars_station.filter(item => {
                // Условие для фильтрации по ФИО
                return full_name
                    ? item.employee.full_name.toLowerCase().includes(full_name.toLowerCase())
                    : true;
            });
            dispatch(updateMarsStation(filteredData));
        }
    };

    useEffect(() => {
        setLoading(true);
        searchMarsStation();
        if (!is_moderator) {
            filterDataForEmployee(MarsStation);
        } else {
            filterFullNameForModerator(MarsStation);
        }
        if (parentUpdateTrigger) {
            setParentUpdateTrigger(false);
        }
    }, [full_name, date_before, date_after, parentUpdateTrigger]);

    // SHORT POOLING
    useEffect(() => {
        const fetchData = async () => {
            await searchMarsStation();
        };
        const interval = setInterval(fetchData, 1000);
        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(interval);
    }, [full_name, status_task, date]);

    // Функция для передачи в дочерний компонент
    const handleUpdateTrigger = () => {
        setParentUpdateTrigger(true);
        setLoading(true)
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70, headerClassName: 'bold-header'},
        {
            field: 'type_status',
            headerName: 'Тип статуса',
            width: 170,
            headerClassName: 'bold-header',
            renderCell: (params: any) => params.value ? params.value :
                <Typography variant="body1" mx={2}> — </Typography>,
        },
        {
            field: 'status_mission',
            headerName: 'Статус миссии',
            width: 130,
            renderCell: (params: any) => {
                const selectedStatus = STATUS_MISSIONS.find(status => status.id === params.value);
                const statusName: string = selectedStatus ? selectedStatus.name : 'Неизвестный статус';
                const statusColors: any = {
                    'Ошибка': 'error',
                    'В работе': 'secondary',
                    'Успех': 'success',
                    'Потеря': 'error',
                };
                const color = statusColors[statusName];
                return <Button variant="outlined" color={color}>{statusName}</Button>;
            }
        },
        {
            field: 'date_create',
            headerName: 'Дата создания',
            width: 150,
            renderCell: (params: any) => params.value ? moment(params.value).format('YYYY-MM-DD') :
                <Typography variant="body1" mx={2}> — </Typography>,
        },
        {
            field: 'date_form',
            headerName: 'Дата формирования',
            width: 150,
            renderCell: (params: any) => params.value ? moment(params.value).format('YYYY-MM-DD') :
                <Typography variant="body1" mx={2}> — </Typography>,
        },
        {
            field: 'date_close',
            headerName: 'Дата закрытия',
            width: 150,
            renderCell: (params: any) => params.value ? moment(params.value).format('YYYY-MM-DD') :
                <Typography variant="body1" mx={2}> — </Typography>,
        },
        ...(is_moderator
                ? [
                    {
                        field: 'employee',
                        headerName: 'Пользователь',
                        width: 250,
                        renderCell: (params: any) => params.value ? params.value.full_name :
                            <Typography variant="body1" mx={2}> — </Typography>,
                    },
                    {
                        field: 'moderator',
                        headerName: 'Модератор',
                        width: 250,
                        renderCell: (params: any) => params.value ? params.value.full_name :
                            <Typography variant="body1" mx={2}> — </Typography>,
                    }
                ]
                : [
                    {
                        field: 'moderator',
                        headerName: 'Модератор',
                        width: 250,
                        renderCell: (params: any) => params.value ? params.value.full_name :
                            <Typography variant="body1" mx={2}> — </Typography>,
                    }
                ]
        ),
        {
            field: 'status_task',
            headerName: 'Статус заявки',
            width: 130,
            renderCell: (params: any) => {
                const selectedStatus = STATUS_TASKS.find(status => status.id === params.value);
                const statusName: string = selectedStatus ? selectedStatus.name : 'Неизвестный статус';
                const statusColors: any = {
                    'Черновик': 'secondary',
                    'В работе': 'warning',
                    'Завершена': 'success',
                    'Отменена': 'error',
                };
                const color = statusColors[statusName];
                return <Button variant="outlined" color={color}>{statusName}</Button>;
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
                {is_moderator && <SearchNameEmployee/>}
                <SearchBar
                    status_task={status_task}
                    setUpdateTriggerParent={handleUpdateTrigger}
                />
                <SearchDateForm
                    setUpdateTriggerParent={handleUpdateTrigger}
                />
            </div>
            {loading && <LoadingAnimation isLoading={loading}/>}
            {MarsStation[0] && MarsStation[0].id === -1 && <LoadingAnimation isLoading={loading}/>}
            {MarsStation[0] && MarsStation[0].id !== -1 &&
                <DataGrid
                    style={{
                        opacity: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize: '15px',
                        width: "auto"
                    }}
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
            }
        </div>
    );
};