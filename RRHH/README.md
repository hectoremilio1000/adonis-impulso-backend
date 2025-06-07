Claro, podemos construir el sistema de forma incremental, empezando por un solo rol/personal (por ejemplo, meseros), y a partir de ahí seguir añadiendo puestos y rutas más complejas. El objetivo es no abrumarnos con la megaestructura final, sino ir agregando tablas y lógica de forma controlada.

A continuación te propongo un plan de implementación incremental y un pequeño ejemplo paso a paso con AdonisJS + MySQL para el rol de “mesero”. Así, iremos creando migraciones y modelos básicos, luego endpoints, y finalmente un simple flujo en el frontend para ver cómo se vería.

Plan de implementación incremental
Definir la migración y modelo para “TrainingPath”

Primero, crearemos una tabla training_paths en la base de datos. Cada fila representará una “Ruta de capacitación” para un determinado rol (inicialmente, “mesero”).

Como en un futuro queremos múltiples rutas (por ejemplo, “mesero”, “cocinero”, etc.), el campo role_name o role_id podría indicar a quién pertenece.

En esta etapa, ignoramos la lógica de lecciones, quizzes, etc. Solo definimos la base: un nombre, una descripción, un rol asociado.

Definir la migración y modelo para “Module”

Similarmente, creamos la tabla modules, donde cada fila representa un “Módulo” dentro de una ruta.

También definimos una tabla pivote path_modules para la relación N:M con training_paths (un training_path puede tener muchos modules; un module podría pertenecer a muchas rutas).

Para no enredar, inicialmente podemos hacer 1:N (un training_path tiene muchos modules) si queremos algo más sencillo. Luego, si vemos que queremos reusar módulos en varios paths, lo cambiamos a la relación N:M.

Crear la migración y modelo de “Lesson”

Cada “módulo” tendrá un conjunto de lecciones. Una lección puede ser un video, un PDF, un texto, etc.

lessons con campos module_id, title, content_type, content_url_o_text, order para indicar su posición.

Crear la migración y modelo de “Quiz” (y “Question”, “Option”)

Dejando para la segunda fase. Si queremos algo muy incremental, primero metemos el “material de capacitación” sin exámenes. Después, en un segundo paso, añadimos los quizzes asociados a cada módulo.

Implementar un flujo de asignación

Definir un endpoint donde el superadmin cree una nueva “ruta de mesero” y la asigne a X “admin/empresa”. O, si la ruta es global, que cualquier admin pueda activarla en su empresa.

El admin luego puede “inscribir” a sus meseros (Employees) a esa ruta.

Al “employee” (mesero) se le lista la ruta con sus módulos, y el estatus (pendiente, completado, etc.).

Registrar progreso

Una tabla employee_module_progress para marcar si un mesero X completó el módulo Y, y si reprobó el quiz.

Una tabla employee_lesson_progress para registrar lecciones vistas, si queremos más granularidad.

Con esto, vamos paso a paso. Te propongo: iniciemos con algo muy sencillo para el rol mesero:

Migraciones: training_paths, modules, y una relación 1:N entre path y modules.

Datos de ejemplo: Creamos un path “Ruta de capacitación para meseros” y dos o tres módulos: “Introducción al servicio al cliente”, “Protocolos de higiene y seguridad”, “Técnicas de upselling”, etc.

Endpoints: un endpoint para que el superadmin cree la ruta y los módulos, y un endpoint para que el admin asigne la ruta a sus empleados meseros.

Visualización en el frontend: una vista “Panel de Meseros”, donde cada mesero tenga un link “Ver capacitación” y, al entrar, se muestren los módulos asignados.

A continuación, te doy un ejemplo de migraciones y un poco de lógica. Verás que iremos al “modo práctico” para no perdernos.

Ejemplo Paso a Paso para Rol “Mesero”

1. Crear migración de training_paths (AdonisJS)
   Ejemplo de migración (database/migrations/xxxx_create_training_paths.ts):

