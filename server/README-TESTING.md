# 🎴 CrossCribbs Game Testing Guide

This guide shows you how to test your CrossCribbs game both graphically and programmatically.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test the game!**

## 🎮 Graphical Testing (Recommended)

Open your browser and go to:
```
http://localhost:4000/test-game
```

This gives you a beautiful visual interface where you can:
- **See the game board** - 5x5 grid with the center card
- **View player hands** - Click cards to select them
- **Play the game** - Click board positions to place cards
- **Track game state** - Current turn, scores, spots left
- **Control the game** - Reset, next round, show scores
- **Monitor logs** - Real-time game activity

### How to Use the Graphical Interface:

1. **Select a card** from the current player's hand (highlighted)
2. **Click a green dot** on the board to place the card
3. **Watch turns alternate** between players
4. **Use control buttons** to manage the game
5. **Check the log** for detailed game events

## 🔧 Programmatic Testing

### Test the GameController Class:

```bash
npm test
```

This runs comprehensive tests that:
- ✅ Create new games
- ✅ Test card selection
- ✅ Validate card placement
- ✅ Test turn management
- ✅ Simulate full rounds
- ✅ Test round endings
- ✅ Test game resets
- ✅ Validate game state

### Test HTTP Endpoints:

```bash
# Health check
curl http://localhost:4000/api/health

# Game state
curl http://localhost:4000/api/game/state
```

## 🧪 What Gets Tested

### Game Mechanics:
- **Card selection** - Players can only select cards on their turn
- **Card placement** - Cards can only go in empty positions
- **Turn management** - Turns alternate correctly between players
- **Hand management** - Cards are removed from hands when played
- **Board state** - 5x5 grid with center card placement
- **Game flow** - Rounds progress correctly

### Game State:
- **Board representation** - 5x5 array with card objects
- **Player hands** - 12 cards each, properly managed
- **Turn tracking** - Current player indicator
- **Score calculation** - Round and total scores
- **Game progression** - Round endings and new rounds

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use:**
   ```bash
   # Windows
   netstat -ano | findstr :4000
   
   # Mac/Linux
   lsof -i :4000
   ```

2. **Module not found errors:**
   ```bash
   npm install
   ```

3. **Browser won't load:**
   - Check server is running
   - Verify port 3001 is accessible
   - Check browser console for errors

### Debug Mode:

Add this to your server for more detailed Socket.IO logs:
```javascript
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
  debug: true  // Add this line
});
```

## 📊 Testing Results

When you run the tests, you should see:
- ✅ All 10 test categories pass
- 📊 Detailed game state information
- 🔄 Proper turn alternation
- 🎯 Valid move validation
- 🏁 Round completion
- 🔄 Game reset functionality

## 🎯 Next Steps

After testing:
1. **Integrate with your React app** - Connect the GameController to your frontend
2. **Add multiplayer support** - Use Socket.IO for real-time game updates
3. **Implement scoring** - Connect to your scoring system
4. **Add game persistence** - Save game states to database
5. **Create AI players** - Add computer opponents

## 🆘 Need Help?

- Check the browser console for JavaScript errors
- Check the server console for Node.js errors
- Verify all dependencies are installed
- Ensure the server is running on port 4000

Happy testing! 🎴✨
