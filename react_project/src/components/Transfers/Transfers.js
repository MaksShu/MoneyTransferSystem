import React from 'react'
import GetTransfers from '../GetTransfers/GetTransfers'
import './transfers.scss';
import './transfersResponsive.scss';

export default function Transfers() {
  return (
    <div className="transfers-container">
      <GetTransfers />
    </div>
  )
}
