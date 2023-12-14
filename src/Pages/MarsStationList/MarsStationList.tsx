import "./MarsStationList.sass"
import {useEffect, useMemo, useState} from "react";
import MarsStationCard from "./MarsStationCard/MarsStationCard.tsx";
import {DOMEN} from "../../Consts";
import {MarsStation} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";
import {Column, useTable} from "react-table";
import {useDispatch, useSelector} from "react-redux";
import {updateMarsStation, updatePagination} from "../../store/MarsStation.ts";
import {FaAnglesLeft, FaAnglesRight} from "react-icons/fa6";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import SearchBar from "./SearchBar/SearchBar.tsx";
import {RootState} from "@reduxjs/toolkit/query";

const MarsStationListPage = () => {
    const {access_token} = useToken()
    const {is_moderator} = useAuth()
    const dispatch = useDispatch()
    const MarsStation = useSelector((state: RootState) => state.mars_station.data);
    const status_task = useSelector((state: RootState) => state.search.status_task);
// Для пагинации
    const pagination = useSelector((state: string) => state.mars_station.pagination);
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

        const params = new URLSearchParams({
            page: currentPage.toString(),
            // status_task: is_moderator ? '2; 3; 4' : '1; 2; 3; 4',
            status_task: status_task,
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
                        totalPages: Math.ceil(response.data.count / 5),
                        count: response.data.count,
                    })
                );
                setLoading(false);
                // console.log(response.data)
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    const lastPage = () => {
        if (currentPage < totalPages) {
            dispatch(updatePagination({currentPage: totalPages, totalPages, count}));
            searchMarsStation(totalPages);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            dispatch(updatePagination({currentPage: currentPage + 1, totalPages, count}));
            searchMarsStation(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            dispatch(updatePagination({currentPage: currentPage - 1, totalPages, count}));
            searchMarsStation(currentPage - 1);
        }
    };

    const initalPage = () => {
        if (currentPage > 1) {
            dispatch(updatePagination({currentPage: 1, totalPages, count}));
            searchMarsStation(1);
        }
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

    // @ts-ignore
    const columns: Column<MarsStation>[] = useMemo(() => {
        let statusColumns;
        if (is_moderator) {
            statusColumns = ['В работе', 'Отменена', 'Завершена'];
        } else {
            statusColumns = ['Черновик', 'В работе', 'Отменена', 'Завершена'];
        }
        const result = statusColumns.map((status) => ({
            Header: status,
            accessor: status,
            Cell: ({row}: { row: any }) => {
                const cardsForStatus = MarsStation
                    .filter((station: MarsStation) => station.status_task === status)
                    .map((station: MarsStation) => <MarsStationCard mars_station={station} key={station.id}/>);

                return cardsForStatus[row.index] || null;
            },
        }));

        return result;
    }, [MarsStation]);

    const tableInstance = useTable({columns, data: MarsStation});

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
    } = tableInstance;

    return (
        <div className="cards-list-wrapper">
            <div className="top">
                <SearchBar
                    status_task={status_task}
                    setUpdateTriggerParent={handleUpdateTrigger}
                />
            </div>
            <table {...getTableProps()} className="mars-station-table">
                <thead>
                <tr>
                    {headerGroups.map((headerGroup) =>
                        headerGroup.headers.map((column) =>
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>)
                    )}
                </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
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
    );
};

export default MarsStationListPage;