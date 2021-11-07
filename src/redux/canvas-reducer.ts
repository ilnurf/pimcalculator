import { SettingsFormDataType } from '../components/settings-form'
import { Dispatch } from 'redux'
import { FORM_ERROR } from 'final-form'

const ADD_LOCATION = 'ADD_LOCATION'
const SET_FREQ = 'SET_FREQ'
const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
const SHOW_SETTINGS_FORM = 'SHOW_SETTINGS_FORM'

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
  opacity: number
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

export type LineGraphType = {
  xy: Array<{ x: number; y: number }>
  color: string
  opacity: number
}

let initialState = {
  limits: {
    xMin: 1600,
    xMax: 2000,
    yMin: 0,
    yMax: 150,
    paddingX: 50,
    paddingY: 40,
    shiftX: 0,
    shiftY: 0,
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
      x: 1710,
      y: 0,
      width: 75,
      height: 150,
      borderColor: 'blue',
      color: 'orange',
      opacity: 0.4,
    },
    {
      x: 1805,
      y: 0,
      width: 75,
      height: 150,
      borderColor: 'blue',
      color: 'orange',
      opacity: 0.4,
    },
  ] as Array<RectangleType>,
  lineGraphs: [] as Array<LineGraphType>,
  freqOne: {
    f0: 1805,
    f1: 1820,
  } as FreqDataType,
  freqTwo: {
    f0: 1835,
    f1: 1850,
  } as FreqDataType,
  duplex: -95,
  freqBandMin: 1805,
  freqBandMax: 1880,
  showSettings: false,
}
export type CanvasStateType = typeof initialState

const readSavedData = (initialState: CanvasStateType) => {
  let n = localStorage.getItem('duplex')
  if (n) initialState.duplex = Number(n)
  n = localStorage.getItem('freqBandMin')
  if (n) initialState.freqBandMin = Number(n)
  n = localStorage.getItem('freqBandMax')
  if (n) initialState.freqBandMax = Number(n)
  n = localStorage.getItem('fMin')
  if (n) initialState.limits.xMin = Number(n)
  n = localStorage.getItem('fMax')
  if (n) initialState.limits.xMax = Number(n)
  n = localStorage.getItem('freqOne0')
  if (n) initialState.freqOne.f0 = Number(n)
  n = localStorage.getItem('freqOne1')
  if (n) initialState.freqOne.f1 = Number(n)
  n = localStorage.getItem('freqTwo0')
  if (n) initialState.freqTwo.f0 = Number(n)
  n = localStorage.getItem('freqTwo1')
  if (n) initialState.freqTwo.f1 = Number(n)
  return initialState
}

const saveDuplex = (duplex: number) => {
  localStorage.setItem('duplex', duplex.toString())
}

const saveFreq = (freq: string, f0: number, f1: number) => {
  if (freq === 'one') {
    localStorage.setItem('freqOne0', f0.toString())
    localStorage.setItem('freqOne1', f1.toString())
  } else {
    localStorage.setItem('freqTwo0', f0.toString())
    localStorage.setItem('freqTwo1', f1.toString())
  }
}

const saveLimits = (fMin: number, fMax: number) => {
  localStorage.setItem('fMin', fMin.toString())
  localStorage.setItem('fMax', fMax.toString())
}

const saveFreqBand = (fMin: number, fMax: number) => {
  localStorage.setItem('freqBandMin', fMin.toString())
  localStorage.setItem('freqBandMax', fMax.toString())
}

initialState = readSavedData(initialState)

const reCalcAxis = (state: CanvasStateType): CanvasStateType => {
  let newState = { ...state }
  let dx =
    (state.limits.xMax - state.limits.xMin - state.limits.shiftX * 2) /
    state.axis.nx
  let x
  for (let i = 0; i <= state.axis.nx; i++) {
    x = state.limits.xMin + i * dx
    newState.axis.xvals[i] = x
    newState.axis.xlabels[i] = Math.round(x).toString()
  }
  return newState
}

const eleminateStrikes = (
  data: Array<{ x: number; y: number }>
): Array<{ x: number; y: number }> => {
  let newData: Array<{ x: number; y: number }> = new Array(data.length)
  for (let i = 0; i < data.length - 1; i = i + 2) {
    if (data[i].y > data[i + 1].y) {
      newData[i] = { x: data[i].x, y: data[i].y }
      newData[i + 1] = { x: data[i + 1].x, y: data[i].y }
    } else {
      newData[i] = { x: data[i].x, y: data[i + 1].y }
      newData[i + 1] = { x: data[i + 1].x, y: data[i + 1].y }
    }
  }
  newData[data.length - 1] = {
    x: data[data.length - 1].x,
    y: data[data.length - 1].y,
  }
  return newData
}

