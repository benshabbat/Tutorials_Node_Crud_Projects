# תרגיל מתקדם - מערכת סטודנטים וקורסים
## עבודה עם 2 קבצי JSON (מתחילים ריקים)

## הגדרות התחלתיות

```bash
npm init -y
npm install express
```

**הוסיפו ל-package.json:**
```json
{
  "type": "module"
}
```

---

## מטרה

לבנות API מלא למערכת סטודנטים וקורסים עם קשר ביניהם, כאשר שני הקבצים מתחילים ריקים

---

## הכנה: צרו 2 קבצי JSON ריקים

**students.json:**
```json
[]
```

**courses.json:**
```json
[]
```

---

## תרגיל הכנה: קוד התחלתי

צרו קובץ `server.js` עם המבנה הבא:

### שלב 1: ייבוא מודולים
```javascript
// TODO: ייבאו את express
// TODO: ייבאו את fs/promises
```

### שלב 2: הגדרות בסיסיות
```javascript
// TODO: צרו אפליקציית express
// TODO: הגדירו את ה-PORT (3000)
// TODO: הוסיפו middleware לטיפול ב-JSON
```

### שלב 3: Helper Functions

#### readStudents()
צרו פונקציה אסינכרונית שמחזירה את רשימת הסטודנטים:
- קראו את הקובץ `students.json`
- אם הקובץ לא קיים או יש שגיאה - החזירו מערך ריק `[]`
- אם הקובץ קיים - המירו את התוכן ל-JSON והחזירו

```javascript
// TODO: async function readStudents() { ... }
```

#### writeStudents(students)
צרו פונקציה אסינכרונית ששומרת את רשימת הסטודנטים:
- קבלו פרמטר `students` (מערך)
- שמרו את המערך לקובץ `students.json`
- המירו ל-JSON עם `JSON.stringify` (עם indent של 2 רווחים)

```javascript
// TODO: async function writeStudents(students) { ... }
```

#### readCourses()
צרו פונקציה זהה ל-`readStudents()` אבל לקורסים:
- קראו את הקובץ `courses.json`
- החזירו מערך ריק אם יש שגיאה

```javascript
// TODO: async function readCourses() { ... }
```

#### writeCourses(courses)
צרו פונקציה זהה ל-`writeStudents()` אבל לקורסים:
- שמרו לקובץ `courses.json`

```javascript
// TODO: async function writeCourses(courses) { ... }
```

### שלב 4: הפעלת השרת
```javascript
// TODO: app.listen(PORT, () => { ... });
// TODO: הדפיסו הודעה שהשרת רץ
```

### שלב 5: Endpoints
```javascript
// TODO: יישמו את כל ה-endpoints המפורטים למטה
```

---

## חלק א': ניהול סטודנטים (Students)

### מבנה נתונים של Student:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "enrolledCourses": [1, 3]
}
```

### Endpoints לסטודנטים:

#### 1. GET /students
- החזירו את כל הסטודנטים
- אם המערך ריק, החזירו מערך ריק `[]`

**TODO:** יישמו route זה

---

#### 2. GET /students/:id
- החזירו סטודנט ספציפי
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

#### 3. POST /students
- הוסיפו סטודנט חדש
- ID אוטומטי (מתחיל מ-1)
- `enrolledCourses` ברירת מחדל: `[]`
- Body: `{ "name": "...", "email": "..." }`
- status 201

**TODO:** יישמו route זה

---

#### 4. PUT /students/:id
- עדכנו את פרטי הסטודנט (לא כולל `enrolledCourses`)
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

#### 5. DELETE /students/:id
- מחקו סטודנט
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

## חלק ב': ניהול קורסים (Courses)

### מבנה נתונים של Course:
```json
{
  "id": 1,
  "name": "JavaScript for Beginners",
  "instructor": "David Smith",
  "credits": 4
}
```

### Endpoints לקורסים:

#### 6. GET /courses
- החזירו את כל הקורסים
- אם המערך ריק, החזירו מערך ריק `[]`

**TODO:** יישמו route זה

---

#### 7. GET /courses/:id
- החזירו קורס ספציפי
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

#### 8. POST /courses
- הוסיפו קורס חדש
- ID אוטומטי (מתחיל מ-1)
- Body: `{ "name": "...", "instructor": "...", "credits": 4 }`
- status 201

**TODO:** יישמו route זה

---

#### 9. PUT /courses/:id
- עדכנו את פרטי הקורס
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

#### 10. DELETE /courses/:id
- מחקו קורס
- **בדיקה חשובה:** וודאו שאף סטודנט לא רשום לקורס הזה!
- אם יש סטודנטים רשומים, החזירו שגיאה 400
- 404 אם לא נמצא

**TODO:** יישמו route זה

---

## חלק ג': ניהול הרשמות (Enrollments)

### 11. POST /students/:studentId/enroll/:courseId
- רשמו סטודנט לקורס
- בדקו שהסטודנט והקורס קיימים
- בדקו שהסטודנט לא רשום כבר לקורס הזה
- הוסיפו את ה-courseId למערך `enrolledCourses`
- החזירו את הסטודנט המעודכן

**TODO:** יישמו route זה

---

### 12. DELETE /students/:studentId/unenroll/:courseId
- הסירו סטודנט מקורס
- בדקו שהסטודנט קיים ורשום לקורס
- הסירו את ה-courseId מהמערך `enrolledCourses`
- 404 אם הסטודנט לא רשום לקורס

**TODO:** יישמו route זה

---

### 13. GET /students/:studentId/courses
- החזירו את כל הקורסים שהסטודנט רשום אליהם (פרטים מלאים)
- קראו את הסטודנט
- קראו את הקורסים
- סננו רק את הקורסים שה-ID שלהם במערך `enrolledCourses`
- 404 אם הסטודנט לא נמצא

**TODO:** יישמו route זה

---

### 14. GET /courses/:courseId/students
- החזירו את כל הסטודנטים הרשומים לקורס
- קראו את כל הסטודנטים
- סננו רק אלה שיש להם את ה-courseId ב-`enrolledCourses`
- 404 אם הקורס לא נמצא

**TODO:** יישמו route זה

---

## חלק ד': חיפוש וסינון

### 15. GET /students/search?name=John
- חפשו סטודנטים לפי שם (חלקי)

**TODO:** יישמו route זה

---

### 16. GET /courses/search?instructor=David
- חפשו קורסים לפי שם המרצה (חלקי)

**TODO:** יישמו route זה

---

### 17. GET /courses/search?minCredits=3&maxCredits=5
- סננו קורסים לפי טווח נקודות זכות

**TODO:** יישמו route זה

---

## דוגמאות בדיקה

### הוספת סטודנטים
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Sarah Smith","email":"sarah@example.com"}'
```

