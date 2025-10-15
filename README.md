# **Financial AI Advisor - Full Stack Application**

## 🚀 **Project Overview**
An intelligent AI-powered financial planning application that analyzes user financial profiles to provide personalized investment strategies and feasibility assessments using Google's Gemini AI.

## 🏗️ **Tech Stack**
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas with Mongoose ODM
- **AI Integration:** Google Gemini API
- **Authentication:** JWT + bcryptjs
- **Charts:** Recharts
- **Deployment:** Ready for Vercel (frontend) + Render (backend)

## ✨ **Features**
### **Core Features:**
- 🤖 **AI-Powered Analysis:** Get personalized investment recommendations from Gemini AI
- 📊 **Multi-Step Form:** Comprehensive financial profile collection (4 steps, 23+ fields)
- 🚦 **Traffic Light System:** Visual feasibility assessment (Red/Yellow/Green)
- 📈 **Interactive Charts:** Portfolio allocation visualization with Recharts
- 🔐 **User Authentication:** Secure registration/login with JWT tokens
- 💾 **Data Persistence:** Save analyses to MongoDB with user-specific isolation
- 📧 **Export Features:** Email reports, PDF export, CSV download
- 📱 **Responsive Design:** Works seamlessly on all devices

### **Advanced Features:**
- ✅ **Real-time validation** with error highlighting
- ✅ **Progress tracking** with animated step indicators
- ✅ **Professional report generation** with executive summaries
- ✅ **Risk assessment** tailored to user psychology
- ✅ **Actionable investment strategies** with specific ETF recommendations
- ✅ **Dashboard** with analysis history and statistics

## 📁 **Project Structure**
```
financial-advisor/
├── frontend/ (React Application)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Register components
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── export/         # Export features
│   │   │   ├── AnalysisReport.tsx
│   │   │   ├── CopyrightHeader.tsx
│   │   │   ├── FinancialForm.tsx
│   │   │   ├── FooterDisclaimer.tsx
│   │   │   └── TrafficLight.tsx
│   │   ├── contexts/          # Auth context
│   │   ├── services/          # API services
│   │   └── types.ts           # TypeScript definitions
│   ├── index.html
│   └── package.json
│
├── backend/ (Express API)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── analysis.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── database.routes.ts
│   │   │   └── export.routes.ts
│   │   ├── services/
│   │   │   ├── gemini.service.ts
│   │   │   ├── database.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── pdf.service.ts
│   │   ├── models/
│   │   │   ├── User.model.ts
│   │   │   └── FinancialAnalysis.model.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

## 🛠️ **Installation & Setup**

### **Prerequisites:**
- Node.js 18+ and npm
- MongoDB Atlas account
- Google Gemini API key

### **1. Clone Repository:**
```bash
git clone https://github.com/yourusername/financial-ai-advisor.git
cd financial-ai-advisor
```

### **2. Backend Setup:**
```bash
cd backend
npm install
```

**Create `.env` file in backend/:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-advisor
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your-strong-jwt-secret-key-32-chars
FRONTEND_URL=http://localhost:3000
```

### **3. Frontend Setup:**
```bash
cd frontend
npm install
```

**Create `.env.local` file in frontend/:**
```env
VITE_API_URL=http://localhost:5000/api
```

### **4. Run Development Servers:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 **Access Application:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## 📋 **API Endpoints**

### **Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout

### **Analysis:**
- `POST /api/analysis` - Analyze financial data (requires auth)
- `GET /api/analysis/history` - Get user's analysis history
- `GET /api/analysis/test` - Test endpoint

### **Database:**
- `GET /api/db/stats` - Get database statistics
- `GET /api/db/analysis/:sessionId` - Get analysis by ID

### **Export:**
- `POST /api/export/email` - Send report via email
- `GET /api/export/pdf/:sessionId` - Download PDF report
- `GET /api/export/csv/:sessionId` - Download CSV data

## 🔧 **Development Phases**

### **Phase 1-4: Foundation**
- Project setup, TypeScript configuration
- Core components (CopyrightHeader, FooterDisclaimer, TrafficLight)
- Type definitions and data models

### **Phase 5-8: Core Features**
- Multi-step financial form implementation
- Gemini AI integration
- Form validation and error handling
- Analysis report component with charts

### **Phase 9-12: Full Stack**
- Backend Express server setup
- MongoDB database integration
- User authentication system
- Protected routes and user-specific data

### **Phase 13-14: Advanced Features**
- User dashboard with analysis history
- Email report functionality
- PDF and CSV export features
- Professional report formatting

## 🗄️ **Database Models**

### **User Model:**
```typescript
{
  email: string,        // Unique, required
  password: string,     // Hashed, required
  fullName: string,     // Required
  createdAt: Date,
  updatedAt: Date
}
```

### **Financial Analysis Model:**
```typescript
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
```

## 🎨 **UI/UX Features**
- **Animated transitions** between form steps
- **Real-time validation** with visual feedback
- **Progress indicators** with percentage completion
- **Responsive design** for mobile and desktop
- **Professional color scheme** with Tailwind CSS
- **Interactive charts** for data visualization
- **Loading states** with spinners and skeletons

## 🔒 **Security Features**
- **JWT authentication** with HTTP-only cookies
- **Password hashing** using bcryptjs
- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **Rate limiting** on authentication endpoints
- **Environment variables** for sensitive data
- **Database indexing** for performance


## 📄 **License**
Copyright © Ahmed Mohamed Khairy. All rights reserved.

## ⚠️ **Disclaimer**
The information and analysis provided by this application are for **educational and informational purposes only**. This report is generated by an Artificial Intelligence system and does not constitute professional financial advice, investment recommendations, or legal counsel. Financial markets are volatile and involve significant risk. Past performance is not indicative of future results. You should not rely solely on this information for making financial decisions. We strongly recommend consulting with a qualified, certified financial planner or advisor before making any investment decisions.

## 🤝 **Contributing**
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 **Contact**
For inquiries, technical advice, or custom development:
- **Email:** ahmedmohamedkhairy123@gmail.com
- **GitHub:** [yourusername](https://github.com/yourusername)

---

**Built with ❤️ using React, Node.js, MongoDB, and Google Gemini AI**