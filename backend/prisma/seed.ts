import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Standard initial password hash for the 3 accounts (Password123!)
const INITIAL_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

async function main() {
  console.log('🧹 Purging all demo data, fake reports, and extra users...');

  // 1. Clean existing records in reverse order of foreign key dependencies
  await prisma.syncEvent.deleteMany();
  await prisma.reportAttachment.deleteMany();
  await prisma.reportHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Purged all demo reports, fake data, and temporary records.');

  // 2. Create the 3 official accounts
  console.log('👤 Creating the 3 core accounts...');

  // 1 System Admin
  const admin = await prisma.user.create({
    data: {
      fullName: 'System Administrator',
      email: 'admin@fieldsync.local',
      passwordHash: INITIAL_PASSWORD_HASH,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  // 1 Coordinator
  const coordinator = await prisma.user.create({
    data: {
      fullName: 'Marcus Vance',
      email: 'marcus.vance@fieldsync.local',
      passwordHash: INITIAL_PASSWORD_HASH,
      role: Role.COORDINATOR,
      isActive: true,
    },
  });

  // 1 Field Worker
  const worker = await prisma.user.create({
    data: {
      fullName: 'Amina Osei',
      email: 'amina.osei@fieldsync.local',
      passwordHash: INITIAL_PASSWORD_HASH,
      role: Role.FIELD_WORKER,
      isActive: true,
    },
  });

  console.log('--------------------------------------------------');
  console.log('✨ Clean database ready with exactly 3 accounts:');
  console.log(`1. Admin:        ${admin.email} (${admin.fullName})`);
  console.log(`2. Coordinator:  ${coordinator.email} (${coordinator.fullName})`);
  console.log(`3. Field Worker: ${worker.email} (${worker.fullName})`);
  console.log('Password for all 3: Password123!');
  console.log('All fake reports, demo histories, and extra users removed.');
  console.log('--------------------------------------------------');
}

main()
  .catch(e => {
    console.error('Seed execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
