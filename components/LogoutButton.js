// components/LogoutButton.js

import { useState } from 'react';
import styles from '../styles/AdminPanel.module.css';

const LogoutButton = ({ onLogoutSuccess, setMessage }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const res = await fetch('/api/logout', {
      method: 'POST',
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      onLogoutSuccess(); // This could be a redirect or any other action after successful logout
    }

    setLoading(false);
  };

  return (
    <button className={styles.logOutBtn} onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;

