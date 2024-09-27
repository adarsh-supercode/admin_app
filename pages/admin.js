// pages/admin.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 
import jwt from 'jsonwebtoken';

export const getServerSideProps = async (context) => {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    // If there's no token, redirect to the login page
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      props: { user: decoded }, 
    };
  } catch (error) {
    // If token verification fails, redirect to the login page
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

const AdminPanel = ({ user }) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token'); 
    if (!token) {
      router.push('/login'); 
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Admin Panel</h1>
      <p>Hello, {user.username}</p>
      {/* Admin panel content goes here */}
    </div>
  );
};

export default AdminPanel;
