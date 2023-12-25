import "../Login.sass"
import {FaLock} from "react-icons/fa6";
import {GrLogin} from "react-icons/gr";
import {Link, useNavigate} from "react-router-dom";
import {errorMessage, successMessage} from "../../../Toasts/Toasts";
import {useToken} from "../../../hooks/useToken";
import {useAuth} from "../../../hooks/useAuth";
import Button from "@mui/material/Button";
import React from "react";
import {AccountApi, ApiAuthenticationPostRequest} from "../../../../swagger/generated-code";

export default function SignIn() {
    const navigate = useNavigate()
    const {setAccessToken} = useToken()
    const {setUser, setEmployee} = useAuth()

    const login = async (data: any) => {
        const api = new AccountApi(); // Замените на фактический класс вашего API
        const requestParameters: ApiAuthenticationPostRequest = {
            userAuthenticationSerializer: data,
        };
        await api.apiAuthenticationPost(requestParameters)
            .then((response) => {
                const {accessToken, user, employee} = response;
                setAccessToken(accessToken);

                const userObject = {
                    id_user: user.id,
                    is_authenticated: true,
                    username: user.username,
                    is_moderator: user.isModerator,
                };
                const employeeObject = {
                    id_employee: employee.id,
                    full_name: employee.fullName,
                    post: employee.post,
                    name_organization: employee.nameOrganization,
                    address: employee.address,
                };

                setUser(userObject);
                setEmployee(employeeObject);
                navigate("/home");
                successMessage(user.username);
            })
            .catch((error) => {
                console.error("Ошибка!\n", error);
                errorMessage();
            })
    };


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formElement = e.currentTarget.closest('form');
        if (formElement) {
            const formData = new FormData(formElement);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;
            const data = {
                username: username,
                password: password
            }
            await login(data);
        }
    };


    return (
        <div className="auth-container">
            <div className="header">
                <div className="text">
                    Вход
                </div>
            </div>
            <form className="inputs">
                <div className="input">
                    <GrLogin/>
                    <input type="text" name="username" placeholder="Логин" required/>
                </div>
                <div className="input">
                    <FaLock/>
                    <input type="password" name="password" placeholder="Пароль" required/>
                </div>
                <div className="sign-up-link-container">
                    <Link to="/auth/register/" style={{textDecoration: 'none'}}>
                        <span> Ещё нет аккаунта? </span>
                    </Link>
                </div>
                <Button
                    variant="outlined"
                    sx={{color: 'white', borderColor: 'white'}}
                    onClick={(e) => handleSubmit(e as React.MouseEvent<HTMLButtonElement>)}
                >
                    Войти
                </Button>
            </form>
        </div>
    )
}
