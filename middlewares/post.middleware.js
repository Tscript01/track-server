import { subscriptionPlans } from '../helpers/subcriptionplan.js';
import User from '../models/user.model.js';

export const checkPostLimit = async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const plan = subscriptionPlans[user.subscriptionPlan];
    const now = new Date();

    if (user.subscriptionExpires && now > user.subscriptionExpires) {
      user.subscriptionPlan = 'free';
      user.isSubscribed = false;
      user.postCount = 0;
      user.subscriptionExpires = null;
      await user.save();

      return res
        .status(403)
        .json({ message: 'Subscription expired. Please renew.' });
    }

    // Reset post count if 30 days passed since last reset
    const daysSinceReset =
      (now - new Date(user.lastPostReset)) / (1000 * 60 * 60 * 24);

    if (daysSinceReset > plan.duration) {
      user.postCount = 0;
      user.lastPostReset = now;
      await user.save();
    }

    // Check post limit
    if (user.postCount >= plan.maxPosts) {
      return res.status(403).json({
        message: `You have reached your post limit (${plan.maxPosts}) for the ${plan.name} kindly ugrade your plan to make more post.`,
      });
    }

    // Allow posting, increment count
    user.postCount += 1;
    await user.save();

    next();
  } catch (error) {
    console.error('Post limit check error:', error);
next(error)
  }
};
