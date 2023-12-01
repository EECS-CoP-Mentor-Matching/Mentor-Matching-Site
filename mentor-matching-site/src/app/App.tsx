import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login/Login';
// import MenteePortal from './menteePortal/MenteePortal';
import TopNav from './nav/TopNav';
import SideNav from './nav/SideNav';
import CreateAccount from './login/CreateAccount';
import MenteePortal from './menteePortal/MenteePortal';
import UserProfile from './userProfile/UserProfile';

function App() {
  return (
    <div className="App">
      <div>
        <TopNav />
        <SideNav />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element = {<Login />}/>
          <Route path='/create-account' element = {<CreateAccount />}/>
          <Route path='/mentee-portal' element = {<MenteePortal />}/>
          <Route path='/profile' element = {<UserProfile />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
