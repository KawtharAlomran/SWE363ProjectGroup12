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
## Environment configurations

###### To connect with the database a .env file is created in each member device. However the file is not pushed to the repasatory because it has a sensitive data including the username and password.
###### The file contains these two variables:
MONGO_URL="Connection URL from mongo and add the database name to it"
PORT= our port number
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
npm install helmet 
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
| http://localhost:5174/api/sections/:term          | DELETE    |
| http://localhost:5174/api/assignments/:term          | DELETE    |
| http://localhost:5174/api/preferences/term/:term         | DELETE    |
| http://localhost:5174/api/terms/:term          | DELETE    |
| http://localhost:5174/api/sections/:term          | PUT    |
| http://localhost:5174/api/sections/unique/:term          | GET    |
| http://localhost:5174/api/assignments/load/:term          | GET    |
| http://localhost:5174/api/preferences/term/:term         | GET    |
| http://localhost:5174/api/preferences         | POST    |
| http://localhost:5174/api/assignments/:termId/:facultyName          | GET    |



### API request example

POST "http://localhost:5174/api/sections"
headers: Content-Type: application/json
body: {
  "termId": "241",
  "courses": [
    {
      "code": "ICS 321",
      "hasLab": true,
      "maleLec": 2,
      "maleLab": 2,
      "femaleLec": 1,
      "femaleLab": 1
    },
    {
      "code": "SWE 363",
      "hasLab": false,
      "maleLec": 3,
      "maleLab": 0,
      "femaleLec": 2,
      "femaleLab": 0
    }
  ]
}


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

1. Login into the system using your KFUPM email.

2. View and Manage Terms:
   - Click on the **Manage Terms** button in the sidebar.
   - All academic terms will be displayed.
   - Click on a term to view:
     - Offered courses
     - Number of sections for that term
   - You can modify **upcoming terms only** by clicking on the **Modify** button.
   - You can add a new term by clicking on **Add New Term**:
     - Enter a valid 3-digit term number.
     - The system will automatically display course demand.
     - Select courses and specify the number of sections.
     - Click **Submit** to save.
     - A notification email will be sent to faculty to submit their preferences.
     - You can still modify the term later if needed.

3. View and Manage Courses:
   - Click on **Manage Courses** in the sidebar.
   - All ICS department courses will be displayed.
   - Use pagination to browse courses.
   - To delete a course:
     - Click the **Delete** button next to the course.
     - A confirmation message will appear.
     - Click **Yes** to proceed or **No** to cancel.
   - To add a new course:
     - Click **Add New Course**
     - Fill in the required fields:
       - Course code (e.g., ICS104 or SWE201, without spaces)
       - Course name
       - Credit hours (1–6)
       - Select whether the course has a lab
       - Course description
     - Click **Add** to save the course
     - If input is invalid, an error message will be shown
     - Click **Cancel** to discard changes

4. View Faculty Preferences and Assign Courses:
   - Click on **Assign Courses** in the sidebar.
   - Select a term from the dropdown menu.
   - Choose view mode:
     - By Instructor
     - By Course
   - To assign instructors:
     - Click the checkbox next to the instructor
     - Select the sections to assign
   - To save changes:
     - Click **Save**
   - To finalize assignments:
     - Click **Submit**

### Faculty

1. Login into the system using your KFUPM account

2. View Offered Courses:
    - Click on Offered Courses button.
    - You can view courses offered in different terms by changing the selected term.
    - Courses are fetched dynamically from the database.
    - You can view course details by clicking on the course.

3. Set Courses Preferences:
    - Click on Set Preferences button.
    - The system automatically shows the upcoming terms.
    - You can select an upcoming term from the drop-down menu.
    - You can drag and drop courses to rank your preferences.
    - On small screens or mobile devices, you can click on courses instead of dragging.
    - The maximum number of preferences is 5 or less depending on available courses.
    - Clicked courses will automatically move to the preferences area in the order in which you click them.
    - Click Submit to save your preferences.

4. View Assigned Courses:
    - Click on Assigned Courses button.
    - You can select a term from the drop-down menu.
    - The system displays assigned courses and the sections.

5. View Submitted Preferences:
    - Click on Submitted Preferences button.
    - You can view all previously submitted preferences.
    - You can switch between terms using the drop-down menu.
    - Modify Submitted Preferences button appears only for:
        - The upcoming term
        - The next term after it
    - When clicking Modify:
        - You will be redirected to Set Preferences page.
        - The selected term will be loaded automatically.
        - Your previous preferences will be loaded for editing.
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
