# 🧠 AI Career Project

AI Career Project is an AI-powered career guidance platform that uses intelligent NPC mentors to assist users with:

- ✅ Career recommendations
- 📚 Personalized learning paths
- 📄 Resume analysis
- 🎤 Mock interviews
- 👩‍🏫 AI-driven mentorship via NPC chat (Tatva)

It includes both a FastAPI backend and a React frontend, designed to work together seamlessly.

---

## 🚀 Getting Started

### 1. 📦 Clone the Repository
```bash
git clone https://github.com/your-repo/AI-Career-Project.git
cd AI-Career-Project
```

---

## 🛠 Backend Setup (FastAPI)

### Step 1: Install Python dependencies
```bash
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

### Step 2: Set up environment variables
```bash
cp .env.template .env  # Then edit .env with your keys and DB URL
```

### Step 3: Run the backend server
```bash
uvicorn app.main:app --reload
```

> API available at: `http://localhost:8000`

---

## 🌐 Frontend Setup (React)

### Step 1: Install dependencies
```bash
cd frontend
npm install
```

### Step 2: Set up environment variables
```bash
cp .env.template .env  # Then edit .env with VITE_BACKEND_URL or REACT_APP_API_URL
```

### Step 3: Run the frontend
```bash
npm start
```

> Frontend available at: `http://localhost:3000`

---

## 🐳 Docker Setup (Optional)

If you prefer using Docker:
```bash
docker-compose up --build
```

Make sure both frontend and backend `.env` files are properly set.

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature-name
```
3. Commit your changes
```bash
git commit -m "Added feature"
```
4. Push to your branch
```bash
git push origin feature-name
```
5. Create a pull request

🔒 **Avoid pushing directly to `main` branch.**

---
## 📬 Feedback
We'd love to hear your feedback! Create issues or feature requests anytime.

---

> Built with 💙 by Team AetherAI for career empowerment.
