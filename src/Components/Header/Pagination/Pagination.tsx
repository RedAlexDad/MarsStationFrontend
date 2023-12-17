import {FaAnglesLeft, FaAnglesRight, FaAngleLeft, FaAngleRight} from 'react-icons/fa6';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, loading, onPageChange}) => {
    return (
        <div className="pagination-container">
            <button
                className="pagination-button"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1 || loading}
            >
                <FaAnglesLeft/>
            </button>

            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
            >
                <FaAngleLeft/>
            </button>

            <span className="pagination-current-page">{currentPage}</span>

            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
            >
                <FaAngleRight/>
            </button>

            <button
                className="pagination-button"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
            >
                <FaAnglesRight/>
            </button>
        </div>
    );
};

export default Pagination;
