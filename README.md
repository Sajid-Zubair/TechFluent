# Interview Question Generator

A dynamic React-powered web app designed to generate sharp, relevant, and domain-focused technical and behavioral interview questions — all crafted specifically for confident, oral responses. Harnessing the power of AI-driven prompts, this project delivers authentic interview practice that prepares you to impress recruiters with concise, real-world questions tailored to your field. Perfect for sharpening your speaking skills and boosting your interview readiness like never before!

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

- Generate concise, domain-specific technical interview questions (e.g., CSE, AI/ML, Data Science).  
- Generate realistic behavioral interview questions encouraging storytelling and experience sharing.  
- Questions designed to be answered orally within 1-2 minutes.  
- AI prompts ensure questions are relevant and likely to be asked in actual interviews.  
- Clean, professional UI with subject selection and easy navigation.

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/Sajid-Zubair/TechFluent.git
   cd TechFluent

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

    ### Technical Question Prompt Design
        Generate one short and concise theoretical random technical interview question for the subject: {subject}.  
        The question should be answerable solely by speaking (oral answer), not by writing code or lengthy explanations.  
        Include only questions that are commonly asked or might be asked in real interviews.

    ### Behavioural Question Prompt Design
        Generate one concise behavioral interview question that is commonly asked or likely to be asked in interviews.  
        The question should encourage the candidate to share real experiences or examples, be answerable orally with a focused narrative,  
        and explore qualities like teamwork, problem-solving, communication, adaptability, or leadership.

