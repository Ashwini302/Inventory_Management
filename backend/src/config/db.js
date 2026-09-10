import mongoose from 'mongoose';

const seedInitialData = async () => {
  try {
    const Product = mongoose.model('Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding initial sample products into database...');
      await Product.insertMany([
        {
          name: 'Wireless Ergonomic Mouse',
          category: 'Electronics',
          price: 1499,
          quantity: 25,
          minStock: 5,
        },
        {
          name: 'Mechanical Gaming Keyboard',
          category: 'Electronics',
          price: 4500,
          quantity: 4,
          minStock: 10,
        },
        {
          name: 'Standing Desk Converter',
          category: 'Furniture',
          price: 12500,
          quantity: 12,
          minStock: 3,
        },
        {
          name: 'Ergonomic Office Chair',
          category: 'Furniture',
          price: 8999,
          quantity: 2,
          minStock: 5,
        },
        {
          name: 'A5 Executive Notebook',
          category: 'Stationery',
          price: 299,
          quantity: 50,
          minStock: 15,
        },
        {
          name: 'Gel Ink Pen Set (Pack of 10)',
          category: 'Stationery',
          price: 199,
          quantity: 3,
          minStock: 8,
        },
      ]);
      console.log('Initial sample products seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding initial data:', err.message);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_db';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`Standard MongoDB connection failed (${error.message}). Attempting MongoDB Memory Server fallback for local testing...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Memory Server connected successfully: ${conn.connection.host}`);
      await seedInitialData();
    } catch (memError) {
      console.error('MongoDB Connection Error:', error.message);
      console.error('Memory Server Fallback Error:', memError.message);
      process.exit(1);
    }
  }
};
