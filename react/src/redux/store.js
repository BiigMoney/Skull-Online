import {createStore, applyMiddleware, compose} from "redux"
import thunk from "redux-thunk"
import reducer from "./reducer"

const initialState = {
  lobby: {
    games: [],
    players: null,
    loading: true,
    error: null
  },
  fatalError: null,
  socket: null,
  name: null,
  loading: true
}

const middleware = [thunk]

const store = createStore(reducer, initialState, compose(applyMiddleware(...middleware) /*window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()*/))

export default store
