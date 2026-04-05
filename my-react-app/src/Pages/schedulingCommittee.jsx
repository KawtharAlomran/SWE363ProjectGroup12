let committee = [
  { name: "Hamdi Aljamimi",    email: "aljamimi@kfupm.edu.sa"  },
  { name: "Fatimah Al Tawfiq", email: "Tawfiq.f@kfupm.edu.sa"  },
  { name: "KAWTHAR ALOMRAN",   email: "Kalomran@kfupm.edu.sa"  },
  { name: "NOUR AL SULAIS",    email: "nours@kfupm.edu.sa"      },
  { name: "LAMA AL THUNAYYAN", email: "lama@kfupm.edu.sa"       },
];

export default function SchedulingCommittee() {
  return (
    <>
      <h2>Hello Dr. Malak 👋,</h2>
      <div className="course-card">
        <h3 style={{ margin: 0, display: 'inline' }}>Scheduling Committee members</h3>
        <button style={{ background: '#008767', color: 'white', margin: 10, borderRadius: 10 }}>
          Add new committee
        </button>
        <table>
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
                <td style={{ fontWeight: '500' }}>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  <button style={{ background: '#e11d48', color: 'white', borderRadius: 10 }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
