import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {getchairmanUsers,getFacltyUsers,getCommitteeUsers} from './data';




export default function Login() {
  // Load all nessesary information from shared data
  let chairman=getchairmanUsers();
  let faclty=getFacltyUsers();
  let committee=getCommitteeUsers();

  const [user, setUsername]=useState ("");
  const [password, setPassword]=useState ("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // handle clicking on Sign In button
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    
    // check if the username belongs to a chairman, committee, or a faculty
    const isChairman = chairman.find(u => u.username === user && u.pass === password);
    const isFaculty = faclty.find(u => u.username === user && u.pass === password);
    const isCommittee = committee.find(u => u.username === user && u.pass === password);
    
    // navigate the user to the correct home page based on its role
    if(isChairman){
      sessionStorage.setItem('UserName', isChairman.name);
      navigate('/chairman/ics-courses');
    }
    else if (isCommittee){
      sessionStorage.setItem('UserName', isCommittee.name);
      navigate('/committee/manage-terms');
    }
    else if (isFaculty){
      sessionStorage.setItem('UserName', isFaculty.name);
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