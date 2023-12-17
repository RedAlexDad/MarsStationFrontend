import { useSelector } from 'react-redux';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {RootState} from "../../../store/store.ts";
import {GeographicalObjectModal} from "./Modal.tsx";
import {useState} from "react";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function BasketBadges() {
  // Получаем значение из Redux
  // Используем значение для установки количества
  const geographicalObjectCount = useSelector((state: RootState) => state.mars_station_draft.geographical_object.length);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => (geographicalObjectCount > 0 ? setOpen(true) : 0);
  const handleClose = () => setOpen(false);

  // !TODO: Корзинку белого цвета
  return (
      <div>
        <IconButton aria-label="cart" onClick={handleOpen}>
          <StyledBadge badgeContent={geographicalObjectCount} color="secondary">
            <ShoppingCartIcon color="info"/>
          </StyledBadge>
        </IconButton>
        {open && <GeographicalObjectModal isOpen={open} handleClose={handleClose} count={geographicalObjectCount} />}
      </div>
  );
}