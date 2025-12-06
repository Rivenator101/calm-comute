# CalmCommute 🧘‍♀️🗺️

**A stress-aware navigation app that helps you find the calmest route to your destination.**

CalmCommute is an intelligent navigation system that considers your mental well-being by providing stress-color-coded routes, interactive waypoints, and built-in breathing exercises. When you need a break, it automatically finds and reroutes you to the nearest rest stop.

![CalmCommute](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-19.2.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)

## ✨ Features

### 🗺️ Interactive Map Experience
- **Stress-Color-Coded Routes**: Visual route segments color-coded by stress level (green = low, yellow = medium, red = high)
- **Clickable Route Segments**: Click any route segment to see its stress level and zoom in
- **Interactive Waypoints**: Click waypoint markers on the map to zoom to that location
- **Real-time Route Updates**: Google Maps-style interactivity with smooth animations

### 🧘 Mental Health Features
- **Breathing Exercise**: 4-7-8 breathing pattern animation when you need to calm down
- **Check-in System**: Regular prompts to assess how you're feeling during your commute
- **Auto-Reroute to Rest Stops**: When you click "I need a break", automatically finds and reroutes to:
  - Parks
  - Cafes
  - Restaurants
  - Gas stations
  - Rest areas

### 🎯 Smart Navigation
- **Google Maps Autocomplete**: Dropdown suggestions like Google Maps
- **Route Optimization**: Considers preferences like:
  - Less traffic
  - Less noise
  - Less busy areas
  - Calming scenery
  - Fewer people

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key with the following APIs enabled:
  - Directions API
  - Places API
  - Maps JavaScript API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/calm-commute.git
   cd calm-commute
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Google Maps API**
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the required APIs (Directions, Places, Maps JavaScript)
   - Update the API key in:
     - `backend/server.js` (line 16)
     - `frontend/src/App.js` (line 6)
     - `frontend/src/MapComponent.js` (line 5)

   See `API_KEY_SETUP.md` for detailed instructions.

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:5001`

6. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```
   App opens at `http://localhost:3000`

## 📁 Project Structure

```
calm-commute/
├── backend/
│   ├── server.js          # Express server with route APIs
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main app component
│   │   ├── MapComponent.js # Google Maps integration
│   │   └── App.css        # Styling
│   └── package.json
├── README.md
└── API_KEY_SETUP.md       # API setup guide
```

## 🎮 How to Use

1. **Enter your route**
   - Type your current location in the "Current location" field
   - Type your destination in the "Destination" field
   - Use autocomplete suggestions for easier input

2. **Set preferences** (optional)
   - Check boxes for route preferences (less traffic, calming scenery, etc.)

3. **Get your route**
   - Click "Get Route"
   - View your stress-color-coded route on the map
   - See waypoints and predicted stress level

4. **Interact with the map**
   - Click route segments to see stress levels
   - Click waypoint markers to zoom to locations
   - Use map controls to explore

5. **Check in during your commute**
   - Click "I'm OK" if you're doing fine
   - Click "I need a break" to automatically reroute to nearest rest stop
   - Breathing exercise will start automatically

## 🛠️ Technologies Used

- **Frontend**: React 19.2, React Google Maps API
- **Backend**: Node.js, Express, Axios
- **APIs**: Google Maps Directions API, Places API, Maps JavaScript API
- **Styling**: CSS3 with modern animations

## 🔧 API Endpoints

### `POST /api/getOptimalRoute`
Get a route with stress analysis.

**Request:**
```json
{
  "origin": "New York, NY",
  "destination": "Boston, MA",
  "preferences": ["less_traffic", "calming_scenery"]
}
```

**Response:**
```json
{
  "start": "New York, NY, USA",
  "end": "Boston, MA, USA",
  "waypoints": [...],
  "coordinates": [{ "lat": 40.7128, "lng": -74.0060, "stress": 5 }, ...],
  "predictedStress": 6
}
```

### `POST /api/findRestStop`
Find nearest rest stop (park, cafe, restaurant, etc.).

**Request:**
```json
{
  "lat": 40.7128,
  "lng": -74.0060
}
```

**Response:**
```json
{
  "name": "Central Park",
  "location": { "lat": 40.7829, "lng": -73.9654 },
  "vicinity": "New York, NY"
}
```

## 🎯 Future Enhancements

- [ ] Real-time traffic integration for stress calculation
- [ ] Machine learning for personalized stress prediction
- [ ] Integration with fitness trackers for biometric stress detection
- [ ] Social features to share calm routes
- [ ] Mobile app version (React Native)
- [ ] Voice navigation with calming prompts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Google Maps Platform for mapping services
- React community for excellent documentation
- All contributors and testers

## 📸 Screenshots

_Add screenshots of your app here!_

---

**Made with ❤️ for stress-free commutes**

