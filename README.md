# Khuta System

## Project Overview

Khuta is a course scheduling management system for KFUPM built with React. The system supports multiple user roles: **Chairman**, **Committee**, and **Faculty**.
The Khuta project aims to replace the manual, repetitive process of collecting instructors' teaching preferences in the ICS department at KFUPM with a centralized web-based platform. Khuta automates the process by allowing instructors to submit preferences online and enabling committee members to review submissions, analyze course demand, determine required sections, and assign courses efficiently. The system provides visibility into enrollment numbers and instructor preferences, supporting fairer distribution of teaching loads. Key benefits include reduced administrative workload, improved efficiency, and enhanced transparency for faculty, the scheduling committee, and the department chairman.

---

## Project Structure

```
Khuta/
├── src/
│   ├── Chairman/
│   │   ├── layout/
│   │   │   └── ChairmanLayout.jsx   ← Layout wrapper with sidebar/nav for Chairman role
│   │   └── Pages/
│   │       ├── ChairmanHomePage.jsx      ← View offered courses
│   │       ├── icsFaculty.jsx            ← View/manage ICS faculty members
│   │       ├── schedulingCommittee.jsx   ← View/manage scheduling committee members
│   │       └── teachingLoad.jsx          ← View faculty teaching loads
│   ├── Committee/
│   │   ├── layout/
│   │   │   └── CommitteeLayout.jsx       ← Layout wrapper for Scheduling Committee role
│   │   └── Pages/
│   │       ├── AddNewTerm.jsx        ← Form to create a new academic term
│   │       ├── AssignCourses.jsx     ← Assign courses to faculty for a term
│   │       ├── ByCourse.jsx          ← View faculty preferences grouped by course
│   │       ├── ByInstructor.jsx      ← View faculty preferences grouped by instructor
│   │       ├── ManageCourses.jsx     ← View/manage all ICS courses
│   │       ├── ManageTerms.jsx       ← List and manage all academic terms
│   │       └── TermDetails.jsx       ← View details of a specific term
│   ├── CSS/
│   │   ├── componentsDesign.css    ← Styled component definitions
│   │   ├── layoutDesign.css       ← Layout styling (sidebar, header, etc.)
│   │   └── Variables.css           ← CSS variables (colors, fonts, breakpoints)
│   ├── Faculty/
│   │   ├── layout/
│   │   │   └── FacultyLayout.jsx         ← Layout wrapper for Faculty role
│   │   └── Pages/
│   │       ├── AssignedCourses.jsx        ← View courses assigned to faculty member
│   │       ├── OfferedCourses.jsx         ← Browse courses offered in current term
│   │       ├── PreviousPreferences.jsx    ← View past term preference history
│   │       └── SetPreferences.jsx         ← Form to submit course teaching preferences
│   ├── shared/
│   │   ├── ConfirmModal.jsx    ← confirmation message before submitting information
│   │   └── Layout.jsx          ← Shared layout component (sidebar + topbar)
│   ├── App.jsx                 ← Routes definition
│   ├── data.jsx                ← data definition
│   ├── login.jsx               ← login interface
│   ├── main.jsx                ← App entry point
│   └── index.html              ← Base HTML template
└── server/
      ├── controllers/
      │       ├── courseController.js              ← functions to access and modify courses collection
      │       ├── preferenceController.js          ← functions to access and modify preference collection
      │       ├── teachingLoad.js                  ← functions to access teaching load for each faculty
      │       ├── termAssignmentController.js      ← functions to access and modify term assignment collection
      │       └── termSectionController.js         ← functions to access and modify offered courses and sections collection
      │
      ├── models/
      │       ├── Assignment.js     ← Collection schema
      │       ├── Course.js         ← Collection schema
      │       ├── Faculty.js        ← Collection schema
      │       ├── Plans.js          ← Collection schema
      │       ├── Preferences.js    ← Collection schema
      │       ├── Sections.js       ← Collection schema
      │       └── Term.js           ← Collection schema
      ├── routes/
      │       ├── assignmentRoutes.js     ← route for the endpoint URL to reach the data
      │       ├── courseRoutes.js         ← route for the endpoint URL to reach the data
      │       ├── loadRoute.js            ← route for the endpoint URL to reach the data
      │       ├── planRoutes.js           ← route for the endpoint URL to reach the data
      │       ├── preferenceRoutes.js     ← route for the endpoint URL to reach the data
      │       ├── sectionRoutes.js        ← route for the endpoint URL to reach the data
      │       └── termRoutes.js           ← route for the endpoint URL to reach the data
      │
      ├──db.js       ← Creating the database connection
      └──server.js   ← Backend config
```

---

## Getting Started

1. open github link
2. Go to "Code" green botton below the repasatory name
3. Copy the http link 
4. Open VS code or any other IDE
5. clone the repasatory

Then follow the below instructions. Run the backend first in one terminal and then the frontend in different terminal.

### Running backend

#### 1. Open the Termanal

Go to Termanal

New Termanal

#### 2. Install dependencies
You have to run them one by one on the termenat
```bash
cd Khuta
cd server 
npm i 
npm install express cors mongoose dotenv
```

#### 3. Run the server
```bash
node server.js 
```

### Running Frontend

#### 1. Open the Termanal

