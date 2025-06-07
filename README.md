# Adonis Impulso Backend

## 1. Tabla `subscriptions`

- `status`: enum('trialing','active','suspended','expired','cancelled','pending')

  - `trialing`: 15 días de prueba.
  - `pending`: esperando pago.
  - `active`: ya pagó.
  - `suspended`: pasaron 5 días de gracia y no pagó.
  - `expired`/`cancelled`: la suscripción terminó.

- `coaching_included` (int): horas de asesoría incluidas.
- `coaching_used` (int): horas de asesoría consumidas.

#Adonis Impulso Backend
Este proyecto maneja la lógica de planes, suscripciones, módulos y el flujo de pagos (trial + gracia + pago + suspensión). Además, contempla la creación de usuarios, asignación de módulos y registro de horas de coaching. Finalmente, se planea un cron job para manejar la expiración automática y el reseteo de coaching.

1. Estructura de Bases de Datos
   plans

id, name, price, max_modules, etc.
Ejemplo: Plan Básico (max_modules=4), Plan Pro (max_modules=10).
modules (los 10 módulos totales)

id, name, slug, description.
subscriptions

id, user_id, plan_id: A qué usuario y plan pertenece.
start_date, end_date: Control del ciclo de facturación.
status: enum(trialing, pending, active, suspended, expired, cancelled).
trialEndsAt: Cuándo termina el trial de 15 días.
coaching_included, coaching_used: Para horas de coaching.
Ejemplo de “Plan Básico” => coaching_included=2; “Plan Pro” => coaching_included=4.
subscription_modules (pivot)

subscription_id, module_id.
Para que cada suscripción apunte a los módulos que usará (4 para Plan Básico, 10 para Plan Pro).
transactions

id, subscription_id, method_payment, status (pending/approved/failed), amount, payment_date.
Se registra cada pago (sea manual u online).
users

id, email, password, role: superadmin o admin, etc.
O cualquier otra info. 2. Flujo de Suscripción
Creación (SubscriptionsController.store):
Se le pasa user_id, plan_id, modules_ids (si es plan básico).
status = 'trialing'.
start_date = hoy (DateTime.now()).
trialEndsAt = start_date + 15 días.
end_date = null (hasta que pague).
Asigna “4 módulos” (básico) o “10 módulos” (pro).
Usuarios pagan:
Se registra un Transaction con status='approved'.
En TransactionsController (o PaymentsController), si status='approved', se actualiza la suscripción:
status='active'.
end_date = hoy + 30 días.
Renovaciones:
Cada que finaliza el mes, si el user paga de nuevo => se extiende end_date = end_date + 30.
Si no paga => a los 5 días se pone 'suspended'.
Upgrade (Básico → Pro):
Se cobra la diferencia.
Se cambia la suscripción a plan “Pro” (plan_id=2).
Se asignan 10 módulos en subscription_modules.
Se setea status='active', start_date= hoy, end_date= hoy+30. 3. Manejo de “Trial + Gracia”
Dos opciones:

Cron Job diario:

Cada noche (ej. 1 AM), un job revisa suscripciones con status='trialing'.
Si DateTime.now() > trialEndsAt + 5 días, se pone 'suspended'.
Middleware on-demand:

Al loguearse o al usar la app, verifica si la suscripción está en trial y si pasó la gracia => se suspende.
En la práctica, muchos usan un cron job (CheckTrialsJob) que corre a la 01:00.

4. Horas de Coaching
   coaching_included en la suscripción (2 horas si Básico, 4 si Pro).
   coaching_used indica cuántas ya consumió el usuario en el mes.
   Con un job (ResetCoachingJob) cada día 1 se reinicia coaching_used=0.
   Si se pasa de las horas incluidas, se cobra 1,000/h extra.

5. Integración con Mercado Pago
   Automática: Callback (webhook).
   MP llama a /payments/notification, y si status='approved', se actualiza la suscripción a 'active'.
   Manual: El superadmin recibe “status='pending'” y manualmente marca 'approved'.
