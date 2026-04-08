let chairmanUsers=[
  {username: "fatimah", pass: "11", name: "Fatimah Al Tawfiq"}
]

let facltyUsers=[
  {username: "lama", pass: "22", name: "LAMA AL THUNAYYAN"}
]

let committeeUsers=[
  {username: "nour", pass: "12", name: "NOUR AL SULAIS"},
  {username: "kawthar", pass: "12", name: "KAWTHAR ALOMRAN"}
]


let coursesList= [
    { code: "ICS 104", name: "Intro. to Prog. in Python & C", credit:3, description: "Overview of computer hardware and software. Programming in Python with emphasis on basic program constructs: variables, assignments, expressions, decision structures, looping, functions, lists, files and exceptions; Introduction to objects and classes. Programming in C with emphasis on pointers and functions with output parameters. Simple multidisciplinary problem solving in science, engineering and business." },
    { code: "ICS 108", name: "Object-Oriented Programming", credit:4, description: "Advanced object-oriented programming; Inheritance; Polymorphism; Abstract classes and interfaces; Generic and collection classes; File input and output; Exception handling; GUI and event-driven programming; Recursion; Searching and sorting."},
    { code: "ICS 202", name: "Data Structures and Algorithms", credit:4, description: "Review of object-oriented concepts; Basic algorithms analysis; Fundamental data structures - implementation strategies for stacks, queues and linked lists; Recursion; Implementation strategies for tree and graph algorithms; Greedy Algorithms; Hash tables; Applications of data structures (e.g. data compression and string matching)." },
    { code: "ICS 253", name: "Discrete Structures", credit:3, description: "Propositional Logic, Propositional Equivalence, Predicates and Quantifiers, Nested Quantifiers, Rules of Inference, Introduction to Proofs; Sets, Set Operations, Functions, Sequences and Summations; Mathematical Induction, Strong Induction, Recursive Definitions and Structural Induction; Basics of Counting, Pigeonhole Principle, Permutations and Combinations, Binomial Coefficients, Discrete Probability, Probability Theory; Recurrence Relations, Solving Linear Recurrence Relations, Generating Functions, Inclusion-Exclusion." },
    { code: "ICS 321", name: "Database Systems", credit:3, description: "Basic database concepts; Conceptual data modeling; Relational data model; Relational theory and languages; Database design; SQL; Introduction to query processing and optimization; Introduction to concurrency and recovery." },
    { code: "ICS 343", name: "Fund. of Computer Networks", credit:4, description: "Introduction to computer networks and layered architectures: Connectivity, topology, circuit and packet switching, TCP/IP and ISO models; Application layer: model, DNS, SMTP, FTP, mm; Transport layer: TCP and UDP, ARQ, congestion and flow control; Network layer: Internetworking, addressing and routing algorithms and protocols; Data link layer: Framing, error detection and correction, medium access control and LANs; Physical layer: Principles of data communications, circuit switching, encoding, multiplexing and transmission media; Principles of network security: Cryptography, message security, user authentication, security protocols, firewalls and VPNs" },
    { code: "ICS 344", name: "Information Security", credit:3, description: "Security properties; Confidentiality, integrity, authentication, non-repudiation; Attack vectors, malicious software and countermeasures; Risk management and analysis; Security mechanisms; Secure software development; Defensive programming; Input sanitization; Symmetric and public-key cryptography; User authentication and access control; Internet security: Email and web security, network security protocols and standards such as IPSec and SSL/TLS; Security technologies and systems: Firewalls, VPNs and IDSs/IPSs; Information security process, ethical and legal issues." },
    { code: "ICS 353", name: "Design/Analysis of Algorithms", credit:3, description: "Basic algorithmic analysis; Analysis of iterative and recursive algorithms; Advanced algorithmic design techniques (induction, divide and conquer, dynamic programming, backtracking); The complexity classes P and NP; Basic computability; Parallel algorithms." },
    { code: "ICS 381", name: "Principles of Artificial Intelligence", credit:3, description: "AI history and applications; Intelligent agents and expert systems; Introduction to AI programming; Problem solving agents by uninformed, heuristic and local search; Constraint satisfaction and programming, games and adversarial search; Knowledge-based agents: Propositional and first-order logic, Forward and backward chaining and inference; Planning and reasoning in uncertain situations; Basics of machine learning; Natural language processing; Exposure to other applications of AI (e.g. Vision and Robotics)"},
    { code: "ICS 410", name: "Programming Languages", credit:3, description: "Programming paradigms: Object-oriented, imperative, functional, and logic; Application development in these paradigms; Fundamentals of Language Design: Syntax and semantics; Language implementation: virtual machines; Compilation, interpretation, and hybrid."}
  ];

