import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    ButtonGroup,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {STATUS_TASKS} from "../../Consts.ts";
import {useNavigate} from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function TableGeographicalObject({
                                                    sortedLocations,
                                                    photoUrlsMap,
                                                    geographicalObjectMap,
                                                    selectedMarsStation,
                                                    deleteLocationAndMarsStation,
                                                    putLocationAndMarsStation
                                                }: {
    sortedLocations: any[];
    photoUrlsMap: Record<string, string>;
    geographicalObjectMap: Record<string, any>;
    selectedMarsStation: any;
    deleteLocationAndMarsStation: (locationId: number, marsStationId: number) => void;
    putLocationAndMarsStation: (locationId: number, marsStationId: number, direction: 'up' | 'down') => void;
}) {
    const navigate = useNavigate();
    const handleRowClick = (id_geographical_object: number) => {
        navigate(`geographical_object/${id_geographical_object}/`);
    };
    const firstLocationNumber = sortedLocations.length > 0 ? sortedLocations[0].sequence_number : null;
    const lastLocationNumber = sortedLocations.length > 0 ? sortedLocations[sortedLocations.length - 1].sequence_number : null;

    return (
        <TableContainer
            component={Paper}
            sx={{
                height: 'auto',
                overflow: 'auto',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                background: 'rgba(255, 255, 255, 0)'
            }}
        >
            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>ID</TableCell>
                        <TableCell
                            style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Изображение</TableCell>
                        <TableCell style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Название</TableCell>
                        <TableCell style={{fontSize: '20px', fontWeight: 'bold', color: 'white'}}>Тип</TableCell>
                        {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "Черновик" && (
                            <>
                                {sortedLocations.length > 1 && (
                                    <TableCell
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>Перемещение</TableCell>
                                )}
                                <TableCell
                                    style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>Удаление</TableCell>
                                <TableCell
                                    style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>Просмотр</TableCell>
                            </>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedLocations.map((location) => (
                        <TableRow key={location.sequence_number}>
                            <TableCell style={{fontSize: '18px', color: 'white'}}>{location.sequence_number}</TableCell>
                            <TableCell style={{fontSize: '18px', color: 'white'}}>
                                <img
                                    src={photoUrlsMap[location.id_geographical_object]}
                                    alt={geographicalObjectMap[location.id_geographical_object]?.feature}
                                    style={{width: '50px', height: '50px'}}
                                />
                            </TableCell>
                            <TableCell
                                style={{
                                    fontSize: '18px',
                                    color: 'white'
                                }}>{geographicalObjectMap[location.id_geographical_object]?.feature}</TableCell>
                            <TableCell
                                style={{
                                    fontSize: '18px',
                                    color: 'white'
                                }}>{geographicalObjectMap[location.id_geographical_object]?.type}</TableCell>

                            {STATUS_TASKS.find(status => status.id === selectedMarsStation?.status_task)?.name === "Черновик" &&
                                <>
                                    {sortedLocations.length > 1 && (
                                        <TableCell>
                                            <ButtonGroup orientation="vertical">
                                                {location.sequence_number !== firstLocationNumber && (
                                                    <Button
                                                        variant="outlined"
                                                        style={{color: 'white', borderColor: 'white'}}
                                                        onClick={() => putLocationAndMarsStation(location.id, location.id_mars_station, 'up')}
                                                    >
                                                        <KeyboardArrowUpIcon/>
                                                    </Button>
                                                )}
                                                {location.sequence_number !== lastLocationNumber && (
                                                    <Button
                                                        variant="outlined"
                                                        style={{color: 'white', borderColor: 'white'}}
                                                        onClick={() => putLocationAndMarsStation(location.id, location.id_mars_station, 'down')}
                                                    >
                                                        <KeyboardArrowDownIcon/>
                                                    </Button>
                                                )}
                                            </ButtonGroup>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            style={{color: 'white', borderColor: 'white'}}
                                            onClick={() => deleteLocationAndMarsStation(location.id, location.id_mars_station)}
                                        >
                                            <DeleteIcon/>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleRowClick(geographicalObjectMap[location.id_geographical_object]?.id)}
                                            style={{color: 'white', borderColor: 'white'}}
                                        >
                                            <RemoveRedEyeIcon/>
                                        </Button>
                                    </TableCell>
                                </>
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
