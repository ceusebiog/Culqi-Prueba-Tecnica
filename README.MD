# Test Tecnico

---

Prueba técnica - Backend Javascript
El proyecto contiene dos funciones lambda:

- Creación de Token
- Obtener datos de tarjeta

## Tabla de Contenido

1. [Rquerimientos](#requerimientos)
2. [Instalación](#instalación)
3. [Ejecución](#ejecución)

### Requerimientos

El proyecto se ha generado con las siguientes versiones:

- NodeJS: v18.16.0
- npm: 9.5.1
- Redis server: 7.2.3

### Instalación

Para instalar las depencias ejecutar el comando

```
npm install
```

O

```
yarn
```

También se debe crear el archivo <code>.env</code> en la raiz del proyecto con la siguiente variable:

```
SECRET_KEY={Secret Key para la encryptación}
```

Además, asegurarse que redis-server este en ejecución

### Ejecución

- Ejecutar proyecto
  Antes de correr el proyecto en modo local se debe crear la compilación con el siguiente comando:

```
npm run build
```

O

```
yarn run build
```

Para correr el proyecto en modo local, ejecutar el comando

```
npm run start
```

O

```
yarn run start
```

- Ejecutar pruebas
  Para correr las pruebas, ejecutar el comando

```
npm run test
```

O

```
yarn run test
```