ts
Copy
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TrainingPaths extends BaseSchema {
protected tableName = 'training_paths'

public async up () {
this.schema.createTable(this.tableName, (table) => {
table.increments('id').primary()
table.string('title').notNullable() // e.g.: "Ruta de capacitación de Meseros"
table.text('description').nullable()
// Indica para qué rol es. Podrías usar rol_id (num) o un string "mesero"
table.string('role_name').nullable()

      // Si vas a permitir que sea privado de una empresa o global
      table
        .integer('company_id')
        .unsigned()
        .references('companies.id')
        .onDelete('CASCADE')
        .nullable()

      table.timestamps(true, true) // created_at, updated_at
    })

}

public async down () {
this.schema.dropTable(this.tableName)
}
}
Modelo TrainingPath.ts:

ts
Copy
// app/Models/TrainingPath.ts

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Module from './Module'
import Company from './Company'

export default class TrainingPath extends BaseModel {
public static table = 'training_paths'

@column({ isPrimary: true })
public id: number

@column()
public title: string

@column()
public description: string | null

// Si usas un string para rol, "mesero", "cocinero", etc.
@column()
public role_name: string | null

@column({ columnName: 'company_id' })
public companyId: number | null

@belongsTo(() => Company, {
foreignKey: 'company_id',
})
public company: BelongsTo<typeof Company>

@hasMany(() => Module, {
foreignKey: 'trainingPathId', // Asumiendo que iremos por 1:N
})
public modules: HasMany<typeof Module>

@column.dateTime({ autoCreate: true })
public createdAt: DateTime

@column.dateTime({ autoCreate: true, autoUpdate: true })
public updatedAt: DateTime
} 2. Crear migración de modules (AdonisJS)
Para ir a lo más simple, definimos que un training_path tiene muchos modules. En la base de datos:

ts
Copy
// database/migrations/xxxx_create_modules.ts
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Modules extends BaseSchema {
protected tableName = 'modules'

public async up () {
this.schema.createTable(this.tableName, (table) => {
table.increments('id').primary()
table
.integer('training_path_id')
.unsigned()
.references('training_paths.id')
.onDelete('CASCADE')
.notNullable()

      table.string('title').notNullable()  // e.g. "Introducción al servicio al cliente"
      table.text('description').nullable() // breve texto

      table.integer('order').defaultTo(1)  // Para el orden en la ruta

      // Si luego quieres permitir que un module sea global (sin path),
      // se haría un pivot N:M, pero de momento lo dejamos 1:N

      table.timestamps(true, true)
    })

}

public async down () {
this.schema.dropTable(this.tableName)
}
}
Modelo Module.ts:

ts
Copy
// app/Models/Module.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import TrainingPath from './TrainingPath'

export default class Module extends BaseModel {
public static table = 'modules'

@column({ isPrimary: true })
public id: number

@column({ columnName: 'training_path_id' })
public trainingPathId: number

@belongsTo(() => TrainingPath, {
foreignKey: 'training_path_id',
})
public trainingPath: BelongsTo<typeof TrainingPath>

@column()
public title: string

@column()
public description: string | null

@column()
public order: number

@column.dateTime({ autoCreate: true })
public createdAt: DateTime

@column.dateTime({ autoCreate: true, autoUpdate: true })
public updatedAt: DateTime
}
Con esto, tenemos la base para crear una “Ruta de Mesero” (TrainingPath) con varios módulos (Module).

3. Insertar datos de ejemplo (seeder o manual)
   Para empezar y poder testear, podemos hacer un “seeder” que cree una ruta “Capacitación Meseros”, con dos o tres módulos:

ts
Copy
// database/seeders/TrainingSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TrainingPath from 'App/Models/TrainingPath'
import Module from 'App/Models/Module'

export default class TrainingSeeder extends BaseSeeder {
public async run () {
// Crear una ruta => "Ruta de Mesero"
const meseroPath = await TrainingPath.create({
title: 'Ruta de Capacitación para Meseros',
description: 'Incluye protocolos de servicio al cliente, higiene, etc.',
role_name: 'mesero', // o "employee" si así lo deseas
companyId: null, // se asume global de momento
})

    // Crear módulos
    await Module.createMany([
      {
        trainingPathId: meseroPath.id,
        title: 'Introducción y Filosofía de Servicio',
        description: 'Importancia del servicio al cliente y actitud positiva.',
        order: 1,
      },
      {
        trainingPathId: meseroPath.id,
        title: 'Protocolos de Higiene',
        description: 'Lavado de manos, manejo de alimentos, presentación personal.',
        order: 2,
      },
      {
        trainingPathId: meseroPath.id,
        title: 'Técnicas de Venta Sugestiva',
        description: 'Recomendaciones de platos, upselling y cross-selling.',
        order: 3,
      },
    ])

}
}
Ahora, podemos cargar esto con node ace db:seed. Listo, ya tenemos una ruta y sus módulos en la base de datos.

