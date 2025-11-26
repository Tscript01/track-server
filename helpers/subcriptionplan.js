export const subscriptionPlans = {
  free: {
    name: 'free',
    maxPosts: 8,
  },
  basic: {
    name: 'basic',
    amount: 2000, 
    duration: 30, 
    features: ['Access to free content', 'Limited posts per day'],
    maxPosts: 10,
  },
  pro: {
    name: 'pro',
    amount: 5000,
    duration: 60,
    features: ['All Basic features', 'Unlimited posts', 'Ad-free experience'],
    maxPosts: 50,
  },
  premium: {
    name: 'premium',
    amount: 10000,
    duration: 90,
    features: [
      'All Pro features',
      'Early access to features',
      'Priority support',
    ],
    maxPosts: Infinity,
  },
};
