import React from 'react'
import { connect } from 'react-redux'
import { AppStateType } from '../redux/store'
import CanvasControl from './control'

import {
  setFrequency,
  FreqType,
  SetFreqActionType,
  FreqDataType,
  SetFreqDuplexActionType,
  setFreqDuplex,
} from '../redux/canvas-reducer'

const mapStateToProps = (state: AppStateType) => ({
  freqOne: state.canvasPage.freqOne,
  freqTwo: state.canvasPage.freqTwo,
  duplex: state.canvasPage.duplex,
})

type MapStateToPropsType = {
  freqOne: FreqDataType
  freqTwo: FreqDataType
  duplex: number
}

type MapToDispatchPropsType = {
  setFrequency: (freq: FreqType, f0: string, f1: string) => SetFreqActionType
  setFreqDuplex: (duplex: string) => SetFreqDuplexActionType
}

type MapOwnToPropsType = {}

export default connect<
  MapStateToPropsType,
  MapToDispatchPropsType,
  MapOwnToPropsType,
  AppStateType
>(mapStateToProps, { setFrequency, setFreqDuplex })(CanvasControl)