4. Endpoints básicos para listar rutas y módulos
   Por ejemplo, un TrainingPathsController con:

ts
Copy
// app/Controllers/Http/TrainingPathsController.ts
import type { HttpContext } from '@adonisjs/core/http'
import TrainingPath from 'App/Models/TrainingPath'

export default class TrainingPathsController {
public async index({ request, response }: HttpContext) {
try {
// Podríamos filtrar por role_name="mesero" o lo que sea
// o solo devolver todos:
const paths = await TrainingPath.query().preload('modules')
return response.json({ status: 'success', data: paths })
} catch (error) {
console.error(error)
return response.status(500).json({ status: 'error', message: 'No se pudo listar rutas' })
}
}

public async show({ params, response }: HttpContext) {
try {
const pathId = params.id
const path = await TrainingPath.query()
.where('id', pathId)
.preload('modules')
.firstOrFail()
return response.json({ status: 'success', data: path })
} catch (error) {
console.error(error)
return response.status(404).json({ status: 'error', message: 'Ruta no encontrada' })
}
}

// Crear o Update si quieres (skipping for brevity)
}
En tus routes.ts agregas:

ts
Copy
import TrainingPathsController from 'App/Controllers/Http/TrainingPathsController'

// ...
router.get('/api/training-paths', [TrainingPathsController, 'index'])
router.get('/api/training-paths/:id', [TrainingPathsController, 'show'])
Con esto, desde el frontend (superadmin) puedes hacer un GET a /api/training-paths y ver la “Ruta de Capacitación para Meseros” con su lista de módulos.

5. Asignar la ruta “Mesero” a Empleados
   Este es un tema de diseño. Si solo meseros necesitan esa ruta, puedes:

Comparar su rol_id o position == 'Mesero' y automáticamente “activar” la ruta para ellos.

O tener una tabla pivot employee_training_paths con (employee_id, training_path_id, status), indicando que cierto empleado está inscrito a cierta ruta.

Ejemplo de una migración create_employee_training_paths.ts:

ts
Copy
import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EmployeeTrainingPaths extends BaseSchema {
protected tableName = 'employee_training_paths'

public async up () {
this.schema.createTable(this.tableName, (table) => {
table.increments('id').primary()

      table
        .integer('employee_id')
        .unsigned()
        .references('employees.id')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('training_path_id')
        .unsigned()
        .references('training_paths.id')
        .onDelete('CASCADE')
        .notNullable()

      table
        .enum('status', ['not_started','in_progress','completed'])
        .defaultTo('not_started')

      table.timestamps(true, true)
    })

}

public async down () {
this.schema.dropTable(this.tableName)
}
}
¿Por qué? Para registrar si un empleado está tomando esa ruta y en qué estado se encuentra. Así, cuando el admin contrata a un mesero nuevo, puede “inscribirlo” a la Ruta Mesero.
Ejemplo:

ts
Copy
// app/Models/EmployeeTrainingPath.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Employee from './Employee'
import TrainingPath from './TrainingPath'

export default class EmployeeTrainingPath extends BaseModel {
public static table = 'employee_training_paths'

@column({ isPrimary: true })
public id: number

@column({ columnName: 'employee_id' })
public employeeId: number

@column({ columnName: 'training_path_id' })
public trainingPathId: number

@column()
public status: 'not_started'|'in_progress'|'completed'

@belongsTo(() => Employee)
public employee: BelongsTo<typeof Employee>

@belongsTo(() => TrainingPath)
public trainingPath: BelongsTo<typeof TrainingPath>

@column.dateTime({ autoCreate: true })
public createdAt: DateTime

@column.dateTime({ autoCreate: true, autoUpdate: true })
public updatedAt: DateTime
}
Un controlador (p.ej. EmployeeTrainingPathsController) con un método “assign”:

