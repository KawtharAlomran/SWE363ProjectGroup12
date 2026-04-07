import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



let chairman=[
  {username: "fatimah", pass: "11", name: "Fatimah Al Tawfiq"}
]

let faclty=[
  {username: "lama", pass: "22", name: "LAMA AL THUNAYYAN"}
]

let committee=[
  {username: "nour", pass: "12", name: "NOUR AL SULAIS"},
  {username: "kawthar", pass: "12", name: "KAWTHAR ALOMRAN"}
]

export default function Login() {

  const [user, setUsername]=useState ("");
  const [password, setPassword]=useState ("");
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const isChairman = chairman.find(u => u.username === user && u.pass === password);
    const isFaculty = faclty.find(u => u.username === user && u.pass === password);
    const isCommittee = committee.find(u => u.username === user && u.pass === password);

    if(isChairman){
      navigate('/chairman-home');
    }
    else if (isCommittee){
      navigate('/committee/manage-terms');
    }
    else if (isFaculty){
      navigate('/faculty/offered-courses');
    }
    
      

  };



  return (
    <>
      <h1>Welcome to Khuta System</h1>
      <h2>Please Sign In with your KFUPM Account</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" placeholder="Enter your kfupm username" onChange={(e) => setUsername(e.target.value)}/>

        <label htmlFor="pass">Password</label>
        <input type="password" name="pass" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>

        <input type="submit" value="Sign In" />
      </form>
    </>
  );
}