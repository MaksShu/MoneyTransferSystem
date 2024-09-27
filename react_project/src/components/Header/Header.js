import React from 'react'
import UserImg from '../../images/user_icon.svg'
import WalletImg from '../../images/wallet2.svg'
import UsersImg from '../../images/users.svg'
import { Link } from 'react-router-dom'
import './header.scss'
import './headerResponsive.scss'

import UserMenu from '../UserMenu/UserMenu'

export default function Header() {
    return (
        <header className="header-menu">
            <nav className="header-nav">
                <Link className="nav-a" to={"../wallets"}>Wallets<img className="nav-a-img" src={WalletImg} alt="Wallets icon" width="20" height="20" /></Link>
                <Link className="nav-a" to={"../users"}>Users<img className="nav-a-img" src={UsersImg} alt="Users icon" width="20" height="20" /></Link>
            </nav>

            <div className="user-icon-div">
                <img className="user-icon" src={UserImg} alt="User icon" />
                <ul className="dropdown-menu">
                    <li className="dropdown-menu-li"><Link to="../">Main</Link></li>
                    <UserMenu />
                </ul>
            </div>
        </header>
    )
}
