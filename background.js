// Background service worker for HabitFlow Chrome extension

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('HabitFlow extension installed');
  
  // Set up default storage
  chrome.storage.local.set({
    habits: [],
    settings: {
      theme: 'light',
      notifications: true,
      aiInsights: true
    },
    lastSync: null
  });
});

// Handle habit reminders
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('habit-reminder-')) {
    const habitId = alarm.name.replace('habit-reminder-', '');
    
    chrome.storage.local.get(['habits'], (result) => {
      const habits = result.habits || [];
      const habit = habits.find(h => h.id === habitId);
      
      if (habit && habit.notifications) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'HabitFlow Reminder',
          message: `Time to ${habit.name}! 🎯`,
          buttons: [
            { title: 'Mark Complete' },
            { title: 'Skip Today' }
          ]
        });
      }
    });
  }
});

// Handle notification clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Mark complete - we'll implement this when we have the habit completion logic
    console.log('Habit marked complete from notification');
  }
  chrome.notifications.clear(notificationId);
});

// Handle messages from popup/dashboard
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setReminder') {
    const { habitId, time } = request;
    chrome.alarms.create(`habit-reminder-${habitId}`, {
      when: time,
      periodInMinutes: 24 * 60 // Daily reminder
    });
    sendResponse({ success: true });
  }
  
  if (request.action === 'clearReminder') {
    const { habitId } = request;
    chrome.alarms.clear(`habit-reminder-${habitId}`);
    sendResponse({ success: true });
  }
  
  return true; // Keep message channel open for async response
});