### הוספת קורסים
```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript for Beginners","instructor":"David Brown","credits":4}'

curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"Advanced React","instructor":"Emily Wilson","credits":5}'
```

### רישום סטודנט לקורס
```bash
curl -X POST http://localhost:3000/students/1/enroll/1
```

### הצגת כל הקורסים של סטודנט
```bash
curl http://localhost:3000/students/1/courses
```

### הצגת כל הסטודנטים בקורס
```bash
curl http://localhost:3000/courses/1/students
```

### חיפוש סטודנטים
```bash
curl http://localhost:3000/students/search?name=John
```

### חיפוש קורסים
```bash
curl "http://localhost:3000/courses/search?minCredits=3&maxCredits=5"
```

---

## אתגר נוסף (אופציונלי)

### 18. GET /stats
- החזירו סטטיסטיקות כלליות:
  - מספר כולל של סטודנטים
  - מספר כולל של קורסים
  - הקורס הפופולרי ביותר (עם הכי הרבה סטודנטים)
  - הסטודנט עם הכי הרבה קורסים

**דוגמה לתוצאה:**
```json
{
  "totalStudents": 5,
  "totalCourses": 3,
  "mostPopularCourse": {
    "id": 1,
    "name": "JavaScript for Beginners",
    "enrolledCount": 4
  },
  "mostActiveStudent": {
    "id": 2,
    "name": "Sarah Smith",
    "coursesCount": 3
  }
}
```

**TODO:** יישמו route זה

---

## סיכום המערכת

מערכת זו מדגימה:

✅ עבודה עם 2 קבצי JSON נפרדים שמתחילים ריקים  
✅ יצירת קשר (relation) בין שני משאבים  
✅ ניהול מערך של IDs (`enrolledCourses`)  
✅ קריאה משני קבצים לצורך הצגת נתונים מקושרים  
✅ בדיקות תקינות (validation) לפני מחיקה  
✅ פעולות מורכבות שדורשות עבודה על שני הקבצים

---

## שאלות נפוצות

**ש: למה ה-helper functions מחזירות מערך ריק במקרה של שגיאה?**  
ת: זה מאפשר למערכת לעבוד גם כשהקבצים עדיין לא קיימים או ריקים

**ש: איך מוודאים שלא מוחקים קורס שיש בו סטודנטים?**  
ת: משתמשים ב-`some()` כדי לבדוק אם יש סטודנט עם ה-courseId ב-`enrolledCourses`

**ש: איך מחזירים פרטי קורסים מלאים לסטודנט?**  
ת: קוראים את שני הקבצים ומסננים את הקורסים לפי ה-IDs ב-`enrolledCourses`

**ש: מה ההבדל בין PUT ל-PATCH?**  
ת: PUT מחליף את כל האובייקט, PATCH משנה רק שדות ספציפיים

---

