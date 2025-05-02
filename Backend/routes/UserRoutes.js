
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// List all collections
router.get('/collections', async (req, res) => {
  try {
    if (!mongoose.connection || !mongoose.connection.db) {
      return res.status(500).json({ error: 'Database connection not established' });
    }
        
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.status(200).json(collections.map(collection => collection.name));
  } catch (err) {
    console.error('Error listing collections:', err);
    res.status(500).json({ error: 'Failed to list collections' });
  }
});

// Get users with scores for admin dashboard
router.get('/users', async (req, res) => {
  try {
    if (!mongoose.connection || !mongoose.connection.db) {
      return res.status(500).json({ error: 'Database connection not established' });
    }
        
    // Get users from your users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
        
    // Check if you have a scores collection
    let scores = [];
    try {
      scores = await mongoose.connection.db.collection('scores').find({}).toArray();
    } catch (err) {
      console.log('No scores collection found or other error:', err.message);
    }
        
    // Combine user data with scores
    const usersWithScores = users.map(user => {
      // Find a matching score for this user
      const userScore = scores.find(score => 
        score.userId && 
        score.userId.toString() === user._id.toString()
      );
            
      // Return user data with score
      return {
        _id: user._id,
        name: user.name,  // Use the name field from your user data
        score: userScore ? userScore.score : 0,  // Use score if exists, otherwise 0
        role: user.role
      };
    });
        
    console.log('Found users with scores:', usersWithScores);
    res.status(200).json(usersWithScores);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create a route to add or update user scores
router.post('/scores', async (req, res) => {
  try {
    if (!mongoose.connection || !mongoose.connection.db) {
      return res.status(500).json({ error: 'Database connection not established' });
    }
        
    const { userId, score } = req.body;
        
    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'User ID and score are required' });
    }
        
    // Check if user exists
    const user = await mongoose.connection.db.collection('users').findOne({ 
      _id: new mongoose.Types.ObjectId(userId) 
    });
        
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
        
    // Check if scores collection exists, create if needed
    const collections = await mongoose.connection.db.listCollections({ name: 'scores' }).toArray();
    if (collections.length === 0) {
      await mongoose.connection.db.createCollection('scores');
    }
        
    // Update or insert score
    const result = await mongoose.connection.db.collection('scores').updateOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { 
        $set: {
          userId: new mongoose.Types.ObjectId(userId),
          score: score,
          updatedAt: new Date()
        }
      },
      { upsert: true } // Create if doesn't exist
    );
        
    // Also update the score in the user document for convenience
    await mongoose.connection.db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { score: score } }
    );
    
    res.status(200).json({ 
      message: 'Score updated successfully', 
      result,
      score
    });
  } catch (err) {
    console.error('Error updating score:', err);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// For backward compatibility - redirect to scores endpoint
router.post('/users/score', async (req, res) => {
  try {
    const { userId, score } = req.body;
    
    // Simple redirect to the /scores endpoint
    if (!userId || score === undefined) {
      return res.status(400).json({ message: 'userId and score are required' });
    }
    
    // Forward to the scores endpoint
    const response = await mongoose.connection.db.collection('scores').updateOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { 
        $set: {
          userId: new mongoose.Types.ObjectId(userId),
          score: score,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    // Also update user document
    const user = await mongoose.connection.db.collection('users').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { score: score } },
      { returnDocument: 'after' }
    );
    
    res.json({ message: 'Score updated successfully', user: user.value });
  } catch (err) {
    console.error('Error updating score:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;