import React from 'react'
import '../style.scss'
import '../responsive.scss'
import GetUsers from './GetUsers'

export default function Users() {
    return (
        <div className="users-container">
            <GetUsers />
        </div>
    )
}
