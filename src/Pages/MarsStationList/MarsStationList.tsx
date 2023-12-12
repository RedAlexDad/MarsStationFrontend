import "./MarsStationList.sass"
import {useEffect, useMemo, useState} from "react";
import MarsStationCard from "./MarsStationCard/MarsStationCard.tsx";
import {DOMEN, requestTime} from "../../Consts";
import {MarsStation} from "../../Types";
import {useToken} from "../../hooks/useToken.ts";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth.ts";
import {Column, useTable} from "react-table";

const MarsStationListPage = () => {
    const {access_token} = useToken()
    const [mars_stations, setMarsStation] = useState<MarsStation[]>([]);
    const {is_moderator} = useAuth()

    const searchMarsStation = async () => {
        let params;
        if (is_moderator) {
            params = new URLSearchParams({
                // Список заявок кроме со статусом 5
                status_task: '2; 3; 4',
                // status_task: '1; 2; 3; 4; 5',
            });
        } else {
            params = new URLSearchParams({
                // Список заявок кроме со статусом 5
                status_task: '1; 2; 3; 4',
            });
        }
        const url = `${DOMEN}api/mars_station/?${params}`;
        await axios.get(url, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                authorization: access_token,
            },
            timeout: requestTime,
        })
            .then(response => {
                const mars_stations: MarsStation[] = response.data;
                setMarsStation(mars_stations);
                // console.log(mars_stations)
            })
            .catch(error => {
                console.error("Ошибка!\n", error);
            });
    };

    useEffect(() => {
        searchMarsStation()
    }, [])

    // @ts-ignore
    const columns: Column<MarsStation>[] = useMemo(() => {
        const statusColumns = ['В работе', 'Отменена', 'Завершена'];
        const result = statusColumns.map((status) => ({
            Header: status,
            accessor: status,
            Cell: ({row}: {row: any}) => {
                const cardsForStatus = mars_stations
                    .filter((station: MarsStation) => station.status_task === status)
                    .map((station: MarsStation) => <MarsStationCard mars_station={station} key={station.id} />);

                return cardsForStatus[row.index] || null;
            },
        }));

        return result;
    }, [mars_stations]);

    const tableInstance = useTable({columns, data:mars_stations});

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
    } = tableInstance;

    return (
        <div className="cards-list-wrapper">
            <table {...getTableProps()} className="mars-station-table">
                <thead>
                <tr>
                    {headerGroups.map((headerGroup) =>
                        headerGroup.headers.map((column) => <th {...column.getHeaderProps()}>{column.render("Header")}</th>)
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
        </div>
    );
};

export default MarsStationListPage;