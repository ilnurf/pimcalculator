import { connect } from 'react-redux'
import SettingsForm, { SettingsFormDataType } from './settings-form'
import { AppStateType } from '../redux/store'
import { updateSettings, showSettingsForm } from '../redux/canvas-reducer'

let mapStateToProps = (state: AppStateType) => ({
  duplex: state.canvasPage.duplex,
  freqMax: state.canvasPage.limits.xMax,
  freqMin: state.canvasPage.limits.xMin,
  freqBandTxMin: state.canvasPage.freqBandMin,
  freqBandTxMax: state.canvasPage.freqBandMax,
})

type MapStateToPropsType = {
  duplex: number
  freqMax: number
  freqMin: number
  freqBandTxMin: number
  freqBandTxMax: number
}

type MapDispatchPropsType = {
  updateSettings: (formData: SettingsFormDataType) => void
  showSettingsForm: (show: boolean) => void
}

type MapOwnStateToPropsType = {}

export default connect<
  MapStateToPropsType,
  MapDispatchPropsType,
  MapOwnStateToPropsType,
  AppStateType
>(mapStateToProps, {
  updateSettings,
  showSettingsForm,
})(SettingsForm)
