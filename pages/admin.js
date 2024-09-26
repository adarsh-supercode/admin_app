// pages/admin.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AdminPanel = () => {
  const [username, setUsername] = useState('Guest');
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const isLoggedIn = typeof window !== "undefined" && sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push('/login');
    } else {
      // Set username if logged in
      setUsername(sessionStorage.getItem('username') || 'Guest');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear login state from sessionStorage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username'); 
    router.push('/login');
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel, {username}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPanel;
