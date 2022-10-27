module.exports = {
    'secret': '$noopy$noozy',
    logs: {
        logFilePath: './log'
    },
    db: {
        development: {
            client: 'mysql',
            
            connection: {
                
                host: 'localhost',
                
                user: 'root',
                password: 'password',
                database: 'dbname'
            },
            acquireConnectionTimeout: 180000
        }
    },
    
    
    
};