ts
Copy
import EmployeeTrainingPath from 'App/Models/EmployeeTrainingPath'

public async assign({ request, response }: HttpContext) {
try {
const { employee_id, training_path_id } = request.only(['employee_id','training_path_id'])
const newRecord = await EmployeeTrainingPath.create({
employeeId: employee_id,
trainingPathId: training_path_id,
status: 'not_started'
})
return response.json({ status: 'success', data: newRecord })
} catch (error) {
console.error(error)
return response.status(500).json({ status: 'error', message: 'No se pudo asignar la ruta' })
}
}
Así, un superadmin (o un admin) puede “asignar” la ruta de meseros a un empleado. Luego, en la vista “Employee detail” se puede mostrar qué rutas le han sido asignadas.

6. Visualizar esto en el frontend: EmployeesPanel
   En tu React, cuando entras a “Employee detail” de un mesero, harás un GET a un endpoint como /api/employees/:id/training-paths (podríamos implementarlo), que devuelva las rutas asignadas a ese empleado. O, en su defecto, le pides directamente la tabla pivot employee_training_paths con employee_id = X, y ya cargas sus trainingPaths.

Una forma es que en tu EmployeesController crees un método getTrainingPaths que devuelva la lista con status, trainingPath (preload).

Ejemplo rápido:

ts
Copy
// app/Controllers/Http/EmployeesController.ts
import EmployeeTrainingPath from 'App/Models/EmployeeTrainingPath'

public async getTrainingPaths({ params, response }: HttpContext) {
try {
const employeeId = params.id
const records = await EmployeeTrainingPath.query()
.where('employee_id', employeeId)
.preload('trainingPath', (tpQuery) => {
tpQuery.preload('modules')
})
return response.json({ status: 'success', data: records })
} catch (error) {
console.error(error)
return response.status(500).json({ status: 'error', message: 'Falló getTrainingPaths' })
}
}
Después, en React, en tu EmployeeDetail.jsx al montar, llamas:

js
Copy
useEffect(() => {
fetch(`/api/employees/${employeeId}/training-paths`, {
headers: { Authorization: `Bearer ...` }
})
.then(r => r.json())
.then(res => setTrainingData(res.data))
}, [employeeId])
Y renderizas la lista de trainingPath con sus modules.

Conclusión
Siguiendo este enfoque incremental:

Creamos las migraciones y modelos necesarios solo para un primer caso: “Ruta de capacitación para meseros” con un par de “módulos”.

Generamos seeds de ejemplo para ver la data en la DB.

Exponemos endpoints básicos en Adonis (listar rutas, asignar rutas a un empleado).

Integramos un EmployeesPanel o EmployeeDetail en el frontend para mostrar y probar la asignación.

Una vez que lo tengas corriendo, amplías para:

Añadir lecciones (videos, PDF, etc.) dentro de los módulos.

Añadir quizzes con calificación.

Añadir tablas de progreso (employee_module_progress, etc.).

Hacer endpoints para registrar “El empleado vio la lección X” o “Presentó el quiz del módulo X, obtuvo 90%”.

Todo esto se hace paso a paso, sin intentar meter todo al inicio. De este modo, no te pierdes y vas confirmando que cada parte funciona antes de pasar a la siguiente.

¡Ánimo con la implementación! Con esta base, podrás escalar el sistema fácilmente para otros puestos (baristas, cocineros, etc.) y para más empresas en tu plataforma, sin perderte en la lógica compleja desde el principio.

4. ¿Qué sigue?
   Extender la lógica para manejar cambios de status (de not_started a in_progress o completed cuando el empleado avanza).

   Siguiendo este enfoque incremental:

Creamos las migraciones y modelos necesarios solo para un primer caso: “Ruta de capacitación para meseros” con un par de “módulos”.

Generamos seeds de ejemplo para ver la data en la DB.

Exponemos endpoints básicos en Adonis (listar rutas, asignar rutas a un empleado).

Integramos un EmployeesPanel o EmployeeDetail en el frontend para mostrar y probar la asignación.

