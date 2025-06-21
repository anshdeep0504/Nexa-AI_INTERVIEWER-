# Nexa – AI Interview Platform

Nexa is an AI-powered platform for practicing technical and behavioral interviews. It simulates real interview sessions with an intelligent AI interviewer, provides real-time voice chat, and delivers detailed feedback to help you improve your skills.

---

## ✨ Features

- **AI Interviewer:** Practice interviews with an AI that asks questions and evaluates your responses.
- **Voice Interaction:** Real-time, low-latency voice chat powered by [VAPI](https://vapi.ai).
- **Personalized Feedback:** Get instant, actionable feedback and performance breakdowns.
- **Multiple Interview Types:** Technical, behavioral, and mixed interviews.
- **Tech Stack Badges:** Visual display of technologies relevant to each interview.
- **Authentication:** Secure login and user management with Firebase Auth.
- **Modern UI:** Clean, professional, and responsive design with Next.js and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Firebase Cloud Functions, Firestore
- **Voice Layer:** VAPI SDK
- **Authentication:** Firebase Auth
- **Hosting:** Vercel (for production) or local (for development)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anshdeep0504/Interview_Ai.git
cd Interview_Ai/AI_INTERVIEWER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the `AI_INTERVIEWER` directory with the following (replace with your actual credentials):

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id
```

**Note:** For the private key, use actual newlines, not `\n`.

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 📁 Folder Structure

```
AI_INTERVIEWER/
├── app/                # Next.js app directory (routes, pages, layouts)
├── components/         # React components (UI, Interview, Feedback, etc.)
├── constants/          # App-wide constants
├── firebase/           # Firebase config and admin setup
├── lib/                # Utility functions and API logic
├── public/             # Static assets (images, icons)
├── types/              # TypeScript type definitions
├── .env.local          # Environment variables (not committed)
├── package.json
└── README.md
```

---

## 📝 Deployment

- **Production:** Deploy to [Vercel](https://vercel.com/) for best performance.
- **Local:** See steps above for local development.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [VAPI](https://vapi.ai) for the voice AI SDK
- [Firebase](https://firebase.google.com/) for backend and authentication
- [Shadcn UI](https://ui.shadcn.com/) for UI inspiration
