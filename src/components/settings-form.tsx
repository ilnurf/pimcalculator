import React from 'react'
import { Form, Field } from 'react-final-form'

import s from './settings.module.css'

// const required = (value: string) => (value ? undefined : 'Required')
const mustBeNumber = (value: number) =>
  isNaN(value) ? 'Must be a number' : undefined
// const minValue = (min) => (value) =>
//   isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
// const composeValidators =
//   (...validators) =>
//   (value) =>
//     validators.reduce(
//       (error, validator) => error || validator(value),
//       undefined
//     )

const fieldCreator = (
  name: string,
  label: string,
  type: string,
  placeholder: string,
  validator?: (value: any) => undefined | string
) => (
  <div key={name} className={s.formField}>
    <Field name={name} validate={validator}>
      {({ input, meta }) => (
        <div>
          <label className={s.formLabel}>{label}</label>
          <input
            {...input}
            type={type}
            placeholder={placeholder}
            className={s.formInput}
          />
          <label className={s.formLabel}>{placeholder}</label>
          {meta.error && meta.touched && (
            <span className={s.error}>{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  </div>
)

export type SettingsFormDataType = {
  duplex: number
  freqMax: number
  freqMin: number
  freqBandTxMin: number
  freqBandTxMax: number
}

type PropTypes = {
  duplex: number
  freqMax: number
  freqMin: number
  freqBandTxMin: number
  freqBandTxMax: number
  updateSettings: (formData: SettingsFormDataType) => void
  showSettingsForm: (show: boolean) => void
}

const SettingsForm: React.FC<PropTypes> = (props) => {
  return (
    <Form
      onSubmit={(formData: SettingsFormDataType) => {
        return props.updateSettings(formData)
      }}
      initialValues={{
        duplex: props.duplex,
        freqMin: props.freqMin,
        freqMax: props.freqMax,
        freqBandTxMin: props.freqBandTxMin,
        freqBandTxMax: props.freqBandTxMax,
      }}
      render={({ handleSubmit, pristine, form, submitting, submitError }) => (
        <div className={s.modal}>
          <form onSubmit={handleSubmit} className={s.settingsForm}>
            <h1>Settings</h1>
            {fieldCreator(
              'freqMin',
              'Freq min:',
              'number',
              'MHz',
              mustBeNumber
            )}
            {fieldCreator(
              'freqMax',
              'Freq max:',
              'number',
              'MHz',
              mustBeNumber
            )}
            <div className={s.bandFreq}>
              <div className={s.bandLabel}>Band pattern</div>
              {fieldCreator(
                'freqBandTxMin',
                'Freq TX min:',
                'number',
                'MHz',
                mustBeNumber
              )}
              {fieldCreator(
                'freqBandTxMax',
                'Freq TX max:',
                'number',
                'MHz',
                mustBeNumber
              )}

              {fieldCreator(
                'duplex',
                'Freq Duplex RX/TX:',
                'number',
                'MHz',
                mustBeNumber
              )}
            </div>
            {submitError &&
              submitError.map((e: string, k: number) => (
                <div className={s.error} key={k}>
                  {e}
                </div>
              ))}
            <div>
              <button type='submit' className={s.btnsend}>
                Update settings
              </button>
              <button
                type='button'
                onClick={() => form.reset()}
                disabled={submitting || pristine}
                className={s.btnsend}
              >
                Reset
              </button>
              <button
                type='button'
                onClick={() => props.showSettingsForm(false)}
                className={s.btnsend}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    />
  )
}

export default SettingsForm
