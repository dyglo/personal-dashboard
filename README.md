# Tafa - Personal Analytics Dashboard

A modern, AI-powered personal analytics dashboard with gamification features built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 📊 Analytics & Insights
- **Personal Analytics Dashboard**: Track habits, goals, and progress
- **AI-Powered Insights**: Gemini AI integration for personalized recommendations
- **Weekly Reports**: Automated progress summaries and analysis
- **Data Visualization**: Interactive charts and progress tracking

### 🎮 Gamification System
- **Mini Games**: Memory Match, Pattern Master, Lightning Reflexes, Goal Puzzle
- **Achievements**: Unlockable achievements based on progress
- **Daily Challenges**: Daily tasks to maintain engagement
- **XP System**: Experience points and leveling system
- **Rewards**: Virtual rewards and customizations

### 🤖 AI Integration
- **Natural Language Queries**: Ask questions about your data in plain English
- **Conversation Flow**: Maintain context across follow-up questions
- **Smart Recommendations**: AI-generated insights and suggestions
- **Weekly Analysis**: Automated weekly progress reports

### 📱 Modern UI/UX
- **Dark Theme**: Beautiful dark mode with yellow accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **AI Integration**: Google Gemini AI (Gemini 2.5 Flash)
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and localStorage
- **Icons**: Lucide React icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dyglo/personal-dashboard.git
   cd personal-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   ```

4. **Get your Gemini AI API key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tafa-dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── ai/           # AI endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard page
├── components/            # React components
│   ├── ui/              # Reusable UI components
│   ├── ai-insights.tsx  # AI insights component
│   ├── data-visualization.tsx # Charts and analytics
│   ├── gamification-system.tsx # Games and achievements
│   ├── goal-manager.tsx # Goal tracking
│   └── habit-tracker.tsx # Habit tracking
├── lib/                  # Utility functions
├── public/               # Static assets
│   ├── favicon.svg      # App icon
│   └── site.webmanifest # PWA manifest
└── README.md            # This file
```

## 🎮 Mini Games

### Memory Match
- Match habit-themed cards to improve memory
- Progressive difficulty with more cards per level
- Score based on efficiency and speed

### Pattern Master
- Simon Says style pattern repetition
- Adaptive speed and complexity
- Visual feedback and progress tracking

### Lightning Reflexes
- Reaction time testing with random targets
- 10-round testing system
- Average reaction time calculation

### Goal Puzzle
- Goal-themed puzzle solving
- Rotating puzzle types (word, logic, sequence)
- Progressive hint system

## 🤖 AI Features

### Natural Language Queries
- Ask questions about your habits and goals
- Maintain conversation context
- Get personalized insights and recommendations

### Weekly Reports
- Automated progress analysis
- Achievement tracking
- Personalized recommendations

### Smart Insights
- Pattern recognition in your data
- Behavioral analysis
- Actionable recommendations

## 🎨 Design System

### Colors
- **Primary**: `#fbbe05` (Yellow)
- **Background**: `#000000` (Black)
- **Card**: `#1a1a1a` (Dark Gray)
- **Text**: `#ffffff` (White)
- **Muted**: `#666666` (Gray)

### Typography
- **Primary Font**: DM Sans
- **Monospace**: Geist Mono

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Mobile-first design with optimized navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ and ☕ by the Tafa team**
