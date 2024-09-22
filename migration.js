const mongoose = require('mongoose');
const Listing = require('./models/listing.js'); // Adjust path as needed

mongoose.connect('mongodb://localhost:27017/wanderquest');

async function migrateImageField() {
  const listings = await Listing.find({ 'image': { $type: 'string' } });

  for (let listing of listings) {
    listing.image = {
      url: listing.image,
      filename: 'default-filename', // or generate a filename if needed
    };
    await listing.save();
  }

  console.log('Migration completed');
  mongoose.connection.close();
}

migrateImageField().catch(err => console.error(err));