Una vez que lo tengas corriendo, amplías para:

Añadir lecciones (videos, PDF, etc.) dentro de los módulos.

Añadir quizzes con calificación.

Añadir tablas de progreso (employee_module_progress, etc.).

Hacer endpoints para registrar “El empleado vio la lección X” o “Presentó el quiz del módulo X, obtuvo 90%”.

Todo esto se hace paso a paso, sin intentar meter todo al inicio. De este modo, no te pierdes y vas confirmando que cada parte funciona antes de pasar a la siguiente.

¡Ánimo con la implementación! Con esta base, podrás escalar el sistema fácilmente para otros puestos (baristas, cocineros, etc.) y para más empresas en tu plataforma, sin perderte en la lógica compleja desde el principio.

Incluir lecciones y quizzes en la TrainingPath o más granularmente en modules.

Registrar el progreso del empleado a nivel de module (p. ej., EmployeeModuleProgress), y/o a nivel de lesson (para saber si vio cada video) y a nivel de quiz (para saber si aprobó).

Integrar la vista en React para que, cuando entres al “Detalle de Empleado #12”, la app llame GET /api/employees/12/training-paths y pinte la lista de rutas con sus módulos.

4. ¿Qué sigue?
   Extender la lógica para manejar cambios de status (de not_started a in_progress o completed cuando el empleado avanza).

Incluir lecciones y quizzes en la TrainingPath o más granularmente en modules.

Registrar el progreso del empleado a nivel de module (p. ej., EmployeeModuleProgress), y/o a nivel de lesson (para saber si vio cada video) y a nivel de quiz (para saber si aprobó).

Integrar la vista en React para que, cuando entres al “Detalle de Empleado #12”, la app llame GET /api/employees/12/training-paths y pinte la lista de rutas con sus módulos.

Con este modelo y controlador (EmployeeTrainingPath + assign), ya tienes la base para asignar rutas de capacitación a empleados de forma muy parecida a lo que describiste. ¡Éxito en la implementación!

You said:
Extender la lógica para manejar cambios de status (de not_started a in_progress o completed cuando el empleado avanza). vamos a hacer esto Incluir lecciones y quizzes en la TrainingPath o más granularmente en modules. tambien esto Registrar el progreso del empleado a nivel de module (p. ej., EmployeeModuleProgress), y/o a nivel de lesson (para saber si vio cada video) y a nivel de quiz (para saber si aprobó). si esto y luego esto Integrar la vista en React para que, cuando entres al “Detalle de Empleado #12”, la app llame GET /api/employees/12/training-paths y pinte la lista de rutas con sus módulos.

seeder checar
// database/seeders/TrainingSeeder.ts
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TrainingPath from 'App/Models/TrainingPath'
import TrainingModule from 'App/Models/TrainingModule'
import TrainingLesson from 'App/Models/TrainingLesson'

export default class TrainingSeeder extends BaseSeeder {
public async run () {
// Crea un path "Ruta de Mesero"
const meserosPath = await TrainingPath.create({
title: 'Capacitación Meseros',
description: 'Ruta esencial para nuevos meseros',
role_name: 'mesero',
companyId: null,
})

    const mod1 = await TrainingModule.create({
      trainingPathId: meserosPath.id,
      title: 'Introducción',
      description: 'Bienvenida y filosofía de servicio',
      order: 1,
    })

    const mod2 = await TrainingModule.create({
      trainingPathId: meserosPath.id,
      title: 'Higiene y Seguridad',
      description: 'Protocolos esenciales',
      order: 2,
    })

    await TrainingLesson.createMany([
      {
        moduleId: mod1.id,
        title: 'Filosofía de la empresa',
        content: 'Video: https://youtu.be/ejemplo1',
        content_type: 'video',
        order: 1,
      },
      {
        moduleId: mod1.id,
        title: 'Actitud de servicio',
        content: 'PDF: https://ejemplo.com/actitud.pdf',
        content_type: 'pdf',
        order: 2,
      },
      {
        moduleId: mod2.id,
        title: 'Lavado de manos',
        content: 'Video: https://youtu.be/ejemplo2',
        content_type: 'video',
        order: 1,
      },
    ])

    // Podrías crear quizzes aquí también
    // ...

}
}

