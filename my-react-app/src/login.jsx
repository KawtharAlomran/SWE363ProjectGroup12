import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {getchairmanUsers,getFacltyUsers,getCommitteeUsers} from './data';
//import'./styles/ManageCourses.css';




export default function Login() {
  let chairman=getchairmanUsers();

  let faclty=getFacltyUsers();

  let committee=getCommitteeUsers();

  const [user, setUsername]=useState ("");
  const [password, setPassword]=useState ("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const isChairman = chairman.find(u => u.username === user && u.pass === password);
    const isFaculty = faclty.find(u => u.username === user && u.pass === password);
    const isCommittee = committee.find(u => u.username === user && u.pass === password);

    if(isChairman){
      navigate('/chairman/ics-courses');
    }
    else if (isCommittee){
      navigate('/committee/manage-terms');
    }
    else if (isFaculty){
      navigate('/faculty/offered-courses');
    }
    else {
      setError("Invalid username or password. Please try again.")
    }
    
      

  };



  return (
    <div className='box'>
      <h1>Welcome to Khuta System</h1>
      <h2>Please Sign In with your KFUPM Account</h2>
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