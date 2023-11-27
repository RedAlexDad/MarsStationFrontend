import {useSelector} from 'react-redux';

export function useGeographicalObject() {
	// @ts-ignore
	const geographical_object = useSelector(state => state.selectedGroup.geographical_object);

	return {
		geographical_object
	};
}