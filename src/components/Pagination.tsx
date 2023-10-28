import {Pagination} from 'react-bootstrap';

function MyPagination({
                          currentPage,
                          handlePreviousPage,
                          handleNextPage,
                          itemsPerPage,
                          totalItems
                      }:
                          {
                              currentPage: any,
                              handlePreviousPage: any,
                              handleNextPage: any,
                              itemsPerPage: any,
                              totalItems: any
                          }) {
    // const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <Pagination>
            <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1}/>
            <Pagination.Next onClick={handleNextPage} disabled={currentPage * itemsPerPage >= totalItems}/>
        </Pagination>
    );
}

export default MyPagination;
