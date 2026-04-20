import React from 'react';
import smcLogo from '../../assets/smc_logo.png';

const SMCLogo = ({ height = '42px' }) => (
  <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img src={smcLogo} alt="SMC Logo" style={{ height, width: 'auto', objectFit: 'contain' }} />
  </a>
);

export default SMCLogo;
