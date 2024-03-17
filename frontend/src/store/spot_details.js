import { csrfFetch } from "./csrf";



const LOAD_SPOT_DETAILS = 'spot/LOAD_SPOT_DETAILS';

// Regular action to load the spot details
const loadSpotDetails = (spotDetails) => {
    return {
        type: LOAD_SPOT_DETAILS,
        payload: spotDetails
    }
}

// Thunk action to load the spot details
export const loadSpotDetailsfromDB = (spotId) => async (dispatch) => {
    console.log('spot details thunk called...');
    const response = await csrfFetch(`/api/spots/${spotId}`);
    // console.log('from thunk: ', response);
    if(response.ok){
        const data = await response.json();
        console.log('Spot Details from thunk: ', data)
        dispatch(loadSpotDetails(data));
        return data
    }else{
        const e = await response.json();
        return e;
    }
}

// Spot Details Reducer
const initialState = {};
const spotDetailsReducer = (state = initialState, action) => {
    // console.log('spot details called...');
    const newState = {...state};
    console.log('spot details called to change state... ', newState);
    switch(action.type){
        case LOAD_SPOT_DETAILS: {
            newState[action.payload.id] = {...newState[action.payload.id], ...action.payload}
            // console.log('spot details with new state: ', newState);
            return newState
        }
        default:
            return state;
    }
}

export default spotDetailsReducer;


// // using the toolkit


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// export const getSpotDetails = createAsyncThunk('spotDetails', async (spotId) => {
//     const data = await csrfFetch(`/api/spots/${spotId}`);
//     const result = await data.json();
//     return result;
// })


// const initialState = {
//     data: [],
//     status: 'idle'
// }

// const spotDetails = createSlice({
//     name: 'products',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//         .addCase(getSpotDetails.pending, (state, action) => {
//             state.status = 'loading'
//         })
//         .addCase(getSpotDetails.fulfilled, (state, action) => {
//             state.data = action.payload
//             state.status = 'idle'
//         })
//         .addCase(getSpotDetails.rejected, (state, action) => {
//             state.status = 'error'
//         })
//     }
// });


// export default spotDetails.reducer;