Go to Termanal

Open New Termanal

#### 2. Install dependencies

You have to run them one by one on the termenat
```bash
cd Khuta
npm install
npm install react-router-dom
```

#### 3. Run the development server

```bash
npm run dev
```

#### 4. Open in browser

```
http://localhost:5173
```

---

## Login Credentials

| Role      | Username  | Password |
|-----------|-----------|----------|
| Chairman  | malak.baslyman@kfupm.edu.sa     | 1      |
| Faculty   | amir.hussain@kfupm.edu.sa      | 1       |
| Committee | aljamimi@kfupm.edu.sa     | 1       |


---


## API documentation 

| API endpoint                                | method  |
|---------------------------------------------|-----------|
| http://localhost:5174/api/courses                                  | GET    |
| http://localhost:5174/api/faculty?role                             |  GET  | 
| http://localhost:5174/api/faculty/:email                           |  GET  | 
| http://localhost:5174/api/faculty                                  |  POST  | 
| http://localhost:5174/api/faculty/:email                           |  DELETE  | 
| http://localhost:5174/api/faculty/:email                           |  PATCH  | 
| http://localhost:5174/api/assignments/:term/:facultyName          | GET    |
| http://localhost:5174/api/terms/check/:term          | GET    |
| http://localhost:5174/api/plans/:term          | GET    |
| http://localhost:5174/api/sections          | POST    |
| http://localhost:5174/api/terms          | GET    |
| http://localhost:5174/api/preferences/term/:term/instructor          | GET    |
| http://localhost:5174/api/preferences/term/:term/course            | GET    |
| http://localhost:5174/api/sections/:term          | GET    |
| http://localhost:5174/api/assignments/:term/sections          | GET    |
| http://localhost:5174/api/assignments/:term          | GET    |
| http://localhost:5174/api/assignments          | POST    |
| http://localhost:5174/api/preferences/manual         | POST    |
| http://localhost:5174/api/courses/:code        | DELETE    |
| http://localhost:5174/api/courses        | POST    |






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

1. Login into the system using your KFUPM email

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
    - the red box in the teaching hours means that the teaching hours exceed the maximum hours for the faculty rank.
    - the yellow box in the teaching hours means that the teaching hours equal to the maximum hours for the faculty rank.
    - the green box in the teaching hours means that the teaching hours below the maximum hours for the faculty rank.

### Committee

1. Login into the system using your KFUPM account

2. You can view and manage terms by clicking on Manage Terms button.
    - You can view all terms and see offered coursese and number of sections by clicking on the term.
    - you can modify current term by clicking on modify button
    - You can add a new term by clicking on Add new Term button
        - You must rnter the term number to view the courses demand and then select the number of sections.
        - If you submit the form a notification email will be send to faculty to set their preferences. However you can still modify the offered courses and number of sections.
3. View and Manage Courses:
    - You can brows all ICS courses by clicking on Manage Courses button
    - You can delet a course by clicking on Delet button
    - You can add a new course by clicking on Add new Course and filling the course information form.
4. View faculty preferences
    - You can brows all faculty preferences by clicking on Assign Courses button
    - You can select the term from the drop-down menue
    - you have the chance to view the preferences by instructors or by courses by changing the view type.
    - To assign instructior, You have to click on the check box and select the number of sections

### Faculty

1. Login into the system using your KFUPM account

2. View All offered courses:
    - Click on Offered Courses button.
    - You can view current offered courses.
    - You can view courses offered in previous terms by change the selected term.
    - You can view each course information by clicking on the course name or course number

2. Set courses preferences:
    - Click on Set Preferences button.
    - Drag and drop the courses that you are interested to each in preferences area. you must rank them based on your interest.
    - Submit your preferences by clicking Submit buttom

3. View Assigned Courses:
    - Click on Assigned Courses button.
    - You can view all assigned courses with the number of sections in all terms

3. View Submitted Preferences:
    - Click on Submitted Preferences button.
    - You can view all preferences that you submit in current or previous terms
    - You can modify your preferences in the current term by clicking on Modify Submitted Preferences button.
    - You are unable to modify your preferences unless you set and submit your preferences.

---

## Interfaces Design

The Figma file is used as a reference to create the style for all interfaces. However, we add extra features, that found useful for inhancing the user experiance, which is not in the Figma file.

```
https://www.figma.com/design/Zn9AeipZGnvmaUCEqFusan/Khuta-system?node-id=0-1&t=QDerzryPjf1qd1La-1
```


---

## Team member

| Member Name | Roles |
|---|---|
| Nour Al Sulais | App.jsx, CSS, data.jsx, ConfirmModal.jsx, Layout.jsx, CommitteeLayout.jsx, ManageTerms.jsx, TermDetails.jsx, AddNewTerm.jsx, AssignCourses.jsx, ByCourse.jsx, ByInstructor.jsx |
| Fatimah Al Tawfiq | App.jsx, CSS, data.jsx, login.jsx, all Chairman interfaces |
| Kawthar Alomran | App.jsx, CSS, data.jsx, ManageCourses.jsx, AssignCourses.jsx, ByCourse.jsx, ByInstructor.jsx |
| Lama Al Thunayyan | App.jsx, CSS, all Faculty interfaces |
