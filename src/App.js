import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/SignUp';
import Dashboard from './components/Dashboard';
import Batch from './components/Batch';
import Students from './components/Students';
import Mentors from './components/Mentors';
import Events from './components/Events';
import EventsEdit from './components/EventsEdit';
import StudentsEdit from './components/StudentsEdit';
import BatchEdit from './components/BatchEdit';
import MentorsEdit from './components/MentorsEdit';


export const URL = "http://localhost:12000"
export const token = sessionStorage.getItem('token');

function App() {

  return (
    <Routes>

      <Route exact path="/" element={<Signin/>}/>

      <Route path="/register" element={<Signup/>}/>

      <Route path="/dashboard" element={<Dashboard/>}/>

      <Route path='/event' element={<Events />} />

      <Route path='/edit/events/:id' element={<EventsEdit />}/>

      <Route path='/batch' element={<Batch />} />

      <Route path='/edit/batch/:id' element={<BatchEdit />} />

      <Route path='/student' element={<Students />} />

      <Route path='edit/student/:id' element={<StudentsEdit />} />
      
      <Route path='/mentors' element={<Mentors />} />

      <Route path='/edit/mentor/:id' element={<MentorsEdit />} />

    </Routes>
  );
}

export default App;
