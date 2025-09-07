// server.js

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sql, poolPromise } = require('./db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");

const upload = multer({ storage: multer.memoryStorage() });

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_BLOB_CONTAINER);





app.get('/api/test', (req, res) => res.json({ message: 'API is working!' }));

// ---------------------- USERS ----------------------
app.get('/api/users', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Users');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- PATIENTS ----------------------
app.get('/api/patients', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Patients');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- PROVIDERS ----------------------
app.get('/api/providers', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Providers');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- APPOINTMENTS ----------------------
app.get('/api/appointments', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Appointments');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- PROVIDER SCHEDULES ----------------------
app.get('/api/provider-schedules', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.ProviderSchedules');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- TIMESLOTS ----------------------
app.get('/api/timeslots', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.TimeSlots');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- MEDICAL RECORDS ----------------------
app.get('/api/medical-records', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.MedicalRecords');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- MEDICAL RECORD PROVIDERS ----------------------
app.get('/api/medical-record-providers', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.MedicalRecordProviders');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- FILE ATTACHMENTS ----------------------
app.get('/api/file-attachments', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.FileAttachments');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- HEALTH METRICS ----------------------
app.get('/api/health-metrics', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.HealthMetrics');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- CHAT MESSAGES ----------------------
app.get('/api/chat-messages', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.ChatMessages');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- NOTIFICATIONS ----------------------
app.get('/api/notifications', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Notifications');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

async function getById(table, column, value, res) {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('value', sql.VarChar(50), value)
      .query(`SELECT * FROM dbo.${table} WHERE ${column} = @value`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: `${table} record not found` });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// ---------------------- USERS ----------------------
/*app.get('/api/users', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Users');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/
app.get('/api/users/:id', (req, res) => getById('Users', 'id', req.params.id, res));



// ---------------------- UPDATE USER ----------------------
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    age,
    date_of_birth,
    role,
    // patient
    insurance_provider,
    insurance_policy_number,
    emergency_contact_name,
    emergency_contact_phone,
    emergency_contact_relationship,
    // provider
    specialization,
    licence,
    experience,
    address,
    education
  } = req.body;

  try {
    const pool = await poolPromise;
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Update Users table
      const result = await transaction.request()
        .input('id', sql.VarChar(50), id)
        .input('name', sql.VarChar(255), name)
        .input('email', sql.VarChar(255), email)
        .input('phone', sql.VarChar(20), phone || null)
        .input('age', sql.Int, age || null)
        .input('dob', sql.Date, date_of_birth || null)
        .query(`
          UPDATE dbo.Users
          SET name = @name,
              email = @email,
              phone = @phone,
              age = @age,
              date_of_birth = @dob
          WHERE id = @id
        `);

      if (result.rowsAffected[0] === 0) {
        await transaction.rollback();
        return res.status(404).json({ error: 'User not found' });
      }

      // Role-specific updates
      if (role === 'patient') {
        await transaction.request()
          .input('user_id', sql.VarChar(50), id)
          .input('insurance_provider', sql.VarChar(255), insurance_provider || null)
          .input('insurance_policy_number', sql.VarChar(255), insurance_policy_number || null)
          .input('emergency_contact_name', sql.VarChar(255), emergency_contact_name || null)
          .input('emergency_contact_phone', sql.VarChar(20), emergency_contact_phone || null)
          .input('emergency_contact_relationship', sql.VarChar(100), emergency_contact_relationship || null)
          .query(`
            UPDATE dbo.Patients
            SET insurance_provider = @insurance_provider,
                insurance_policy_number = @insurance_policy_number,
                emergency_contact_name = @emergency_contact_name,
                emergency_contact_phone = @emergency_contact_phone,
                emergency_contact_relationship = @emergency_contact_relationship
            WHERE user_id = @user_id
          `);
      }

      if (role === 'provider') {
        await transaction.request()
          .input('user_id', sql.VarChar(50), id)
          .input('specialization', sql.VarChar(255), specialization || null)
          .input('licence', sql.VarChar(100), licence || null)
          .input('experience', sql.Int, experience || null)
          .input('address', sql.VarChar(255), address || null)
          .input('education', sql.VarChar(255), education || null)
          .query(`
            UPDATE dbo.Providers
            SET specialization = @specialization,
                license = @licence,
                experience = @experience,
                address = @address,
                education = @education
            WHERE user_id = @user_id
          `);
      }

      await transaction.commit();

      // Return updated user
      const updatedUser = await pool.request()
        .input('id', sql.VarChar(50), id)
        .query(`SELECT * FROM dbo.Users WHERE id = @id`);

      res.json({ message: 'User updated successfully', user: updatedUser.recordset[0] });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




// ---------------------- PATIENTS ----------------------
/*app.get('/api/patients', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Patients');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/
app.get('/api/patients/:user_id', (req, res) =>
  getById('Patients', 'user_id', req.params.user_id, res)
);

// ---------------------- PROVIDERS ----------------------
// app.get('/api/providers', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.Providers');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/providers/:id', (req, res) => getById('Providers', 'id', req.params.id, res));

// ---------------------- APPOINTMENTS ----------------------
// app.get('/api/appointments', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.Appointments');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/appointments/:id', (req, res) =>
  getById('Appointments', 'id', req.params.id, res)
);


app.get('/api/appointments/:id', (req, res) =>
  getById('Appointments', 'id', req.params.id, res)
);

// ---------------------- PROVIDER SCHEDULES ----------------------
// app.get('/api/provider-schedules', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.ProviderSchedules');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/provider-schedules/:id', (req, res) =>
  getById('ProviderSchedules', 'id', req.params.id, res)
);


app.get('/api/timeslots/:id', (req, res) => getById('TimeSlots', 'id', req.params.id, res));

// ---------------------- MEDICAL RECORDS ----------------------
// app.get('/api/medical-records', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.MedicalRecords');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ---------------------- MEDICAL RECORD PROVIDERS ----------------------
// app.get('/api/medical-record-providers', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.MedicalRecordProviders');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// composite key (medical_record_id + provider_id)
app.get('/api/medical-record-providers/:medical_record_id/:provider_id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('mid', sql.VarChar(50), req.params.medical_record_id)
      .input('pid', sql.VarChar(50), req.params.provider_id)
      .query(
        'SELECT * FROM dbo.MedicalRecordProviders WHERE medical_record_id=@mid AND provider_id=@pid'
      );
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Mapping not found' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- FILE ATTACHMENTS ----------------------
// app.get('/api/file-attachments', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.FileAttachments');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/file-attachments/:id', (req, res) =>
  getById('FileAttachments', 'id', req.params.id, res)
);

// ---------------------- HEALTH METRICS ----------------------
// app.get('/api/health-metrics', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.HealthMetrics');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/health-metrics/:id', (req, res) =>
  getById('HealthMetrics', 'id', req.params.id, res)
);

// ---------------------- CHAT MESSAGES ----------------------
// app.get('/api/chat-messages', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.ChatMessages');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/chat-messages/:id', (req, res) =>
  getById('ChatMessages', 'id', req.params.id, res)
);

// ---------------------- NOTIFICATIONS ----------------------
// app.get('/api/notifications', async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request().query('SELECT * FROM dbo.Notifications');
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



app.get('/api/notifications/user/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.VarChar(50), userId)
      .query('SELECT * FROM dbo.Notifications WHERE user_id = @userId');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/notifications/:id', (req, res) =>
  getById('Notifications', 'id', req.params.id, res)
);




// ---------------------- USERS ----------------------
// app.post('/api/users', async (req, res) => {
//   const { email, name, role, phone, password } = req.body;

//   if (!email || !name || !role || !password) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const pool = await poolPromise;

//     // Generate random unique ID
//     const userId = uuidv4();

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await pool.request()
//       .input('id', sql.VarChar(50), userId)
//       .input('email', sql.VarChar(255), email)
//       .input('name', sql.VarChar(255), name)
//       .input('role', sql.VarChar(100), role)
//       .input('phone', sql.VarChar(20), phone)
//       .input('password', sql.VarChar(255), hashedPassword)
//       .query(`
//         INSERT INTO dbo.Users (id, email, name, role, phone, password, created_at)
//         VALUES (@id, @email, @name, @role, @phone, @password, GETUTCDATE())
//       `);

//     res.status(201).json({ message: 'User created successfully', userId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


// ---------------------- PATIENTS ----------------------


app.post('/api/users', async (req, res) => {
  const {
    email,
    name,
    role,
    phone,
    age,
    date_of_birth,
    password,
    // patient
    insurance_provider,
    insurance_policy_number,
    emergency_contact_name,
    emergency_contact_phone,
    emergency_contact_relationship,
    // provider
    specialization,
    licence,
    experience,
    address,
    education
  } = req.body;

  if (!email || !name || !role || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await poolPromise;
    const userId = uuidv4();
    const providerId = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Insert into Users
      await transaction.request()
        .input('id', sql.VarChar(50), userId)
        .input('age', sql.Int, age || null)
        .input('dob', sql.Date, date_of_birth || null)
        .input('email', sql.VarChar(255), email)
        .input('name', sql.VarChar(255), name)
        .input('role', sql.VarChar(100), role)
        .input('phone', sql.VarChar(20), phone)
        .input('password', sql.VarChar(255), hashedPassword)
        .query(`
          INSERT INTO dbo.Users (id, age, date_of_birth, email, name, role, phone, password, created_at)
          VALUES (@id, @age, @dob, @email, @name, @role, @phone, @password, GETUTCDATE())
        `);

      if (role === 'patient') {
        await transaction.request()
          .input('id', sql.VarChar(50), userId)          
          .input('insurance_provider', sql.VarChar(255), insurance_provider || null)
          .input('insurance_policy_number', sql.VarChar(255), insurance_policy_number || null)
          .input('emergency_contact_name', sql.VarChar(255), emergency_contact_name || null)
          .input('emergency_contact_phone', sql.VarChar(20), emergency_contact_phone || null)
          .input('emergency_contact_relationship', sql.VarChar(100), emergency_contact_relationship || null)
          .query(`
            INSERT INTO dbo.Patients
            (user_id, insurance_provider, insurance_policy_number, 
             emergency_contact_name, emergency_contact_phone, emergency_contact_relationship)
            VALUES (@id, @insurance_provider, @insurance_policy_number, 
             @emergency_contact_name, @emergency_contact_phone, @emergency_contact_relationship)
          `);
      }

      if (role === 'provider') {
        await transaction.request()
          .input('id', sql.VarChar(50), providerId)
          .input('user_id', sql.VarChar(50), userId)
          .input('specialization', sql.VarChar(255), specialization || null)
          .input('licence', sql.VarChar(100), licence || null)
          .input('experience', sql.Int, experience || null)
          .input('address', sql.VarChar(255), address || null)
          .input('education', sql.VarChar(255), education || null)
          .query(`
            INSERT INTO dbo.Providers
            (id, user_id, specialization, license, experience, address, education)
            VALUES (@id, @user_id, @specialization, @licence, @experience, @address, @education)
          `);
      }

      await transaction.commit();
      res.status(201).json({ message: 'User created successfully', userId, role });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query(`SELECT * FROM dbo.Users WHERE email = @email`);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // remove password before sending response
    delete user.password;

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







app.post('/api/patients', async (req, res) => {
  const { user_id, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, insurance_provider, insurance_policy_number } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('user_id', sql.VarChar(50), user_id)
      .input('emergency_contact_name', sql.VarChar(255), emergency_contact_name)
      .input('emergency_contact_phone', sql.VarChar(20), emergency_contact_phone)
      .input('emergency_contact_relationship', sql.VarChar(100), emergency_contact_relationship)
      .input('insurance_provider', sql.VarChar(255), insurance_provider)
      .input('insurance_policy_number', sql.VarChar(100), insurance_policy_number)
      .query(`
        INSERT INTO dbo.Patients (user_id, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, insurance_provider, insurance_policy_number)
        VALUES (@user_id, @emergency_contact_name, @emergency_contact_phone, @emergency_contact_relationship, @insurance_provider, @insurance_policy_number)
      `);
    res.status(201).json({ message: 'Patient created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- PROVIDERS ----------------------
app.post('/api/providers', async (req, res) => {
  const { id, user_id, specialization, license, rating, experience, address, education } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('user_id', sql.VarChar(50), user_id)
      .input('specialization', sql.VarChar(255), specialization)
      .input('license', sql.VarChar(100), license)
      .input('rating', sql.Decimal(3,2), rating)
      .input('experience', sql.Int, experience)
      .input('address', sql.VarChar(500), address)
      .input('education', sql.VarChar(255), education)
      .query(`
        INSERT INTO dbo.Providers (id, user_id, specialization, license, rating, experience, address, education)
        VALUES (@id, @user_id, @specialization, @license, @rating, @experience, @address, @education)
      `);
    res.status(201).json({ message: 'Provider created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- APPOINTMENTS ----------------------
app.post('/api/appointments', async (req, res) => {
  const { patient_id, provider_id, date, time, duration, status, type, reason, notes, booked_at, confirmed_at, cancellation_reason, rejection_reason } = req.body;
  const id = uuidv4();
  try {
    const pool = await poolPromise;
    await pool.request()
    .input('id', sql.VarChar(50), id)
      .input('patient_id', sql.VarChar(50), patient_id)
      .input('provider_id', sql.VarChar(50), provider_id)
      .input('date', sql.Date, date)
      .input('time', sql.VarChar(20), time)
      .input('duration', sql.Int, duration)
      .input('status', sql.VarChar(50), status)
      .input('type', sql.VarChar(100), type)
      .input('reason', sql.Text, reason)
      .input('notes', sql.Text, notes)
      .input('booked_at', sql.DateTime2, booked_at)
      .input('confirmed_at', sql.DateTime2, confirmed_at)
      .input('cancellation_reason', sql.Text, cancellation_reason)
      .input('rejection_reason', sql.Text, rejection_reason)
      .query(`
        INSERT INTO dbo.Appointments (id, patient_id, provider_id, date, time, duration, status, type, reason, notes, created_at, booked_at, confirmed_at, cancellation_reason, rejection_reason)
        VALUES (@id, @patient_id, @provider_id, @date, @time, @duration, @status, @type, @reason, @notes, GETUTCDATE(), @booked_at, @confirmed_at, @cancellation_reason, @rejection_reason)
      `);
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- PROVIDER SCHEDULES ----------------------
app.post('/api/provider-schedules', async (req, res) => {
  const { id, provider_id, day_of_week, start_time, end_time } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('provider_id', sql.VarChar(50), provider_id)
      .input('day_of_week', sql.Int, day_of_week)
      .input('start_time', sql.Time, start_time)
      .input('end_time', sql.Time, end_time)
      .query(`
        INSERT INTO dbo.ProviderSchedules (id, provider_id, day_of_week, start_time, end_time)
        VALUES (@id, @provider_id, @day_of_week, @start_time, @end_time)
      `);
    res.status(201).json({ message: 'Provider schedule created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- TIMESLOTS ----------------------
app.post('/api/timeslots', async (req, res) => {
  const { id, provider_id, date, time, is_booked, appointment_id, is_break } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('provider_id', sql.VarChar(50), provider_id)
      .input('date', sql.Date, date)
      .input('time', sql.Time, time)
      .input('is_booked', sql.Bit, is_booked)
      .input('appointment_id', sql.VarChar(50), appointment_id)
      .input('is_break', sql.Bit, is_break)
      .query(`
        INSERT INTO dbo.TimeSlots (id, provider_id, date, time, is_booked, appointment_id, is_break)
        VALUES (@id, @provider_id, @date, @time, @is_booked, @appointment_id, @is_break)
      `);
    res.status(201).json({ message: 'Timeslot created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// // ---------------------- MEDICAL RECORDS ----------------------



// app.post("/api/medical-records", upload.single("file"), async (req, res) => {
//   const pool = await poolPromise;
//   const transaction = pool.transaction();
//   await transaction.begin();

//   try {
//     const { patient_id, uploader_id, type, title, description, date } = req.body;

//     if (!patient_id || !uploader_id || !type || !title || !description || !date) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }


//     let fileUrl = null;
// if (req.file) {
//   try {
//     const blobName = `${patient_id}/${Date.now()}-${req.file.originalname}`;
//     const containerClient = blobServiceClient.getContainerClient("medical-records");
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.uploadData(req.file.buffer, {
//       blobHTTPHeaders: { blobContentType: req.file.mimetype },
//     });
//     fileUrl = blockBlobClient.url;
//   } catch (uploadErr) {
//     console.error("Blob upload failed:", uploadErr);
//     return res.status(500).json({ error: "File upload failed" });
//   }
// }



//     // let fileUrl = null;
//     // if (req.file) {
//     //   const blobName = `${patient_id}/${Date.now()}-${req.file.originalname}`;
//     //   const containerClient = blobServiceClient.getContainerClient("medical-records");
//     //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     //   await blockBlobClient.uploadData(req.file.buffer, {
//     //     blobHTTPHeaders: { blobContentType: req.file.mimetype },
//     //   });
//     //   fileUrl = blockBlobClient.url;
//     // }

//     const recordId = uuidv4();




//     await transaction.request()
//       .input("id", sql.VarChar(50), recordId)
//       .input("patient_id", sql.VarChar(50), patient_id)
//       .input("uploader_id", sql.VarChar(50), uploader_id)
//       .input("type", sql.VarChar(50), type)
//       .input("title", sql.VarChar(255), title)
//       .input("description", sql.Text, description)
//       .input("date", sql.Date, date)
//       .input("link", sql.VarChar(255), fileUrl || null)
//       .query(`
//         INSERT INTO dbo.MedicalRecords
//         (id, patient_id, uploader_id, type, title, description, date, link)
//         VALUES (@id, @patient_id, @uploader_id, @type, @title, @description, @date, @link)
//       `);

//     await transaction.commit();

//     res.status(201).json({
//       id: recordId,
//       patient_id,
//       uploader_id,
//       type,
//       title,
//       description,
//       date,
//       files: fileUrl ? [{
//         id: `file-${recordId}`,
//         name: req.file?.originalname,
//         url: `${fileUrl}?${process.env.AZURE_STORAGE_SAS_TOKEN}`,
//         uploadedAt: date,
//         type,
//         size: req.file?.size || 0
//       }] : []
//     });

//   } catch (err) {
//     await transaction.rollback();
//     console.error("Error saving medical record:", err);
//     res.status(500).json({ error: err.message });
//   }
// });



app.post("/api/medical-records", upload.single("file"), async (req, res) => {
  const pool = await poolPromise;
  const transaction = pool.transaction();
  await transaction.begin();

  try {
    const { patient_id, uploader_id, type, title, description, date } = req.body;

    if (!patient_id || !uploader_id || !type || !title || !description || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let filePath = '';

    // Upload to Blob Storage
    if (req.file) {
      try {
        const safeFileName = encodeURIComponent(req.file.originalname); // encode special chars
        filePath = `${patient_id}/${Date.now()}-${safeFileName}`;

        const containerClient = blobServiceClient.getContainerClient("medical-records");
        const blockBlobClient = containerClient.getBlockBlobClient(filePath);

        await blockBlobClient.uploadData(req.file.buffer, {
          blobHTTPHeaders: { blobContentType: req.file.mimetype },
        });

        const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
        // filePath = `${blockBlobClient.url}?${sasToken}`;
        filePath = `${blockBlobClient.url}`;


      } catch (uploadErr) {
        console.error("Blob upload failed:", uploadErr);
        return res.status(500).json({ error: "File upload failed" });
      }
    }

    const recordId = uuidv4();

    // Insert only the blob path into DB
    await transaction.request()
      .input("id", sql.VarChar(50), recordId)
      .input("patient_id", sql.VarChar(50), patient_id)
      .input("uploader_id", sql.VarChar(50), uploader_id)
      .input("type", sql.VarChar(50), type)
      .input("title", sql.VarChar(255), title)
      .input("description", sql.Text, description)
      .input("date", sql.Date, date)
      .input("link", sql.NVarChar(sql.MAX), filePath || null)
      .query(`
        INSERT INTO dbo.MedicalRecords
        (id, patient_id, uploader_id, type, title, description, date, link)
        VALUES (@id, @patient_id, @uploader_id, @type, @title, @description, @date, @link)
      `);

    await transaction.commit();

    // Build SAS URL for immediate response
    const containerClient = blobServiceClient.getContainerClient("medical-records");
    const fileUrl = filePath
      // ? `${containerClient.getBlockBlobClient(filePath).url}?${process.env.AZURE_STORAGE_SAS_TOKEN}`
      // : null;

    res.status(201).json({
      id: recordId,
      patient_id,
      uploader_id,
      type,
      title,
      description,
      date,
      files: fileUrl ? [{
        id: `file-${recordId}`,
        name: req.file?.originalname,
        url: fileUrl,
        uploadedAt: date,
        type,
        size: req.file?.size || 0
      }] : []
    });

  } catch (err) {
    await transaction.rollback();
    console.error("Error saving medical record:", err);
    res.status(500).json({ error: err.message });
  }
});



app.get("/api/medical-records/patients/:patientId", async (req, res) => {
  const pool = await poolPromise;
  const { patientId } = req.params;

  try {
    const result = await pool.request()
      .input("patient_id", sql.VarChar(50), patientId)
      .query("SELECT * FROM dbo.MedicalRecords WHERE patient_id = @patient_id ORDER BY date DESC");

    const records = result.recordset.map((record) => {
      let files = [];
      if (record.link) {
        // Ensure SAS token is appended
        let urlWithSAS = record.link;
        const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;        
          
          // Check if the full SAS token is already present
  // if (!urlWithSAS.includes(sasToken)) {
  //   urlWithSAS += urlWithSAS.includes('?') ? `&${sasToken}` : `?${sasToken}`;
  // }
        // Extract filename from the blob path
        const pathParts = new URL(record.link).pathname.split('/');
        const blobNameWithTimestamp = pathParts[pathParts.length - 1];
        const fileName = blobNameWithTimestamp.substring(blobNameWithTimestamp.indexOf('-') + 1);

        files.push({
          id: `file-${record.id}`,   // unique file id
          name: fileName,
          url: urlWithSAS,
          uploadedAt: record.date,   // use record date
          type: record.type,
          size: 0, // optional: can be filled if you store file size in DB
        });
      }

      return {
        id: record.id,
        patient_id: record.patient_id,
        uploader_id: record.uploader_id,
        type: record.type,
        title: record.title,
        description: record.description,
        date: record.date,
        files,
      };
    });

    res.json(records);

  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get('/api/medical-records/:id', (req, res) =>
  getById('MedicalRecords', 'id', req.params.id, res)
);


// ---------------------- MEDICAL RECORD PROVIDERS ----------------------
app.post('/api/medical-record-providers', async (req, res) => {
  const { medical_record_id, provider_id } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('medical_record_id', sql.VarChar(50), medical_record_id)
      .input('provider_id', sql.VarChar(50), provider_id)
      .query(`
        INSERT INTO dbo.MedicalRecordProviders (medical_record_id, provider_id)
        VALUES (@medical_record_id, @provider_id)
      `);
    res.status(201).json({ message: 'MedicalRecordProvider created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ---------------------- FILE ATTACHMENTS ----------------------
app.post('/api/file-attachments', async (req, res) => {
  const { id, name, type, size, url, medical_record_id } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('name', sql.VarChar(255), name)
      .input('type', sql.VarChar(50), type)
      .input('size', sql.Int, size)
      .input('url', sql.VarChar(255), url)
      .input('medical_record_id', sql.VarChar(50), medical_record_id)
      .query(`
        INSERT INTO dbo.FileAttachments (id, name, type, size, url, uploaded_at, medical_record_id)
        VALUES (@id, @name, @type, @size, @url, GETUTCDATE(), @medical_record_id)
      `);
    res.status(201).json({ message: 'File attachment created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- HEALTH METRICS ----------------------
app.post('/api/health-metrics', async (req, res) => {
  const { id, patient_id, label, value, unit, status, icon, color } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('patient_id', sql.VarChar(50), patient_id)
      .input('label', sql.VarChar(100), label)
      .input('value', sql.VarChar(100), value)
      .input('unit', sql.VarChar(50), unit)
      .input('status', sql.VarChar(50), status)
      .input('icon', sql.VarChar(50), icon)
      .input('color', sql.VarChar(50), color)
      .query(`
        INSERT INTO dbo.HealthMetrics (id, patient_id, label, value, unit, status, icon, color)
        VALUES (@id, @patient_id, @label, @value, @unit, @status, @icon, @color)
      `);
    res.status(201).json({ message: 'Health metric created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- CHAT MESSAGES ----------------------
app.post('/api/chat-messages', async (req, res) => {
  const { id, conversation_id, sender_id, receiver_id, text } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('conversation_id', sql.VarChar(50), conversation_id)
      .input('sender_id', sql.VarChar(50), sender_id)
      .input('receiver_id', sql.VarChar(50), receiver_id)
      .input('text', sql.Text, text)
      .query(`
        INSERT INTO dbo.ChatMessages (id, conversation_id, sender_id, receiver_id, text, timestamp)
        VALUES (@id, @conversation_id, @sender_id, @receiver_id, @text, GETUTCDATE())
      `);
    res.status(201).json({ message: 'Chat message created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------- NOTIFICATIONS ----------------------
// app.post('/api/notifications', async (req, res) => {
//   const { id, user_id, type, title, message, is_read, related_entity_id } = req.body;
//   try {
//     const pool = await poolPromise;
//     await pool.request()
//       .input('id', sql.VarChar(50), id)
//       .input('user_id', sql.VarChar(50), user_id)
//       .input('type', sql.VarChar(100), type)
//       .input('title', sql.VarChar(255), title)
//       .input('message', sql.Text, message)
//       .input('is_read', sql.Bit, is_read)
//       .input('related_entity_id', sql.VarChar(50), related_entity_id)
//       .query(`
//         INSERT INTO dbo.Notifications (id, user_id, type, title, message, is_read,  related_entity_id)
//         VALUES (@id, @user_id, @type, @title, @message, @is_read, @related_entity_id)
//       `);
//     res.status(201).json({ message: 'Notification created successfully from here' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });


app.post('/api/notifications', async (req, res) => {
  const { user_id, type, title, message, is_read, related_entity_id } = req.body;

  // Generate UUID v4
  const id = uuidv4();

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('user_id', sql.VarChar(50), user_id)
      .input('type', sql.VarChar(100), type)
      .input('title', sql.VarChar(255), title)
      .input('message', sql.Text, message)
      .input('is_read', sql.Bit, is_read ?? 0) // default to false if not provided
      .input('related_entity_id', sql.VarChar(50), related_entity_id)
      .query(`
        INSERT INTO dbo.Notifications (id, user_id, type, title, message, is_read, related_entity_id)
        VALUES (@id, @user_id, @type, @title, @message, @is_read, @related_entity_id)
      `);

    res.status(201).json({ message: 'Notification created successfully', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



//  ----------------------------------------------------------PUT Calls -----------------------------------------------------------------

app.put('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status, reason, notes, rejection_reason } = req.body;
  
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('status', sql.VarChar(50), status)
      .input('reason', sql.Text, reason)
      .input('notes', sql.Text, notes)
      .input('rejection_reason', sql.Text, rejection_reason)
      .query(`
        UPDATE dbo.Appointments
        SET 
          status = ISNULL(@status, status),
          reason = ISNULL(@reason, reason),
          notes = ISNULL(@notes, notes),
          rejection_reason = ISNULL(@rejection_reason,rejection_reason)
        WHERE id = @id;
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ---------------------- NOTIFICATIONS: update single ----------------------


app.put('/api/notifications/markAllRead', async (req, res) => {
  const userId = (req.user && req.user.id) || req.body.user_id;

  console.log("DEBUG: incoming userId =", JSON.stringify(userId));

  if (!userId) {
    return res.status(400).json({ message: 'user_id required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', sql.VarChar(50), userId)
      .query(`
        UPDATE dbo.Notifications
        SET is_read = 1
        WHERE user_id = @user_id AND is_read = 0;
      `);

    console.log("DEBUG: rowsAffected =", result.rowsAffected);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({
        message: `Marked ${result.rowsAffected[0]} notifications as read`
      });
    } else {
      res.status(200).json({
        message: 'No unread notifications to update.'
      });
    }

  } catch (err) {
    console.error("DEBUG: SQL error", err);
    res.status(500).json({ error: err.message });
  }
});



app.put('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;
  const { is_read, title, message } = req.body;

  // Prefer using auth middleware that sets req.user.id. Fallback to body.user_id for testing.
  const userId = (req.user && req.user.id) || req.body.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id required (use auth or pass in body for testing)' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('user_id', sql.VarChar(50), userId)
      .input('is_read', sql.Bit, is_read ?? null)   // allow partial updates
      .input('title', sql.VarChar(255), title ?? null)
      .input('message', sql.Text, message ?? null)
      .query(`
        UPDATE dbo.Notifications
        SET 
          is_read = COALESCE(@is_read, is_read),
          title   = COALESCE(@title, title),
          message = COALESCE(@message, message)
        WHERE id = @id AND user_id = @user_id;
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Notification not found or not owned by user' });
    }

    res.status(200).json({ message: 'Notification updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




// ---------------------- NOTIFICATIONS: delete single ----------------------
app.delete('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;

  // If you have auth, replace with req.user.id
  const userId = (req.user && req.user.id) || req.body.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'user_id required (use auth or pass in body for testing)' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('user_id', sql.VarChar(50), userId)
      .query(`
        DELETE FROM dbo.Notifications
        WHERE id = @id AND user_id = @user_id;
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Notification not found or not owned by user' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




app.put('/api/timeslots/reject/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('is_booked', sql.Bit, false) // always set to true
      .query(`
        UPDATE dbo.TimeSlots
        SET is_booked = @is_booked
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Timeslot marked as booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.put('/api/timeslots/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar(50), id)
      .input('is_booked', sql.Bit, true) // always set to true
      .query(`
        UPDATE dbo.TimeSlots
        SET is_booked = @is_booked
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Timeslot marked as booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});





app.use(express.static(path.join(__dirname, 'dist')));

// Start
const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
