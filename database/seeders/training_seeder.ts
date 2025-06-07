import TrainingPath from '#models/training_path'
import TrainingModule from '#models/training_module'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class TrainingSeeder extends BaseSeeder {
  public static environment = ['development', 'testing'] // Opcional: limitar a entornos

  public async run() {
    // 1. Crear o actualizar la ruta de capacitación de meseros
    const trainingPath = await TrainingPath.updateOrCreate(
      { title: 'Ruta de Capacitación para Meseros' }, // criterio de búsqueda
      { title: 'Ruta de Capacitación para Meseros' } // datos para crear/actualizar
    )

    // 2. Definir los módulos de esa ruta (incluyendo el ID de la ruta para la relación)
    const modulesData = [
      {
        title: 'Módulo 1: Introducción al Servicio',
        trainingPathId: trainingPath.id,
      },
      {
        title: 'Módulo 2: Atención al Cliente',
        trainingPathId: trainingPath.id,
      },
      {
        title: 'Módulo 3: Manejo de Quejas',
        trainingPathId: trainingPath.id,
      },
    ]

    // 3. Crear o actualizar los módulos, evitando duplicados por título
    await TrainingModule.updateOrCreateMany('title', modulesData)
  }
}
