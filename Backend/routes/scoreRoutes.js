import express from 'express';


const router = express.Router();

// POST /api/v2/Quizdb/users/score
router.post('/users/score', async (req, res) => {
  try {
    const { userId, score } = req.body;

    // Validate input
    if (!userId || score === undefined) {
      return res.status(400).json({ message: 'userId and score are required' });
    }

    // Update user's score
    const user = await User.findByIdAndUpdate(
      userId,
      { score },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Score updated successfully', user });
  } catch (err) {
    console.error('Error updating score:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;