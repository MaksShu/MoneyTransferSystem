import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import Users from './components/Users/Users'
import Wallets from './components/Wallets/Wallets'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Change from './components/Change/Change'
import { Route, Routes } from 'react-router-dom';
import './style.scss';
import Transfers from './components/Transfers/Transfers';
import MakeTransfer from './components/MakeTransfer/MakeTransfer';
import Deposit from './components/Deposit/Deposit';


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/users" element={<Users />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change" element={<Change />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/make-transfer" element={<MakeTransfer />} />
        <Route path="/deposit" element={<Deposit />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