6. Cron Jobs (Scheduler)
   CheckTrialsJob: Cada día a la 01:00 => suspende las suscripciones que terminaron el trial + 5 días.
   ResetCoachingJob: Cada día 1 de mes => pone coaching_used=0.
   (Opcional) “CheckExpirationsJob”: Para si end_date + 5 pasa y no pagó => 'suspended'.
   Con adonis-impulso-backend, lo habitual es que en start/scheduler.ts crees un SchedulerService, registras esos jobs, y los importas en app.ready(...).

7. Módulos
   Tablas:
   modules: (10 disponibles).
   subscription_modules: pivot.
   Lógica:
   Plan Básico => 4 módulos.
   Plan Pro => 10 módulos.
   Se asigna en store o al hacer upgrade.
8. UI (React) y Roles
   Superadmin:
   Ve todos los usuarios y suscripciones.
   Crea suscripciones.
   Asigna plan, módulos.
   Marca transacciones como 'approved' si es manual.
   Ve reportes de ingresos.
   Admin (dueño):
   Usa sus módulos (Punto de Venta, Inventarios, etc.).
   Ve su “estado de suscripción” (trial/active/suspended).
   Un botón “Pagar Mensualidad” (Mercado Pago).
   Crea empleados (sub-usuarios), si se requiere.
9. Roadmap
   Migraciones (plans, modules, subscriptions, subscription_modules, transactions).
   Endpoints
   /subscriptions: store, update, index, show.
   /transactions: store (o create), index.
   /payments/notification: webhook.
   Front (React)
   Panel superadmin => CRUD suscripciones, planes, módulos, usuarios.
   Panel admin => ver mis módulos, pagar, ver mi coaching restante.
   Cron
   Implementar CheckTrialsJob y ResetCoachingJob.
   Adición de Chatbot (WhatsApp)
   Tras la base lista, integrar un microservicio que responda preguntas tipo “¿cuánto vendí ayer?” consultando la DB.
10. Recomendaciones Finales
    Empezar con la parte de suscripciones y planes (store + transacciones).
    Probar manualmente un “trial” y un “pago” para ver que se actualice a 'active'.
    Usar un cron job (o script manual) para suspender trial > 15+5 días.
    Luego pasar a los módulos (Punto de venta, Inventarios, etc.).
    Finalmente, integrar Chatbot WhatsApp usando la data real.
11. Resumen Rápido
    Planes: Básico (4 módulos, 2h coaching, $10k/mes), Pro (10 módulos, 4h coaching, $20k/mes).
    Suscripción: 'trialing' => 'active' => 'suspended' si no renueva.
    Módulos: pivot subscription_modules.
    Pagos: transactions. Si 'approved', la sub se pone 'active'.
    Horas de Coaching: coaching_included, coaching_used, reset cada mes.
    Cron Job: suspende al expirar trial + gracia, resetea coaching.
    UI: superadmin crea sub, admin paga, fin.

## -----------------------------------##

A continuación tienes un flujo actualizado que combina la lógica Automática (cron job + webhook de pago) con la posibilidad de pago offline, sin perder la consistencia de trial + gracia y el reseteo (si aplica) de horas de coaching.

Flujo Híbrido: Pago Offline + Pago Online + Automatizaciones

1. Creación de la Suscripción
   Status = 'trialing'.
   start_date = DateTime.now().
   trialEndsAt = start_date + 15 días.
   end_date = null (hasta que pague).
   coaching_included = 2 (Básico) o 4 (Pro).
   coaching_used = 0.
   Asignas 4 módulos si es Plan Básico, 10 si es Pro.
   Resultado: El usuario puede usar el sistema por 15 días gratis.

