# HomeWork Board
Tablero de notas y texto. Creado con Jquery UI, Asp.Net MVC y Sqlite.

## Paquetes :cactus:

> Microsoft.EntityFrameworkCore 9.0.4

> Microsoft.EntityFrameworkCore.Design 9.0.4

> Microsoft.EntityFrameworkCore.Sqlite 9.0.4

> Microsoft.EntityFrameworkCore.Tools 9.0.4

## Notas: 🌎
> Proyecto Asp .Net MVC, creado con Code First, actualmente cuenta con la tabla Task y TextBox.

> Se debe ejecutar el comando  `Add-migration name` y `Update-database`.


## Comandos y pasos necesarios :corn:
> Migración nueva 

PM> `Add-migration name`
PM> `Update-database`

> Agregar tablas o columnas

1> Modificar el archivo DataBase/ApplicationDbContext
`Ejemplo: public DbSet<TaskModel> Task { get; set; }`

2> Agregar modelo en Models/

3> Ejecutar Add-migration "nombre" y Update-database

## Imagenes 👀

<img src="HomeWork_Board/wwwroot/Images/Homeworkboard_Img.png" width="1000"/>