// const calcFreqPims = (
//   freqReqtangles: Array<RectangleType>,
//   freqOne: FreqDataType,
//   freqTwo: FreqDataType
// ): Array<RectangleType> => {
//   let rectangles: Array<RectangleType> = freqReqtangles.slice(0, 2)
//   let fmax = freqOne.f1 > freqTwo.f1 ? freqOne.f1 : freqTwo.f1
//   let fmin = freqOne.f0 < freqTwo.f0 ? freqOne.f0 : freqTwo.f0
//   rectangles.push({
//     x: 2 * fmin - fmax,
//     y: 0,
//     width: 2 * (fmax - fmin) - fmin + fmax,
//     height: 30,
//     borderColor: 'blue',
//     color: 'red',
//     opacity: 0.1,
//   })

//   rectangles.push({
//     x: 3 * fmin - 2 * fmax,
//     y: 0,
//     width: 3 * (fmax - fmin) - 2 * (fmin - fmax),
//     height: 5,
//     borderColor: 'blue',
//     color: 'orange',
//     opacity: 0.3,
//   })

//   return rectangles
// }

let funcAddPim3 = (f1: number, f2: number, data: any, num: number) => {
  let x
  x = Math.round(num * (2 * f1 - f2))
  data[x] === undefined ? (data[x] = 1) : (data[x] = data[x] + 1)
  x = Math.round(num * (2 * f2 - f1))
  data[x] === undefined ? (data[x] = 1) : (data[x] = data[x] + 1)
}

let funcAddPim5 = (f1: number, f2: number, data: any, num: number) => {
  let x
  x = Math.round(num * (3 * f1 - 2 * f2))
  data[x] === undefined ? (data[x] = 1) : (data[x] = data[x] + 1)
  x = Math.round(num * (3 * f2 - 2 * f1))
  data[x] === undefined ? (data[x] = 1) : (data[x] = data[x] + 1)
}

let calcPimFreqs = (
  freqOne: FreqDataType,
  freqTwo: FreqDataType,
  num: number,
  height: number,
  pimFunc: (f1: number, f2: number, data: any, num: number) => void
) => {
  let fmax = freqOne.f1 > freqTwo.f1 ? freqOne.f1 : freqTwo.f1
  let fmin = freqOne.f0 < freqTwo.f0 ? freqOne.f0 : freqTwo.f0
  let step = (fmax - fmin) / num

  let data: any = {}
  for (let i = freqOne.f0; i < freqOne.f1; i = i + step) {
    for (let j = freqTwo.f0; j < freqTwo.f1; j = j + step) {
      pimFunc(i, j, data, num)
    }
  }
  // inner band PIM
  for (let i = freqOne.f0; i < freqOne.f1; i = i + step) {
    for (let j = freqOne.f0; j < freqOne.f1; j = j + step) {
      pimFunc(i, j, data, num)
    }
  }
  for (let i = freqTwo.f0; i < freqTwo.f1; i = i + step) {
    for (let j = freqTwo.f0; j < freqTwo.f1; j = j + step) {
      pimFunc(i, j, data, num)
    }
  }
  let maxy = 0
  let data2: Array<{ x: number; y: number }>
  data2 = Object.keys(data).map((d: any) => {
    if (data[d] > maxy) maxy = data[d]
    return { x: d / num, y: data[d] }
  })
  data2.map((d) => (d.y = (d.y / maxy) * height))
  data2.sort((a, b) => {
    return a.x - b.x
  })

  return eleminateStrikes(data2)
}

const calcFreqPims2 = (
  freqOne: FreqDataType,
  freqTwo: FreqDataType,
  num: number
): Array<LineGraphType> => {
  let linegraphs: Array<LineGraphType> = []

  const height = 100
  let data2 = calcPimFreqs(freqOne, freqTwo, num, height, funcAddPim3)

  linegraphs.push({
    xy: data2,
    color: 'red',
    opacity: 0.5,
  })

  // console.log(data2)

  data2 = calcPimFreqs(freqOne, freqTwo, num, height / 4, funcAddPim5)

  linegraphs.push({
    xy: data2,
    color: 'black',
    opacity: 0.5,
  })
  return linegraphs
}

