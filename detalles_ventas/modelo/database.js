
    const mysql = require('mysql');

    // Define una nueva conexion
    const conexion = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'tiendagenericav2'
    });
    
    // verifica errores
    conexion.connect(function(err) {
      if (err) {
          console.error('Error connecting: ' + err.stack);
          return;
      }
    
      console.log('Connected as id ' + conexion.threadId);
    });
    
    exports.conexion = conexion;
    