2. Manejo de Gracia (Trial + 5 días)
   2.1. Cron Job (CheckTrialsJob)
   Corre, por ejemplo, cada noche a la 01:00.
   Busca suscripciones con status='trialing'.
   Si hoy > trialEndsAt + 5 días, pasa status='suspended'.
   Aclaración:

Suspender es automático (cron job) si no pagó en 15+5 días.
Alternativa Manual: El superadmin puede forzar “suspend” en cualquier momento. 3. Pago Online (Mercado Pago)
El usuario ingresa a la pasarela.
Mercado Pago hace callback a /payments/notification con status='approved' (automático).
Tu backend:
Busca la suscripción (subscription_id).
Cambia status='active'.
end_date = hoy + 30 días (o suma 30 a end_date si ya estaba corriendo).
Crea un transaction con status='approved'.
Ventaja: Sin intervención del superadmin.

4. Pago Offline
   El usuario paga en efectivo / transferencia.
   Superadmin recibe el comprobante fuera del sistema.
   Superadmin (en un panel):
   Crea un transaction con status='pending'.
   Verifica manualmente.
   Actualiza transaction.status='approved'.
   Se actualiza subscription.status='active'.
   end_date = hoy + 30 días.
   Conclusión: la suscripción se “activa” igual que en el flujo online, solo que la aprobación es manual.

5. Renovaciones Mensuales
   Cuando end_date se acerca, el usuario debe pagar otra vez (online u offline).
   Si paga a tiempo (ej. antes o el día que vence), end_date = end_date + 30.
   Cron Job (ej. CheckRenewalsJob) podría suspender después de 5 días sin pago si es que usas el mismo patrón de gracia mensual.
   O Manual: superadmin ve “no pagó 5 días después de end_date” => 'suspended'.
   Así, cada mes se repite la mecánica. Quien no paga, se suspende.

6. Upgrade de Plan (Básico → Pro)
   El usuario dice “quiero subir a Pro” antes de que acabe su ciclo.
   Pago la diferencia (ej. $10,000 MXN extra).
   Superadmin o webhook de MP => 'approved' => subscription.status='active', plan_id=Pro, end_date= hoy+30, subscription_modules= (10), etc.
7. Coaching Hours y Reseteo
   coaching_included = 2 (Básico) o 4 (Pro).

coaching_used se incrementa cada vez que se da 1h de asesoría.

Exceso => Cobrar 1,000/h extra (nuevo transaction + 'approved' => cargo adicional).

Reset:

Automático:
“ResetCoachingJob” corre el día 1 de cada mes => coaching_used=0.
Sencillo si tienes muchos clientes.
Manual:
El superadmin, al iniciar el nuevo ciclo, pone coaching_used=0.
Útil si tienes pocos clientes y quieres mayor control. 8. Combinación Manual + Automático
Flujo:

Trials se suspenden con un cron job (CheckTrialsJob).
Pagos online => callback (automático).
Pagos offline => superadmin “aprueba” (manual).
Renovaciones se pueden hacer con un “cron job” (o manual) revisando si end_date + 5 ya pasó.
Reset de coaching => también cron job o manual.
Ventaja:

La mayoría de clientes paga online => No requiere acción del superadmin.
Si algún cliente hace offline => superadmin “aprueba”.
Trials y fin de ciclo => suspendidos automáticamente por cron. 9. Resumen del Flujo Híbrido
Creación => 'trialing', 15 días.
Cron => si pasa 15+5 días => 'suspended'.
Pago => 'active', 30 días.
Online => MP callback.
Offline => superadmin aprueba.
Renovación => se repite mes a mes. Quien no paga => 'suspended' (cron/manual).
Coaching => si se excede, se cobra extra. Reset mensual con cron o manual.
Con esto, cubres los casos:

Pago “invisible” (online) => no hay intervención.
Pago “offline” => superadmin habilita manualmente.
Suspensión y resets con cron => no hay que estar pendiente de fechas.
O superadmin puede hacer todo manual si lo prefiere.
¡Listo! Ese es el flujo combinado que en la vida real te da confiabilidad para muchos clientes (automatización) + flexibilidad para pagos offline.

