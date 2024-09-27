// components/LoginForm.js

import { useState } from 'react';
import { useRouter } from 'next/router'; 
import Cookies from 'js-cookie'; // Add this for cookie management

const LoginForm = ({ setMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'login', username, password }),
    });
    
    const data = await res.json();
    setMessage(data.message); 

    if (res.ok) {
      // Store the JWT token in cookies
      Cookies.set('token', data.token, { expires: 7 }); 

      // Store login state in sessionStorage
      sessionStorage.setItem('isLoggedIn', true);
      sessionStorage.setItem('username', username);
      
      // Redirect to the admin page after successful login
      router.push('/admin');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
