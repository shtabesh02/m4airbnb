import { csrfFetch } from "./csrf";


const LOAD_SPOTS = 'spot/load_spots';
const LOAD_SPOT_DETAILS = 'spot/LOAD_SPOT_DETAILS'


// Regular action to load the spots
const loadSpots = (spots) => {
    return{
        type: LOAD_SPOTS,
        payload: spots
    }
}


// Thunk action to load the spots
export const loadSpotsfromDB = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    console.log('from thunk...', response)
    if(response.ok){
        const data = await response.json();
        console.log('spot data from thunk: ', data)
        dispatch(loadSpots(data.Spots));
        return data;
    }else{
        const e = await response.json();
        return e;
    }
}

// Regular action to load the spot details
const loadSpotDetails = (spotDetails) => {
    return {
        type: LOAD_SPOT_DETAILS,
        payload: spotDetails
    }
}

// Thunk action to load the spot details
export const loadSpotDetailsfromDB = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    console.log('from thunk: ', response);
    if(response.ok){
        const data = await response.json();
        dispatch(loadSpotDetails(data));
        return data
    }else{
        const e = await response.json();
        return e;
    }
}

// Spot Reducer
const initialState = {};
const spotReducer = (state = initialState, action) => {
    const newState = {...state};
    switch(action.type){
        case LOAD_SPOTS: {
            action.payload.forEach(spot => {
                newState[spot.id] = {...newState[spot.id], ...spot}
            });
            return newState;
        }
        case LOAD_SPOT_DETAILS: {
            newState[action.payload.id] = {...newState[action.payload.id], ...action.payload}
            return newState
        }
        default:
            return state;
    }
}

export default spotReducer;