<details>
<summary><strong>📖 רמזים ופתרונות (לחצו כדי לפתוח)</strong></summary>

## פתרון לקוד ההתחלתי

<details>
<summary>קוד התחלתי מלא</summary>

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper functions
async function readStudents() {
  try {
    const data = await fs.readFile('students.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeStudents(students) {
  await fs.writeFile('students.json', JSON.stringify(students, null, 2));
}

async function readCourses() {
  try {
    const data = await fs.readFile('courses.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeCourses(courses) {
  await fs.writeFile('courses.json', JSON.stringify(courses, null, 2));
}

// TODO: יישמו את כל ה-endpoints המפורטים למטה


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
</details>

---

## טיפים חשובים

### 1. בדיקת קיום סטודנט/קורס:
```javascript
const students = await readStudents();
const student = students.find(s => s.id === studentId);

if (!student) {
  return res.status(404).json({ message: 'Student not found' });
}
```

### 2. בדיקה אם סטודנט כבר רשום לקורס:
```javascript
if (student.enrolledCourses.includes(courseId)) {
  return res.status(400).json({ message: 'Student already enrolled' });
}
```

### 3. הוספת קורס לסטודנט:
```javascript
student.enrolledCourses.push(courseId);
await writeStudents(students);
```

### 4. הסרת קורס מסטודנט:
```javascript
student.enrolledCourses = student.enrolledCourses.filter(id => id !== courseId);
await writeStudents(students);
```

### 5. מציאת קורסים של סטודנט:
```javascript
const courses = await readCourses();
const studentCourses = courses.filter(course => 
  student.enrolledCourses.includes(course.id)
);
```

### 6. מציאת סטודנטים בקורס:
```javascript
const students = await readStudents();
const enrolledStudents = students.filter(student =>
  student.enrolledCourses.includes(courseId)
);
```

### 7. בדיקה לפני מחיקת קורס:
```javascript
const students = await readStudents();
const hasStudents = students.some(student =>
  student.enrolledCourses.includes(courseId)
);

if (hasStudents) {
  return res.status(400).json({ 
    message: 'Cannot delete course with enrolled students' 
  });
}
```

---

## פתרונות מלאים

### פתרונות לחלק הסטודנטים:

<details>
<summary>GET /students - פתרון</summary>

```javascript
app.get('/students', async (req, res) => {
  const students = await readStudents();
  res.json(students);
});
```
</details>

<details>
<summary>GET /students/:id - פתרון</summary>

```javascript
app.get('/students/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const students = await readStudents();
  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json(student);
});
```
</details>

<details>
<summary>POST /students - פתרון</summary>

```javascript
app.post('/students', async (req, res) => {
  const students = await readStudents();
  const maxId = students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;

  const newStudent = {
    id: maxId + 1,
    name: req.body.name,
    email: req.body.email,
    enrolledCourses: []
  };

  students.push(newStudent);
  await writeStudents(students);
  res.status(201).json(newStudent);
});
```
</details>

<details>
<summary>PUT /students/:id - פתרון</summary>

```javascript
app.put('/students/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const students = await readStudents();
  const index = students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  students[index] = {
    id,
    name: req.body.name,
    email: req.body.email,
    enrolledCourses: students[index].enrolledCourses
  };

  await writeStudents(students);
  res.json(students[index]);
});
```
</details>

<details>
<summary>DELETE /students/:id - פתרון</summary>

```javascript
app.delete('/students/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const students = await readStudents();
  const filteredStudents = students.filter(s => s.id !== id);

  if (filteredStudents.length === students.length) {
    return res.status(404).json({ message: 'Student not found' });
  }

  await writeStudents(filteredStudents);
  res.json({ message: 'Student deleted successfully' });
});
```
</details>

---

### פתרונות לחלק הקורסים:

<details>
<summary>GET /courses - פתרון</summary>

```javascript
app.get('/courses', async (req, res) => {
  const courses = await readCourses();
  res.json(courses);
});
```
</details>

<details>
<summary>POST /courses - פתרון</summary>

```javascript
app.post('/courses', async (req, res) => {
  const courses = await readCourses();
  const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) : 0;

  const newCourse = {
    id: maxId + 1,
    ...req.body
  };

  courses.push(newCourse);
  await writeCourses(courses);
  res.status(201).json(newCourse);
});
```
</details>

<details>
<summary>DELETE /courses/:id - פתרון (עם בדיקה)</summary>

```javascript
app.delete('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  const courses = await readCourses();
  const students = await readStudents();

  // בדיקה אם יש סטודנטים רשומים
  const hasStudents = students.some(student =>
    student.enrolledCourses.includes(courseId)
  );

  if (hasStudents) {
    return res.status(400).json({ 
      message: 'Cannot delete course with enrolled students' 
    });
  }

  const filteredCourses = courses.filter(c => c.id !== courseId);

  if (filteredCourses.length === courses.length) {
    return res.status(404).json({ message: 'Course not found' });
  }

  await writeCourses(filteredCourses);
  res.json({ message: 'Course deleted successfully' });
});
```
</details>

---

### פתרונות לחלק ההרשמות:

<details>
<summary>POST /students/:studentId/enroll/:courseId - פתרון</summary>

```javascript
app.post('/students/:studentId/enroll/:courseId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const courseId = parseInt(req.params.courseId);

  const students = await readStudents();
  const courses = await readCourses();

  const student = students.find(s => s.id === studentId);
  const course = courses.find(c => c.id === courseId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (student.enrolledCourses.includes(courseId)) {
    return res.status(400).json({ message: 'Student already enrolled in this course' });
  }

  student.enrolledCourses.push(courseId);
  await writeStudents(students);
  res.json(student);
});
```
</details>

<details>
<summary>DELETE /students/:studentId/unenroll/:courseId - פתרון</summary>

```javascript
app.delete('/students/:studentId/unenroll/:courseId', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const courseId = parseInt(req.params.courseId);

  const students = await readStudents();
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  if (!student.enrolledCourses.includes(courseId)) {
    return res.status(404).json({ message: 'Student not enrolled in this course' });
  }

  student.enrolledCourses = student.enrolledCourses.filter(id => id !== courseId);
  await writeStudents(students);
  res.json(student);
});
```
</details>

<details>
<summary>GET /students/:studentId/courses - פתרון</summary>

```javascript
app.get('/students/:studentId/courses', async (req, res) => {
  const studentId = parseInt(req.params.studentId);
  const students = await readStudents();
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const courses = await readCourses();
  const studentCourses = courses.filter(course => 
    student.enrolledCourses.includes(course.id)
  );

  res.json(studentCourses);
});
```
</details>

<details>
<summary>GET /courses/:courseId/students - פתרון</summary>

```javascript
app.get('/courses/:courseId/students', async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const courses = await readCourses();
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const students = await readStudents();
  const enrolledStudents = students.filter(student =>
    student.enrolledCourses.includes(courseId)
  );

  res.json(enrolledStudents);
});
```
</details>

---

### פתרונות לחלק החיפוש:

<details>
<summary>GET /students/search?name=John - פתרון</summary>

```javascript
app.get('/students/search', async (req, res) => {
  const searchName = req.query.name || '';
  const students = await readStudents();
  
  const results = students.filter(student =>
    student.name.toLowerCase().includes(searchName.toLowerCase())
  );
  
  res.json(results);
});
```
</details>

<details>
<summary>GET /courses/search - פתרון מלא (instructor + credits)</summary>

```javascript
app.get('/courses/search', async (req, res) => {
  const searchInstructor = req.query.instructor || '';
  const minCredits = parseInt(req.query.minCredits) || 0;
  const maxCredits = parseInt(req.query.maxCredits) || 999;
  
  const courses = await readCourses();
  
  let filtered = courses;
  
  // סינון לפי מרצה
  if (searchInstructor) {
    filtered = filtered.filter(course =>
      course.instructor.toLowerCase().includes(searchInstructor.toLowerCase())
    );
  }
  
  // סינון לפי נקודות זכות
  filtered = filtered.filter(course =>
    course.credits >= minCredits && course.credits <= maxCredits
  );
  
  res.json(filtered);
});
```
</details>

---

### פתרון לאתגר הסטטיסטיקות:

<details>
<summary>GET /stats - פתרון מלא</summary>

```javascript
app.get('/stats', async (req, res) => {
  const students = await readStudents();
  const courses = await readCourses();

  const totalStudents = students.length;
  const totalCourses = courses.length;

  // מציאת הקורס הפופולרי ביותר
  const coursesWithCount = courses.map(course => ({
    ...course,
    enrolledCount: students.filter(s => 
      s.enrolledCourses.includes(course.id)
    ).length
  }));

  const mostPopularCourse = coursesWithCount.reduce((max, course) =>
    course.enrolledCount > (max?.enrolledCount || 0) ? course : max
  , null);

  // מציאת הסטודנט הכי פעיל
  const mostActiveStudent = students.reduce((max, student) =>
    student.enrolledCourses.length > (max?.enrolledCourses.length || 0) ? student : max
  , null);

  res.json({
    totalStudents,
    totalCourses,
    mostPopularCourse: mostPopularCourse ? {
      id: mostPopularCourse.id,
      name: mostPopularCourse.name,
      enrolledCount: mostPopularCourse.enrolledCount
    } : null,
    mostActiveStudent: mostActiveStudent ? {
      id: mostActiveStudent.id,
      name: mostActiveStudent.name,
      coursesCount: mostActiveStudent.enrolledCourses.length
    } : null
  });
});
```
</details>

</details>

---

בהצלחה! 🎓🚀
