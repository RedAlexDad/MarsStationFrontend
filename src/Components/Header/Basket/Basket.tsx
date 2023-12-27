import {useSelector} from 'react-redux';
import Badge, {BadgeProps} from '@mui/material/Badge';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import {RootState} from "../../../store/store.ts";
import {Link, useLocation} from "react-router-dom";
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import {useEffect, useState} from "react";

const StyledBadge = styled(Badge)<BadgeProps>(({theme}) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

export default function BasketBadges() {
    const location = useLocation();
    const [isPartVisible, setIsPartVisible] = useState(true);

    // Получаем значение из Redux
    // Используем значение для установки количества
    const IDMarsStationDraft = useSelector((state: RootState) => state.geographical_object.id_draft);
    const geographicalObjectCount = useSelector((state: RootState) => state.geographical_object.count_geographical_object_by_draft);

    useEffect(() => {
        // Проверяем текущий путь и скрываем часть компонента при необходимости
        if (location.pathname === '/geographical_object/') {
            setIsPartVisible(true);
        } else {
            setIsPartVisible(false);
        }
    }, [location.pathname]);

    return (
        <>
            {isPartVisible && (
                <Link to={geographicalObjectCount > 0 ? `/mars_station/${IDMarsStationDraft}/` : '#'}>
                    <IconButton aria-label="cart">
                        {geographicalObjectCount >= 0 &&
                            <StyledBadge badgeContent={geographicalObjectCount} color="secondary">
                                <RocketLaunchIcon color="warning"/>
                            </StyledBadge>
                        }
                    </IconButton>
                </Link>
            )}
        </>
    );
}