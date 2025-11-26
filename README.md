# Digital Padhai (eLearning Platform)

A full-stack eLearning platform built with Django (backend) and React (frontend) that allows students to browse courses, enroll, track progress, take tests, and receive certificates.

---

## Features

- User authentication and authorization
- Course browsing, enrollment, and progress tracking
- Video player for course content
- Test system with multiple-choice questions
- Certificate generation for completed courses
- Admin panel for managing courses, tests, and users
- Payment integration via Khalti

---

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** React.js, Redux Toolkit, Tailwind CSS
- **Database:** PostgreSQL / MySQL
- **Payment Gateway:** Khalti
- **Version Control:** Git & GitHub

---

## Installation / Setup

### 1. Clone the repository
```bash
git clone https://github.com/ankitkarki27/eLearning-Platform-django-react.git
cd eLearning-Platform-django-react
```
### 2. Backend Setup

```bash
cd backend
python -m venv env
# Activate environment
# Windows: env\Scripts\activate
# Mac/Linux: source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### 4. Screenshots / Demo

<img width="1897" height="1061" alt="image" src="https://github.com/user-attachments/assets/fc375946-de74-4846-abbd-5db975da1029" />

<img width="1885" height="970" alt="image" src="https://github.com/user-attachments/assets/db270ead-2fd6-4a2b-9874-69e21ab4c216" />

<img width="1893" height="1059" alt="image" src="https://github.com/user-attachments/assets/76c36d73-4c03-4a1b-845d-9680831ea854" />

<img width="1888" height="1055" alt="image" src="https://github.com/user-attachments/assets/b8274211-29a5-4722-b6bf-bd09b665580a" />



### 5. Notes

```text
- Python .pyc and __pycache__ files are ignored via .gitignore.
- Project is maintained by a single developer.
- All frontend and backend code is included in this repository.
```

### 6. Contact

```text
Developer: Ankit Karki
Email: ankitkarki8088@gmail.com
GitHub: https://github.com/ankitkarki27
Portfolio: https://karkiankit.com.np
```


