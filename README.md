# Khuta System — Developer Guide

## Project Overview

Khuta is a course scheduling management system for KFUPM built with React. The system supports multiple user roles: **Chairman**, **Committee**, and **Faculty**.
The Khuta project aims to replace the manual, repetitive process of collecting instructors' teaching preferences in the ICS department at KFUPM with a centralized web-based platform. Khuta automates the process by allowing instructors to submit preferences online and enabling committee members to review submissions, analyze course demand, determine required sections, and assign courses efficiently. The system provides visibility into enrollment numbers and instructor preferences, supporting fairer distribution of teaching loads. Key benefits include reduced administrative workload, improved efficiency, and enhanced transparency for faculty, the scheduling committee, and the department chairman.

---

## Project Structure

```
Khuta/
└── src/
    ├── Chairman/
    │   ├── layout/
    │   │   └── ChairmanLayout.jsx   ← Layout wrapper with sidebar/nav for Chairman role
    │   └── Pages/
    │       ├── ChairmanHomePage.jsx      ← View offered courses
    │       ├── icsFaculty.jsx            ← View/manage ICS faculty members
    │       ├── schedulingCommittee.jsx   ← View/manage scheduling committee members
    │       └── teachingLoad.jsx          ← View faculty teaching loads
    ├── Committee/
    │   ├── layout/
    │   │   └── CommitteeLayout.jsx       ← Layout wrapper for Scheduling Committee role
    │   └── Pages/
    │       ├── AddNewTerm.jsx        ← Form to create a new academic term
    │       ├── AssignCourses.jsx     ← Assign courses to faculty for a term
    │       ├── ByCourse.jsx          ← View faculty prefrences grouped by course
    │       ├── ByInstructor.jsx      ← View faculty prefrences grouped by instructor
    │       ├── ManageCourses.jsx     ← View/manage all ICS courses
    │       ├── ManageTerms.jsx       ← List and manage all academic terms
    │       └── TermDetails.jsx       ← View details of a specific term
    ├── CSS/
    │   ├── componentsDesign.jsx    ← Styled component definitions
    │   ├── layoutDesign.jsx        ← Layout styling (sidebar, header, etc.)
    │   └── Variables.jsx           ← CSS variables (colors, fonts, breakpoints)
    ├── Faculty/
    │   ├── layout/
    │   │   └── FacultyLayout.jsx         ← Layout wrapper for Faculty role
    │   └── Pages/
    │       ├── AssignedCourses.jsx        ← View courses assigned to faculty member
    │       ├── OfferedCourses.jsx         ← Browse courses offered in current term
    │       ├── PreviousPreferences.jsx    ← View past term preference history
    │       └── SetPreferences.jsx         ← Form to submit course teaching preferences
    ├── shared/
    │   ├── ConfirmModal.jsx    ← confirmation message before submitting information
    │   └── Layout.jsx          ← Shared layout component (sidebar + topbar)
    ├── App.jsx                 ← Routes definition
    ├── data.jsx                ← data definition
    ├── login.jsx               ← login interface
    ├── main.jsx                ← App entry point
    └── index.html              ← Base HTML template
```

---

## Getting Started

### 1. Open the Termanal

Go to Termanal
New Termanal

### 2. Install dependencies

```bash
cd Khuta
npm install
npm install react-router-dom
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Open in browser

```
http://localhost:5173
```

---

## Login Credentials

| Role      | Username  | Password |
|-----------|-----------|----------|
| Chairman  | Malak     | 11       |
| Faculty   | Nuha      | 22       |
| Committee | Hamdi     | 12       |


---

## Routing

| Path                          | Page                  | User       |
|-------------------------------|-----------------------|------------|
| `/`                             | Login                 | All        |
| `/chairman/ics-courses`         | ICS Courses           | Chairman   |
| `/chairman/ics-faculty`         | ICS Faculty           | Chairman   |
| `/chairman/ics-committee`       | Scheduling Committee  | Chairman   |
| `/chairman/teaching-load`       | Teaching Load         | Chairman   |
| `/committee/assign-courses`     | Assign Courses        | Committee  |
| `/committee/manage-terms`       | Manage Terms          | Committee  |
| `/committee/manage-courses`     | Manage Courses        | Committee  |
| `/faculty/offered-courses`      | Offered Courses       | Faculty    |
| `/faculty/set-preferences`      | Set Preferences       | Faculty    |
| `/faculty/assigned-courses`     | Assigned Courses      | Faculty    |
| `/faculty/previous-preferences` | Previous Preferences  | Faculty    |

---

## Usage instructions

### Chairman

1. Login into the system using your KFUPM account
2. View All offered courses:
- Click on ICS Courses button.
- You can view current offered courses.
- You can view courses offered in previous terms by change the selected term.

3. View Scheduling Committee members:
- Click on Scheduling Committee button.
- You can remove a member by clicking on the remove button mext to the member information
- You can add a new member by clicking on Add new committee button and typing the faculty email and clicking add

4. View Faculty members:
- Click on ICS Faculty button.
- You can delete a faculty by clicking on the delete button mext to the faculty information
- You can add a new faculty by clicking on Add new faculty button and filling the required information

5. View Faculty Teaching Load:
- Click on Teaching Load button.
- You can view the teaching load for each faculty by showing the teached courses and number of sections with the total teaching hours.
- You can view the teaching load in previous terms by change the selected term.
- the red box in the teaching hours means that the teaching hours reached the maximum hours for the faculty rank

### Committee

### Faculty

---

## Team member

| Member Name | Roles |
|---|---|
| Nour Al Sulais |  |
| Fatimah Al Tawfiq |  |
| Kawthar Alomran | |
| Lama Al Thunayyan |  |
