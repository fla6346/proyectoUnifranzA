CREATE DATABASE bddgestion_eventoUFT;

CREATE TABLE usuario (
  idusuario SERIAL PRIMARY KEY,
  userName VARCHAR(20) NOT NULL,
  contrasenia VARCHAR(20) NOT NULL,
  habilitado VARCHAR(10),
  nombre VARCHAR(50) NOT NULL,
  apellidopat VARCHAR(50) NOT NULL,
  apellidomat VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  idusuarioexterno VARCHAR(20),
  idestudiante VARCHAR(20),
);