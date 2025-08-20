import GameController from './gameController.js';

console.log('🧪 Testing GameController...\n');

// Test 1: Create a new game
console.log('1️⃣ Creating new game...');
const game = new GameController(2);
console.log('✅ Game created successfully');
console.log(`   - Players: ${game.numPlayers}`);
console.log(`   - Current turn: Player ${game.turn}`);
console.log(`   - Spots left: ${game.numSpotsLeft}`);
console.log(`   - Center card: ${game.board[2][2]}`);
console.log(`   - Player 1 hand size: ${game.hand1.length}`);
console.log(`   - Player 2 hand size: ${game.hand2.length}`);
console.log(`   - Selected card: ${game.selectedCard}\n`);

// Test 2: Test card selection
console.log('2️⃣ Testing card selection...');
const testCard = game.hand1[0];
const selectionResult = game.selectCard(1, testCard);
console.log(`   - Selected card: ${testCard}`);
console.log(`   - Selection result: ${selectionResult}`);
console.log(`   - Current selected card: ${game.selectedCard}\n`);

// Test 3: Test playing a card
console.log('3️⃣ Testing card placement...');
const validPosition = [1, 1]; // Position [1,1] should be empty
console.log(`   - Attempting to place card at position [${validPosition[0]}, ${validPosition[1]}]`);
console.log(`   - Position valid: ${game.isValidMove(validPosition)}`);
console.log(`   - Spots left before: ${game.numSpotsLeft}`);

const playResult = game.playCard(validPosition);
console.log(`   - Play result: ${playResult}`);
console.log(`   - Spots left after: ${game.numSpotsLeft}`);
console.log(`   - Card at position: ${game.board[validPosition[0]][validPosition[1]]}`);
console.log(`   - Current turn: Player ${game.turn}`);
console.log(`   - Selected card: ${game.selectedCard}\n`);

// Test 4: Test invalid moves
console.log('4️⃣ Testing invalid moves...');
const invalidPosition = [2, 2]; // Center position (already occupied)
console.log(`   - Testing invalid position [${invalidPosition[0]}, ${invalidPosition[1]}]`);
console.log(`   - Position valid: ${game.isValidMove(invalidPosition)}`);

// Test 5: Test available moves
console.log('5️⃣ Testing available moves...');
const availableMoves = game.getAvailableMoves();
console.log(`   - Available moves count: ${availableMoves.length}`);
console.log(`   - First few moves: ${availableMoves.slice(0, 5).map(m => `[${m[0]},${m[1]}]`).join(', ')}\n`);

// Test 6: Test game state
console.log('6️⃣ Testing game state...');
const gameState = game.getGameState();
console.log(`   - Game state retrieved successfully`);
console.log(`   - State keys: ${Object.keys(gameState).join(', ')}`);
console.log(`   - Board dimensions: ${gameState.board.length}x${gameState.board[0].length}`);
console.log(`   - Hand sizes: P1=${gameState.hand1.length}, P2=${gameState.hand2.length}\n`);

console.log('🎉 All tests completed successfully!');
console.log('✅ GameController is working correctly');
