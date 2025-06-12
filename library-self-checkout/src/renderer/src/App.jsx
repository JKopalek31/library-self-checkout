import TitlePage from './pages/TitlePage/TitlePage'
import UserAuthenicationPage from './pages/UserAuthenticationPage/UserAuthenicationPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import SummaryPage from './pages/SummaryPage/SummaryPage';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// import { useHistory } from 'react-router-dom';



function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/auth-page" element={<UserAuthenicationPage />} />
        <Route path="/checkout-page" element={<CheckoutPage />}/>
        <Route path="/summary-page" element={<SummaryPage />}/>
      </Routes>
    </Router>
  )
}

export default App
