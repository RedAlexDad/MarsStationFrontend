import "./SearchBar.sass"
import {useDispatch} from "react-redux";
import {updateStatusTask} from "../../../store/Search.ts";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dispatch, SetStateAction} from "react";

const SearchBar = ({status_task, setUpdateTriggerParent}: {
    status_task: string[];
    setUpdateTriggerParent: Dispatch<SetStateAction<boolean>>;
}) => {
    const dispatch = useDispatch();

    const handleStatusSelect = (status: string) => {
        const updatedStatus = [...status_task];
        if (updatedStatus.includes(status)) {
            // Удаляем статус, если он уже выбран
            const index = updatedStatus.indexOf(status);
            updatedStatus.splice(index, 1);
        } else {
            // Добавляем статус, если он еще не выбран
            updatedStatus.push(status);
        }
        dispatch(updateStatusTask(updatedStatus));
        setUpdateTriggerParent(true);
    };

    return (
        <div className="dropdown-wrapper">
            <DropdownButton id="dropdown-item-button" title="Статус задачи" className="dropdown-button">
                <Dropdown.ItemText className="dropdown-item-text">Выберите статус(ы)</Dropdown.ItemText>
                <Dropdown.Item as="button" active={status_task.includes('1')}
                               onClick={() => handleStatusSelect('1')} className={`dropdown-item action`}>
                    Черновик
                </Dropdown.Item>
                <Dropdown.Item as="button" active={status_task.includes('2')}
                               onClick={() => handleStatusSelect('2')}
                               className={`dropdown-item another-action`}>
                    В работе
                </Dropdown.Item>
                <Dropdown.Item as="button" active={status_task.includes('3')}
                               onClick={() => handleStatusSelect('3')}
                               className={`dropdown-item something-else`}>
                    Завершена
                </Dropdown.Item>
                <Dropdown.Item as="button" active={status_task.includes('4')}
                               onClick={() => handleStatusSelect('4')}
                               className={`dropdown-item something-else`}>
                    Отменена
                </Dropdown.Item>
            </DropdownButton>
        </div>
    );
};

export default SearchBar;