import React from 'react'
import './users.scss'
import './usersResponsive.scss'
import GetUsers from '../GetUsers/GetUsers'

export default function Users() {
    return (
        <div className="users-container">
            <GetUsers />
        </div>
    )
}
