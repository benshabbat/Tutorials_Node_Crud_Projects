import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.MYSQL_USER || 'myuser',
        password: process.env.MYSQL_PASSWORD || 'mypassword',
        database: process.env.MYSQL_DATABASE || 'myapp_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
};
