import Home from './pages/Home.jsx'
import MainPage from './pages/MainPage.jsx'
import Absence from './pages/Absence.jsx';
import Rep from './pages/Rep.jsx';
import {Routes,Route} from 'react-router-dom'

function App() {
  return(
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Main' element={<MainPage/>} />
      <Route path='/absence' element={<Absence/>} />
      <Route path='/rep' element={<Rep/>} />
    </Routes>
    );
}

export default App
