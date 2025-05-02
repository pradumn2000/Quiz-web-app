quiz-web-app/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── QuizCard.jsx
│   │   │   ├── QuestionBlock.jsx
│   │   │   └── ResultModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Result.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── quizService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
├── server/                     # Node.js backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   └── adminRoutes.js
│   ├── config/
│   │   └── db.js
│   ├── app.js
│   ├── server.js
│   └── .env
│
└── README.md
