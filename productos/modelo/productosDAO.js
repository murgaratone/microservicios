
  const  { conexion }  = require('./database.js');

  function seleccionarTabla(callback) {

    sql =
     `select  BIN_TO_UUID(id) as id,codigo,iva_compra,BIN_TO_UUID(proveedor_id) as proveedor_id,nombre,valor_compra,valor_venta 
      from productos
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
     `select  BIN_TO_UUID(id) as id,codigo,iva_compra,BIN_TO_UUID(proveedor_id) as proveedor_id,nombre,valor_compra,valor_venta 
      from productos
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
     `insert into productos( id,codigo,iva_compra,proveedor_id,nombre,valor_compra,valor_venta )
      values ( UUID_TO_BIN(?),?,?,UUID_TO_BIN(?),?,?,? );`;

      conexion.query(sql,[ dato.id,dato.codigo,dato.iva_compra,dato.proveedor_id,dato.nombre,dato.valor_compra,dato.valor_venta ],(err, result) => {

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
     `update productos set  codigo = ?,iva_compra = ?,proveedor_id = UUID_TO_BIN(?),nombre = ?,valor_compra = ?,valor_venta = ? 
      where id = UUID_TO_BIN(?)`;

      conexion.query(sql,[ dato.codigo,dato.iva_compra,dato.proveedor_id,dato.nombre,dato.valor_compra,dato.valor_venta,dato.id],(err, result) => {

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

    sql = 'delete from productos where id = UUID_TO_BIN(?)';

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