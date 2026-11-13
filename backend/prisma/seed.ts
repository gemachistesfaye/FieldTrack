import { PrismaClient, Role, ReportCategory, Priority, WorkflowStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Demo password hash for standard test accounts (placeholder standard hash for local development)
const DEMO_PASSWORD_HASH = '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ecpv5nGWpR3qjUsWW'; // Password123!

async function main() {
  console.log('🌱 Starting FieldSync database seed...');

  // 1. Clean existing records in reverse order of foreign key dependencies
  await prisma.syncEvent.deleteMany();
  await prisma.reportAttachment.deleteMany();
  await prisma.reportHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Purged existing records.');

  // 2. Create Users
  // Admin (1)
  const _admin = await prisma.user.create({
    data: {
      fullName: 'Elena Rostova',
      email: 'admin@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  // Coordinators (2)
  const coordinator1 = await prisma.user.create({
    data: {
      fullName: 'Marcus Vance',
      email: 'marcus.vance@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.COORDINATOR,
      isActive: true,
    },
  });

  const coordinator2 = await prisma.user.create({
    data: {
      fullName: 'David Kimani',
      email: 'david.kimani@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.COORDINATOR,
      isActive: true,
    },
  });

  // Field Workers (5)
  const worker1 = await prisma.user.create({
    data: {
      fullName: 'Amina Osei',
      email: 'amina.osei@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FIELD_WORKER,
      isActive: true,
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      fullName: 'Samuel Kiprop',
      email: 'samuel.kiprop@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FIELD_WORKER,
      isActive: true,
    },
  });

  const worker3 = await prisma.user.create({
    data: {
      fullName: 'Grace Mwangi',
      email: 'grace.mwangi@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FIELD_WORKER,
      isActive: true,
    },
  });

  const worker4 = await prisma.user.create({
    data: {
      fullName: 'Joseph Odhiambo',
      email: 'joseph.odhiambo@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FIELD_WORKER,
      isActive: true,
    },
  });

  const worker5 = await prisma.user.create({
    data: {
      fullName: 'Faith Cherono',
      email: 'faith.cherono@fieldsync.local',
      passwordHash: DEMO_PASSWORD_HASH,
      role: Role.FIELD_WORKER,
      isActive: true,
    },
  });

  console.log(`👤 Created 8 users (1 Admin, 2 Coordinators, 5 Field Workers).`);

  // 3. Create Sample Reports (16 realistic reports)
  const reportsData = [
    {
      clientId: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Borehole Submersible Pump Mechanical Seizure',
      description:
        'Main pump bearing seized during morning cycle. Approximately 1,400 households without water.',
      category: ReportCategory.WATER,
      location: 'Kibera District Sector 3 Borehole Well',
      latitude: -1.312015,
      longitude: 36.78421,
      priority: Priority.CRITICAL,
      status: WorkflowStatus.IN_PROGRESS,
      createdById: worker1.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-12T07:15:00Z'),
      submittedAt: new Date('2026-11-12T07:16:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Substation Transformer Feeder Busbar Overheating',
      description:
        'Thermal imaging scan detected 94°C on terminal connection under nominal 40% load.',
      category: ReportCategory.ELECTRICAL,
      location: 'North Municipal Substation Yard B',
      latitude: -1.28543,
      longitude: 36.82194,
      priority: Priority.HIGH,
      status: WorkflowStatus.ASSIGNED,
      createdById: worker2.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-12T08:30:00Z'),
      submittedAt: new Date('2026-11-12T08:35:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Secondary Distribution Valve Gasket Flange Leak',
      description:
        'Persistent 1.2 liter/sec water loss at secondary junction. Ground erosion beginning along roadway.',
      category: ReportCategory.WATER,
      location: 'East Ridge Junction 7 Manhole #14',
      latitude: -1.291,
      longitude: 36.835,
      priority: Priority.MEDIUM,
      status: WorkflowStatus.SUBMITTED,
      createdById: worker1.id,
      assignedToId: null,
      clientCreatedAt: new Date('2026-11-12T09:00:00Z'),
      submittedAt: new Date('2026-11-12T09:05:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Generator Automatic Transfer Switch (ATS) Relay Failure',
      description:
        'Standby 150kVA diesel generator fails to engage automatically upon grid outage simulation.',
      category: ReportCategory.EQUIPMENT,
      location: 'Central Water Treatment Control Room',
      latitude: -1.3005,
      longitude: 36.7902,
      priority: Priority.HIGH,
      status: WorkflowStatus.RESOLVED,
      createdById: worker3.id,
      assignedToId: coordinator2.id,
      clientCreatedAt: new Date('2026-11-11T10:00:00Z'),
      submittedAt: new Date('2026-11-11T10:02:00Z'),
      resolvedAt: new Date('2026-11-12T06:00:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Main Pedestrian Bridge Handrail Structural Compromise',
      description:
        'Support weld snapped on southwest span. Severe fall hazard over drainage culvert.',
      category: ReportCategory.INFRASTRUCTURE,
      location: 'South Perimeter Access Bridge',
      latitude: -1.3211,
      longitude: 36.7789,
      priority: Priority.CRITICAL,
      status: WorkflowStatus.IN_PROGRESS,
      createdById: worker4.id,
      assignedToId: coordinator2.id,
      clientCreatedAt: new Date('2026-11-12T11:00:00Z'),
      submittedAt: new Date('2026-11-12T11:02:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440006',
      title: 'Chlorine Dosing Sensor Drift Beyond Operational Bounds',
      description:
        'Residual telemetry reporting 0.05 mg/L while titration confirms 1.4 mg/L. Recalibration required.',
      category: ReportCategory.SAFETY,
      location: 'Treatment Plant Dosing Module 2',
      latitude: -1.298,
      longitude: 36.802,
      priority: Priority.HIGH,
      status: WorkflowStatus.ASSIGNED,
      createdById: worker3.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-12T12:00:00Z'),
      submittedAt: new Date('2026-11-12T12:04:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440007',
      title: 'Telemetry RTU Antenna Mast Snapped by Windstorm',
      description:
        'Remote station lost SCADA connection. Local visual inspection confirmed bent mast.',
      category: ReportCategory.SERVICE_INTERRUPTION,
      location: 'Hilltop Booster Station RTU-04',
      latitude: -1.274,
      longitude: 36.85,
      priority: Priority.MEDIUM,
      status: WorkflowStatus.SUBMITTED,
      createdById: worker5.id,
      assignedToId: null,
      clientCreatedAt: new Date('2026-11-12T13:10:00Z'),
      submittedAt: new Date('2026-11-12T13:15:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440008',
      title: 'Exposed High-Voltage Trench Cable Near School Crossing',
      description:
        'Erosion uncovered 11kV conduit with outer armored sheath scraped. Children play nearby.',
      category: ReportCategory.SAFETY,
      location: 'Railway Crossing km 14.2',
      latitude: -1.3156,
      longitude: 36.792,
      priority: Priority.CRITICAL,
      status: WorkflowStatus.IN_PROGRESS,
      createdById: worker4.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-12T13:40:00Z'),
      submittedAt: new Date('2026-11-12T13:42:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440009',
      title: 'Solar Inverter Cooling Fan Blocked With Grit',
      description:
        'Array 3 inverter de-rating capacity due to high heat sink temperature during midday hours.',
      category: ReportCategory.EQUIPMENT,
      location: 'Solar Farm Array #3 Inverter Kiosk',
      latitude: -1.33,
      longitude: 36.76,
      priority: Priority.LOW,
      status: WorkflowStatus.SUBMITTED,
      createdById: worker2.id,
      assignedToId: null,
      clientCreatedAt: new Date('2026-11-12T14:00:00Z'),
      submittedAt: new Date('2026-11-12T14:05:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440010',
      title: 'Public Sanitation Facility Main Line Blockage',
      description:
        'Sewage backup detected at inspection chamber #8. Needs immediate hydro-jetting.',
      category: ReportCategory.INFRASTRUCTURE,
      location: 'Community Center Wash Station Block C',
      latitude: -1.309,
      longitude: 36.788,
      priority: Priority.HIGH,
      status: WorkflowStatus.ASSIGNED,
      createdById: worker1.id,
      assignedToId: coordinator2.id,
      clientCreatedAt: new Date('2026-11-12T14:30:00Z'),
      submittedAt: new Date('2026-11-12T14:32:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440011',
      title: 'Routine Inspection Draft: Sector 6 Metering Skids',
      description:
        'Initial observations saved in local draft; checking mechanical seal integrity before finalizing.',
      category: ReportCategory.WATER,
      location: 'Sector 6 Offtake Manifold',
      latitude: -1.295,
      longitude: 36.81,
      priority: Priority.LOW,
      status: WorkflowStatus.DRAFT,
      createdById: worker5.id,
      assignedToId: null,
      clientCreatedAt: new Date('2026-11-12T15:00:00Z'),
      submittedAt: null,
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440012',
      title: 'Duplicate Submission: Pump Bearing Seizure Report',
      description: 'Re-reported by field worker unaware previous technician had already logged it.',
      category: ReportCategory.WATER,
      location: 'Kibera District Sector 3 Borehole Well',
      latitude: -1.312015,
      longitude: 36.78421,
      priority: Priority.LOW,
      status: WorkflowStatus.REJECTED,
      createdById: worker3.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-12T15:20:00Z'),
      submittedAt: new Date('2026-11-12T15:22:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440013',
      title: 'Scheduled Replacement of Sediment Filter Cartridges',
      description:
        'Cartridge differential pressure reached 1.8 bar threshold. Replacement completed successfully.',
      category: ReportCategory.WATER,
      location: 'Filtration Bank 4B',
      latitude: -1.2995,
      longitude: 36.804,
      priority: Priority.LOW,
      status: WorkflowStatus.RESOLVED,
      createdById: worker2.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-10T08:00:00Z'),
      submittedAt: new Date('2026-11-10T08:05:00Z'),
      resolvedAt: new Date('2026-11-10T14:30:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440014',
      title: 'Security Fence Perimeter Vandalism Near Reservoir',
      description: 'Razor wire cut and mesh pulled down along 4-meter section on north boundary.',
      category: ReportCategory.OTHER,
      location: 'High-Level Reservoir North Perimeter',
      latitude: -1.265,
      longitude: 36.84,
      priority: Priority.HIGH,
      status: WorkflowStatus.ASSIGNED,
      createdById: worker4.id,
      assignedToId: coordinator2.id,
      clientCreatedAt: new Date('2026-11-12T15:45:00Z'),
      submittedAt: new Date('2026-11-12T15:50:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440015',
      title: 'Low Pressure Telemetry Alert on Feeder Trunk Line A',
      description: 'Line pressure dropped below 1.5 bar threshold for 45 minutes.',
      category: ReportCategory.SERVICE_INTERRUPTION,
      location: 'Feeder Trunk A Monitoring Point #3',
      latitude: -1.288,
      longitude: 36.815,
      priority: Priority.MEDIUM,
      status: WorkflowStatus.SUBMITTED,
      createdById: worker5.id,
      assignedToId: null,
      clientCreatedAt: new Date('2026-11-12T16:00:00Z'),
      submittedAt: new Date('2026-11-12T16:05:00Z'),
    },
    {
      clientId: '550e8400-e29b-41d4-a716-446655440016',
      title: 'Streetlight Pole Leaning After Heavy Rain Near Distribution Box',
      description: 'Steel utility pole leaning 25 degrees following soil subsidence.',
      category: ReportCategory.ELECTRICAL,
      location: 'Access Road 4 Corner 2',
      latitude: -1.305,
      longitude: 36.795,
      priority: Priority.MEDIUM,
      status: WorkflowStatus.IN_PROGRESS,
      createdById: worker1.id,
      assignedToId: coordinator1.id,
      clientCreatedAt: new Date('2026-11-12T16:15:00Z'),
      submittedAt: new Date('2026-11-12T16:20:00Z'),
    },
  ];

  for (const reportItem of reportsData) {
    const report = await prisma.report.create({
      data: reportItem,
    });

    // Create Initial Creation History
    await prisma.reportHistory.create({
      data: {
        reportId: report.id,
        actorId: report.createdById,
        action: 'REPORT_CREATED',
        newValue: report.status,
        description: `Incident report registered via offline client sync. Category: ${report.category}`,
        createdAt: report.clientCreatedAt || report.createdAt,
      },
    });

    // Create Assignment and In Progress History if assigned
    if (report.assignedToId) {
      await prisma.reportHistory.create({
        data: {
          reportId: report.id,
          actorId: coordinator1.id,
          action: 'COORDINATOR_ASSIGNED',
          previousValue: 'UNASSIGNED',
          newValue: report.assignedToId,
          description: `Assigned to coordinator for regional dispatch`,
          createdAt: new Date(new Date(report.createdAt).getTime() + 1000 * 60 * 30),
        },
      });

      if (report.status === WorkflowStatus.IN_PROGRESS) {
        await prisma.reportHistory.create({
          data: {
            reportId: report.id,
            actorId: report.assignedToId,
            action: 'STATUS_UPDATED',
            previousValue: WorkflowStatus.ASSIGNED,
            newValue: WorkflowStatus.IN_PROGRESS,
            description: 'Technician dispatched to field site with repair kit',
            createdAt: new Date(new Date(report.createdAt).getTime() + 1000 * 60 * 60),
          },
        });
      }

      if (report.status === WorkflowStatus.RESOLVED) {
        await prisma.reportHistory.create({
          data: {
            reportId: report.id,
            actorId: report.assignedToId,
            action: 'STATUS_UPDATED',
            previousValue: WorkflowStatus.IN_PROGRESS,
            newValue: WorkflowStatus.RESOLVED,
            description: 'Work order completed and verified operational',
            createdAt: report.resolvedAt || new Date(),
          },
        });
      }
    }
  }

  console.log(`📋 Created ${reportsData.length} incident reports with audit histories.`);
  console.log('✅ FieldSync database seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