1. Planes y Precios
   Plan Básico

Precio: 10,000 MXN mensuales.
Módulos incluidos: El usuario elige cualquier 4 de los 10 disponibles.
15 días de prueba gratis (trial).
5 días de gracia luego de la fecha de cobro (pero, de momento, no se guarda en DB, simplemente se suspende al no pagar).
Horas de asesoría personal: 0 (o algo muy limitado).
Puede pagar horas extra de asesoría a 1,000 MXN/h.
Plan Pro

Precio: 20,000 MXN mensuales.
Incluye todos los 10 módulos.
+4 horas de asesoría personal gratuitas (1 presencial y 3 en línea).
Las horas extra también se cobran a 1,000 MXN/h.
Mismo trial de 15 días y misma mecánica de gracia de 5 días.
Upgrade de Básico a Pro: se cobra la diferencia y se reinicia o ajusta la suscripción en ese momento.
(Nota: Los montos mensuales son altos, pero es lo que has definido — no hay problema técnico, simplemente lo comento.)

2. Selección de Módulos en el Plan Básico
   Como cada usuario “básico” puede elegir 4 de los 10 módulos, el Plan Básico no se define estáticamente con esos 4 módulos en plans_modules; en su lugar lo que hacemos es guardar que “este Plan_Básico permite máximo 4 módulos” y, cuando creamos la suscripción, definimos exactamente cuáles 4.
   Esa elección la hará el superadmin al crear la suscripción (no el usuario final).
   Modelo sugerido
   plans
   id, name, price, max_modules (por ejemplo, 4 si es el Plan Básico y 10 si es el Plan Pro).
   description, … etc.
   modules (10 módulos totales)
   id, name, slug, description, …
   subscriptions
   id, user_id, plan_id (Básico o Pro),
   start_date, end_date (cuándo caduca el período pagado),
   status (trialing, active, suspended, canceled, etc.),
   trial_ends_at (opcional, si quieres guardarlo),
   observations, etc.
   subscription_modules (para usuarios del Plan Básico)
   id, subscription_id, module_id.
   Para el Plan Pro, como siempre son todos, puedes (a) crear 10 filas de golpe en subscription_modules o (b) en el front, cuando detectas que es “Pro”, habilitas todos los accesos sin consultar la DB.
   Lo mejor es guardar todo en DB para que sea más consistente (“10 filas = 10 módulos asignados”).
   transactions
   id, subscription_id, method_payment (e.g. “MercadoPago”), amount,
   status (pending, approved, failed),
   payment_date, transaction_number, etc.
3. Fechas: Trial y Gracia
   Trial: 15 días.
   En subscriptions.start_date se pone la fecha de hoy, en subscriptions.trial_ends_at = start_date + 15 días.
   status = trialing.
   Al cumplirse el día 15 (o el día 16 en la mañana), el usuario debe pagar.
   Hay 5 días de gracia (no lo guardas en DB por ahora). Lo que hacen muchos sistemas es tener un campo grace_period_ends_at = trial_ends_at + 5 días. Pero si no lo guardas, igual podrías manejar la lógica en un cron job o un middleware que dice:
   "¿Hoy es mayor a trial_ends_at + 5 días y no pagó? => status = suspended."
   Suspensión: si no paga dentro de la gracia, se pone status = suspended.
   (Luego, cuando pague, renuevas la suscripción 30 días a partir de la fecha de pago, lo pones en active, etc.)

4. Pago Automático vs. Pago Manual con Mercado Pago
   A. Automático (Callback de Mercado Pago)
   El cliente hace clic en “Pagar” y se redirige a la URL de checkout de Mercado Pago.

Cuando la transacción se completa, Mercado Pago envía un webhook (o “IPN / notification”) a tu endpoint de Adonis, por ejemplo /payments/notification.

