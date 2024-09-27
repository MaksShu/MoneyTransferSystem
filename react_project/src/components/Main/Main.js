import React from 'react'
import { Link } from 'react-router-dom'
import './main.scss'
import './mainResponsive.scss'


export default function Main() {
  return (
    <div className="welcome-container">
      <div className="welcome-text">
        <h1 className='welcome-text-h1'>WELCOME TO MT Wallet System!</h1>
      </div>
      <div className="reg-to-start-container">
        <h2 className="center">Login or Register to start:</h2>
        <div className="center">
          <Link className="reg-button" to="../login">Login</Link>
          <Link className="reg-button" to="../register">Register</Link>
        </div>
      </div>
    </div>
  )
}
