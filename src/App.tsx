import React from 'react'
import './App.css'
import CanvasMain from './components/canvas-container'
import ControlMenu from './components/control-container'

const App: React.FC = () => {
  return (
    <div className='App'>
      <div className='App-header'>
        <h1>Calc PIM</h1>
      </div>
      <div className='App-canvas'>
        <CanvasMain />
      </div>
      <div className='App-control'>
        <ControlMenu />
      </div>
    </div>
  )
}

export default App
