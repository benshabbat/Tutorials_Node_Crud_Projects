import * as courseModel from '../models/courseModel.js';
import * as studentModel from '../models/studentModel.js';

export async function getCourses(req, res) {
  try {
    const courses = await courseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await courseModel.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
}

export async function searchCourses(req, res) {
  try {
    const { instructor, minCredits, maxCredits } = req.query;
    
    if (instructor) {
      const courses = await courseModel.searchCoursesByInstructor(instructor);
      return res.json(courses);
    }
    
    if (minCredits || maxCredits) {
      const courses = await courseModel.searchCoursesByCredits(minCredits, maxCredits);
      return res.json(courses);
    }
    
    res.status(400).json({ message: 'Please provide instructor or credits parameters' });
  } catch (error) {
    res.status(500).json({ message: 'Error searching courses' });
  }
}

export async function createCourse(req, res) {
  try {
    const newCourse = await courseModel.createCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' });
  }
}

export async function updateCourse(req, res) {
  try {
    const updatedCourse = await courseModel.updateCourse(req.params.id, req.body);
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' });
  }
}

export async function deleteCourse(req, res) {
  try {
    const courseId = parseInt(req.params.id);
    
    // Check if any students are enrolled
    const enrolledStudents = await studentModel.getStudentsEnrolledInCourse(courseId);
    
    if (enrolledStudents.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete course with enrolled students',
        enrolledCount: enrolledStudents.length
      });
    }
    
    const deleted = await courseModel.deleteCourse(courseId);
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
}

export async function getCourseStudents(req, res) {
  try {
    const course = await courseModel.getCourseById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const students = await studentModel.getStudentsEnrolledInCourse(req.params.courseId);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course students' });
  }
}
