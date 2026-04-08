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
    { code: "ICS 104", name: "Intro. to Prog. in Python & C", credit:3 },
    { code: "ICS 108", name: "Object-Oriented Programming", credit:4 },
    { code: "ICS 202", name: "Data Structures and Algorithms", credit:4 },
    { code: "ICS 253", name: "Discrete Structures", credit:3 },
    { code: "ICS 321", name: "Database Systems", credit:3 },
    { code: "ICS 343", name: "Fund. of Computer Networks", credit:4 },
    { code: "ICS 344", name: "Information Security", credit:3 },
    { code: "ICS 353", name: "Design/Analysis of Algorithms", credit:3 },
    { code: "ICS 381", name: "Principles of Artificial Intelligence", credit:3},
    { code: "ICS 410", name: "Programming Languages", credit:3}
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


export function addCourse(code, name, hours){
    coursesList.push({code:code,name:name, credit:hours})
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