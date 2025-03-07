# AI Career Project

## Project Overview
AI Career Project is an AI-powered career guidance chatbot that provides career recommendations, personalized learning paths, and resume analysis with mock interviews. It integrates AI-driven NPCs for mentorship, training, and recruitment.

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/AI-Career-Project.git
cd AI-Career-Project
```

### 2. Backend Setup
#### Install Dependencies
```sh
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

#### Configure Environment Variables
- Copy the `.env.template` file to `.env` and update it with the correct values.
```sh
cp .env.template .env
```

#### Run the Backend Server
```sh
uvicorn app.main:app --reload
```

### 3. Frontend Setup
#### Install Dependencies
```sh
cd frontend
npm install
```

#### Configure Environment Variables
- Copy the `.env.template` file to `.env` and update it with the correct values.
```sh
cp .env.template .env
```

#### Run the Frontend Server
```sh
npm start
```

### 4. Docker Setup (Optional)
To run the project using Docker:
```sh
docker-compose up --build
```



**Note:** Since `.env` is ignored in `.gitignore`, use `.env.template` as a reference to create your `.env` file.

### 5. Contribution Guidelines
Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Added feature").
Push to your branch (git push origin feature-name). Dont push directly to main.
Open a pull request.