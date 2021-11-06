import { combineReducers, createStore, applyMiddleware } from 'redux'
import { compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import canvasReducer from './canvas-reducer'

let reducers = combineReducers({
  canvasPage: canvasReducer,
})

export type ReducerType = typeof reducers

export type AppStateType = ReturnType<ReducerType>

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  reducers,
  /* preloadedState, */ composeEnhancers(applyMiddleware(thunkMiddleware))
)

export default store
