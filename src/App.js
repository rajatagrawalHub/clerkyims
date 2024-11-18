import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { UserContextProvider } from './contexts/userContext';
import { DateProvider } from './contexts/dateContext';
import CompanyPage from './pages/CompanyPage';
import SelectModalWrapper from './Components/SelectModalWrapper';
import Sales from './pages/Sales';
import Purchase from './pages/Purchase';
import Report from './pages/Report';

function App() {
  return (
    <UserContextProvider>
      <DateProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element = {<Dashboard />}></Route>
            <Route path='/login' element = {<Login/>}></Route>
            <Route path='/createUser' element = {<Signup/>}></Route>
            <Route path='/create/Company' element = {<CompanyPage type='Create' />} ></Route>
            <Route path='/alter/Company' element = {<SelectModalWrapper type={'Alter'} />} ></Route>
            <Route path='/delete/Company' element = {<SelectModalWrapper type={'Delete'} />} ></Route>
            <Route path='/select/Company' element = {<SelectModalWrapper type={'Select'} />} ></Route>
            <Route path='/sales' element = {<Sales />} ></Route>
            <Route path='/purchase' element = {<Purchase />} ></Route>
            <Route path='/report' element = {<Report />} ></Route>
          </Routes>
        </BrowserRouter>
      </DateProvider>
    </UserContextProvider>
  );
}

export default App;