initialState = reCalcAxis(initialState)
// initialState.rectangles = calcFreqPims(
//   initialState.rectangles,
//   initialState.freqOne,
//   initialState.freqTwo
// )
initialState.lineGraphs = calcFreqPims2(
  initialState.freqOne,
  initialState.freqTwo,
  1000
)

const canvasReducer = (
  state = initialState,
  action:
    | AddLocationActionType
    | SetFreqActionType
    | ShowSettingsFromActionType
    | UpdateSettingsActionType
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
        saveFreq('one', newState.freqOne.f0, newState.freqOne.f1)
      } else {
        newState.freqTwo = { f0: action.f0, f1: action.f1 }
        if (action.f0 < 0) {
          newState.freqTwo.f0 = state.freqTwo.f0
        }
        if (action.f1 < 0) {
          newState.freqTwo.f1 = state.freqTwo.f1
        }
        saveFreq('two', newState.freqTwo.f0, newState.freqTwo.f1)
      }

      // newState.rectangles = calcFreqPims(
      //   newState.rectangles,
      //   newState.freqOne,
      //   newState.freqTwo
      // )
      newState.lineGraphs = calcFreqPims2(
        newState.freqOne,
        newState.freqTwo,
        1000
      )
      return newState

    case SHOW_SETTINGS_FORM:
      return { ...state, showSettings: action.show }
    case UPDATE_SETTINGS:
      newState = { ...state, showSettings: false }
      newState.limits = { ...state.limits }
      newState.limits.xMin = Number(action.data.freqMin)
      newState.limits.xMax = Number(action.data.freqMax)
      newState.freqBandMin = Number(action.data.freqBandTxMin)
      newState.freqBandMax = Number(action.data.freqBandTxMax)
      newState.duplex = Number(action.data.duplex)
      newState = reCalcAxis(newState)
      newState.rectangles = [...state.rectangles]
      newState.rectangles[0] = { ...state.rectangles[0] }
      newState.rectangles[1] = { ...state.rectangles[1] }
      newState.rectangles[1].x = newState.freqBandMin
      newState.rectangles[1].width = newState.freqBandMax - newState.freqBandMin
      newState.rectangles[0].x = newState.freqBandMin + newState.duplex
      newState.rectangles[0].width = newState.freqBandMax - newState.freqBandMin
      // save
      saveDuplex(newState.duplex)
      saveLimits(newState.limits.xMin, newState.limits.xMax)
      saveFreqBand(newState.freqBandMin, newState.freqBandMax)
      return newState
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
  if (f0new > f1new) {
    f0new = -1
    f1new = -1
  }
  return {
    type: SET_FREQ,
    freq,
    f0: f0new,
    f1: f1new,
  }
}

export type ShowSettingsFromActionType = {
  type: typeof SHOW_SETTINGS_FORM
  show: boolean
}

export const showSettingsFormAction = (
  show: boolean
): ShowSettingsFromActionType => ({
  type: SHOW_SETTINGS_FORM,
  show,
})

export type UpdateSettingsActionType = {
  type: typeof UPDATE_SETTINGS
  data: SettingsFormDataType
}

export const updateSettingsAction = (
  formData: SettingsFormDataType
): UpdateSettingsActionType => ({
  type: UPDATE_SETTINGS,
  data: formData,
})

export const showSettingsForm = (show: boolean) => {
  return (dispatch: Dispatch<ShowSettingsFromActionType>) => {
    dispatch(showSettingsFormAction(show))
  }
}

export const updateSettings = (formData: SettingsFormDataType) => {
  return (dispatch: Dispatch<UpdateSettingsActionType>) => {
    let errors: Array<string> = []
    if (formData.freqMax < formData.freqMin)
      errors.push('Freq min must be less then freq max')
    if (formData.freqBandTxMax < formData.freqBandTxMin)
      errors.push('FreqBand min must be less then freqBand max')
    if (formData.freqMax < formData.freqBandTxMax)
      errors.push('Freq max must be more then freqBand max')
    if (formData.freqMin > formData.freqBandTxMin)
      errors.push('Freq min must be less then freqBand min')
    if (
      Math.abs(formData.duplex) <
      formData.freqBandTxMax - formData.freqBandTxMin
    )
      errors.push('duplex must be more then span between freq max and freq min')
    if (errors.length > 0)
      return Promise.resolve({
        [FORM_ERROR]: errors,
      })
    dispatch(updateSettingsAction(formData))
  }
}

export default canvasReducer
