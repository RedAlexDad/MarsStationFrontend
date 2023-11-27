import "../Login.sass"
import {FaLock} from "react-icons/fa6";
import {GrLogin} from "react-icons/gr";
import {Response} from "../../../Types";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {errorMessage, successMessage} from "../../../Toasts/Toasts";
import {useToken} from "../../../hooks/useToken";
import {useAuth} from "../../../hooks/useAuth";
import {variables} from "../../../utls/variables";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import {DOMEN} from "../../../Consts.ts";

const SignIn = () => {

    const navigate = useNavigate()

    const {setAccessToken} = useToken()
    const {setUser} = useAuth()

    // @ts-ignore
    const login = async (formData) => {
        try {
            const response: Response = await axios(`${DOMEN}api/authentication/`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                data: formData as FormData
            })
            setAccessToken(response.data['access_token'])
            const permissions = {
                is_authenticated: true,
                id: response.data.user["id"],
                username: response.data.user["username"],
                is_moderator: response.data.user["is_moderator"],
            }
            setUser(permissions)
            navigate("/home");
            successMessage(response.data.user["username"])

        } catch (error) {
            console.log(error)
            errorMessage()
        }
    }

    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        await login(formData)
    }


    return (
        <div className="auth-container">
            <div className="header">
                <div className="text">
                    Вход
                </div>
            </div>
            <form className="inputs" action="POST" onSubmit={handleSubmit}>
                <div className="input">
                    <GrLogin/>
                    <input type="text" name="username" placeholder="Логин" required/>
                </div>
                <div className="input">
                    <FaLock/>
                    <input type="password" name="password" placeholder="Пароль" required/>
                </div>
                <div className="sign-up-link-container">
                    <Link to="/auth/register" style={{textDecoration: 'none'}}>
                        <span> Ещё нет аккаунта? </span>
                    </Link>
                </div>
                {/*	@ts-ignore*/}
                <CustomButton bg={variables.primary} text="Войти"/>
            </form>

        </div>
    )
}

export default SignIn;