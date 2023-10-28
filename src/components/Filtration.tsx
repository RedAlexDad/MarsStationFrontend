import {useEffect, useState} from 'react'
import {GET_FILTRATION_GeographicalObjectsPaginations} from '../modules/GET_GeographicalObjects.ts'
import "../styles/search_button.css"
// import {setGeographicalObjectData} from "../components/Main.tsx"
import {GeographicalObjectResult} from "../modules/GET_GeographicalObjects.ts"

function FiltrationGeographicalObject({
                                          setGeographicalObjectData,
                                          setFilterData,
                                          currentPage,
                                      }: {
    setGeographicalObjectData: (data: GeographicalObjectResult) => void;
    setFilterData: (data: any) => void;
    currentPage: number;
}) {
    // Для фильтрации услуг
    const [filterKeyword, setFilterKeyword] = useState<string>('');

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilterKeyword(event.target.value);
    };

    const handleFilterSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    };

    useEffect(() => {
        // Функция, которая будет выполнять фильтрацию данных
        const fetchFilteredData = async () => {
            try {
                const response = await GET_FILTRATION_GeographicalObjectsPaginations(
                    filterKeyword,
                    currentPage
                );
                setGeographicalObjectData(response);
                setFilterData(filterKeyword);
            } catch (error) {
                console.error('Error filtering geographical objects:', error);
            }
        };
        // Вызываем фильтрацию данных при изменении filterKeyword
        fetchFilteredData();
        // Этот useEffect будет выполнен при изменении filterKeyword или currentPage
    }, [filterKeyword, currentPage]);


    return (
        <>
            <div className="header">
                <div className="search-box">
                    <form onSubmit={handleFilterSubmit}>
                        <input
                            className="input-search"
                            type="text"
                            name="filter_keyword"
                            value={filterKeyword}
                            onChange={handleFilterChange}
                            placeholder="Введите название..."
                        />
                        <button className="btn-search" type="submit"></button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FiltrationGeographicalObject;