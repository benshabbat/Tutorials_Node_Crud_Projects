import fs from 'fs/promises';
import path from 'path';

const studentsFilePath = path.join(process.cwd(), 'data', 'students.json');

export async function getAllStudents() {
  try {
    const data = await fs.readFile(studentsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getStudentById(id) {
  const students = await getAllStudents();
  return students.find(s => s.id === parseInt(id));
}

export async function searchStudentsByName(name) {
  const students = await getAllStudents();
  return students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

export async function createStudent(studentData) {
  const students = await getAllStudents();
  const maxId = students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;
  const newStudent = {
    id: maxId + 1,
    ...studentData,
    enrolledCourses: []
  };
  students.push(newStudent);
  await saveStudents(students);
  return newStudent;
}

export async function updateStudent(id, studentData) {
  const students = await getAllStudents();
  const index = students.findIndex(s => s.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  students[index] = {
    id: parseInt(id),
    ...studentData,
    enrolledCourses: students[index].enrolledCourses
  };
  await saveStudents(students);
  return students[index];
}

export async function deleteStudent(id) {
  const students = await getAllStudents();
  const filteredStudents = students.filter(s => s.id !== parseInt(id));
  
  if (filteredStudents.length === students.length) {
    return false;
  }
  
  await saveStudents(filteredStudents);
  return true;
}

export async function enrollStudentInCourse(studentId, courseId) {
  const students = await getAllStudents();
  const student = students.find(s => s.id === parseInt(studentId));
  
  if (!student) {
    return null;
  }
  
  if (student.enrolledCourses.includes(parseInt(courseId))) {
    return { error: 'already_enrolled' };
  }
  
  student.enrolledCourses.push(parseInt(courseId));
  await saveStudents(students);
  return student;
}

export async function unenrollStudentFromCourse(studentId, courseId) {
  const students = await getAllStudents();
  const student = students.find(s => s.id === parseInt(studentId));
  
  if (!student) {
    return null;
  }
  
  if (!student.enrolledCourses.includes(parseInt(courseId))) {
    return { error: 'not_enrolled' };
  }
  
  student.enrolledCourses = student.enrolledCourses.filter(id => id !== parseInt(courseId));
  await saveStudents(students);
  return student;
}

export async function getStudentsEnrolledInCourse(courseId) {
  const students = await getAllStudents();
  return students.filter(s => s.enrolledCourses.includes(parseInt(courseId)));
}

async function saveStudents(students) {
  await fs.writeFile(studentsFilePath, JSON.stringify(students, null, 2));
}
