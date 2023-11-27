import {useDispatch, useSelector} from 'react-redux';
import {updateUser, cleanUser} from "../store/authSlice";
import {Response} from "../Types";
import axios from "axios";
import {useToken} from "./useToken";
import {DOMEN} from "../Consts.ts";

export function useAuth() {
	// @ts-ignore
	const {is_authenticated, is_moderator, id, username} = useSelector(state => state.user);

	const dispatch = useDispatch()

	// @ts-ignore
	const setUser = (value) => {
		dispatch(updateUser(value))
	}

	const sendRequest = async() => {
		// @ts-ignore
		const { token } = useToken()

		try {

			const response: Response = await axios(`${DOMEN}/api/logout/`, {
				method: "POST",
				headers: {
					'authorization': `${token}`
				}
			})

			if (response.status == 200)
			{
				console.log(response.data)
			}

		} catch (error) {

		}
	}

	const logOut = async () => {
		sendRequest()
		dispatch(cleanUser())
	}


	return {
		is_authenticated,
		is_moderator,
		id,
		username,
		setUser,
		logOut
	};
}