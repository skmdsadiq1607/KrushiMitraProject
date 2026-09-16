import mongoose from '../server/node_modules/mongoose/index.js';
import dotenv from '../server/node_modules/dotenv/lib/main.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Crop } from '../server/src/models/Crop.js';
import { Disease } from '../server/src/models/Disease.js';
import { FieldReport } from '../server/src/models/FieldReport.js';
import { Diagnosis } from '../server/src/models/Diagnosis.js';
import { User } from '../server/src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crop_health_ai';

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected successfully.');

    // 1. Seed Demo User
    await User.deleteMany({ email: 'farmer@krushimitra.org' });
    const demoUser = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@krushimitra.org',
      password: 'farmerpassword123',
      role: 'farmer',
      farmLocation: { state: 'Maharashtra', district: 'Pune' },
      primaryCrops: ['Tomato', 'Soybean', 'Cotton']
    });
    console.log(`✓ Seeded Demo User: ${demoUser.email} (Password: farmerpassword123)`);

    // 2. Seed Crops
    const cropsFile = path.resolve(__dirname, '../knowledge-base/crops/crops.json');
    if (fs.existsSync(cropsFile)) {
      const cropsData = JSON.parse(fs.readFileSync(cropsFile, 'utf-8'));
      await Crop.deleteMany({});
      await Crop.insertMany(cropsData);
      console.log(`✓ Seeded ${cropsData.length} Crops into database.`);
    }

    // 3. Seed Diseases & Pests
    const diseasesFile = path.resolve(__dirname, '../knowledge-base/diseases/diseases.json');
    const pestsFile = path.resolve(__dirname, '../knowledge-base/pests/pests.json');
    let allDiseases = [];
    if (fs.existsSync(diseasesFile)) {
      allDiseases = [...allDiseases, ...JSON.parse(fs.readFileSync(diseasesFile, 'utf-8'))];
    }
    if (fs.existsSync(pestsFile)) {
      allDiseases = [...allDiseases, ...JSON.parse(fs.readFileSync(pestsFile, 'utf-8'))];
    }
    if (allDiseases.length > 0) {
      await Disease.deleteMany({});
      await Disease.insertMany(allDiseases);
      console.log(`✓ Seeded ${allDiseases.length} Disease & Pest profiles into database.`);
    }

    // 4. Seed Sample Reports
    const reportsFile = path.resolve(__dirname, '../data/demo/sampleReports.json');
    if (fs.existsSync(reportsFile)) {
      const reportsData = JSON.parse(fs.readFileSync(reportsFile, 'utf-8')).map(r => ({
        ...r,
        userId: demoUser._id
      }));
      await FieldReport.deleteMany({});
      await FieldReport.insertMany(reportsData);
      console.log(`✓ Seeded ${reportsData.length} Field Reports for map view.`);
    }

    // 5. Seed Sample Diagnoses
    const diagnosesFile = path.resolve(__dirname, '../data/demo/sampleDiagnoses.json');
    if (fs.existsSync(diagnosesFile)) {
      const diagData = JSON.parse(fs.readFileSync(diagnosesFile, 'utf-8')).map(d => ({
        ...d,
        userId: demoUser._id,
        _id: undefined
      }));
      await Diagnosis.deleteMany({});
      await Diagnosis.insertMany(diagData);
      console.log(`✓ Seeded ${diagData.length} Diagnosis history records.`);
    }

    console.log('\n🌟 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error (Notice: If MongoDB is offline, the app utilizes built-in in-memory fallback):', error.message);
    process.exit(0);
  }
};

seed();