### paso 2

1. Estructura de Datos y Controladores (Backend)
   A) Módulo de “Rutas de Capacitación” (TrainingPaths + Modules + Lessons + Quizzes, etc.)
   Tablas / Modelos

training_paths: define la ruta (p.ej. “Capacitación Meseros”).

training_modules: cada ruta puede tener varios módulos (p.ej. “Introducción”, “Higiene y Seguridad”).

training_lessons: cada módulo puede tener lecciones (p.ej. “Video de bienvenida”, “PDF de protocolos”).

training_quizzes, training_questions, training_options: para evaluaciones dentro de un módulo.

Controladores

TrainingPathsController: CRUD de rutas (crear, listar, editar, eliminar).

TrainingModulesController y TrainingLessonsController (opcional, si deseas endpoints separados para crear/editar módulos y lecciones).

QuizzesController, QuestionsController, etc. (opcional) para manejar la parte de cuestionarios.

Flujo

El superadmin o un “content manager” crea la ruta (“Capacitación Meseros”).

Dentro de esa ruta, crea módulos (“Introducción”, “Protocolos Higiene”) y cada uno con sus lecciones.

(Opcional) Agrega un quiz al final de cada módulo.

Estos endpoints se usan en tu pantalla de “Gestión de Capacitaciones” (ver Frontend), donde construyes la ruta y su contenido.

B) Módulo de “Asignación” (EmployeeTrainingPath)
Tabla

employee_training_paths: relaciona un employee_id con un training_path_id y tiene un status (“not_started”, “in_progress”, “completed”).

Controlador

EmployeeTrainingPathsController con métodos:

assign: asignar una ruta a un empleado (crea el registro con status = "not_started").

listEmployeePaths: retorna todas las rutas asignadas a un empleado (con preload de trainingPath).

updateStatus: cambia el estado de la ruta para ese empleado (“in_progress” o “completed”).

Tablas de Progreso Granular

training_employee_module_progress: si quieres ver qué módulo ha completado el empleado.

training_employee_lesson_progress: si quieres ver qué lecciones ya vio.

employee_quiz_attempts (por ejemplo) para guardar intentos de quiz.

Flujo

El admin de una empresa dice “Quiero asignar la Ruta ‘Meseros’ a mis 5 meseros”. Se hace un POST /employee-training-paths/assign para cada uno, o un batch.

El empleado, al iniciar la capacitación, pasa a “in_progress”.

Cuando finaliza, se marca “completed”.

Estos endpoints se usan en tu pantalla de “Asignar Capacitación” (ver Frontend) y en el “Panel de Empleado” para ver / actualizar el estado de la ruta.

C) Módulo de “Empleados” (EmployeesController)
Ya lo tienes:

GET /employees, POST /employees para crearlos, etc.

GET /employees/:id/training-paths para ver sus rutas asignadas (podrías delegar a EmployeeTrainingPathsController).

Flujo:

El admin gestiona sus empleados (crear, editar).

Luego, en “Asignar Capacitación”, filtra a los empleados según empresa, puesto, etc.

D) Módulo de “Manuales” (TrainingManualsController)
Si mantienes los “Manuales” como un recurso distinto a las “Rutas de capacitación”, lo manejas en su propio CRUD.

Cada manual puede relacionarse con company_id y position_id (como ya tienes).

Podrías incorporarlo al “plan de capacitación” o no, dependiendo de tu diseño.

O integrarlo a las lecciones.

2. Pantallas y Flujo en el Frontend
   Dado tu plan incremental, la forma más clara de organizarlo es con pantallas separadas (Propuesta B). Así, cuando leas tu propio código más adelante, sabrás dónde encaja cada parte.

A) Pantalla “Gestión de Rutas” (o “Gestión de Capacitación”)
URL: /superadmin/training-paths

Objetivo:

Listar las rutas (GET /training-paths).

Crear una nueva (botón “Crear Ruta”), abriendo un modal o una vista POST /training-paths.

Editar (botón “Editar”) → PUT /training-paths/:id.

Eliminar (botón “Borrar”) → DELETE /training-paths/:id.

Ver Detalle de Ruta (módulos y lecciones):

