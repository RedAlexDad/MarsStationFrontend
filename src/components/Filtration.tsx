import {useState} from 'react'
import {GET_FILTRATION_GeographicalObjectsPaginations} from '../modules/GET_GeographicalObjects.ts'
import "../styles/search_button.css"
// import {setGeographicalObjectData} from "../components/Main.tsx"
import {GeographicalObjectResult} from "../modules/GET_GeographicalObjects.ts"

function FiltrationGeographicalObject({
    setGeographicalObjectData,
    setFilterData,
    filterData,
    currentPage,
}: {
    setGeographicalObjectData: (data: GeographicalObjectResult) => void;
    setFilterData: (data: any) => void;
    filterData: any;
    currentPage: number;
}) {
    // Для фильтрации услуг
    // Мы инициализируем состояние 'filterField' значением 'feature'
    const [filterField, setFilterField] = useState<string>('feature');
    // Мы инициализируем состояние 'filterKeyword' пустой строкой
    const [filterKeyword, setFilterKeyword] = useState<string>('');

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        if (event.target.name === 'filter_field') {
            // Мы обновляем состояние 'filterField' значением из события
            setFilterField(event.target.value);
        } else if (event.target.name === 'filter_keyword') {
            // Мы обновляем состояние 'filterKeyword' значением из события
            setFilterKeyword(event.target.value);
        }
    };

    const handleFilterSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            filterData.filterField = filterField
            filterData.filterKeyword = filterKeyword
            const response = await GET_FILTRATION_GeographicalObjectsPaginations(
                filterData.filterField,
                filterData.filterKeyword,
                currentPage
            );
            setGeographicalObjectData(response);
            // Обновление данных фильтрации
            setFilterData(filterData);
        } catch (error) {
            console.error('Error filtering geographical objects:', error);
        }
    };

    return (
        <>
            <div className="header">
                <div className="search-box">
                    <form onSubmit={handleFilterSubmit}>
                        <select className="filter-field" name="filter_field" onChange={handleFilterChange}
                                value={filterField}>
                            <option value="feature">Название</option>
                            <option value="type">Тип</option>
                            <option value="size">Площадь</option>
                            <option value="describe">Описание</option>
                        </select>
                        <input
                            className="input-search"
                            type="text"
                            name="filter_keyword"
                            value={filterKeyword}
                            onChange={handleFilterChange}
                            placeholder="Введите..."
                        />
                        <button className="btn-search" type="submit"><i className="fas fa-search"></i></button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FiltrationGeographicalObject;