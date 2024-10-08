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
import Chat from './components/Chat/Chat'
import { Route, Routes } from 'react-router-dom';
import './style.scss';
import Transfers from './components/Transfers/Transfers';
import MakeTransfer from './components/MakeTransfer/MakeTransfer';
import Deposit from './components/Deposit/Deposit';
import PageNotFound from './components/PageNotFound/PageNotFound';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
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
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
