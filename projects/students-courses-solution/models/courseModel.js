import fs from 'fs/promises';
import path from 'path';

const coursesFilePath = path.join(process.cwd(), 'data', 'courses.json');

export async function getAllCourses() {
  try {
    const data = await fs.readFile(coursesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function getCourseById(id) {
  const courses = await getAllCourses();
  return courses.find(c => c.id === parseInt(id));
}

export async function searchCoursesByInstructor(instructor) {
  const courses = await getAllCourses();
  return courses.filter(c => c.instructor.toLowerCase().includes(instructor.toLowerCase()));
}

export async function searchCoursesByCredits(minCredits, maxCredits) {
  const courses = await getAllCourses();
  return courses.filter(c => {
    if (minCredits && c.credits < parseInt(minCredits)) return false;
    if (maxCredits && c.credits > parseInt(maxCredits)) return false;
    return true;
  });
}

export async function createCourse(courseData) {
  const courses = await getAllCourses();
  const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) : 0;
  const newCourse = {
    id: maxId + 1,
    ...courseData
  };
  courses.push(newCourse);
  await saveCourses(courses);
  return newCourse;
}

export async function updateCourse(id, courseData) {
  const courses = await getAllCourses();
  const index = courses.findIndex(c => c.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  courses[index] = { id: parseInt(id), ...courseData };
  await saveCourses(courses);
  return courses[index];
}

export async function deleteCourse(id) {
  const courses = await getAllCourses();
  const filteredCourses = courses.filter(c => c.id !== parseInt(id));
  
  if (filteredCourses.length === courses.length) {
    return false;
  }
  
  await saveCourses(filteredCourses);
  return true;
}

async function saveCourses(courses) {
  await fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2));
}
