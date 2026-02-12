const readline = require('readline');

// Terminal Interface Configuration
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Dash character (can be changed to '━', '═', or '-')
// The character '─' is the Box Drawings Light Horizontal
const DASH_CHAR = "─"; 

/**
 * Main Generator Function
 * Centers text by calculating left and right padding.
 */
function generateCategory(text, totalLength) {
  const textLen = text.length;
  const remainingSpace = totalLength - textLen;

  // If text is longer than target, return original text
  if (remainingSpace <= 0) {
    return text;
  }

  // Split remaining space left and right
  // Using floor/ceil to handle odd numbers gracefully
  const leftSize = Math.floor(remainingSpace / 2);
  const rightSize = Math.ceil(remainingSpace / 2);

  // Create dash strings
  const leftLine = DASH_CHAR.repeat(leftSize);
  const rightLine = DASH_CHAR.repeat(rightSize);

  return `${leftLine}${text}${rightLine}`;
}

// Clear terminal screen
console.clear();
console.log("\x1b[36m%s\x1b[0m", "=== DISCORD CATEGORY GENERATOR ===");
console.log("Type your category text and press Enter.");
console.log("Press 'Ctrl + C' to exit.\n");

// Start program by asking for total length
rl.question('Enter total character length (Default: 25): ', (answer) => {
  
  // Set default to 25 if user presses enter directly
  const totalWidth = answer.trim() === '' ? 25 : parseInt(answer);
  
  // Validation: Ensure input is a number
  if (isNaN(totalWidth)) {
    console.log("Error: Please enter a valid number. Restart the program.");
    rl.close();
    return;
  }

  console.log(`\nTarget Length: [${totalWidth}] chars. Dash Style: '${DASH_CHAR}'`);
  console.log("----------------------------------------------------\n");

  // Set prompt so user knows where to type
  rl.setPrompt('Input Text > ');
  rl.prompt();

  // Event listener for every Enter key press
  rl.on('line', (line) => {
    const input = line.trim();
    
    if (input) {
      const result = generateCategory(input, totalWidth);
      console.log(`\nResult (Copy this):\n${result}\n`);
    }

    rl.prompt(); // Show prompt again for next input
  }).on('close', () => {
    console.log('\nGoodbye!');
    process.exit(0);
  });
});