Ese endpoint verifica que el status sea approved (o authorized).

Si es approved, creas un registro en transactions con status='approved', payment_date = now, etc., y cambias la subscription.status a active, actualizando subscription.start_date y subscription.end_date.

Por ejemplo: start_date = hoy, end_date = hoy + 30 días.
El usuario, al volver a tu panel, su suscripción ya está en active, y puede usar los módulos.

Ventaja: todo es automático, no necesitas un superadmin revisando manualmente.

B. Manual (Verificación manual)
El usuario paga (sea en efectivo o con la misma pasarela).
Se notifica a tu DB con status pending.
Un superadmin va a la tabla de transacciones y verifica el comprobante.
Si está OK, marca manualmente status='approved'.
Actualizas subscription => active, etc.
Ventaja: control más estricto en caso de pagos en efectivo, cheques, etc.
Desventaja: es más labor manual.

Lo usual es combinar ambas:

Para pagos en línea (Mercado Pago), implementas el callback automático.
Si un usuario paga offline (efectivo/transferencia), se crea un transaction con status='pending' y el superadmin lo cambia a approved manualmente. 5) Upgrade de Básico a Pro
El usuario no ha terminado su mes, pero quiere pasar al Plan Pro.
Cobras la diferencia. Ejemplo: supón que el usuario pagó 10,000 hace 15 días, y hoy la suscripción está a mitad. Para el upgrade podrías:
Cobrar 10,000 más y reiniciar su fecha a “hoy + 30 días con Plan Pro.”
O prorratear (ej. cobrar ~5,000 por lo que falta de mes).
Me comentas que quieres “cobrar la diferencia y a partir de ahí corre un mes completo”.
Entonces:
Haces un cargo por 10,000 MXN (diferencia)
Cambias la suscripción a Pro => plan_id = 2.
start_date = hoy, end_date = hoy + 30 días, status=active.
En subscription_modules asignas los 10 módulos.
No reembolsas días. 6) Roles y Creación de Usuarios
superadmin:

Crea usuarios.
Asigna plan.
Elige 4 módulos en caso de plan básico.
Gestiona pagos manuales.
Ve reportes.
admin (dueño de restaurante / cliente):

Usa los módulos (Panel en React).
Puede crear empleados (sub-usuarios).
Probablemente un “employee” rol.
Puede ver su estado de suscripción, su próxima fecha de cobro, etc.
Puede pagar (Mercado Pago).
Y si no paga → se suspende.
(Te valdría la pena tener un “employee” si tu cliente va a invitar a su staff. O si no, podrías usar un “admin” + “sub-admin” approach. Pero eso ya es diseño interno. Lo que me confirmaste es que sí puede crear cuentas para sus empleados.)

7. Historial de Pagos / Facturación
   Guardar en transactions cada pago.
   El superadmin podrá ver un reporte en el dashboard: “Suma de amount por mes = ingresos mensuales”.
   Allí también filtrar por plan, por usuario, etc.
8. Lo más importante ahora (prioridad de desarrollo)
   Módulos del usuario (funcionalidad)

Definir en Adonis la tabla modules, el endpoint para asignar/quitar módulos a la suscripción.
En React (rol=admin/cliente) que puedan usar su(s) módulo(s).
Cada módulo es una sección / feature:
Ej. “Punto de venta” → Cuando entra, ve su sistema de tickets o facturas.
“Inventarios” → CRUD de inventarios.
… etc.
Cobro / Suscripción

Manejar la creación de la suscripción en tu panel de superadmin.
Integrar el checkout de Mercado Pago para cuando un “admin” quiera pagar.
Implementar el webhook de Mercado Pago para que sea automático.
Si un usuario no paga al día 15 + 5 días de gracia, se le marcan sus módulos como inactivos.
Horas de capacitación

