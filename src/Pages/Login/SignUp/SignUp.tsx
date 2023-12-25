import "../Login.sass"
import {FaLock, FaRegBuilding, FaSignsPost, FaUser} from "react-icons/fa6";
import {GrLogin, GrMap} from "react-icons/gr";
import {Link, useNavigate} from "react-router-dom";
import {errorMessage, successMessage} from "../../../Toasts/Toasts";
import {useToken} from "../../../hooks/useToken";
import {useAuth} from "../../../hooks/useAuth";
import Button from "@mui/material/Button";
import React from "react";
import {AccountApi, ApiAuthenticationPostRequest, ApiRegisterPostRequest} from "../../../../swagger/generated-code";

export default function SignUp() {
    const navigate = useNavigate()
    const {setAccessToken} = useToken()
    const {setUser} = useAuth()

    const login = async (data: any) => {
        console.log('login', data)
        const api = new AccountApi(); // Замените на фактический класс вашего API
        const requestParameters: ApiAuthenticationPostRequest = {
            userAuthenticationSerializer: data,
        };
        await api.apiAuthenticationPost(requestParameters)
            .then((response) => {
                const {accessToken, user} = response;
                setAccessToken(accessToken);
                const permissions = {
                    id: user.id,
                    is_authenticated: true,
                    username: user.username,
                    is_moderator: user.isModerator,
                }
                setUser(permissions)
                navigate("/home/");
                successMessage(user.username)
            })
            .catch((error) => {
                console.error("Ошибка!\n", error);
                errorMessage();
            })
    };

    const register = async (data: any) => {
        try {
            const api = new AccountApi(); // Замените YourApiClassName на фактическое имя вашего класса API
            const requestParameters: ApiRegisterPostRequest = {
                userRegisterSerializer: data,
            };
            console.log(data)
            const response = await api.apiRegisterPost(requestParameters);

            console.log(response);
            console.log(data);

            login(data.user);
        } catch (error) {
            console.error("Ошибка!\n", error);
            errorMessage();
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const formElement = e.currentTarget.closest('form');
        if (formElement) {
            const formData = new FormData(formElement);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;
            const full_name = formData.get('full_name') as string;
            const post = formData.get('post') as string;
            const name_organization = formData.get('name_organization') as string;
            const address = formData.get('address') as string;

            const data = {
                user: {
                    username: username,
                    password: password,
                    is_moderator: false,
                },
                employee: {
                    fullName: full_name,
                    post: post,
                    nameOrganization: name_organization,
                    address: address
                }
            }
            await register(data)
        }
    }

    return (
        <div className="auth-container">
            <div className="header">
                <div className="text">
                    Регистрация
                </div>
            </div>
            <form className="inputs">
                <div className="input">
                    <GrLogin className="icon"/>
                    <input type="text" placeholder="Логин" name="username"/>
                </div>
                <div className="input">
                    <FaLock className="icon"/>
                    <input type="password" placeholder="Пароль" name="password"/>
                </div>
                <div className="input">
                    <FaUser className="icon"/>
                    <input type="text" placeholder="ФИО" name="full_name"/>
                </div>
                <div className="input">
                    <FaSignsPost className="icon"/>
                    <input type="text" placeholder="Должность" name="post"/>
                </div>
                <div className="input">
                    <FaRegBuilding className="icon"/>
                    <input type="text" placeholder="Название организации" name="name_organization"/>
                </div>
                <div className="input">
                    <GrMap className="icon"/>
                    <input type="text" placeholder="Адрес" name="address"/>
                </div>
                <div className="sign-in-link-container">
                    <Link to="/auth/login/" style={{textDecoration: 'none'}}>
                        <span>Уже есть аккаут?</span>
                    </Link>
                </div>
                <Button
                    variant="outlined"
                    sx={{color: 'white', borderColor: 'white'}}
                    onClick={(e) => handleSubmit(e as React.MouseEvent<HTMLButtonElement>)}
                >
                    Зарегестрироваться
                </Button>
            </form>
        </div>
    )
}