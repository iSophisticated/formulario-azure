// Importar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getDbConnection, sql } = require('./db/connection'); // Importar la conexión y el objeto sql

// Validar CLIENT_SECRET
const clientSecret = process.env.CLIENT_SECRET;
if (!clientSecret) {
  console.error('Error: CLIENT_SECRET no está configurado en las variables de entorno.');
  process.exit(1); // Detiene la ejecución si no se encuentra CLIENT_SECRET
}

// Configurar la aplicación
const app = express();
const port = 3000;

// Middleware para parsear solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para servir el formulario completo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/complete_form.html'));
});

// Ruta para manejar la inserción o actualización de datos en Assignments
app.post('/assignments', async (req, res) => {
  const { assignment_id, assignment_name, start_date, end_date, hours, action } = req.body;

  if (!assignment_id || !assignment_name || !start_date || !action) {
    res.status(400).send('Error: Algunos campos obligatorios están vacíos.');
    return;
  }

  let sqlQuery;
  if (action === 'new') {
    sqlQuery = `
      INSERT INTO Assignments (ID, Assignment, Start_Date, End_Date, Hours)
      VALUES (@assignment_id, @assignment_name, @start_date, @end_date, @hours)
    `;
  } else if (action === 'update') {
    sqlQuery = `
      UPDATE Assignments
      SET Assignment = @assignment_name, Start_Date = @start_date, End_Date = @end_date, Hours = @hours
      WHERE ID = @assignment_id
    `;
  } else {
    res.status(400).send('Error: Acción no válida.');
    return;
  }

  try {
    const request = await getDbConnection();
    await request
      .input('assignment_id', sql.VarChar, assignment_id)
      .input('assignment_name', sql.VarChar, assignment_name)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('hours', sql.Int, hours)
      .query(sqlQuery);

    res.send('Assignment procesado con éxito.');
  } catch (err) {
    console.error('Error al procesar Assignments:', err.message);
    res.status(500).send('Error al procesar Assignments.');
  }
});

// Ruta para manejar la inserción o actualización de datos en Members
app.post('/members', async (req, res) => {
  const {
    id, first_name, middle_name, last_name, birth_date, street_address, address_line_2, city,
    state, zip_code, status, source, ej_participant, low_income, fossil_fuel_worker,
    tribe_member, gateway_city, new_entrant, participant_status, enroll_date,
    training_focus_high_perf, training_focus_net_zero, training_focus_clean_transp,
    training_focus_offshore_wind, other_climate_critical_train, salary_enrollment,
    income_preprogram, salary_placement, salary_current, certifications, college_credits, action,
  } = req.body;

  if (!id || !first_name || !last_name || !birth_date || !action) {
    res.status(400).send('Error: Algunos campos obligatorios están vacíos.');
    return;
  }
  // Validación de EJ_Participant
  if (ej_participant !== 'Yes' && ej_participant !== 'No') {
    res.status(400).send("Error: EJ_Participant debe ser 'Yes' o 'No'.");
    return;
  // Validación de New_entrant
  }
  if (ej_participant !== 'Yes' && new_entrant !== 'No') {
    res.status(400).send("Error: new_entrant debe ser 'Yes' o 'No'.");
    return;
  }

  let sqlQuery;
  if (action === 'new') {
    sqlQuery = `
      INSERT INTO Member (
        ID, First_Name, Middle_Name, Last_Name, Birth_Date, Street_Address, Address_Line_2,
        City, State, Zip_Code, Status, Source, EJ_Participant, Low_Income, Fossil_Fuel_Worker,
        Tribe_Member, Gateway_City, New_Entrant, Participant_status, Enroll_Date,
        Training_Focus_High_Perf, Training_Focus_Net_Zero, Training_Focus_Clean_Transp,
        Training_Focus_Offshore_Wind, Other_Climate_Critical_Train, Salary_Enrollment,
        Income_Preprogram, Salary_Placement, Salary_Current, Certifications, College_Credits
      )
      VALUES (
        @id, @first_name, @middle_name, @last_name, @birth_date, @street_address,
        @address_line_2, @city, @state, @zip_code, @status, @source, @ej_participant,
        @low_income, @fossil_fuel_worker, @tribe_member, @gateway_city, @new_entrant,
        @participant_status, @enroll_date, @training_focus_high_perf, @training_focus_net_zero,
        @training_focus_clean_transp, @training_focus_offshore_wind, @other_climate_critical_train,
        @salary_enrollment, @income_preprogram, @salary_placement, @salary_current,
        @certifications, @college_credits
      )
    `;
  } else if (action === 'update') {
    sqlQuery = `
      UPDATE Member
      SET First_Name = @first_name, Middle_Name = @middle_name, Last_Name = @last_name,
          Birth_Date = @birth_date, Street_Address = @street_address, Address_Line_2 = @address_line_2,
          City = @city, State = @state, Zip_Code = @zip_code, Status = @status, Source = @source,
          EJ_Participant = @ej_participant, Low_Income = @low_income, Fossil_Fuel_Worker = @fossil_fuel_worker,
          Tribe_Member = @tribe_member, Gateway_City = @gateway_city, New_Entrant = @new_entrant,
          Participant_status = @participant_status, Enroll_Date = @enroll_date,
          Training_Focus_High_Perf = @training_focus_high_perf, Training_Focus_Net_Zero = @training_focus_net_zero,
          Training_Focus_Clean_Transp = @training_focus_clean_transp, Training_Focus_Offshore_Wind = @training_focus_offshore_wind,
          Other_Climate_Critical_Train = @other_climate_critical_train, Salary_Enrollment = @salary_enrollment,
          Income_Preprogram = @income_preprogram, Salary_Placement = @salary_placement, Salary_Current = @salary_current,
          Certifications = @certifications, College_Credits = @college_credits
      WHERE ID = @id
    `;
  } else {
    res.status(400).send('Error: Acción no válida.');
    return;
  }

  try {
    const request = await getDbConnection();
    await request
      .input('id', sql.VarChar, id)
      .input('first_name', sql.VarChar, first_name)
      .input('middle_name', sql.VarChar, middle_name)
      .input('last_name', sql.VarChar, last_name)
      .input('birth_date', sql.Date, birth_date)
      .input('street_address', sql.VarChar, street_address)
      .input('address_line_2', sql.VarChar, address_line_2)
      .input('city', sql.VarChar, city)
      .input('state', sql.VarChar, state)
      .input('zip_code', sql.VarChar, zip_code)
      .input('status', sql.VarChar, status)
      .input('source', sql.VarChar, source)
      .input('ej_participant', sql.VarChar, ej_participant)
      .input('low_income', sql.Bit, low_income)
      .input('fossil_fuel_worker', sql.Bit, fossil_fuel_worker)
      .input('tribe_member', sql.Bit, tribe_member)
      .input('gateway_city', sql.Bit, gateway_city)
      .input('new_entrant', sql.VarChar, new_entrant)
      .input('participant_status', sql.VarChar, participant_status)
      .input('enroll_date', sql.Date, enroll_date)
      .input('training_focus_high_perf', sql.Bit, training_focus_high_perf)
      .input('training_focus_net_zero', sql.Bit, training_focus_net_zero)
      .input('training_focus_clean_transp', sql.Bit, training_focus_clean_transp)
      .input('training_focus_offshore_wind', sql.Bit, training_focus_offshore_wind)
      .input('other_climate_critical_train', sql.Bit, other_climate_critical_train)
      .input('salary_enrollment', sql.Float, salary_enrollment)
      .input('income_preprogram', sql.Float, income_preprogram)
      .input('salary_placement', sql.Float, salary_placement)
      .input('salary_current', sql.Float, salary_current)
      .input('certifications', sql.VarChar, certifications)
      .input('college_credits', sql.Int, college_credits)
      .query(sqlQuery);

    res.send('Member procesado con éxito.');
  } catch (err) {
    console.error('Error al procesar Member:', err.message);
    res.status(500).send('Error al procesar Member.');
  }
});