let terms=[
    { id: 1, name: 'Academic Terms 261', year: 2026 },
    { id: 2, name: 'Academic Terms 253', year: 2025 },
    { id: 3, name: 'Academic Terms 252', year: 2024 },
    { id: 4, name: 'Academic Terms 251', year: 2023 },
    { id: 5, name: 'Academic Terms 242', year: 2022 },
  ];

let offeredCourses=[
    {termNum:"261", courses:['ICS 104','ICS 202','ICS 253','ICS 343']},
    {termNum:"252", courses:['ICS 104',"ICS 108",'ICS 202','ICS 253','ICS 321','ICS 343']}
];

let committee=[
    {name: "Hamdi Aljamimi",email:"aljamimi@kfupm.edu.sa"},
    {name: "Fatimah Al Tawfiq",email:"Tawfiq.f@kfupm.edu.sa"},
    {name: "KAWTHAR ALOMRAN",email:"Kalomran@kfupm.edu.sa"},
    {name: "NOUR AL SULAIS",email:"nours@kfupm.edu.sa"},
    {name: "LAMA AL THUNAYYAN",email:"lama@kfupm.edu.sa"}
];

let faculty=[
    {name: "Hamdi Aljamimi",email:"aljamimi@kfupm.edu.sa", level:"Associate Professor"},
    {name: "Mufti Mahmud",email:"mufti.mahmud@kfupm.edu.sa", level:"Professor"},
    {name: "Tarek Helmy El-Bassuny",email:"helmy@kfupm.edu.sa", level:"Professor"},
    {name: "Mohammad Rabah Alshayeb",email:"alshayeb@kfupm.edu.sa", level:"Professor"},
    {name: "Mahmood Khan Niazi",email:"mkniazi@kfupm.edu.sa", level:"Professor"},
    {name: "Mohammed Balah",email:" mbalah@kfupm.edu.sa", level:"Instructor"},
    {name: "Alawi Alsaggaf",email:"alawi@kfupm.edu.sa", level:"Senior Lecturer"},
    {name: "Mohammed Aslam",email:"mwaslam@kfupm.edu.sa", level:"Lecturer"},
    {name: "Rashad Othman",email:"rashad.othman@kfupm.edu.sa", level:"Senior Lecturer"},
    {name: "Yahya Garout",email:"garout@kfupm.edu.sa", level:"Lecturer"},
    {name: "Nuha Albadi",email:"nuha.badi@kfupm.edu.sa", level:"Assistant Professor"},
    {name: "Putu Raharja",email:"raharja@kfupm.edu.sa", level:"Lecturer"},
    {name: "Hani Almohair",email:"hanik@kfupm.edu.sa", level:"Senior Lecturer"},
    {name: "Fakhri Khan",email:"fakhri.khan@kfupm.edu.sa", level:"Associate Professor"},
    {name: "Waleed Al Gobi",email:"waleed.gobi@kfupm.edu.sa", level:"Assistant Professor"}
]

let instructorsPrefrences = [
  {
    id: 1, name: 'Mufti Mahmud',
    courses: [
      { id: 1, code: 'ICS 202', rank: 1, assigned: false },
      { id: 2, code: 'ICS 343', rank: 2, assigned: false  },
      { id: 3, code: 'ICS 344', rank: 3, assigned: false },
      { id: 4, code: 'ICS 353', rank: 4, assigned: false },
      { id: 5, code: 'ICS 108', rank: 5, assigned: false },
      { id: 6, code: 'ICS 104', rank: 6, assigned: false },
    ]
  },
  {
    id: 2, name: 'Tarek El-Bassuny',
    courses: [
      { id: 1, code: 'ICS 474', rank: 1, assigned: false  },
      { id: 2, code: 'ICS 343', rank: 2, assigned: false },
      { id: 3, code: 'ICS 344', rank: 3, assigned: false },
    ]
  },
  {
    id: 3, name: 'Mohammad Alshayeb',
    courses: [
      { id: 1, code: 'SWE 439', rank: 1, assigned: false },
      { id: 2, code: 'SWE 422', rank: 2, assigned: false },
    ]
  },
  {
    id: 4, name: 'Mahmood Niazi',
    courses: [
      { id: 1, code: 'SWE 455', rank: 1, assigned: false },
      { id: 2, code: 'SWE 439', rank: 2, assigned: false },
      { id: 3, code: 'SWE 463', rank: 3, assigned: false  },
      { id: 4, code: 'ICS 353', rank: 4, assigned: false },
    ]
  },
];

