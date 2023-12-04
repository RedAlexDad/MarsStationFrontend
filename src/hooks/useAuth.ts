import {useDispatch, useSelector} from 'react-redux';
import {updateUser, cleanUser} from "../store/User.ts";
import {cleanEmployee, updateEmployee} from "../store/Employee.ts";
import axios from "axios";
import {useToken} from "./useToken";
import {DOMEN} from "../Consts.ts";

export function useAuth() {
    const selectedUserData = useSelector((state) => state.user);
    const selectedEmployeeData = useSelector((state) => state.employee);

    const {
        id_user,
        is_authenticated,
        is_moderator,
        username,
    } = selectedUserData;

    const {
        id_employee,
        full_name,
        post,
        name_organization,
        address,
    } = selectedEmployeeData;

    const dispatch = useDispatch()

    const setUser = (user_value) => {
        dispatch(updateUser(user_value));
    }
    const setEmployee = (employee_value) => {
        dispatch(updateEmployee(employee_value));
    };

    const sendRequest = async () => {
        const {access_token} = useToken()
        await axios(`${DOMEN}/api/logout/`, {
            method: "POST",
            headers: {
                'authorization': `${access_token}`
            }
        })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }

    const logOut = async () => {
        sendRequest();
        dispatch(cleanUser());
        dispatch(cleanEmployee());
    }


    return {
        id_user,
        is_authenticated,
        is_moderator,
        username,
        id_employee,
        full_name,
        post,
        name_organization,
        address,
        // Redux
        setUser,
        setEmployee,
        // Other
        logOut,
    };
}