Para Plan Pro: 4 horas incluidas (1 presencial, 3 online).
Registrar cuántas horas ya consumió.
Si quiere más, se factura a 1,000 MXN/h. Podrías hacer un CRUD de “sesiones de capacitación”.
Futuro:

Reportes de ingresos mensuales en el dashboard superadmin.
Algún cron job en Adonis o en tu hosting que corra a diario y revise las suscripciones que deban suspenderse. 9) Bot WhatsApp para consultas
Lo que comentas: “Si el usuario escribe en su WhatsApp: ‘¿Cuánto vendí ayer?’ que el bot le responda con la cifra”.

¿Cómo lograrlo?
WhatsApp Business API (o Twilio, o 360Dialog, o Zenvia, etc.).
Necesitas un backend con “webhook de WhatsApp” que reciba el mensaje del usuario, interprete la pregunta y consulte tu DB (o tu API) para responder.
Un approach es tener un microservicio de “Chatbot NLP” (Natural Language Processing) que interprete la frase (“ventas ayer” => select sum(ventas) where date = current_date -1) y devuelva la respuesta.
O algo más simple: un set de “intents” predefinidos: “ventas ayer”, “ventas mes pasado”, “inventario actual”, etc.
Dado que tu data de ventas e inventarios vive en cada módulo (por ejemplo, un “módulo Ventas” con su tabla), necesitarás endpoints que retornen la info en JSON.
El Bot, una vez interpretado, hará axios.get('https://tu-api.com/ventas/dia?fecha=YYYY-MM-DD') y te responde.
Esto es más avanzado en la capa NLP y en la integración con WhatsApp. Pero conceptualmente:

Recibir mensaje del usuario (WhatsApp).
Identificar la intención: “¿Cuánto vendí ayer?”
Buscar la data en tu DB / Módulo Ventas.
Responder en texto: “Ayer vendiste 25,000 MXN.”
Sugerencia: primero termina la parte de suscripciones, planes, pagos y la funcionalidad base de cada módulo. Luego, integras el Chatbot con la data.

10. Flujo: Puntos clave a implementar de inmediato
    Migraciones en Adonis para:

plans (2 planes, con max_modules = 4 y max_modules=10).
modules (los 10).
users (rol superadmin o admin).
subscriptions.
subscription_modules.
transactions.
Endpoints:

/subscriptions:
POST: superadmin crea la suscripción para un usuario. (Si plan = básico => selec. 4 módulos. Si plan = pro => 10).
/subscriptions/:id:
GET: ver detalles (user, plan, status).
PUT: actualizar (por ejemplo, upgrade a pro).
/transactions:
POST: registrar una transacción (desde el webhook de MP o manual).
/payments/notification:
POST: webhook de Mercado Pago.
Si status=approved, actualiza la sub a active + extiende la fecha final.
Lógica de trial:

Al crear la suscripción, status='trialing', start_date=now, end_date=null (hasta que pague), trial_ends_at= now + 15 días.
Algún cron job: “if today > subscription.trial_ends_at + 5 días and subscription.status in [‘trialing’, ‘pending’] => status='suspended'.”
UI en React:

Módulo “Suscripciones”:
Para el superadmin: ver un grid con user, plan, status, next billing date, etc.
Botón “Registrar Pago” (manual) y “Upgrade a Pro”.
Módulo “Planes”:
Ya lo tienes en parte. Sólo agrégale max_modules.
Módulo “Módulos”:
Lista de los 10. El superadmin asigna/quita, etc.
Panel “admin” (dueño del restaurante):
Ve sus módulos activos.
Un botón “Pagar Mensualidad” -> lo lleva a MP.
Un “Resumen” de su suscripción.
Reportes:

Tab “Dashboard” superadmin:
Ingresos totales del mes => sum(transactions.amount) con status=approved, en la fecha >= primer día del mes.
Cantidad de suscripciones activas.
Cantidad de suscripciones en trial, etc.
Horas de asesoría:

