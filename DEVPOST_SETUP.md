# Devpost Submission Guide

## Required Information for Devpost

### 1. Project Title
**CalmCommute - Stress-Aware Navigation**

### 2. Tagline/Subtitle
"A navigation app that helps you find the calmest route to your destination"

### 3. Description

**Problem:**
Daily commutes can be stressful, and traditional navigation apps don't consider mental well-being. They optimize for speed and distance, but not for your peace of mind.

**Solution:**
CalmCommute is an intelligent navigation system that:
- Provides stress-color-coded routes so you can see which parts of your journey might be more stressful
- Offers interactive waypoints and route segments you can click to explore
- Includes built-in breathing exercises for when you need to calm down
- Automatically finds and reroutes to rest stops (parks, cafes, rest areas) when you need a break
- Considers your preferences like less traffic, calming scenery, and quieter routes

**How it works:**
1. Enter your origin and destination
2. Get a route color-coded by stress levels (green = low, yellow = medium, red = high)
3. Interact with the map - click route segments to see stress details, click waypoints to zoom
4. During your commute, check in with how you're feeling
5. If you need a break, click "I need a break" and it automatically reroutes you to the nearest rest stop

**Technologies:**
- React 19.2 for the frontend
- Node.js/Express for the backend
- Google Maps Platform (Directions API, Places API, Maps JavaScript API)
- Real-time route optimization and stress analysis

### 4. Inspiration
We wanted to create a navigation app that prioritizes mental health and well-being, not just getting from point A to point B as quickly as possible.

### 5. What it does
- Stress-color-coded route visualization
- Interactive map with clickable waypoints and route segments
- Automatic rest stop finding and rerouting
- Built-in breathing exercises
- Preference-based route optimization

### 6. How we built it
- **Frontend**: React with Google Maps integration for interactive mapping
- **Backend**: Express.js server handling route calculations and Places API calls
- **APIs**: Google Maps Directions API for routes, Places API for finding rest stops
- **Features**: Stress analysis algorithm, real-time route updates, interactive UI

### 7. Challenges we ran into
- Setting up Google Maps API keys and restrictions
- Implementing interactive map features (clickable segments, waypoints)
- Creating smooth animations for the breathing exercise
- Integrating multiple Google Maps APIs (Directions, Places, JavaScript)

### 8. Accomplishments we're proud of
- Fully functional stress-aware navigation system
- Interactive map with Google Maps-style features
- Automatic rest stop finding and rerouting
- Beautiful, user-friendly interface
- Real-time route updates and stress visualization

### 9. What we learned
- Google Maps Platform API integration
- React state management for complex map interactions
- Building mental health features into navigation apps
- Creating interactive, clickable map elements

### 10. What's next
- Machine learning for personalized stress prediction
- Integration with fitness trackers for biometric stress detection
- Real-time traffic data integration
- Mobile app version
- Social features to share calm routes

## Screenshots/Videos Needed

### Required:
1. **Main screenshot**: App showing a route with stress-color-coded segments
2. **Feature screenshot**: Interactive waypoints or route segments being clicked
3. **Feature screenshot**: "I need a break" feature showing reroute to rest stop
4. **Demo video** (2-3 minutes): Walkthrough of all features

### Screenshot Ideas:
- Map with green/yellow/red route segments
- Clicking on a route segment showing stress level popup
- Clicking on a waypoint marker
- "I need a break" button and resulting reroute
- Breathing exercise animation
- Autocomplete dropdown

## Submission Checklist

- [ ] GitHub repository is public and linked
- [ ] README.md is complete with setup instructions
- [ ] Screenshots added (at least 3-5)
- [ ] Demo video uploaded (YouTube/Vimeo) and embedded
- [ ] All team members added
- [ ] Technologies/tools listed
- [ ] Devpost description filled out completely
- [ ] Project is working and accessible
- [ ] API keys are properly restricted (for security)

## Tips for Devpost

1. **Make it visual**: Screenshots and videos are crucial
2. **Tell a story**: Explain the problem and how your solution helps
3. **Show, don't just tell**: Demo video is worth 1000 words
4. **Be specific**: Mention exact technologies and features
5. **Highlight innovation**: What makes your app unique?

## Demo Video Script (2-3 minutes)

1. **Introduction (30s)**: "CalmCommute is a stress-aware navigation app..."
2. **Problem (20s)**: "Traditional navigation doesn't consider mental health..."
3. **Demo (90s)**:
   - Show entering origin/destination
   - Show stress-color-coded route
   - Click route segment to show stress level
   - Click waypoint marker
   - Show "I need a break" feature
   - Show breathing exercise
4. **Conclusion (20s)**: "Built with React, Node.js, and Google Maps APIs..."

Good luck with your submission! 🚀

