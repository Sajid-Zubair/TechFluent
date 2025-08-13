# Interview Prep Platform

TechFluent is an AI-powered web platform designed to help students and job seekers:

1.Improve interview skills with technical and behavioral questions.

2.Analyze and improve resumes with AI feedback.

3.Search for jobs with real-time listings from Indeed.

4.Get instant help from a career-focused chatbot.

5.Track progress and performance through gamification.

The platform uses AI models for question generation, answer evaluation, and speech-to-text conversion, providing a complete, interactive, and personalized career preparation experience.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Technical Details](#technical-details)  
- [Gamification](#gamification)  
- [Prompt Design](#prompt-design)  

---

## 🚀 Project Overview

This project helps candidates prepare for interviews by generating tailored technical and behavioral questions that simulate real interview scenarios. The focus is on questions that can be answered orally, promoting clear, confident verbal responses.

---

## ✨ Features

1. AI-Powered Interview Prep
Generate domain-specific technical questions (CSE, AI/ML, Data Science).
Generate realistic behavioral questions for storytelling and experience sharing.
Questions are designed to be answered orally within 1–2 minutes.
Real-time speech-to-text conversion using OpenAI’s Whisper model.
AI evaluation on accuracy, coherence, grammar, fluency, and personalized feedback.
Questions and feedback tailored for realistic interview scenarios.

2. Job Search Portal
Search jobs by role and location.
Real-time job scraping from Indeed using Apify.
Clean, user-friendly display of listings without leaving the platform.

3. Resume Analyzer
Upload resumes in PDF or DOCX format.
Extract text using PyMuPDF and python-docx libraries.
AI analyzes resume content and provides personalized suggestions to improve structure, phrasing, and impact.

4. Intelligent Chatbot
Ask career-related questions or interview doubts.
AI-powered responses provide context-aware answers to help users prepare better.

5. Profile Dashboard & Analytics
Visualize overall rating and scores for accuracy, coherence, grammar, and fluency.
Track interview streaks, total interviews completed, and peer rankings.
Progress shown with radar charts (skill breakdown) and line charts (improvement over time).

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/Sajid-Zubair/TechFluent.git
   cd TechFluent
   npm install

2. Start the Frontend:
    In the TechFluent directory, run:
    ```bash
    npm run dev

3. Start the Backend
    Open a new terminal window/tab, then:
    ```bash
    cd techbackend
    python manage.py runserver

4. Access the application:
    Open your browser and navigate to the frontend URL displayed by the npm run dev command (usually http://localhost:3000 or similar).

---

## 🎯 Usage
    Select a technical subject or behavioral interview type from the dropdown.

    Click Generate Question to receive a relevant interview question.

    Use the generated question to practice oral responses.

---

## 🧑‍💻 Technical Details
    Frontend: React.js with hooks for state management.

    Backend: (Optional) API to interact with AI services like Groq models.

    AI Prompt Engineering: Carefully crafted prompts ensure high-quality, realistic interview questions focused on oral answers.

---

## 🎮 Gamification

To motivate consistent practice and healthy competition, the project incorporates gamification elements including:

- **College-specific Leaderboards:** Students are ranked based on their overall interview performance within their college, fostering a competitive yet collaborative environment.  
- **Maximum Streak Tracking:** Encourages users to maintain consecutive days of practice, rewarding consistency and dedication.  
- **Visual Performance Metrics:**  
  - **Radar Charts** display detailed scoring across multiple interview skill dimensions (e.g., fluency, grammar, coherence, content structure, vocabulary, relevance).  
  - **Line Charts** track interview skill progress over time, allowing users to visualize their improvement trajectory.  

These elements combine to create an engaging and rewarding interview preparation experience.

---



## 📝 Prompt Design

- ## Technical Question Prompt Design
    Generate one short and concise theoretical random technical interview question for the subject: {subject}.  
    The question should be answerable solely by speaking (oral answer), not by writing code or lengthy explanations.  
    Include only questions that are commonly asked or might be asked in real interviews.

- ## Behavioural Question Prompt Design
    Generate one concise behavioral interview question that is commonly asked or likely to be asked in interviews.  
    The question should encourage the candidate to share real experiences or examples, be answerable orally with a focused narrative,  
    and explore qualities like teamwork, problem-solving, communication, adaptability, or leadership.

