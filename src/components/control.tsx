import React from 'react'
import s from './control.module.css'
import {
  FreqType,
  SetFreqActionType,
  FreqDataType,
} from '../redux/canvas-reducer'

type PropTypes = {
  freqOne: FreqDataType
  freqTwo: FreqDataType
  duplex: number
  setFrequency: (freq: FreqType, f0: string, f1: string) => SetFreqActionType
  showSettingsForm: (show: boolean) => void
}

const ControlMenu: React.FC<PropTypes> = (props) => {
  let [freqStart0min, setFreqStart0min] = React.useState('')
  let [freqStart0max, setFreqStart0max] = React.useState('')
  let [freqStart1min, setFreqStart1min] = React.useState('')
  let [freqStart1max, setFreqStart1max] = React.useState('')

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.setFrequency('one', freqStart0min, freqStart0max)
      props.setFrequency('two', freqStart1min, freqStart1max)
    }
  }

  React.useEffect(() => {
    setFreqStart0min(props.freqOne.f0.toString())
    setFreqStart0max(props.freqOne.f1.toString())
    setFreqStart1min(props.freqTwo.f0.toString())
    setFreqStart1max(props.freqTwo.f1.toString())
  }, [props.freqOne, props.freqTwo, props.duplex])

  return (
    <div>
      <div className={s.divField}>
        <label className={s.labelField}>f1 min:</label>
        <input
          type='text'
          value={freqStart0min}
          onChange={(e) => setFreqStart0min(e.target.value)}
          onKeyDown={onKeyDown}
          className={s.inputField}
        />
        <span className={s.labelField}>MHz</span>
      </div>
      <div className={s.divField}>
        <label className={s.labelField}>f1 max:</label>
        <input
          type='text'
          value={freqStart0max}
          onChange={(e) => setFreqStart0max(e.target.value)}
          onKeyDown={onKeyDown}
          className={s.inputField}
        />
        <span className={s.labelField}>MHz</span>
      </div>
      <div className={s.divField}>
        <label className={s.labelField}>f2 min:</label>
        <input
          type='text'
          value={freqStart1min}
          onChange={(e) => setFreqStart1min(e.target.value)}
          onKeyDown={onKeyDown}
          className={s.inputField}
        />
        <span className={s.labelField}>MHz</span>
      </div>
      <div className={s.divField}>
        <label className={s.labelField}>f2 max:</label>
        <input
          type='text'
          value={freqStart1max}
          onChange={(e) => setFreqStart1max(e.target.value)}
          onKeyDown={onKeyDown}
          className={s.inputField}
        />
        <span className={s.labelField}>MHz</span>
      </div>
      <button className={s.btn} onClick={() => props.showSettingsForm(true)}>
        Settings
      </button>
    </div>
  )
}

export default ControlMenu
