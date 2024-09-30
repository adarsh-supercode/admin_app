import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

export const getServerSideProps = async (context) => {
  const { req } = context;

  const token = req.cookies.token;
  if (token) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login = () => {
  const router = useRouter(); 
  const [message, setMessage] = useState('');

  const handleLoginSuccess = () => {
    router.push('/admin'); 
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm setMessage={setMessage} onLoginSuccess={handleLoginSuccess} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
