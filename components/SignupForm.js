// components/SignupForm.js

import { useState } from 'react';
import { useRouter } from 'next/router'; 

const SignupForm = ({ setMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'signup', username, password }),
    });
    
    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      // Redirect to the login page after successful signup
      router.push('/login');
    }
  };

  return (
    <form onSubmit={handleSignup}>
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
