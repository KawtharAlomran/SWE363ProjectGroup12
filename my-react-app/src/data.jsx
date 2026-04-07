import { useState } from 'react';


const [coursesList, setcourses] = useState([
    { code: "ICS 104", name: "Intro. to Prog. in Python & C" },
    { code: "ICS 108", name: "Object-Oriented Programming" },
    { code: "ICS 202", name: "Data Structures and Algorithms" },
    { code: "ICS 253", name: "Discrete Structures" },
    { code: "ICS 321", name: "Database Systems" },
    { code: "ICS 343", name: "Fund. of Computer Networks" },
    { code: "ICS 344", name: "Information Security" },
    { code: "ICS 353", name: "Design/Analysis of Algorithms" },
    { code: "ICS 381", name: "Principles of Artificial Intelligence"},
    { code: "ICS 410", name: "Programming Languages"}
  ]);

const [terms, setTerms] = useState([
    { id: 1, name: 'Academic Terms 261', year: 2026 },
    { id: 2, name: 'Academic Terms 253', year: 2025 },
    { id: 3, name: 'Academic Terms 252', year: 2024 },
    { id: 4, name: 'Academic Terms 251', year: 2023 },
    { id: 5, name: 'Academic Terms 242', year: 2022 },
  ]);

const [offeredCourses, setOfferedCourses] = useState([
    {termNum:"261", courses:['ICS 104','ICS 202','ICS 253','ICS 343']},
    {termNum:"252", courses:['ICS 104',"ICS 108",'ICS 202','ICS 253','ICS 321','ICS 343']}
]);

export function getAllIcsCourses(){
    return coursesList;
}

export function getAllOfferedCourses(){
    return offeredCourses;
}

export function getAllTerms(){
    return terms;
}