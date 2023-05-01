import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Main from './components/Main'
import Users from './components/Users'
import Wallets from './components/Wallets'
import Login from './components/Login'
import Register from './components/Register'
import Change from './components/Change'
import { Route, Routes } from 'react-router-dom';



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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
