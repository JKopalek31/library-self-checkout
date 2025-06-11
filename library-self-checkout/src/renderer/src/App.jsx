import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div>Cheese saya yo</div>
      <Versions></Versions>
    </>
  )
}

export default App
