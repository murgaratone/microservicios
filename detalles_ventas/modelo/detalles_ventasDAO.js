
  const  { conexion }  = require('./database.js');

  function seleccionarTabla(callback) {

    sql =
     `select  BIN_TO_UUID(id) as id,BIN_TO_UUID(producto_id) as producto_id,BIN_TO_UUID(venta_id) as venta_id,cantidad,valor,valor_total 
      from detalles_ventas
      order by id`;

      conexion.query(sql,(err, rows) => {

        if (err) {
          // envia el objeto de error
          console.log(err);
          callback(err,null);
          return;
        }

        // devuelve la informacion
        const datos = rows.map(x => Object.assign({},x));
        callback(null,datos);

      });

  }

  function seleccionarRegistro(id, callback) {

    sql =
     `select  BIN_TO_UUID(id) as id,BIN_TO_UUID(producto_id) as producto_id,BIN_TO_UUID(venta_id) as venta_id,cantidad,valor,valor_total 
      from detalles_ventas
      where id = UUID_TO_BIN(?)`;

      conexion.query(sql,[id],(err, rows) => {
        if (err) {
          // envia el objeto de error
          console.log(err);
          callback(err,null);
          return;
        }

        if (! rows.length) {
          // Error: no se encontro informacion
          callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
          return;
        }

        // devuelve la informacion
        const dato = Object.assign({},rows[0]);
        callback(null,dato);

      });

  }

  function insertarRegistro(dato, callback) {

    sql =
     `insert into detalles_ventas( id,producto_id,venta_id,cantidad,valor,valor_total )
      values ( UUID_TO_BIN(?),UUID_TO_BIN(?),UUID_TO_BIN(?),?,?,? );`;

      conexion.query(sql,[ dato.id,dato.producto_id,dato.venta_id,dato.cantidad,dato.valor,dato.valor_total ],(err, result) => {

        if (err) {
          // envia el objeto de error
          console.log(err);
          callback(err,null);
          return;
        }

        // Devuelve mensaje exitoso
        callback(null,{dato: dato, status: 'Registro insertado.'});

      });

  }

  function actualizarRegistro(dato, callback) {

    sql =
     `update detalles_ventas set  producto_id = UUID_TO_BIN(?),venta_id = UUID_TO_BIN(?),cantidad = ?,valor = ?,valor_total = ? 
      where id = UUID_TO_BIN(?)`;

      conexion.query(sql,[ dato.producto_id,dato.venta_id,dato.cantidad,dato.valor,dato.valor_total,dato.id],(err, result) => {

        if (err) {
          // envia el objeto de error
          console.log(err);
          callback(err,null);
          return;
        }

        if (result.affectedRows == 0) {
          // Error: no se encontro informacion
          callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
          return;
        }

        // Devuelve mensjae exitoso
        callback(null,{dato: dato, status: 'Registro actualizado.'});

      });

  }

  function eliminarRegistro(id, callback) {

    sql = 'delete from detalles_ventas where id = UUID_TO_BIN(?)';

      conexion.query(sql,[id],(err, result) => {

        if (err) {
          // envia el objeto de error
          console.log(err);
          callback(err,null);
          return;
        }

        if (! result.affectedRows == 0) {
          // Error: no se encontro informacion
          callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
          return;
        }

        callback(null,{id: id, status: 'Registro eliminado.'});

      });
  }

  module.exports.seleccionarTabla = seleccionarTabla;
  module.exports.seleccionarRegistro = seleccionarRegistro;
  module.exports.insertarRegistro = insertarRegistro;
  module.exports.actualizarRegistro = actualizarRegistro;
  module.exports.eliminarRegistro = eliminarRegistro;