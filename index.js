
import dbConnect from './connections/database.js';
import app from './app.js';
const startServer = async () => {
  try {
    // Connect to database first
    await dbConnect();
    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () => {
      console.log('Server is running on port', PORT);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    // Don't exit in serverless - let Vercel handle it
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

// Start the server
startServer();
