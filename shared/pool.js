const sql =require('mssql');
const config = {
    user:'newadmin',
    password:'admin222',
    server: 'PAVANA', // replace with your SQL Server instance name or IP address
    database: 'estore',
    options: {
        trustServerCertificate: true,
      trustedConnection: true, // Use Windows authentication
    },
  };
  const pool = new sql.ConnectionPool(config);
  const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
      console.log('Connected to SQL Server');
      return pool;
  })
  .catch(err => console.error('Database connection failed:', err));

  module.exports= poolPromise;