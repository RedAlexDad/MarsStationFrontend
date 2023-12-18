import {Theme, useTheme} from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(id: number, selectedIds: number[], theme: Theme) {
    return {
        fontWeight:
            selectedIds.indexOf(id) === -1 || !id
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultipleSelectTransport({transports, selectedTransports, onChange}: {
    transports: { id: number; type: string }[];
    selectedTransports: number[];
    onChange: (selectedIds: number[]) => void;
}) {
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<typeof selectedTransports>) => {
        const {
            target: { value },
        } = event;
        onChange(value as number[]);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel sx={{ color: 'white' }} id="demo-multiple-name-label">Type</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={selectedTransports}
                    onChange={handleChange}
                    input={<OutlinedInput label="Type" />}
                    MenuProps={MenuProps}
                    sx={{ color: 'white' }}
                >
                    {transports.map((transport) => (
                        <MenuItem
                            key={transport.id}
                            value={transport.id}
                            style={{ color: 'black', ...getStyles(transport.id, selectedTransports, theme) }}
                        >
                            {transport.type || 'Unknown Type'}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Добавьте отображение выбранных карточек транспорта по аналогии с предыдущим примером */}
            {/*{transports*/}
            {/*    .filter((transport) => selectedTransports.includes(transport.id))*/}
            {/*    .map((selectedTransport) => (*/}
            {/*        <div key={selectedTransport.id} className="cards-list-wrapper">*/}
            {/*            <div className="bottom">*/}
            {/*                <div className="card-wrapper">*/}
            {/*                    <div className="card-content">*/}
            {/*                        <div className="content-top">*/}
            {/*                            <p className="type"> Тип: {selectedTransport.type} </p>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
        </div>
    );
};