// Ruta para manejar la inserción o actualización de datos en Member_Events
app.post('/member-events', async (req, res) => {
  const updateMemberStatus = async (eventId, newStatus) => {
    try {
      const request = await getDbConnection();
      await request
        .input('event_id', sql.Int, eventId)
        .input('status', sql.VarChar, newStatus)
        .query(`
          UPDATE Member
          SET Status = @status
          WHERE ID = (
            SELECT Member_ID FROM Member_Events WHERE ID = @event_id
          )
        `);
    } catch (err) {
      console.error('Error al actualizar el estado de Member:', err.message);
    }
  };
  const { event_id, event_type, event_date_time, action } = req.body;

  if (!event_id || !event_type || !event_date_time || !action) {
    res.status(400).send('Error: Algunos campos obligatorios están vacíos.');
    return;
  }

  let sqlQuery;
  if (action === 'new') {
    sqlQuery = `
      INSERT INTO Member_Events (ID, Event, Event_Date_Time)
      VALUES (@event_id, @event_type, @event_date_time)
    `;
  } else if (action === 'update') {
    sqlQuery = `
      UPDATE Member_Events
      SET Event = @event_type, Event_Date_Time = @event_date_time
      WHERE ID = @event_id
    `;
  } else {
    res.status(400).send('Error: Acción no válida.');
    return;
  }

  try {
    const request = await getDbConnection();
    await request
      .input('event_id', sql.Int, event_id)
      .input('event_type', sql.VarChar, event_type)
      .input('event_date_time', sql.DateTime, event_date_time)
      .query(sqlQuery);

    res.send('Member_Events procesado con éxito.');
  } catch (err) {
    console.error('Error al procesar Member_Events:', err.message);
    res.status(500).send('Error al procesar Member_Events.');
  }
});

// Ruta para probar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    const request = await getDbConnection();
    await request.query('SELECT 1 AS Test');
    res.send('Conexión exitosa a la base de datos.');
  } catch (err) {
    console.error('Error al probar la conexión:', err.message);
    res.status(500).send('Error al probar la conexión a la base de datos.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
