import * as studentModel from '../models/studentModel.js';
import * as courseModel from '../models/courseModel.js';

export async function getStats(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    const courses = await courseModel.getAllCourses();
    
    // Find most popular course
    const courseEnrollments = {};
    students.forEach(student => {
      student.enrolledCourses.forEach(courseId => {
        courseEnrollments[courseId] = (courseEnrollments[courseId] || 0) + 1;
      });
    });
    
    let mostPopularCourse = null;
    let maxEnrollments = 0;
    
    for (const [courseId, count] of Object.entries(courseEnrollments)) {
      if (count > maxEnrollments) {
        maxEnrollments = count;
        const course = courses.find(c => c.id === parseInt(courseId));
        if (course) {
          mostPopularCourse = {
            ...course,
            enrolledCount: count
          };
        }
      }
    }
    
    // Find most active student
    let mostActiveStudent = null;
    let maxCourses = 0;
    
    students.forEach(student => {
      if (student.enrolledCourses.length > maxCourses) {
        maxCourses = student.enrolledCourses.length;
        mostActiveStudent = {
          id: student.id,
          name: student.name,
          coursesCount: student.enrolledCourses.length
        };
      }
    });
    
    res.json({
      totalStudents: students.length,
      totalCourses: courses.length,
      mostPopularCourse,
      mostActiveStudent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
}
