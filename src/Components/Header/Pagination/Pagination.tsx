import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface StyledPaginationProps {
    currentPage: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

const StyledPagination: React.FC<StyledPaginationProps> = ({currentPage, totalPages, loading, onPageChange}) => {
    return (
        <Stack spacing={2} direction="row" alignItems="center" justifyContent="center">
            <Pagination
                count={totalPages}
                variant="outlined"
                color="primary"
                page={currentPage}
                onChange={(_, page) => onPageChange(page)}
                disabled={loading}
                sx={{ '& button, & .MuiPaginationItem-page': { color: 'white' } }}
            />
        </Stack>
    );
};

export default StyledPagination;
