# Recipe Finder 🍳

[![GitHub License](https://img.shields.io/github/license/AyushNikhara/Recipe_Finder)](https://github.com/AyushNikhara/Recipe_Finder/blob/main/LICENSE)
[![Render Deployment](https://img.shields.io/badge/Backend-Hosted%20on%20Render-46e3b7)](https://render.com)
[![Vercel Deployment](https://img.shields.io/badge/Frontend-Hosted%20on%20Vercel-000000)](https://recipe-finder-three-nu.vercel.app/)

A modern web application that helps you discover delicious recipes through text search or ingredient photo recognition. Built with a React frontend and Node.js/Express backend.

![image](https://github.com/user-attachments/assets/854992a6-6401-464c-bfd3-bef3fd19ab8f)
![image](https://github.com/user-attachments/assets/1dac1af0-b24a-4d8e-820f-cbbeb746ed76)
![image](https://github.com/user-attachments/assets/bd268d46-dc91-40a7-8c8d-f5e90f5878e4)
![image](https://github.com/user-attachments/assets/16fac5a2-bca7-4a37-95ee-361ca8b57b91)
![image](https://github.com/user-attachments/assets/7be61f76-e3ad-4a69-97f3-31476aa1abd8)
![image](https://github.com/user-attachments/assets/cabd2757-ec5d-452a-9d22-40fac69f1042)
![image](https://github.com/user-attachments/assets/9e3a0628-9008-4acd-afa0-18f78f117626)


## Live Demo
- Frontend: https://recipe-finder-three-nu.vercel.app/
- Backend API: https://recipe-finder-1-iwk6.onrender.com

## Features ✨
- 📸 Image-to-text conversion using AI (Microsoft Git-Base model)
- 🔍 Search recipes by ingredients (text or image input)
- 🥗 Filter by dietary preferences (Vegetarian, Vegan, Gluten-free, etc.)
- 🌍 Cuisine type filtering
- 📖 Detailed recipe instructions and nutritional information
- ❤️ Save favorite recipes
- 📱 Fully responsive design

## Technologies Used 🛠️
**Frontend:**
- TypeScript
- Tailwind CSS (Styling)
- Hugging Face API (Image-to-text conversion)
- Axios (HTTP Client)

**Backend:**
- Node.js
- Express.js
- MongoDb (For Recipe Data)

**AI/ML:**
- Microsoft Git-Base model via Hugging Face API

**Deployment:**
- Vercel (Frontend)
- Render (Backend)

## Installation 💻
1. Clone the repository:
```bash
git clone https://github.com/AyushNikhara/Recipe_Finder.git
```
Set up environment variables:
Create .env file in backend directory:
```
MONGO_DB_URL=Your_MongoDb_URL
```
Create .env file in frontend directory:
```
VITE_HUGGINGFACE_API_KEY= HiggingFace API Key
```
Start development servers:
```
# Backend
cd backend && npm start

# Frontend (in separate terminal)
cd frontend && npm start
```
