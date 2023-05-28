import {createStore, combineReducers, applyMiddleware} from "redux";
import { productReducer, productDetailsReducer } from './reducers/ProductReducer';
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension"


const reducer = combineReducers({
    products: productReducer,
    productDetails: productDetailsReducer
});

let initialState = {};
const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;