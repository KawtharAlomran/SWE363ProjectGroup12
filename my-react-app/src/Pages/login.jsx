import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/chairman-home');
  };

  return (
    <>
      <h1>Welcome to Khuta System</h1>
      <h2>Please Sign In with your KFUPM Account</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Enter your kfupm username" />

        <label htmlFor="pass">Password</label>
        <input type="password" name="pass" placeholder="Enter your password" />

        <input type="submit" value="Sign In" />
      </form>
    </>
  );
}