import {SETLOADING, SETERROR, SETSOCKET, SETLOBBYINFO, SETNAME, SETLOBBYERROR, SETLOBBYLOADING} from "./types"

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

function store(state = initialState, action) {
  switch (action.type) {
    case SETLOADING:
      return {...state, loading: action.payload}
    case SETERROR:
      return {...state, fatalError: action.payload}
    case SETSOCKET:
      return {...state, socket: action.payload}
    case SETLOBBYINFO:
      return {...state, lobby: {...state.lobby, ...action.payload}}
    case SETNAME:
      return {...state, name: action.payload}
    case SETLOBBYLOADING:
      return {...state, lobby: {...state.lobby, loading: action.payload}}
    case SETLOBBYERROR:
      return {...state, lobby: {...state.lobby, error: action.payload}}
    default:
      return state
  }
}

export default store
