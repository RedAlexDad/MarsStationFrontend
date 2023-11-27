import "../Login.sass"
import {FaLock, FaRegBuilding, FaSignsPost, FaUser} from "react-icons/fa6";
import {GrLogin, GrMap} from "react-icons/gr";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {errorMessage, successMessage} from "../../../Toasts/Toasts";
import {useToken} from "../../../hooks/useToken";
import {useAuth} from "../../../hooks/useAuth";
import {Response} from "../../../Types";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import {variables} from "../../../utls/variables";
import {DOMEN} from "../../../Consts.ts";

const SignUp = () => {

	const navigate = useNavigate()
	const { setAccessToken } = useToken()
	const { setUser } = useAuth()

	// @ts-ignore
	const login = async (formData) => {
		const username = formData.get('username')
		const password = formData.get('password')
		try {
			const response:Response = await axios(`${DOMEN}api/authentication/`, {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				},
				data: {
					username: username,
					password: password
				}
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

		} catch {
			errorMessage()
		}
	}

	// @ts-ignore
	const register = async (formData) => {
		console.log(formData)
		try {
			const response = await axios(`${DOMEN}api/register/`, {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				},
				data: formData as FormData
			})

			if (response.status == 200) {
				login(formData)
			}
		} catch (error) {
			console.log(error)
			errorMessage()
		}

	}
	// @ts-ignore
	const handleSubmit = async (e) => {
		e.preventDefault()
		const formData:FormData = new FormData(e.target as HTMLFormElement)
		await register(formData)
	}

	return (
		<div className="auth-container">

			<div className="header">

				<div className="text">
					Регистрация
				</div>

			</div>

			<form className="inputs" action="POST" onSubmit={handleSubmit}>

				<div className="input">
					<GrLogin className="icon" />
					<input type="text" placeholder="Логин" name="username" />
				</div>

				<div className="input">
					<FaLock className="icon" />
					<input type="password"  placeholder="Пароль" name="password" />
				</div>

				<div className="input">
					<FaUser className="icon" />
					<input type="text" placeholder="ФИО" name="full_name" />
				</div>

				<div className="input">
					<FaSignsPost className="icon" />
					<input type="text" placeholder="Должность" name="post" />
				</div>

				<div className="input">
					<FaRegBuilding className="icon" />
					<input type="text" placeholder="Название организации" name="name_organization" />
				</div>

				<div className="input">
					<GrMap className="icon" />
					<input type="text" placeholder="Адрес" name="address" />
				</div>


				<div className="sign-in-link-container">
					<Link to="/auth/login" style={{ textDecoration: 'none' }}>
						<span>Уже есть аккаут?</span>
					</Link>
				</div>

				{/*@ts-ignore*/}
				<CustomButton bg={variables.primary} text="Зарегестрироваться" />

			</form>

		</div>
	)
}

export default SignUp;