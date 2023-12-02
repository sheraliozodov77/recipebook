// DO node seed.js to seed DB for testing purposes. Make sure server is not running before doing so.
const mongoose = require('mongoose');
const { User, Recipe } = require('./server'); // Adjust the path as needed

const mongoDBURL = "mongodb://127.0.0.1/recipes";
mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });

const users = [
  { username: 'alice', password: 'password123' },
  { username: 'bob', password: 'password456' },
  // add more users if needed
];

const recipes = [
  { title: 'Chocolate Cake', category: 'Dessert', content: 'Instructions for chocolate cake', image: 'chocolate_cake.jpg' },
  { title: 'Caesar Salad', category: 'Salad', content: 'Instructions for Caesar salad', image: 'caesar_salad.jpg' },
  // add more recipes if needed
];

const seedDatabase = async () => {
  try {
    await User.deleteMany({}); // Clear existing data
    await Recipe.deleteMany({});

    const createdUsers = await User.insertMany(users);
    const createdRecipes = await Recipe.insertMany(recipes);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
