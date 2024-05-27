<h1 align="center" id="title">2da Pre Entrega - BackEnd</h1>


El proyecto es un un servidor que contiene los endpoints y servicios necesarios para gestionar los productos y carritos de compra en un e-commerce.
La información que se utilizó es de un [proyecto](https://entrega-final-react-js-reschkenicolas.netlify.app/) anterior de React.


## Instalación

1. Clona este repositorio: `git clone https://github.com/NicolasReschke/2da_pre_entrega_BackEnd`

2. Instala las dependencias: `npm install`

## Tabla de Contenido

- [Objetivos Generales](#objetivosgenerales)
- [Objetivos Específicos](#objetivosespecíficos)
- [Modelo de Datos](#modelodedatos)
- [Vistas](#vistas)
- [Dependencies](#dependencies)
- [Postman](#postman)
- [Handlebars](#handlebars)
- [EndPoints](#endpoints)


### Objetivos Generales

- Utilizar MongoDB como sistema de persistencia principal.
- Definir todos los endpoints necesarios para trabajar con productos y carritos.

### Objetivos Específicos

#### Profesionalización de Consultas de Productos
- Implementar filtros, paginación y ordenamientos en las consultas de productos.
- Permitir la búsqueda por categoría o disponibilidad.
- Permitir el ordenamiento ascendente o descendente por precio.

#### Mejoras en la Gestión de Carritos
- Agregar nuevos endpoints para gestionar productos en el carrito.
- Actualizar la cantidad de ejemplares de un producto en el carrito.
- Permitir la eliminación de todos los productos del carrito.

### Modelo de Datos

- Se ha actualizado el modelo de Carts para que la propiedad products haga referencia al modelo de Products mediante un "populate".

### Vistas

- Se ha creado una vista en `/products` para visualizar todos los productos con paginación.
- Se ha agregado una vista en `/products/:pid` para visualizar un producto específico con sus detalles.
- Se ha agregado una vista en `/carts/:cid` para visualizar un carrito específico con sus productos.
- Se ha agregado una vista en `/login` para loguear el usuario.
- Se ha agregado una vista en `/register` para registrar el usuario.

## Dependencias
| Dependencias | README |
| ------ | ------ |
| bcryptjs | [2.4.3] |
| dotenv | [^16.4.5] |
| express | [^4.19.2] |
| express-handlebars | [^7.1.2] |
| express-session | [^1.18.0] |
| mongoose | [^8.4.0] |
| mongoose-paginate-v2 | [^1.8.1] |
| passport | [^0.7.0] |
| passport-local | [^1.0.0] |
| sweetalert2 | [^11.11.0] |


## Postman
Se utilizó Postman para ver todo el flujo de información.
En este enlace, pueden acceder a mi colección de Postman, para facilitarles el ruteo
* [postman.json](https://github.com/NicolasReschke/2da_pre_entrega_BackEnd/blob/main/2da_pre_entrega_BackEnd.postman_collection.json)



## Handlebars
Vistas creadas para los products, carts, viewDetailProduct, login y register.



### Endpoints

#### Productos
- `GET /products`: Consulta de productos con filtros, paginación y ordenamientos.
- `PUT /products/:id`: Actualización de un producto existente.

#### Carritos
- `GET /carts`: Consulta de carrito.
- `DELETE /api/carts/:cid/products/:pid`: Eliminación de un producto específico del carrito.
- `PUT /api/carts/:cid`: Actualización del carrito con un nuevo arreglo de productos.
- `PUT /api/carts/:cid/products/:pid`: Actualización de la cantidad de ejemplares de un producto en el carrito.
- `DELETE /api/carts/:cid`: Eliminación de todos los productos del carrito.