let coursePrefrences = [
  {
    id: 1, code: 'ICS 104',
    instructors: [
      { id: 1, name: 'Mohammed Balah',  rank: 1, assigned: false  },
      { id: 2, name: 'Mohammed Aslam',  rank: 1, assigned: false },
      { id: 3, name: 'Alawi Alsaggaf',  rank: 3, assigned: false  },
      { id: 4, name: 'Rashad Othman',   rank: 4, assigned: false },
      { id: 5, name: 'Mufti Mahmud',   rank: 6, assigned: false }
    ]
  },
  {
    id: 2, code: 'ICS 108',
    instructors: [
      { id: 1, name: 'Yahya Garout',  rank: 1, assigned: false  },
      { id: 2, name: 'Nuha Albadi',   rank: 3, assigned: false },
      { id: 3, name: 'Putu Raharja',  rank: 5, assigned: false },
      { id: 4, name: 'Rashad Othman', rank: 1, assigned: false  },
      { id: 5, name: 'Mufti Mahmud',  rank: 5, assigned: false }

    ]
  },
  {
    id: 3, code: 'ICS 343',
    instructors: [
      { id: 1, name: 'Hani Almohair', rank: 1, assigned: false },
      { id: 2, name: 'Mufti Mahmud',  rank: 2, assigned: false },
      { id: 3, name: 'Tarek El-Bassuny',  rank: 2, assigned: false }
    ]
  },
  {
    id: 4, code: 'ICS 344',
    instructors: [
      { id: 1, name: 'Fakhri Khan',    rank: 2, assigned: false  },
      { id: 2, name: 'Waleed Al Gobi', rank: 4, assigned: false },
      { id: 3, name: 'Mufti Mahmud',  rank: 3, assigned: false },
      { id: 4, name: 'Tarek El-Bassuny',  rank: 3, assigned: false }

    ]
  },
];
/*
let teachingHours=[
    {nemail:"aljamimi@kfupm.edu.sa", hours:},
    {email:"mufti.mahmud@kfupm.edu.sa", hours:},
    {email:"helmy@kfupm.edu.sa", hours:},
    {email:"alshayeb@kfupm.edu.sa", hours:},
    {email:"mkniazi@kfupm.edu.sa", hours:},
    {email:" mbalah@kfupm.edu.sa", hours:},
    {email:"alawi@kfupm.edu.sa", hours:},
    {email:"mwaslam@kfupm.edu.sa",hours:},
    {email:"rashad.othman@kfupm.edu.sa", hours:},
    {email:"garout@kfupm.edu.sa", hours:},
    {email:"nuha.badi@kfupm.edu.sa", hours:},
    {nemail:"raharja@kfupm.edu.sa", hours:},
    {email:"hanik@kfupm.edu.sa", hours:},
    {email:"fakhri.khan@kfupm.edu.sa", hours:},
    {email:"waleed.gobi@kfupm.edu.sa", hours:}
]
*/
/*
let assignedCourses=[
    {termNum:"261", courses:['ICS 104','ICS 202','ICS 253','ICS 343']},
    {termNum:"252", courses:['ICS 104',"ICS 108",'ICS 202','ICS 253','ICS 321','ICS 343']}
];
*/

// ----------- Getter functions -------------//

//      For Login      //
export function getchairmanUsers(){
    return chairmanUsers;
}
export function getFacltyUsers(){
    return facltyUsers;
}
export function getCommitteeUsers(){
    return committeeUsers;
}
// -------------------------------------//

export function getAllIcsCourses(){
    return coursesList;
}

export function getAllOfferedCourses(){
    return offeredCourses;
}

export function getAllTerms(){
    return terms;
}

export function getCommittee(){
    return committee;
}

export function getFaculty(){
    return faculty;
}

export function getInstructorsPrefrences(){
    return instructorsPrefrences;
}
export function getCoursePrefrences(){
    return coursePrefrences;
}

// ----------- Setesrs functions -------------//
export function setInstructorsPrefrences(updatedList) {
  instructorsPrefrences = updatedList;
}

export function setCoursePrefrences(updatedList) {
  coursePrefrences = updatedList;
}

// ----------- Add functions -------------//
export function addCommittee(newEmail){
    let info = faculty.find(f => f.email === newEmail);
    committee.push({ name: info.name, email: info.email });
    return [...committee];

}

export function addFaculty(newNAme, newEmail, newLevel){
    faculty.push({name:newNAme, email:newEmail, level:newLevel})
    return [...faculty];
}


export function addCourse(code, name, hours, description){
    coursesList.push({code:code,name:name, credit:hours, description:description})
}
/*
export function addTerm(code, name, hours){
    coursesList.push({code:code,name:name, credit:hours})
}
    */

// ----------- Deletion functions -------------//

export function deleteCommittee(email){
    committee = committee.filter(member => member.email !== email);
    return committee;
}

export function deleteFaculty(email){
    faculty = faculty.filter(faculty => faculty.email !== email);
    return faculty;
}

export function deleteCourse(code){
    coursesList = coursesList.filter(course => course.code !== code);
    return coursesList;
}
