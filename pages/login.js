// pages/login.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('token');
    if (isLoggedIn) {
      router.push('/admin'); 
    }
  }, [router]);

  return (
    <div>
      <h1>Login</h1>
      <LoginForm setMessage={setMessage} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
