
import { useNavigate,NavLink } from 'react-router-dom';
import {getCommittee} from "../../data";
import '../../styles/ManageCourses.css';

//---Only button handeling is remaining---//

export default function SchedulingCommittee(){
  let committee=getCommittee();

    const navigate = useNavigate();
    return(
        <>
        <div className="container">
            <div className="header">
              <h2>Scheduling Committee members</h2>
              <button className="addBtn">Add new committee</button>
              </div>
              <table className="coursesTable">
                <thead>
                  <tr>
                    <th>Committee Name</th>
                    <th>Committee Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {committee.map((member) => (
                  <tr key={member.email}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td><button className="deleteBtn">Remove</button></td>
                  </tr>
                  ))}
                </tbody>
              </table>


        </div>
        </>
    )
}
