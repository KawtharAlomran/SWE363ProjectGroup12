import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



export default function Login() {
  const [user, setUsername] = useState(""); // This will be the email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`http://localhost:5174/api/faculty/${user}`);
      
      if (!response.ok) {
        throw new Error("Invalid username or password. Please try again.");
      }

      const facultyMember = await response.json();

      if (facultyMember.pass === password) {
        sessionStorage.setItem('UserName', facultyMember.name);
        sessionStorage.setItem('UserRole', facultyMember.role);

        if (facultyMember.role === 'chairman') {
          navigate('/chairman/ics-courses');
        } else if (facultyMember.role === 'faculty') {
          navigate('/faculty/offered-courses');
        } else if (facultyMember.role === 'committee')  {
          navigate('/committee/manage-terms');
        }
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Check your KFUPM username/email.");
    }
  };

  return (
    <div className='box'>
      <h1>Welcome to Khuta System</h1>
      <h2>Please Sign In with your KFUPM Account</h2>
      
      {/* form for getting the username and password from the user  */}
      <form className='login' onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Enter your kfupm username" onChange={(e) => {
            setUsername(e.target.value);
            if(error) setError("");
          }}/>

        <label htmlFor="pass">Password</label>
        <input type="password" name="pass" placeholder="Enter your password" onChange={(e) => {
            setPassword(e.target.value);
            if(error) setError("");
          }}/>

        <input className='addBtn' type="submit" value="Sign In" />
        {error && <p className='error'>{error}</p>}
      </form>
    </div>
  );
}