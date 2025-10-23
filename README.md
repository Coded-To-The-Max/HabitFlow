# 🎯 HabitFlow - AI-Powered Chrome Extension Habit Tracker

A modern, minimal, and intelligent habit tracker Chrome extension with AI-powered insights and motivational reminders.

![HabitFlow Screenshot](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎨 **Modern UI/UX**
- Clean, distraction-free interface
- Light/Dark mode toggle with system preference detection
- Smooth animations and micro-interactions
- Responsive design optimized for Chrome extension popup

### 📊 **Habit Management**
- Create, edit, and delete habits with ease
- 10+ predefined categories (Health, Fitness, Learning, Productivity, etc.)
- Custom icons and colors for visual organization
- Flexible frequency settings (daily, weekly, custom)
- Smart reminder notifications

### 📈 **Progress Tracking**
- Real-time completion tracking
- Streak counters with visual feedback
- Calendar view for historical data
- Completion percentage and progress bars
- Weekly and monthly statistics

### 🤖 **AI-Powered Insights**
- Personalized habit suggestions based on completion patterns
- Motivational reminders tailored to your progress
- Optimal timing recommendations using historical data
- Smart insights about consistency and improvement areas
- AI-generated progress summaries

### 🔔 **Smart Notifications**
- Browser notifications for habit reminders
- Customizable reminder times
- Streak celebration notifications
- Progress milestone alerts

### 💾 **Local Storage**
- All data stored locally in browser (privacy-focused)
- Fast performance with IndexedDB
- No account required to get started
- Modular architecture ready for cloud sync integration

## 🚀 Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Download/Clone the Extension**
   ```bash
   git clone <repository-url>
   cd habitflow-chrome-extension
   ```

2. **Install Dependencies & Build**
   ```bash
   npm install
   npm run build
   ```

3. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" button
   - Select the project folder (`/app`)
   - The HabitFlow extension will appear in your extensions

4. **Pin Extension (Optional)**
   - Click the Extensions icon (puzzle piece) in Chrome toolbar
   - Pin HabitFlow for easy access

### Method 2: Development Mode
```bash
npm run dev    # Watches for changes and rebuilds automatically
```

## 📖 Usage Guide

### 🎯 **Getting Started**
1. Click the HabitFlow icon in your Chrome toolbar
2. Click the blue "+" button to add your first habit
3. Fill in habit details:
   - **Name**: e.g., "Drink 8 glasses of water"
   - **Description**: Optional details
   - **Category**: Choose from 10 categories
   - **Icon & Color**: Personalize your habit
   - **Reminders**: Set notification times
   - **Target Days**: Select which days to track

### ✅ **Daily Tracking**
1. Open the extension popup each day
2. Click the circle next to each habit to mark as complete
3. Watch your streaks grow with visual celebrations
4. View progress in the quick stats cards

### 📊 **Dashboard View**
1. Click the "External Link" icon in the popup header
2. Opens full dashboard in a new tab
3. View detailed statistics and insights
4. Generate AI-powered recommendations

### 🤖 **AI Insights**
1. Enable AI insights in Settings (gear icon)
2. Click "Generate AI Insights" in dashboard
3. Receive personalized suggestions and motivation
4. Get optimal timing recommendations

## 🛠️ Technical Architecture

### **Frontend Stack**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library

### **Chrome Extension APIs**
- **Storage API** - Local data persistence
- **Notifications API** - Reminder system
- **Alarms API** - Scheduled notifications
- **Runtime API** - Background processing

### **AI Integration**
- **OpenAI GPT-4** - Intelligent insights generation
- **Smart Analytics** - Pattern recognition
- **Personalized Recommendations** - Context-aware suggestions

### **File Structure**
```
/app/
├── manifest.json           # Extension configuration
├── popup.html             # Popup interface
├── dashboard.html         # Full dashboard
├── background.js          # Service worker
├── src/
│   ├── popup/            # Popup React app
│   ├── dashboard/        # Dashboard React app
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   └── services/         # AI and storage services
└── icons/                # Extension icons
```

## 🎨 Customization

### **Adding New Categories**
Edit `src/popup/components/AddHabitModal.tsx`:
```typescript
const categories = [
  { value: 'custom', label: 'Custom', description: 'Your category' },
  // ... existing categories
];
```

### **Custom Themes**
Modify `tailwind.config.js` for custom color schemes:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
    }
  }
}
```

### **AI Prompts**
Customize AI behavior in `src/services/aiService.ts`:
```typescript
// Modify system prompts and response parsing
const systemPrompt = 'Your custom AI instructions...';
```

## 🔧 Development

### **Build Commands**
```bash
npm run build      # Production build
npm run dev        # Development with watch mode
npm run type-check # TypeScript validation
```

### **Debugging**
1. **Popup Issues**: Right-click extension icon → "Inspect popup"
2. **Background Script**: Go to `chrome://extensions/` → Click "Inspect views: background page"
3. **Dashboard**: Open dashboard and use browser DevTools normally

### **Hot Reload**
- Frontend/React changes reload automatically in development mode
- Manifest/background script changes require extension reload

## 📱 Browser Compatibility

- ✅ **Chrome 88+** (Manifest V3 support)
- ✅ **Edge 88+** (Chromium-based)
- ⚠️ **Firefox** (requires Manifest V2 adaptation)
- ❌ **Safari** (different extension system)

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Install dependencies: `npm install`
3. Make changes in `src/` directory
4. Test with `npm run dev`
5. Build with `npm run build`
6. Submit pull request

### **Contribution Areas**
- 🎨 **UI/UX improvements**
- 🤖 **AI prompt optimization**
- 📊 **New analytics features**
- 🔔 **Enhanced notifications**
- 🌐 **Internationalization**
- ☁️ **Cloud sync integration**

## 🎯 Roadmap

### **Phase 1: Core Features** ✅
- [x] Basic habit CRUD operations
- [x] Local storage and data persistence
- [x] Streak tracking and statistics
- [x] Modern popup interface
- [x] AI insights integration

### **Phase 2: Enhanced Analytics** 🔄
- [ ] Calendar heatmap visualization
- [ ] Detailed progress charts
- [ ] Habit correlation analysis
- [ ] Export data functionality
- [ ] Advanced streak statistics

### **Phase 3: Social & Sync** 📅
- [ ] Cloud sync with authentication
- [ ] Habit sharing and communities
- [ ] Goal setting and challenges
- [ ] Progress sharing features
- [ ] Team habit tracking

### **Phase 4: Gamification** 🎮
- [ ] Achievement badges system
- [ ] Level progression
- [ ] Habit challenges
- [ ] Reward points system
- [ ] Leaderboards

## 📄 License

GNU License - see LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** - AI insights and recommendations
- **Lucide** - Beautiful icon library
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Excellent UI library

---

**Built with ❤️ for productive habit building**

*HabitFlow - Your AI-powered companion for building lasting habits*
