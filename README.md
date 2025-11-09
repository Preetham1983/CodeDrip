---

# <img width="30" height="30" alt="img" src="https://github.com/user-attachments/assets/f97c1444-b41e-4f96-82a9-d4eb1b90f18a"/> CodeDrip

###  Track 2 — AI-Powered Repository Analysis

---

##  **Overview**

The **Codebase & Repository Explorer Agent** is an AI-driven tool that helps engineering teams understand and analyze large GitHub repositories.
It automatically explores repositories, summarizes dependencies, analyzes project activity, and provides actionable insights about code health and structure.

---

##  **Problem & Solution**

> In large organizations, managing and understanding complex codebases is a daily struggle. Developers spend hours navigating massive repositories, tracking dependencies, and identifying technical debt — often without clear visibility into overall code health. Our project, CodeDrip, solves this by acting as an AI-powered assistant that analyzes repositories, summarizes dependencies, detects issues, and provides actionable insights in seconds.

---

##  **Objectives**

* Explore and analyze organization codebases.
* Detect dependencies, commits, and contribution trends.
* Generate and store actionable repository insights.
* Allow users to ask natural language questions about the repository.

---

## ⚙️ **Folder Structure**

```
repo-explorer/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   ├── models.py
│   ├── db.py
│   └── utils.py
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Analyze.js
    │   │   ├── QaPage.js
    │   │   └── RepoDetails.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── RepoCard.js
    │   └── services/
    │       └── api.js
    ├── package.json
    └── vite.config.js
```

---

##  **Tech Stack**

### 🖥️ Frontend

* **React.js (Vite)**
* **React Router DOM**
* **Axios** for API calls
* **Responsive UI** built with custom CSS
* **Hosted on AWS Amplify**

### ⚙️ Backend

* **Python (Flask)**
* **Google Gemini 2.5 Flash Model** for repository understanding and analysis
* **MongoDB Atlas** for storing user-submitted repositories and insights
* **Hosted on Vercel**

---

##  **Features**

✅ Analyze GitHub repositories by simply pasting a repo URL

✅ Automatically extracts dependencies, commits, contributors, and activity logs

✅ Provides AI-generated summaries and code insights using Gemini 2.5 Flash

✅ Stores analyzed repositories in **MongoDB Atlas**

✅ Includes **“Ask Questions About Repo”** — a feature for interactive AI Q&A

✅ Frontend hosted on **AWS Amplify**, backend deployed via **Vercel**

✅ Clean and modular folder structure

---

##  **Setup & Installation**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/repo-explorer.git
cd repo-explorer
```

---

### 2️⃣ Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

#### Create `.env` file:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=Git_Hub_Token_Key
```

#### Run locally:

```bash
python app.py
```

#### BackEnd Deployment (Vercel)
# login to vercel 
```bash
vercel
vercel --prod
```

Include a `vercel.json` file in your backend:

```json
{
  "version": 2,
  "builds": [{ "src": "app.py", "use": "@vercel/python" }],
  "routes": [{ "src": "/(.*)", "dest": "app.py" }]
}
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start 
npm i ajv # if npm start fails
```

#### Build for production:

```bash
npm run build
```

#### Deployment (AWS Amplify)

1. Go to **AWS Amplify Console**
2. Select **Deploy without Git provider**
3. Upload the generated **build folder (.zip)**
4. Deploy and test your live frontend

---

##  **Example Workflow**

1. User enters a **GitHub repository URL** in the web interface.
2. Backend fetches repository data and runs analysis via **Gemini 2.5 Flash**.
3. AI summarizes dependencies, contributors, and commit stats.
4. Insights and metrics are stored in **MongoDB Atlas**.
5. Frontend displays:

   *  Repo Details
   *  Commits & Contributors
   *  Key Insights
   *  Q&A Interaction with the repository

---

##  **Screens & Components**

* **Home Page** → Displays repo exploration UI
  
<img width="1883" height="904" alt="Screenshot 2025-11-10 003056" src="https://github.com/user-attachments/assets/0cd22076-ec6b-4e6e-a3a4-8accf379cba9" />

----
* **Analyze Page** → Paste repo URL & analyze
  
<img width="1890" height="790" alt="Screenshot 2025-11-09 235944" src="https://github.com/user-attachments/assets/dbee09d5-f7b2-410a-92c9-7782239a3aea" />

----

* **Repo Details Page** → Shows repo metadata, commits, and contributors
  
<img width="1876" height="907" alt="Screenshot 2025-11-09 235927" src="https://github.com/user-attachments/assets/d6d7e1bb-80f3-40e0-9400-fdeeedcb0c8f" />

----

* **QA Page** → Ask repository-related AI questions
  
<img width="1888" height="891" alt="Screenshot 2025-11-09 235937" src="https://github.com/user-attachments/assets/04ae79cb-a9df-46c9-9529-c37614361432" />

----

* **Navbar & RepoCard Components** → Reusable and responsive

---

## 🌐 **Deployment Summary**

| Layer        | Platform      | Description                             |
| ------------ | ------------- | --------------------------------------- |
| **Frontend** | AWS Amplify   | Deployed using uploaded `.zip` build    |
| **Backend**  | Vercel        | Deployed using `vercel` and `.env` file |
| **Database** | MongoDB Atlas | Stores user-submitted repos & insights  |


---

## 🧑‍💻 **Team Members**

| Name                     | Role                             | Description                                                                                                        |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Preetham** | Full-Stack Developer/ AWS Amplify | Focused on backend integration with Gemini 2.5 Flash, AI pipeline design, and frontend deployment via AWS Amplify. |
| **Naveen**               | Team Lead/FrontEnd & Backend Developer | Worked on Flask backend logic, MongoDB Atlas integration, and API endpoints for repository analysis.               |
| **Akshit**               | Frontend Developer & Research     | Designed and implemented responsive React components, UI pages, and handled state management.                      |
| **Smaran**               | Research & Integration Engineer  | Focused on AI model integration, repo analytics workflows, and performance optimization.                           |

📍 **Location:** Hyderabad, India
🎓 **Institution:** Keshav Memorial College of Engineering
💡 **Team Focus:** AWS Services , Cloud , Artificial Intelligence , and Full-Stack Development


---

##  **Conclusion**

This project demonstrates how **AI and software engineering** can work together to simplify repository exploration.
By integrating **Gemini 2.5 Flash**, **MongoDB Atlas**, and **React**, this solution empowers developers to **analyze and interact with codebases intelligently**.

---

### ⭐ **If you like this project, don’t forget to star the repository!**

---
