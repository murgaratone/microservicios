
  const express = require('express');
  const router = express.Router();
  const {v1: uuid} = require('uuid');
  const proveedoresDAO = require('../modelo/proveedoresDAO');

  const STATUS_OK = 200;
  const STATUS_NOT_FOUND = 404;
  const STATUS_INTERNAL_ERROR = 500;

  // GET: Seleccionar Datos
  router.get('/', (req, res) => {
    proveedoresDAO.seleccionarTabla((err,datos) => {

      if (err) {
        // Devuelve mensaje de error
        res.status(STATUS_INTERNAL_ERROR).json({message: err.message || 'Error al seleccionar datos'});
        return;
      }

      // Devuelve informacion
      console.log(datos);
      res.status(STATUS_OK).json(datos);

    });

  });

  // GET: Seleccionar un solo Dato por Id
  router.get('/:id', (req, res) => {
      const { id } = req.params;
      proveedoresDAO.seleccionarRegistro(id,(err,dato) => {

        if (err) {
          if (err.code == 'ER_WRONG_VALUE_FOR_TYPE' || err.code == 'NOT_FOUND') {
            // Error del usuario
            res.status(STATUS_NOT_FOUND);
          } else {
            // Error de sistema
            res.status(STATUS_INTERNAL_ERROR);
          }
          res.json({message: err.message || 'Error al seleccionar dato'});
          return;
        }

        // Devuelve informacion
        res.status(STATUS_OK).json(dato);

      });
    });

  // DELETE: Eliminar un Dato por Id
  router.delete('/:id', (req, res) => {

    if (!req.params.id) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'Se debe enviar el parametro id'});
      return;
    }

    const { id } = req.params;
    proveedoresDAO.eliminarRegistro(id,(err,resultado) => {
      if (err) {
        if (err.code == 'ER_WRONG_VALUE_FOR_TYPE' || err.code == 'NOT_FOUND') {
          // Error del usuario
          res.status(STATUS_NOT_FOUND);
        } else {
          // Error de sistema
          res.status(STATUS_INTERNAL_ERROR);
        }
        res.json({message: err.message || 'Error al eliminar dato'});
        return;
      }

      // Devuelve resultado
      res.status(STATUS_OK).json(resultado);
    });
  });

  // POST: Insertar un dato
  router.post('/', (req, res) => {

    if (!req.body) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'El cuerpo de la petición no puede estar vacía!'});
      return;
    }

    const { id,nit,ciudad,direccion,nombre,telefono } = req.body;

    const dato = {  id: id, nit: nit, ciudad: ciudad, direccion: direccion, nombre: nombre, telefono: telefono  };

    console.log(dato);

    proveedoresDAO.insertarRegistro(dato,(err,resultado) => {

      if (err) {
        res.status(STATUS_INTERNAL_ERROR);
        res.json({message: err.message || 'Error al insertar dato.'});
      }

      // Devuelve Resultado
      res.status(STATUS_OK);
      res.json(resultado);

    }); 

  });

  // PUT: Actualizar un dato
  router.put('/:id', (req, res) => {

    if (!req.params.id) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'Se debe enviar el parametro id'});
      return;
    }

    if (!req.body) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'El cuerpo de la petición no puede estar vacía!'});
      return;
    }

    const { nit,ciudad,direccion,nombre,telefono } = req.body;
    const { id } = req.params;

    const dato = {  id: id, nit: nit, ciudad: ciudad, direccion: direccion, nombre: nombre, telefono: telefono  };

    console.log(dato);
    proveedoresDAO.actualizarRegistro(dato,(err,resultado) => {

      if (err) {
        if (err.code == 'ER_WRONG_VALUE_FOR_TYPE' || err.code == 'NOT_FOUND') {
          // Error del usuario
          res.status(STATUS_NOT_FOUND);
        } else {
          // Error de sistema
          res.status(STATUS_INTERNAL_ERROR);
        }

        res.json({message: err.message || 'Error al eliminar dato'});
        return;

      }

      res.status(STATUS_OK).json(resultado);

    });

  });

  module.exports = router;