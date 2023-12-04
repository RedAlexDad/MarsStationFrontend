import "./UserInfo.sass"
import {useAuth} from "../../../../hooks/useAuth";
import {ImExit} from "react-icons/im";
import user_avatar from "./user.png";
import {useNavigate } from "react-router-dom";
import {logOutMessage} from "../../../../Toasts/Toasts";
import {useToken} from "../../../../hooks/useToken";
import {useModal} from "../../../../hooks/useModal";

const UserInfo = () => {

	const navigate = useNavigate()
	// @ts-ignore
	const {id_user, id_employee, full_name, post, name_organization, address, is_moderator, logOut} = useAuth()
	const {resetTokens} = useToken()
	const {modalRef, buttonRef, isOpen, setIsOpen} = useModal()

	const doLogOut = () => {
		logOut()
		resetTokens()
		logOutMessage()
		navigate("/home")
	}

	return (
		<div>
			<div ref={buttonRef}>
				{/*@ts-ignore*/}
				<img src={user_avatar} className="user-avatar" onClick={(e) => setIsOpen(!isOpen)} />
			</div>

			<div className={"user-info-wrapper " + (isOpen ? "open" : "")} ref={modalRef}>
				{/*<span>ID USER: {id_user}</span>*/}
				{/*<span>ID EMPLOYEE: {id_employee}</span>*/}
				<span>Имя: {full_name}</span>
				<span>Должность: {post}</span>
				<span>Название организации: {name_organization}</span>
				{address && <span>Адрес: {address}</span>}
				<span>Статус: {is_moderator ? "Модератор" : "Пользователь"}</span>

				<button onClick={doLogOut}>
					Выйти
					<ImExit />
				</button>
			</div>

		</div>
	)
}

export default UserInfo;