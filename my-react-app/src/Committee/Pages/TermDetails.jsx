import '../../styles/ManageTerms.css';

const COURSES = [
  { id: 1, code: 'ICS 104', maleDemand: 70,  femaleDemand: 65, hasLab: true,  maleLec: 4, maleLab: 4, femaleLec: 3, femaleLab: 3 },
  { id: 2, code: 'ICS 350', maleDemand: 7,   femaleDemand: 0,  hasLab: false, maleLec: 1, maleLab: 0, femaleLec: 0, femaleLab: 0 },
  { id: 3, code: 'ICS 399', maleDemand: 52,  femaleDemand: 50, hasLab: false, maleLec: 1, maleLab: 0, femaleLec: 1, femaleLab: 0 },
  { id: 4, code: 'SWE 399', maleDemand: 51,  femaleDemand: 49, hasLab: false, maleLec: 1, maleLab: 0, femaleLec: 1, femaleLab: 0 },
];

export default function TermDetails({ term, onBack }) {
  return (
    <>

      <div className="mt-card">

        <h3 className="mt-title" style={{ marginBottom: 4 }}>All Offered Courses</h3>
        <div className="td-term-badge">Term {term?.name?.replace('Academic Terms ', '') ?? ''}</div>
      <div className='an-table-wrap'>
        <table className="an-table textCenter " style={{ marginTop: 24 }}>
          <thead>
            <tr>
              <th>Course number</th>
              <th>Student Demand</th>
              <th>Number of sections</th>
            </tr>
          </thead>
          <tbody>
            {COURSES.map(course => (
              <tr key={course.id}>
                <td><span className="an-course-name">{course.code}</span></td>
                <td>
                  <div className="an-demand">
                    Male: {course.maleDemand}<br />
                    Female: {course.femaleDemand}
                  </div>
                </td>
                <td>
                  <div className="an-sections">
                    <div className="an-section-row">
                      <span>Male:</span>
                      <select className="an-select" defaultValue={course.maleLec}>
                        {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                      {course.hasLab && (
                        <>
                          <span>, Lab</span>
                          <select className="an-select" defaultValue={course.maleLab}>
                            {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                          </select>
                        </>
                      )}
                    </div>
                    <div className="an-section-row">
                      <span>Female:</span>
                      <select className="an-select" defaultValue={course.femaleLec}>
                        {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                      </select>
                      {course.hasLab && (
                        <>
                          <span>, Lab</span>
                          <select className="an-select" defaultValue={course.femaleLab}>
                            {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

      </div>
    </>
  );
}