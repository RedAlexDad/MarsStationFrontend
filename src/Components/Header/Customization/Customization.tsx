import { useSelector } from 'react-redux';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function CustomizedBadges() {
  // Получаем значение из Redux
  const geographicalObjectCount = useSelector(state => state.mars_station_draft.geographical_object.length);

  return (
    <IconButton aria-label="cart">
      {/* Используем значение для установки количества */}
      <StyledBadge badgeContent={geographicalObjectCount} color="secondary">
        <ShoppingCartIcon />
      </StyledBadge>
    </IconButton>
  );
}
