module.exports = {
    secret: '$noopy$noozy',
    environment: 'development',
    logs: {
        logFilePath: './log'
    },
    uploads: './uploads',
    db: {
        development: {
            client: 'mssql',
            timezone: 'UTC',
            connection: {
                server: 'localhost',
                user: 'sa',
                password: 'admin123',
                database: 'RichCard'
            },
            migrations: {
                tableName: 'knex_migrations'
            },
            acquireConnectionTimeout: 180000
        }
    },
    mailer: {
        from: 'mail@website.us',
        service: 'office365',
        host: 'smtp.office365.com',
        port: 587,
        auth: {
            user: 'mail@website.us', //Sender Email id
            pass: 'mailerpassword' //Sender Email Password
        }
    },
    serviceBaseURL: {
        url: "http://localhost:8091"
    }
};
