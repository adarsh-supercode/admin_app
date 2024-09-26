// pages/login.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const isLoggedIn = typeof window !== "undefined" && sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push('/admin'); 
    }
  }, [router]);

  return (
    <div>
      <h1>Login</h1>
      <LoginForm setMessage={setMessage} />
      {message && <p>{message}</p>} {/* Display the message */}
    </div>
  );
};

export default Login;
