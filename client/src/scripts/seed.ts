import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOWER_PRIMARY_SUBJECTS = [
  { name: 'English', icon: 'Globe2', color: '#7c3aed' },
  { name: 'Kiswahili', icon: 'BookOpen', color: '#e11d48' },
  { name: 'Mathematics', icon: 'Calculator', color: '#fbbf24' },
  { name: 'Environmental Activities', icon: 'Globe2', color: '#059669' },
  { name: 'Hygiene & Nutrition', icon: 'Sparkles', color: '#0d9488' },
  { name: 'Creative & Movement Activities', icon: 'Palette', color: '#0ea5e9' }
];

const MIDDLE_SCHOOL_SUBJECTS = [
  { name: 'English', icon: 'Globe2', color: '#7c3aed' },
  { name: 'Kiswahili', icon: 'BookOpen', color: '#e11d48' },
  { name: 'Mathematics', icon: 'Calculator', color: '#fbbf24' },
  { name: 'Science & Technology', icon: 'FlaskConical', color: '#0d9488' },
  { name: 'Social Studies', icon: 'Globe2', color: '#ea580c' },
  { name: 'Agriculture & Nutrition', icon: 'Sparkles', color: '#65a30d' },
  { name: 'Creative Arts', icon: 'Palette', color: '#0ea5e9' },
  { name: 'Physical & Health Education', icon: 'Flame', color: '#dc2626' },
  { name: 'Religious Education', icon: 'BookOpen', color: '#8b5cf6' }
];

const JUNIOR_SCHOOL_CORE = [
  { name: 'English', icon: 'Globe2', color: '#7c3aed' },
  { name: 'Kiswahili', icon: 'BookOpen', color: '#e11d48' },
  { name: 'Mathematics', icon: 'Calculator', color: '#fbbf24' },
  { name: 'Integrated Science', icon: 'FlaskConical', color: '#0d9488' },
  { name: 'Social Studies', icon: 'Globe2', color: '#ea580c' },
  { name: 'Pre-Technical Studies', icon: 'Calculator', color: '#2563eb' },
  { name: 'Business Studies', icon: 'Trophy', color: '#d97706' },
  { name: 'Agriculture & Nutrition', icon: 'Sparkles', color: '#65a30d' },
  { name: 'Religious Education', icon: 'BookOpen', color: '#8b5cf6' },
  { name: 'Health Education', icon: 'Flame', color: '#dc2626' },
  { name: 'Life Skills Education', icon: 'Sparkles', color: '#0ea5e9' },
  { name: 'Sports & Physical Education', icon: 'Flame', color: '#be123c' }
];

const JUNIOR_SCHOOL_OPTIONAL = [
  { name: 'Computer Science', icon: 'Calculator', color: '#2563eb' },
  { name: 'Home Science', icon: 'FlaskConical', color: '#f43f5e' },
  { name: 'Visual Arts', icon: 'Palette', color: '#ec4899' }
];

async function main() {
  console.log('Clearing existing subjects...');
  await prisma.subject.deleteMany();

  const subjectsToCreate: any[] = [];

  // Helper to push subjects for specific grades
  const addSubjects = (grades: string[], list: any[], isOptional = false) => {
    for (const grade of grades) {
      for (const sub of list) {
        // e.g. "G4_MATH" (first 4 chars of name)
        const code = sub.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
        const id = `G${grade.split('_')[1]}_${code}_${Math.random().toString(36).substring(7)}`;

        subjectsToCreate.push({
          id,
          name: sub.name,
          grade: grade,
          icon: sub.icon,
          color: sub.color,
          isOptional
        });
      }
    }
  };

  // Lower Primary
  addSubjects(['GRADE_1', 'GRADE_2', 'GRADE_3'], LOWER_PRIMARY_SUBJECTS);
  
  // Middle School
  addSubjects(['GRADE_4', 'GRADE_5', 'GRADE_6'], MIDDLE_SCHOOL_SUBJECTS);

  // Junior School Core
  addSubjects(['GRADE_7', 'GRADE_8', 'GRADE_9'], JUNIOR_SCHOOL_CORE);

  // Junior School Optional
  addSubjects(['GRADE_7', 'GRADE_8', 'GRADE_9'], JUNIOR_SCHOOL_OPTIONAL, true);

  console.log(`Seeding ${subjectsToCreate.length} subjects...`);
  
  await prisma.subject.createMany({
    data: subjectsToCreate
  });

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
