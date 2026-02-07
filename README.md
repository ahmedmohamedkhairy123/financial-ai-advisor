© 2025 Financial AI Advisor - Full Stack Application - All Rights Reserved
#### for techinal guidelines or inquires please contact ahmedmohamedkhairy123@gmail.com
### 📋Statement of originality
#### This project is entirely **my own original work**,developed from scratch 
#### **No plagiarism**: No part of this repo has been copied from external sources or other developers 
#### **Full Accountability** I , [Ahmed], assume full legal and professional responsibility for the authenticity of this 

## 🚀 Project Overview
An intelligent AI-powered financial planning application that analyzes user financial profiles to provide personalized investment strategies and feasibility assessments using Google's Gemini AI.
## ❤️ live demo (please wait 5 seconds to see the GIF) 
![Demo Animation](Demo2.gif)
[![Vercel](https://img.shields.io/badge/Vercel-Live%20App-black?style=for-the-badge&logo=vercel)](https://financial-ai-advisor.vercel.app/)
## 🏗 Tech Stack
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB Atlas with Mongoose ODM
- AI Integration: Google Gemini API
- Authentication: JWT + bcryptjs
- Charts: Recharts
- Deployment: Ready for Vercel 

## ✨ Features
### Core Features:
- 🤖 AI-Powered Analysis: Get personalized investment recommendations from Gemini AI
- 📊 Multi-Step Form: Comprehensive financial profile collection (4 steps, 23+ fields)
- 🚦 Traffic Light System: Visual feasibility assessment (Red/Yellow/Green)
- 📈 Interactive Charts: Portfolio allocation visualization with Recharts
- 🔐 User Authentication: Secure registration/login with JWT tokens
- 💾 Data Persistence: Save analyses to MongoDB with user-specific isolation
- 📧 Export Features: Email reports, PDF export, CSV download
- 📱 Responsive Design: Works seamlessly on all devices

### Advanced Features:
- ✅ Real-time validation with error highlighting
- ✅ Progress tracking with animated step indicators
- ✅ Professional report generation with executive summaries
- ✅ Risk assessment tailored to user psychology
- ✅ Actionable investment strategies with specific ETF recommendations
- ✅ Dashboard with analysis history and statistics

## 📁 Project Structure
```
├── backend
│   ├── src
│   │   ├── db
│   │   │   └── connection.ts
│   │   ├── middleware
│   │   │   └── auth.middleware.ts
│   │   ├── models
│   │   │   ├── FinancialAnalysis.model.ts
│   │   │   └── User.model.ts
│   │   ├── routes
│   │   │   ├── analysis.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── database.routes.ts
│   │   │   └── export.routes.ts
│   │   ├── services
│   │   │   ├── database.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── gemini.service.ts
│   │   │   └── pdf.service.ts
│   │   ├── utils
│   │   │   └── jwt.utils.ts
│   │   └── index.ts
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── src
│   ├── components
│   │   ├── auth
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── dashboard
│   │   │   └── Dashboard.tsx
│   │   ├── export
│   │   │   └── ExportButtons.tsx
│   │   ├── AnalysisReport.tsx
│   │   ├── CopyrightHeader.tsx
│   │   ├── FinancialForm.tsx
│   │   ├── FooterDisclaimer.tsx
│   │   └── TrafficLight.tsx
│   ├── contexts
│   │   └── AuthContext.tsx
│   ├── services
│   │   ├── geminiService.ts
│   │   └── pdfGenerator.ts
│   ├── utils
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   └── types.ts
├── .env.local
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── test-report.pdf
├── test.pdf
├── tsconfig.json
└── vite.config.ts
```
## 🛠 Installation & Setup

### Prerequisites:
- Node.js 18+ and npm
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone Repository:
git clone https://github.com/ahmedmohamedkhairy123/financial-ai-advisor.git
cd financial-ai-advisor

### 2. Backend Setup:
cd backend
npm install

Create `.env` file in backend/:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-advisor
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your-strong-jwt-secret-key-32-chars
FRONTEND_URL=http://localhost:3000

### 3. Frontend Setup:
npm install

Create `.env.local` file in frontend/:
VITE_API_URL=http://localhost:5000/api

### 4. Run Development Servers:

Terminal 1 - Backend:
cd backend
npm run dev

Terminal 2 - Frontend:

npm run dev
## 🌐 Access Application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📋 API Endpoints

### Authentication:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile
- POST /api/auth/logout - Logout

### Analysis:
- POST /api/analysis - Analyze financial data (requires auth)
- GET /api/analysis/history - Get user's analysis history
- GET /api/analysis/test - Test endpoint

### Database:
- GET /api/db/stats - Get database statistics
- GET /api/db/analysis/:sessionId - Get analysis by ID

### Export:
- POST /api/export/email - Send report via email
- GET /api/export/pdf/:sessionId - Download PDF report
- GET /api/export/csv/:sessionId - Download CSV data

## 🔧 Development Phases

### Phase 1-4: Foundation
- Project setup, TypeScript configuration
- Core components (CopyrightHeader, FooterDisclaimer, TrafficLight)
- Type definitions and data models

### Phase 5-8: Core Features
- Multi-step financial form implementation
- Gemini AI integration
- Form validation and error handling
- Analysis report component with charts

### Phase 9-12: Full Stack
- Backend Express server setup
- MongoDB database integration
- User authentication system
- Protected routes and user-specific data

### Phase 13-14: Advanced Features
- User dashboard with analysis history
- Email report functionality
- PDF and CSV export features
- Professional report formatting

## 🗄 Database Models

### User Model:
{
  email: string,        // Unique, required
  password: string,     // Hashed, required
  fullName: string,     // Required
  createdAt: Date,
  updatedAt: Date
}

### Financial Analysis Model:
{
  userId: string,       // Reference to user
  sessionId: string,    // Unique session identifier
  formData: object,     // Complete form data (23+ fields)
  analysisResult: object, // AI-generated analysis
  metadata: {
    ipAddress: string,
    userAgent: string,
    processingTime: number
  },
  createdAt: Date,
  updatedAt: Date
}

## 🎨 UI/UX Features
- Animated transitions between form steps
- Real-time validation with visual feedback
- Progress indicators with percentage completion
- Responsive design for mobile and desktop
- Professional color scheme with Tailwind CSS
- Interactive charts for data visualization
- Loading states with spinners and skeletons

## 🔒 Security Features
- JWT authentication with HTTP-only cookies
- Password hashing using bcryptjs
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Rate limiting on authentication endpoints
- Environment variables for sensitive data
- Database indexing for performance


## 📄 License
Copyright © Ahmed Mohamed Khairy. All rights reserved.

## ⚠️ Disclaimer
The information and analysis provided by this application are for educational and informational purposes only. This report is generated by an Artificial Intelligence system and does not constitute professional financial advice, investment recommendations, or legal counsel. Financial markets are volatile and involve significant risk. Past performance is not indicative of future results. You should not rely solely on this information for making financial decisions. We strongly recommend consulting with a qualified, certified financial planner or advisor before making any investment decisions.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Contact
For inquiries, technical advice, or custom development:
- Email: ahmedmohamedkhairy123@gmail.com


---

Built by Ahmed love you all ❤️