import { isAuthenticated } from '../utils/auth';

export const getServerSideProps = async (context) => {
  const { req } = context;

  if (isAuthenticated(req)) {
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

  return (
    <div>
      <h1>Login</h1>
      <LoginForm setMessage={setMessage} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
