const ADD_LOCATION = 'ADD_LOCATION'
const SET_FREQ = 'SET_FREQ'
const SET_FREQ_DUPLEX = 'SET_FREQ_DUPLEX'

export type LimitTypes = {
  xMin: number
  xMax: number
  yMax: number
  yMin: number
  paddingX: number
  paddingY: number
  shiftX: number
  shiftY: number
}

export type LocationType = {
  x: number
  y: number
}

export type RectangleType = {
  x: number
  y: number
  width: number
  height: number
  borderColor: string | null
  color: string
}

export type CircleType = {
  x: number
  y: number
  radius: number
  borderColor: string | null
  color: string | null
}

export type FreqDataType = {
  f0: number
  f1: number
}

export type AxisDataType = {
  nx: number
  xvals: Array<number>
  xlabels: Array<string>
  fontColor: string
  fontSize: number
}

let initialState = {
  limits: {
    xMin: 0,
    xMax: 1000,
    yMin: 0,
    yMax: 700,
    paddingX: 20,
    paddingY: 20,
    shiftX: 50,
    shiftY: 50,
  } as LimitTypes,
  axis: {
    nx: 10,
    xvals: [] as Array<number>,
    xlabels: [] as Array<string>,
    fontColor: 'black',
    fontSize: 20,
  } as AxisDataType,
  locations: [
    {
      x: 10,
      y: 30,
    },
    {
      x: 50,
      y: 90,
    },
  ] as Array<LocationType>,
  circles: [
    {
      x: 50,
      y: 50,
      radius: 10,
      borderColor: 'blue',
      color: 'red',
    },
    {
      x: 200,
      y: 100,
      radius: 20,
      borderColor: 'blue',
      color: 'green',
    },
    {
      x: 300,
      y: 150,
      radius: 20,
      borderColor: 'blue',
      color: 'yellow',
    },
    {
      x: 400,
      y: 50,
      radius: 10,
      borderColor: 'blue',
      color: 'brown',
    },
  ] as Array<CircleType>,
  rectangles: [
    {
      x: 0,
      y: 0,
      width: 800,
      height: 500,
      borderColor: 'blue',
      color: 'lightgreen',
    },
    {
      x: 200,
      y: 50,
      width: 500,
      height: 400,
      borderColor: 'blue',
      color: 'lightyellow',
    },
    {
      x: 100,
      y: 100,
      width: 50,
      height: 20,
      borderColor: 'blue',
      color: 'green',
    },
  ] as Array<RectangleType>,
  freqOne: {
    f0: 200,
    f1: 220,
  } as FreqDataType,
  freqTwo: {
    f0: 300,
    f1: 340,
  } as FreqDataType,
  duplex: 300,
}
export type CanvasStateType = typeof initialState

const reCalcAxis = (state: CanvasStateType): CanvasStateType => {
  let newState = { ...state }
  let dx =
    (state.limits.xMax - state.limits.xMin - state.limits.shiftX * 2) /
    state.axis.nx
  let x
  for (let i = 0; i <= state.axis.nx; i++) {
    x = state.limits.xMin + i * dx
    newState.axis.xvals[i] = x
    newState.axis.xlabels[i] = x.toString()
  }
  return newState
}

const calcFreqPims = (
  freqOne: FreqDataType,
  freqTwo: FreqDataType
): Array<RectangleType> => {
  let rectangles: Array<RectangleType> = []
  let fmax = freqOne.f1 > freqTwo.f1 ? freqOne.f1 : freqTwo.f1
  let fmin = freqOne.f0 < freqTwo.f0 ? freqOne.f0 : freqTwo.f0
  rectangles.push({
    x: 2 * fmin - fmax,
    y: 0,
    width: 2 * (fmax - fmin) - fmin + fmax,
    height: 200,
    borderColor: 'blue',
    color: 'lightyellow',
  })
  return rectangles
}

initialState = reCalcAxis(initialState)
initialState.rectangles = calcFreqPims(
  initialState.freqOne,
  initialState.freqTwo
)

const canvasReducer = (
  state = initialState,
  action: AddLocationActionType | SetFreqActionType | SetFreqDuplexActionType
): CanvasStateType => {
  let newState: CanvasStateType
  switch (action.type) {
    case ADD_LOCATION:
      return { ...state, locations: [...state.locations, action.location] }
    case SET_FREQ:
      newState = { ...state }
      if (action.freq === 'one') {
        newState.freqOne = { f0: action.f0, f1: action.f1 }
        if (action.f0 < 0) {
          newState.freqOne.f0 = state.freqOne.f0
        }
        if (action.f1 < 0) {
          newState.freqOne.f1 = state.freqOne.f1
        }
      } else {
        newState.freqTwo = { f0: action.f0, f1: action.f1 }
        if (action.f0 < 0) {
          newState.freqTwo.f0 = state.freqTwo.f0
        }
        if (action.f1 < 0) {
          newState.freqTwo.f1 = state.freqTwo.f1
        }
      }
      newState.rectangles = calcFreqPims(newState.freqOne, newState.freqTwo)
      return newState
    case SET_FREQ_DUPLEX:
      let d = action.duplex > 0 ? action.duplex : state.duplex
      return { ...state, duplex: d }
    default:
      return state
  }
}

export type AddLocationActionType = {
  type: typeof ADD_LOCATION
  location: LocationType
}

export const addLocation = (location: LocationType): AddLocationActionType => {
  return {
    type: ADD_LOCATION,
    location,
  }
}

export type FreqType = 'one' | 'two'

export type SetFreqActionType = {
  type: typeof SET_FREQ
  freq: FreqType
} & FreqDataType

export const setFrequency = (
  freq: FreqType,
  f0: string,
  f1: string
): SetFreqActionType => {
  let f0new
  let f1new
  f0new = Number(f0)
  if (isNaN(f0new)) f0new = -1
  f1new = Number(f1)
  if (isNaN(f1new)) f1new = -1

  return {
    type: SET_FREQ,
    freq,
    f0: f0new,
    f1: f1new,
  }
}

export type SetFreqDuplexActionType = {
  type: typeof SET_FREQ_DUPLEX
  duplex: number
}

export const setFreqDuplex = (duplex: string): SetFreqDuplexActionType => {
  let d = Number(duplex)
  if (isNaN(d)) {
    d = -1
  }
  return {
    type: SET_FREQ_DUPLEX,
    duplex: d,
  }
}

export default canvasReducer