Deja un subscription.coaching_hours_used y subscription.coaching_hours_included.
Para Pro: coaching_hours_included = 4.
Cada que se use 1 hora, lo incrementas. Si pasa de 4, generas un cargo adicional. 11) Respondiendo las dudas específicas
Diferencia entre automático y manual con Mercado Pago

Automático: configuras un webhook en MP que, al aprobarse el pago, te llama con la data. Tu backend en Adonis recibe esa llamada y marca la suscripción como pagada. El admin no toca nada.
Manual: no usas el webhook (o no lo aprovechas). El admin (superadmin) recibe un mail/alerta, entra a tu panel y hace clic en “Aprobar pago”.
Lo más práctico: habilitar el webhook de Mercado Pago para que sea todo automático. Y si hay pagos en efectivo, se hace de forma manual.
Reporte de ingresos mensuales

Se consigue sumando transaction.amount donde status='approved' y payment_date en el mes actual.
“¿Los roles determinan qué menús o vistas se muestran?”

Dices que tu app solo tiene dos roles principales: superadmin y admin.
Efectivamente, superadmin ve menús de control total (Usuarios, Subscriptions, Planes, etc.).
El admin ve solo sus módulos + su panel de pago.
No hay más roles “employee,” aunque te lo planteas, se puede añadir cuando sea necesario.
Te preocupa el “grace_period_ends_at”

Si no quieres guardarlo, tu cron job puede calcular algo como:
“si hoy > trial_ends_at + 5 días => suspender.”
O en un helper: if ( Date.now() - subscription.trial_ends_at.getTime() > 5*24*60*60*1000 ) subscription.status='suspended'. 12) Conclusión y Próximos Pasos
Definir la DB y las migraciones.
Crear endpoints en Adonis para manejar:
Suscripciones (CREAR / GET / ACTUALIZAR).
Transacciones (CREAR / LISTAR).
Webhook de MercadoPago.
En React (panel superadmin), crear la interfaz para:
Crear usuarios y asignar plan.
Elegir 4 módulos si es Plan Básico.
Registrar pagos manuales.
Listado de suscripciones (mostrar estado y poder cambiarlo).
En React (panel admin/cliente), crear la interfaz de:
Ver mis módulos contratados.
Botón “Pagar” (link a MercadoPago).
Ver mi estado de suscripción (fecha, etc.).
(Opcional) Ver cuántas horas de coaching me quedan.
Configurar Cron (o job) que diariamente verifique suscripciones que pasaron la fecha de trial/gracia o la fecha de end_date.
(Más adelante) la capa de Chatbot WhatsApp, para que sea un “fancy UI” que permita a un usuario “admin” (dueño de restaurante) preguntar: “¿Cuánto vendí ayer?” e internamente tu Bot realice la consulta a la BD de Ventas del “módulo X” y devuelva la respuesta.
Resumen Final
Con lo que me has dicho, la prioridad es construir la lógica de planes, suscripciones y asignación de módulos para que, en el momento en que un usuario (admin) paga, su suscripción se actualice (vía MP webhook) y se le activen los módulos correspondientes.
Después, ir desarrollando cada módulo (Punto de Venta, Inventarios, Lealtad, etc.) con su respectiva DB y pantallas.
Finalmente, integrar el Chatbot de WhatsApp que consulte datos en tu backend y responda a las preguntas del cliente sin que tenga que entrar al panel.
Tienes un buen roadmap. Si deseas más detalles de implementación o de la lógica concreta del webhook, transacciones o cron jobs, avísame y profundizamos en ese punto. ¡Seguimos paso a paso!

## BASE DE DATOS PRUEBA

Database = toizbseh_testimpulsohector
userdatabase=toizbseh_test_hector_impulso
password=01HV193084
DB_PORT=3306
DB_HOST=50.31.174.150
.envhector = respaldo