Un detalle que llama GET /training-paths/:id con preload('modules').

Allí, un CRUD de Módulos (crear, editar, borrar).

Dentro de cada módulo, un CRUD de Lecciones y Quizzes (si lo deseas en la misma pantalla o en pantallas hijas).

Beneficio: cualquier usuario con acceso a esa pantalla podrá “diseñar” la capacitación sin confundirlo con la parte de “asignar a empleados”.

B) Pantalla “Asignar Capacitación” (EmployeeTrainingPaths)
URL: /superadmin/assign-training

Objetivo:

Mostrar un select de empresa (para filtrar empleados).

Mostrar un select de puesto (para filtrar más).

Listar abajo los empleados que cumplan ese filtro.

Mostrar un select de Rutas (GET /training-paths).

Botón “Asignar” → hace POST /employee-training-paths/assign (por cada empleado tildado o algo similar).

(Opcional) Botón “Desasignar” → DELETE /employee-training-paths/:id o un PUT con status = removed.

Flujo:

El admin llega, elige “Empresa 8”, “Puesto = Mesero”.

Le aparecen 5 meseros (employees). Tilda 3 de ellos.

Selecciona la “Ruta de Meseros” y hace clic en “Asignar”.

Se llama el endpoint → crea registros en employee_training_paths.

Mensaje de éxito.

C) Pantalla “Panel de Empleado” (o “Detalle de Empleado”)
URL: /superadmin/employees/:id

Objetivo:

Mostrar datos básicos del empleado.

Mostrar las rutas asignadas (GET /api/employees/:id/training-paths).

Cada ruta vendrá con su status.

(Opcional) Botón “Ver Detalle de Ruta” → abre una vista donde se ve cada módulo y su progreso (puede venir de employee_module_progress).

(Opcional) Botón “Iniciar Quiz” si hay un quiz en ese módulo.

Actualizar el status o el score cuando complete los módulos.

Si el empleado entra con su propia cuenta (por ejemplo, en una app de empleados), puede ver su propio progreso. Pero si solo el superadmin lo ve, igual sirve para control interno.

D) (Opcional) Pantalla “Tomar Quiz” (si el empleado tiene acceso al sistema)
Muestra las preguntas de training_questions y las opciones.

Al enviar las respuestas, se calcula si pasó o no.

Se crea un registro en employee_quiz_attempts.

Se actualiza employee_module_progress con la nota (score) y passed = true si superó el passingScore.

Resumen de la Lógica
Creación de contenido (Rutas, Módulos, Lecciones, Quizzes) → Pantalla A (Gestión de Rutas). Se usa TrainingPathsController, etc.

Asignar contenido a empleados → Pantalla B (Assign). Se usa EmployeeTrainingPathsController.

Ver progreso y detalle de cada empleado → Pantalla C (EmployeeDetail). Se obtienen registros de employee_training_paths (y, si quieres, employee_module_progress).

Completar un módulo → se marca en BD (status = completed) o se registra en employee_module_progress.

Tomar quiz → en la parte del frontend que maneje “Ver Módulo → Ver Lecciones → Tomar Quiz”. Se updatea la DB con la calificación.

De esta forma, todo tu backend (migraciones, modelos y controladores) está alineado con pantallas muy claras en el frontend:

“Gestión de Capacitación” para construir y editar el material.

“Asignar Capacitación” para vincular ese material a tus empleados.

“Panel de Empleado” o “Detalle Empleado” para ver su progreso.

Así, día con día puedes ir añadiendo:

Nuevas columnas (ej. employee_module_progress.score).

Rutas extras en el front (/superadmin/quizzes).

Funciones de “reportes” (ej. “¿Cuántos empleados terminaron la Ruta de Meseros?”).

Sin enredar el código, pues cada responsabilidad (crear contenidos, asignar, ver progreso) vive en una pantalla y controlador bien definido.

¡Listo! Con esa explicación, cuando veas tu propio código o alguien nuevo se integre al proyecto, te resultará natural decir:

“Crea la ruta” en la Pantalla A.

“Asígnala a empleados” en la Pantalla B.

“Ve el avance” en la Pantalla C.

Y con eso cierras el ciclo de vida de la capacitación.
