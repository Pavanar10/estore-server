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

  module.exports=pool;