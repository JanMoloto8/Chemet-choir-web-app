import Home from './pages/Home.jsx'
import MainPage from './pages/MainPage.jsx'
import Absence from './pages/Absence.jsx';
import Attendance from './pages/Attendance.jsx';
import Rep from './pages/Rep.jsx';
import OnBoarding from './pages/OnBoarding.jsx';
import EventsCalendar from './pages/Events.jsx';
import {Routes,Route} from 'react-router-dom'

function App() {
  return(
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Main' element={<MainPage/>} />
      <Route path='/absence' element={<Absence/>} />
      <Route path='/rep' element={<Rep/>} />
      <Route path='/events' element={<EventsCalendar/>} />
      <Route path='/attend' element={<Attendance/>} />
      <Route path='/onboarding' element={<OnBoarding/>} />
    </Routes>
    );
}

export default App
