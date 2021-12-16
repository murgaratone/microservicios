
    const express = require('express');
    const app = express();

    const cors = require('cors');
    app.use(cors());

    // Settings
    app.set('port', 4070);

    // Middlewares
    app.use(express.json());

    // Routes
       app.use(require('./controlador/detalles_ventasRouter'));


    // Starting the server
    app.listen(app.get('port'), () => {
      console.log('Server on port ' + app.get('port'));
    });