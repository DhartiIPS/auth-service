import * as bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { User } from '../entities/user.entity';
import { Role } from '../enums/role.enum';

async function seedDatabase() {
  try {
    // Initialize the data source
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if test user already exists
    const existingUser = await userRepository.findOne({
      where: { email: 'jenish@yopmail.com' },
    });

    if (existingUser) {
      console.log('✅ Test user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Test@123', 10);

    // Create test user
    const testUser = userRepository.create({
      email: 'jenish@yopmail.com',
      password: hashedPassword,
      full_name: 'Jenish Test',
      role: Role.PATIENT,
      phone: '1234567890',
      age: 30,
      gender: 'Male',
      blood_group: 'O+',
      address: 'Test Address',
    });

    await userRepository.save(testUser);
    console.log('✅ Test user created successfully');
    console.log('Email: jenish@yopmail.com');
    console.log('Password: Test@123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seedDatabase();
