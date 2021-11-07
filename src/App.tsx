import React from 'react'
import { connect } from 'react-redux'
import './App.css'
import { AppStateType } from './redux/store'
import CanvasMain from './components/canvas-container'
import ControlMenu from './components/control-container'
import SettingsForm from './components/settings-form-container'

type PropTypes = {
  showSettings: boolean
}
const App: React.FC<PropTypes> = (props) => {
  return (
    <div className='App'>
      <div className='App-header'>
        <h1>Calc PIM</h1>
      </div>
      <div className='App-control'>
        <ControlMenu />
      </div>
      <div className='App-canvas'>
        <CanvasMain />
      </div>
      {props.showSettings && <SettingsForm />}
    </div>
  )
}

let mapStateToProps = (state: AppStateType) => ({
  showSettings: state.canvasPage.showSettings,
})

export default connect(mapStateToProps)(App)
