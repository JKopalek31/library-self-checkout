import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import TitlePage from './pages/TitlePage'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <TitlePage/>
      <Versions></Versions>
    </>
  )
}

export default App
