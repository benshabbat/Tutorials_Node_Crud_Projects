import * as studentModel from '../models/studentModel.js';
import * as courseModel from '../models/courseModel.js';

export async function getStudents(req, res) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
}

export async function getStudentById(req, res) {
  try {
    const student = await studentModel.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student' });
  }
}

export async function searchStudents(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
    }
    const students = await studentModel.searchStudentsByName(name);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error searching students' });
  }
}

export async function createStudent(req, res) {
  try {
    const newStudent = await studentModel.createStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student' });
  }
}

export async function updateStudent(req, res) {
  try {
    const updatedStudent = await studentModel.updateStudent(req.params.id, req.body);
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student' });
  }
}

export async function deleteStudent(req, res) {
  try {
    const deleted = await studentModel.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
  }
}

export async function enrollStudent(req, res) {
  try {
    const { studentId, courseId } = req.params;
    
    // Check if course exists
    const course = await courseModel.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const result = await studentModel.enrollStudentInCourse(studentId, courseId);
    
    if (!result) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (result.error === 'already_enrolled') {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling student' });
  }
}

export async function unenrollStudent(req, res) {
  try {
    const { studentId, courseId } = req.params;
    
    const result = await studentModel.unenrollStudentFromCourse(studentId, courseId);
    
    if (!result) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (result.error === 'not_enrolled') {
      return res.status(404).json({ message: 'Student not enrolled in this course' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error unenrolling student' });
  }
}

export async function getStudentCourses(req, res) {
  try {
    const student = await studentModel.getStudentById(req.params.studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const allCourses = await courseModel.getAllCourses();
    const studentCourses = allCourses.filter(course => 
      student.enrolledCourses.includes(course.id)
    );
    
    res.json(studentCourses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student courses' });
  }
}
