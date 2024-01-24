import { csrfFetch } from "./csrf";
import { loadSpotDetailsfromDB } from "./spot";

const LOAD_REVIEWS = `review/LOAD_REVIEWS`;
const REMOVE_REVIEW = 'review/REMOVE_REVIEW';

// Regular action for loading the reviews
const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    }
}

// Thunk action to fetch reviews from DB
export const loadReviewsfromDB = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if(response.ok){
        const reviews = await response.json();
        dispatch(loadReviews(reviews.Reviews));
        return reviews;
    }else{
        const e = await response.json();
        return e;
    }
}

// Regular action for deleting the reviews
const removeReview = (reviewId) => {
    return{
        type: REMOVE_REVIEW,
        payload: reviewId
    }
}

// Thunk action for deleting from DB
export const deleteReviewfromDB = (reviewId, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    if(response.ok){
        const data = await response.json();
        dispatch(removeReview(reviewId));
        dispatch(loadReviewsfromDB(spotId));
        dispatch(loadSpotDetailsfromDB(spotId));
        return data;
    }else{
        const e = await response.json();
        return e;
    }
}


// Thunk action for adding review to a post
export const addReviewToDB = (reviewForm, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reviewForm)
    });
    if(response.ok){
        dispatch(loadReviewsfromDB(spotId));
        dispatch(loadSpotDetailsfromDB(spotId));
        return response;
    }else{
        const e = await response.json();
        return e;
    }
}


// Review Reducer
const initialState = {};
const reviewReducer = (state = initialState, action) => {
    const newState = {...state};
    switch(action.type){
        case LOAD_REVIEWS: {
            action.payload.forEach(review => {
                newState[review.id] = {...newState[review.id], ...review};
            });
            return newState;
        }
        case REMOVE_REVIEW:{
            delete newState[action.payload];
            return newState;
        }
        default:
            return state;
    }
}

export default reviewReducer;