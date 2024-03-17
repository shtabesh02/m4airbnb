import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import sessionReducer from './session';
import spotReducer from './spot';
import reviewReducer from './review';
import spotDetailsReducer from './spot_details';
import spotsimagesReducer from './spotsimages';
// import spotDetails from './spot_details'

const rootReducer = combineReducers({
  // ADD REDUCERS HERE
  session: sessionReducer,
  spots: spotReducer,
  reviews: reviewReducer,
  spotDetails: spotDetailsReducer,
  spotsimages: spotsimagesReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
