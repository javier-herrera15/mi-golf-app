# ⛳ Mi Golf App

Aplicación móvil para reservar tee times en campos de golf españoles. Proyecto personal full-stack desarrollado con React Native y Supabase.

## Por qué la construí

Por dos motivos.

**La oportunidad.** El pádel tiene Playtomic: una plataforma que ha resuelto la reserva de pistas con una experiencia de usuario sencilla y una adopción enorme. El golf en España no tiene todavía un equivalente con esa penetración, y la reserva de tee times sigue siendo fragmentada entre clubes. Soy jugador de golf y quería explorar ese hueco construyendo un prototipo funcional en lugar de quedarme en la idea.

**El aprendizaje.** También quería medir hasta dónde puede llegar hoy alguien sin formación en desarrollo apoyándose en herramientas de IA, y entender de primera mano cómo encajan las piezas de un producto digital: base de datos, autenticación, interfaz y la lógica que las conecta.

## Qué hace

- **Registro e inicio de sesión** con autenticación por email y contraseña.
- **Listado de campos** con ubicación y precio de referencia.
- **Disponibilidad en tiempo real**: al abrir un campo, la app consulta la base de datos y marca como ocupadas las franjas ya reservadas, impidiendo dobles reservas.
- **Reserva con confirmación** mediante modal.
- **Gestión de reservas propias**: cada usuario ve únicamente sus reservas, y puede cancelarlas para liberar la franja.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React Native (Expo), TypeScript |
| Navegación | Expo Router (file-based routing) |
| Backend | Supabase — PostgreSQL + Auth |

## Estructura

```
app/
├── login.tsx          Autenticación (registro e inicio de sesión)
├── (tabs)/index.tsx   Listado de campos disponibles
├── detalles.tsx       Franjas horarias y reserva
├── mis-reservas.tsx   Reservas del usuario y cancelación
└── supabase.js        Cliente de Supabase
```

## Cómo ejecutarlo

```bash
npm install
npx expo start
```

Escanea el código QR con la app Expo Go, o ábrelo en un emulador de iOS o Android.

Requiere un proyecto de Supabase con una tabla `reservas` con los campos: `id`, `campo_nombre`, `hora`, `usuario_nombre`, `user_id`, `created_at`.

## Estado actual y siguientes pasos

Este es un proyecto de aprendizaje. Funciona de extremo a extremo, pero está deliberadamente acotado:

- El catálogo de campos y las franjas horarias están fijados en el código; no hay todavía panel de administración.
- Las reservas no manejan fecha, solo hora: el siguiente paso natural es añadir un calendario.
- La sesión no persiste entre reinicios de la app (`persistSession: false`), pendiente de migrar a almacenamiento seguro.

---

Desarrollado como proyecto personal por [Javier Herrera García](https://github.com/javier-herrera15).
