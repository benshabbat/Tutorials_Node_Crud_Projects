# 🐳 מדריך MySQL עם Docker ו-phpMyAdmin

## תוכן עניינים
1. [מבוא](#מבוא)
2. [התקנת Docker](#התקנת-docker)
3. [הרצת MySQL עם Docker](#הרצת-mysql-עם-docker)
4. [הוספת phpMyAdmin](#הוספת-phpmyadmin)
5. [Docker Compose](#docker-compose)
6. [חיבור מ-Node.js](#חיבור-מ-nodejs)
7. [ניהול Containers](#ניהול-containers)
8. [דוגמאות מעשיות](#דוגמאות-מעשיות)
9. [Best Practices](#best-practices)
10. [פתרון בעיות](#פתרון-בעיות)

---

## מבוא

### מה זה Docker?
**Docker** הוא פלטפורמה ליצירה, הרצה וניהול של containers - סביבות מבודדות להרצת אפליקציות.

#### למה להשתמש ב-Docker?
- ✅ **עקביות** - אותה סביבה בכל מקום (פיתוח, בדיקות, production)
- ✅ **בידוד** - כל שירות רץ בנפרד ולא משפיע על המערכת
- ✅ **קלות התקנה** - לא צריך להתקין MySQL ישירות על המחשב
- ✅ **גרסאות מרובות** - אפשר להריץ כמה גרסאות של MySQL במקביל
- ✅ **ניקיון** - קל למחוק ולהתחיל מחדש
- ✅ **פריסה** - אותם containers יכולים לרוץ בענן

### מה זה phpMyAdmin?
**phpMyAdmin** הוא כלי ניהול ויזואלי למסדי נתונים MySQL:
- 🖥️ ממשק גרפי דרך הדפדפן
- 📊 צפייה ועריכת טבלאות
- 🔧 הרצת שאילתות SQL
- 📤 יבוא וייצוא מסדי נתונים
- 👤 ניהול משתמשים והרשאות

### ארכיטקטורה
```
┌─────────────────────────────────────┐
│      Your Node.js Application       │
│            (Port 3000)              │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│        MySQL Container              │
│         (Port 3306)                 │
│      Database: myapp_db             │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│      phpMyAdmin Container           │
│         (Port 8080)                 │
│    http://localhost:8080            │
└─────────────────────────────────────┘
```

---

## התקנת Docker

### Windows

#### 1. הורד Docker Desktop
הורד מ: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

#### 2. התקן
- הפעל את קובץ ההתקנה
- עקוב אחרי ההוראות
- אשר WSL 2 installation (אם נדרש)
- הפעל מחדש את המחשב

#### 3. ודא התקנה
פתח PowerShell והרץ:
```powershell
docker --version
docker-compose --version
```

אמור לראות משהו כמו:
```
Docker version 24.0.0, build abc123
Docker Compose version v2.20.0
```

### macOS

#### 1. הורד Docker Desktop
הורד מ: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)

#### 2. התקן
- פתח את קובץ ה-.dmg
- גרור את Docker ל-Applications
- הפעל את Docker מ-Applications

#### 3. ודא התקנה
```bash
docker --version
docker-compose --version
```

### Linux (Ubuntu/Debian)

```bash
# עדכן את המערכת
sudo apt update

# התקן תלויות
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# הוסף GPG key של Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# הוסף repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# התקן Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# הוסף משתמש לקבוצת docker (כדי לא להצטרך sudo)
sudo usermod -aG docker $USER

# התנתק והתחבר מחדש, ואז בדוק:
docker --version
docker compose version
```

---

## הרצת MySQL עם Docker

### שיטה 1: פקודת Docker בסיסית

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=myapp_db \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mysql:8.0
```

**הסבר הפקודה:**
- `docker run` - הרץ container חדש
- `--name mysql-dev` - שם ה-container
- `-e MYSQL_ROOT_PASSWORD=rootpassword` - סיסמת root
- `-e MYSQL_DATABASE=myapp_db` - יצירת מסד נתונים אוטומטית
- `-e MYSQL_USER=myuser` - יצירת משתמש
- `-e MYSQL_PASSWORD=mypassword` - סיסמת המשתמש
- `-p 3306:3306` - מיפוי פורט (host:container)
- `-d` - הרץ ברקע (detached mode)
- `mysql:8.0` - שם ה-image וגרסה

### בדיקת Container

```bash
# צפייה ב-containers פעילים
docker ps

# צפייה בלוגים
docker logs mysql-dev

# כניסה ל-container
docker exec -it mysql-dev bash

# חיבור ל-MySQL בתוך ה-container
docker exec -it mysql-dev mysql -u root -p
```

### שיטה 2: עם Volume (שמירת מידע)

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=myapp_db \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  -d mysql:8.0
```

**Volume** שומר את המידע גם אחרי שמוחקים את ה-container!

---

## הוספת phpMyAdmin

### הרצת phpMyAdmin

```bash
docker run --name phpmyadmin-dev \
  -e PMA_HOST=mysql-dev \
  -e PMA_PORT=3306 \
  -e PMA_USER=root \
  -e PMA_PASSWORD=rootpassword \
  -p 8080:80 \
  --link mysql-dev:mysql \
  -d phpmyadmin:latest
```

**הסבר:**
- `PMA_HOST=mysql-dev` - שם ה-MySQL container
- `PMA_PORT=3306` - פורט MySQL
- `PMA_USER=root` - משתמש ברירת מחדל
- `PMA_PASSWORD=rootpassword` - סיסמה
- `-p 8080:80` - פורט (גישה דרך http://localhost:8080)
- `--link mysql-dev:mysql` - חיבור ל-MySQL container

### גישה ל-phpMyAdmin

1. פתח דפדפן וגש ל: **http://localhost:8080**
2. התחבר עם:
   - **Username:** `root` (או `myuser`)
   - **Password:** `rootpassword` (או `mypassword`)

---

## Docker Compose

**Docker Compose** מאפשר להגדיר ולהריץ מספר containers בקלות!

### יצירת docker-compose.yml

צור קובץ `docker-compose.yml` בשורש הפרויקט:

```yaml
version: '3.8'

services:
  # MySQL Service
  mysql:
    image: mysql:8.0
    container_name: mysql-dev
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: myapp_db
      MYSQL_USER: myuser
      MYSQL_PASSWORD: mypassword
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network

  # phpMyAdmin Service
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin-dev
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: rootpassword
    ports:
      - "8080:80"
    depends_on:
      - mysql
    networks:
      - app-network

volumes:
  mysql-data:

networks:
  app-network:
    driver: bridge
```

### הרצה עם Docker Compose

```bash
# הפעל את כל השירותים
docker-compose up -d

# צפה בלוגים
docker-compose logs -f

# עצור את כל השירותים
docker-compose down

# עצור ומחק גם volumes (מחיקת מידע!)
docker-compose down -v

# הפעל מחדש שירות ספציפי
docker-compose restart mysql
```

### יתרונות Docker Compose

- ✅ **קובץ אחד** - כל ההגדרות במקום אחד
- ✅ **ניהול קל** - פקודה אחת להפעלה והפסקה
- ✅ **תיעוד** - ברור מה הסביבה של הפרויקט
- ✅ **שיתוף** - קל לשתף עם צוות
- ✅ **רשתות** - containers מתקשרים בקלות

---

## חיבור מ-Node.js

### הגדרת .env

```env
# Docker MySQL Connection
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=myapp_db
DB_PORT=3306
```

### קובץ db.js

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL (Docker)!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL Connection Error:', err.message);
  });

export default pool;
```

### בדיקת חיבור

```javascript
// test-connection.js
import pool from './config/db.js';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Test query result:', rows[0].result);
    
    const [databases] = await pool.query('SHOW DATABASES');
    console.log('Available databases:', databases);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testConnection();
```

הרץ:
```bash
node test-connection.js
```

---

## ניהול Containers

### פקודות Docker בסיסיות

```bash
# רשימת containers פעילים
docker ps

# רשימת כל ה-containers (כולל שלא פעילים)
docker ps -a

# עצירת container
docker stop mysql-dev

# הפעלת container
docker start mysql-dev

# הפעלה מחדש
docker restart mysql-dev

# מחיקת container
docker rm mysql-dev

# מחיקת container פעיל (בכוח)
docker rm -f mysql-dev
```

### ניהול Images

```bash
# רשימת images
docker images

# הורדת image
docker pull mysql:8.0

# מחיקת image
docker rmi mysql:8.0

# ניקוי images שלא בשימוש
docker image prune
```

### ניהול Volumes

```bash
# רשימת volumes
docker volume ls

# מידע על volume
docker volume inspect mysql-data

# מחיקת volume
docker volume rm mysql-data

# ניקוי volumes שלא בשימוש
docker volume prune
```

### ניקוי כללי

```bash
# ניקוי הכל (containers, networks, images, volumes שלא בשימוש)
docker system prune -a --volumes

# ניקוי בלי volumes
docker system prune -a

# צפייה בשימוש דיסק
docker system df
```

---

## דוגמאות מעשיות

### דוגמה 1: פרויקט מלא עם Docker Compose

**מבנה הפרויקט:**
```
my-project/
├── docker-compose.yml
├── .env
├── .dockerignore
├── package.json
├── server.js
├── config/
│   └── db.js
└── init-db/
    └── init.sql
```

**docker-compose.yml מתקדם:**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: myapp-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "${MYSQL_PORT}:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init-db:/docker-entrypoint-initdb.d
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: myapp-phpmyadmin
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
    ports:
      - "8080:80"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - app-network

  app:
    build: .
    container_name: myapp-node
    restart: always
    environment:
      DB_HOST: mysql
      DB_USER: ${MYSQL_USER}
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_NAME: ${MYSQL_DATABASE}
      DB_PORT: 3306
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - app-network
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  mysql-data:

networks:
  app-network:
    driver: bridge
```

**קובץ .env:**
```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=supersecretroot
MYSQL_DATABASE=myapp_db
MYSQL_USER=myapp_user
MYSQL_PASSWORD=myapp_password
MYSQL_PORT=3306

# Application Configuration
NODE_ENV=development
PORT=3000
```

**קובץ init.sql (יצירת טבלאות אוטומטית):**
```sql
-- init-db/init.sql
-- This file runs automatically when MySQL container starts for the first time

USE myapp_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, age) VALUES
  ('John Doe', 'john@example.com', 30),
  ('Jane Smith', 'jane@example.com', 25),
  ('Bob Johnson', 'bob@example.com', 35);

INSERT INTO posts (user_id, title, content) VALUES
  (1, 'First Post', 'This is my first post!'),
  (1, 'Second Post', 'Another great post'),
  (2, 'Hello World', 'My first blog post');
```

**Dockerfile (אופציונלי - להרצת Node.js ב-container):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

**.dockerignore:**
```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
```

### דוגמה 2: סקריפטים נוחים

**package.json - הוסף scripts:**
```json
{
  "scripts": {
    "dev": "node --watch server.js",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:mysql": "docker exec -it myapp-mysql mysql -u root -p",
    "docker:restart": "docker-compose restart",
    "docker:clean": "docker-compose down -v && docker system prune -f"
  }
}
```

**שימוש:**
```bash
# הפעלת סביבת Docker
npm run docker:up

# צפייה בלוגים
npm run docker:logs

# כניסה ל-MySQL
npm run docker:mysql

# ניקוי מלא
npm run docker:clean
```

### דוגמה 3: סביבות שונות

**docker-compose.dev.yml (פיתוח):**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: dev_root_pass
      MYSQL_DATABASE: dev_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-dev-data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8080:80"
    depends_on:
      - mysql

volumes:
  mysql-dev-data:
```

**docker-compose.prod.yml (ייצור):**
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
      MYSQL_DATABASE: prod_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-prod-data:/var/lib/mysql
    secrets:
      - mysql_root_password

secrets:
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt

volumes:
  mysql-prod-data:
```

**הרצה:**
```bash
# פיתוח
docker-compose -f docker-compose.dev.yml up -d

# ייצור
docker-compose -f docker-compose.prod.yml up -d
```

---

## Best Practices

### 1. ✅ השתמש ב-Environment Variables

```yaml
# ✅ טוב - משתני סביבה
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  MYSQL_DATABASE: ${MYSQL_DATABASE}

# ❌ לא טוב - ערכים קבועים
environment:
  MYSQL_ROOT_PASSWORD: mypassword123
  MYSQL_DATABASE: mydb
```

### 2. ✅ השתמש ב-Volumes לשמירת מידע

```yaml
# ✅ טוב - עם volume
volumes:
  - mysql-data:/var/lib/mysql

# ❌ לא טוב - בלי volume
# המידע ימחק כשמוחקים את ה-container!
```

### 3. ✅ הגדר Health Checks

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  timeout: 20s
  retries: 10
  start_period: 40s
```

### 4. ✅ השתמש ב-depends_on עם conditions

```yaml
depends_on:
  mysql:
    condition: service_healthy  # המתן עד שהשירות בריא
```

### 5. ✅ הגדר Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      memory: 256M
```

### 6. ✅ שמור לוגים בצורה נכונה

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 7. ✅ השתמש ב-Networks

```yaml
networks:
  app-network:
    driver: bridge
```

### 8. ✅ גרסאות ספציפיות

```yaml
# ✅ טוב
image: mysql:8.0.33

# ❌ פחות טוב
image: mysql:latest  # יכול להשתנות ולגרום לבעיות
```

### 9. ✅ .dockerignore

```
node_modules
.env
.git
*.log
.DS_Store
npm-debug.log
```

### 10. ✅ גיבויים

```bash
# גיבוי מסד נתונים
docker exec mysql-dev mysqldump -u root -p myapp_db > backup.sql

# שחזור
docker exec -i mysql-dev mysql -u root -p myapp_db < backup.sql
```

---

## פתרון בעיות

### בעיה 1: Container לא מתחיל

**תסמינים:**
```bash
docker ps  # לא רואים את ה-container
```

**פתרונות:**
```bash
# 1. צפה בלוגים
docker logs mysql-dev

# 2. בדוק שהפורט לא תפוס
# Windows
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :3306

# 3. נסה להריץ בלי -d כדי לראות שגיאות
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=root mysql:8.0
```

### בעיה 2: לא מצליח להתחבר מ-Node.js

**תסמינים:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**פתרונות:**
```bash
# 1. בדוק שה-container רץ
docker ps

# 2. בדוק שהפורט פתוח
docker port mysql-dev

# 3. נסה להתחבר מתוך ה-container
docker exec -it mysql-dev mysql -u root -p

# 4. בדוק את משתני הסביבה
docker exec mysql-dev env | grep MYSQL
```

### בעיה 3: phpMyAdmin לא מתחבר ל-MySQL

**תסמינים:**
```
mysqli_real_connect(): (HY000/2002): Connection refused
```

**פתרונות:**
```yaml
# וודא שהשירותים באותה network
networks:
  - app-network

# וודא PMA_HOST נכון
environment:
  PMA_HOST: mysql  # שם השירות, לא localhost!
```

### בעיה 4: המידע נמחק כשעוצרים את ה-container

**פתרון:**
```yaml
# הוסף volume
volumes:
  - mysql-data:/var/lib/mysql

volumes:
  mysql-data:  # הגדרת volume בסוף הקובץ
```

### בעיה 5: שגיאת "Port already in use"

**פתרונות:**
```bash
# Windows - מצא מי משתמש בפורט
netstat -ano | findstr :3306
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3306 | xargs kill -9

# או שנה את הפורט ב-docker-compose.yml
ports:
  - "3307:3306"  # שימוש בפורט אחר
```

### בעיה 6: הרשאות (Permissions) ב-MySQL

**תסמינים:**
```
Access denied for user 'myuser'@'%'
```

**פתרון:**
```bash
# התחבר כ-root
docker exec -it mysql-dev mysql -u root -p

# תן הרשאות
GRANT ALL PRIVILEGES ON myapp_db.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
```

### בעיה 7: Docker Compose לא עובד

**תסמינים:**
```
ERROR: yaml.scanner.ScannerError
```

**פתרונות:**
```bash
# 1. בדוק syntax
docker-compose config

# 2. בדוק גרסת Docker Compose
docker-compose --version

# 3. וודא indentation נכון (רווחים, לא tabs!)
```

---

## פקודות מועילות

### Backup & Restore

```bash
# Backup
docker exec mysql-dev mysqldump -u root -p myapp_db > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i mysql-dev mysql -u root -p myapp_db < backup_20240101.sql

# Backup all databases
docker exec mysql-dev mysqldump -u root -p --all-databases > all_databases.sql
```

### ניהול רשת

```bash
# רשימת networks
docker network ls

# מידע על network
docker network inspect app-network

# יצירת network
docker network create my-network

# חיבור container ל-network
docker network connect my-network mysql-dev
```

### ביצועים

```bash
# סטטיסטיקות בזמן אמת
docker stats

# שימוש במשאבים
docker system df

# מידע מפורט על container
docker inspect mysql-dev
```

---

## סיכום

### מה למדנו?
- ✅ מה זה Docker ולמה להשתמש בו
- ✅ איך להתקין Docker
- ✅ הרצת MySQL ב-container
- ✅ הוספת phpMyAdmin
- ✅ שימוש ב-Docker Compose
- ✅ חיבור מ-Node.js
- ✅ ניהול containers, images ו-volumes
- ✅ Best Practices
- ✅ פתרון בעיות נפוצות

### צעדים הבאים
1. התקן Docker על המחשב שלך
2. צור `docker-compose.yml` פשוט
3. הרץ MySQL ו-phpMyAdmin
4. חבר את הפרויקט Node.js שלך
5. נסה את הדוגמאות המעשיות
6. תרגל backup ו-restore

### יתרונות העבודה עם Docker
- 🚀 **מהירות** - הקמת סביבה בשניות
- 🔒 **בידוד** - לא משפיע על המערכת
- 🔄 **עקביות** - אותה סביבה בכל מקום
- 🧹 **ניקיון** - קל למחוק ולהתחיל מחדש
- 👥 **שיתוף** - קל לשתף את הסביבה עם הצוות

### משאבים נוספים
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [phpMyAdmin Docker Hub](https://hub.docker.com/_/phpmyadmin)

---

**בהצלחה! 🐳**

יש לך שאלות? צריך עזרה בהקמת הסביבה? כנס ל-[phpMyAdmin](http://localhost:8080) ונסה!
