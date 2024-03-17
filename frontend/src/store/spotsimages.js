// ---------------------------------------
// spots and their images
const LOAD_SPOTSIMAGES = 'spot/load_spots_images';
// Regular action to load the spots images
const spotsimages = (spots_images) => {
    return{
        type: LOAD_SPOTSIMAGES,
        payload: spots_images
    }
}


// Thunk action to load the spots
export const loadSpotsImagesFromDB = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/spotsimages');
    console.log('spotsimages loaded: ', response)
    if(response.ok){
        const data = await response.json();
        console.log('spotsimages from thunk: ', data)
        dispatch(spotsimages(data));
        // return data;
    }else{
        const e = await response.json();
        return e;
    }
}


// Spots Images Reducer
const initialState = {};

const spotsimagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTSIMAGES: {
            // Assuming action.payload is an array of spot images
            const updatedState = {};
            action.payload.forEach(spot => {
                updatedState[spot.id] = { ...state[spot.id], ...spot };
            });
            return { ...state, ...updatedState };
        }
        default:
            return state;
    }
};

export default spotsimagesReducer;

// ---------------------------------------