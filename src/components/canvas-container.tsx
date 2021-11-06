import { connect } from 'react-redux'
import {
  LocationType,
  CircleType,
  RectangleType,
  addLocation,
  AddLocationActionType,
  LimitTypes,
  FreqDataType,
  AxisDataType,
  LineGraphType,
} from '../redux/canvas-reducer'
import CanvasMain from './canvas'
import { AppStateType } from '../redux/store'

let mapStateToProps = (state: AppStateType) => {
  return {
    limits: state.canvasPage.limits,
    axis: state.canvasPage.axis,
    locations: state.canvasPage.locations,
    circles: state.canvasPage.circles,
    rectangles: state.canvasPage.rectangles,
    lineGraphs: state.canvasPage.lineGraphs,
    freqOne: state.canvasPage.freqOne,
    freqTwo: state.canvasPage.freqTwo,
    duplex: state.canvasPage.duplex,
  }
}

type MapToStatePropsType = {
  limits: LimitTypes
  axis: AxisDataType
  locations: Array<LocationType>
  circles: Array<CircleType>
  rectangles: Array<RectangleType>
  lineGraphs: Array<LineGraphType>
  freqOne: FreqDataType
  freqTwo: FreqDataType
  duplex: number
}

type MapToDispatchPropsType = {
  addLocation: (location: LocationType) => AddLocationActionType
}

type MapOwnPropsType = {}

export default connect<
  MapToStatePropsType,
  MapToDispatchPropsType,
  MapOwnPropsType,
  AppStateType
>(mapStateToProps, { addLocation })(CanvasMain)
