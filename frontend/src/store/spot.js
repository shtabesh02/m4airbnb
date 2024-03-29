import { csrfFetch } from "./csrf";


const LOAD_SPOTS = 'spot/load_spots';

const LOAD_SPOT_DETAILS = 'spot/LOAD_SPOT_DETAILS';
const INSERT_IMAGE = '/spot/INSERT_IMAGE';
const DELETE_SPOT = 'spot/DELETE_SPOT';


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
    // console.log('from thunk...', response)
    if(response.ok){
        const data = await response.json();
        // console.log('spot data from thunk: ', data)
        dispatch(loadSpots(data.Spots));
        // return data;
    }else{
        const e = await response.json();
        return e;
    }
}


// Thunk action to load the spots for the current user
export const loadCurrentSpotsfromDB = () => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/current`);
    // console.log('from current user thunk...', response)
    if(response.ok){
        const data = await response.json();
        // console.log('spot data from thunk: ', data)
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
export const loadSpotDetailsfromDB = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    // console.log('from thunk: ', response);
    if(response.ok){
        const data = await response.json();
        // console.log('Spot Details from thunk: ', data)
        dispatch(loadSpotDetails(data));
        return data
    }else{
        const e = await response.json();
        return e;
    }
}

// Thunk action to insert new spot to spot table
export const insertNewSpot = (newSpotDetails) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newSpotDetails)
    });
    if(response.ok){
        const data = await response.json();
        dispatch(loadSpotDetails(data));
        return data;
    }else{
        const e = await response.json();
        // console.log('error from thunk for spot insertion: ', e);
        return e.errors;
    }
}

// Regular action to insert images to image table
const insertImage = (spotId, imageUrls) => {
    return {
        type: INSERT_IMAGE,
        payload: {spotId, imageUrls}
    }
}
// Thunk action to insert new image to image table
export const insertNewImage = (img, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify(img),
    })
    // console.load('')
    if(response.ok){
        const data = await response.json();
        dispatch(insertImage(spotId, data.url)) // call image action creator
        return data;
    }else{
        const e = await response.json();
        // console.log('error from thunk for image insertion: ', e);
        return e;
    }
}

// Regular action to delete a spot
const deleteSpot = (spotId) => {
    return{
        type: DELETE_SPOT,
        payload: spotId
    }
}
// Thunk action to delete a spot
export const deleteSpotFromDB = (spotId) => async (dispatch) => {
    const result = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });

    if(result.ok){
        const data = await result.json();
        dispatch(deleteSpot(spotId));
        return data;
    }else{
        const e = await result.json();
        return e;
    }
}



// Thunk action to update the  current spot
export const updateCurrentSpot = (updateDetails, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateDetails)
    });
    if(response.ok){
        const data = await response.json();
        dispatch(loadSpotDetails(data));
        return data;
    }else{
        const e = await response.json();
        // console.log('error from thunk for spot update: ', e);
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
            // console.log('from reducer: ', newState);
            return newState
        }
        default:
            return state;
    }
}

export default spotReducer;