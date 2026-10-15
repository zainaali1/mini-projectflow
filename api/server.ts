import express from "express";

import sql from 'mssql';

const pool = new sql.ConnectionPool({
  server: process.env.SQL_SERVER!,
  database: process.env.SQL_DATABASE!,
  options: { encrypt: true },
  authentication: { type: 'azure-active-directory-default', options: {} },
} as sql.config);

const poolReady = pool.connect();   // start connecting once, when the API starts


//create api
const app = express();
app.use(express.json());

// app.get("/hello", (req, res) => {
//   res.json([{ "message": "Hello from Zaina's API" }]);
// });





app.get("/people", async(req, res) => {
  try {
    // 1. Wait until the database connection is ready
    await poolReady;

    // 2. Run your SQL and save the answer in a variable called result
    const result = await pool.request().query("SELECT * FROM People");

    // 3. Send the rows back to the browser as JSON
    res.json(result.recordset);
  }catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




//post request to add a new person
app.post("/people", async (req, res) => {
  try {
    // 1. Wait until the database connection is ready
    await poolReady;

    // 2. Get the new person's data from the request body
    const { firstName, lastName, email, jobRole } = req.body;

    if (!firstName || !lastName || !email || !jobRole) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 3. Insert the new person into the database
    const result = await pool.request()
      .input("FirstName", sql.NVarChar(100), firstName)
      .input("LastName", sql.NVarChar(100), lastName)
      .input("Email", sql.NVarChar(255), email)
      .input("JobRole", sql.NVarChar(100), jobRole)
      .query("INSERT INTO People (FirstName, LastName, Email, JobRole) VALUES (@FirstName, @LastName, @Email, @JobRole)");

    // 4. Send a success response
    res.status(201).json({ message: "Person added successfully" });
  } catch (error) {
    const sqlError = error as {number?: number; message?: string}; // Type assertion for better error handling
    if (sqlError.number === 2627) { // Unique constraint violation
      return res.status(409).json({ error: "A person with this email already exists." });
    }
    console.error("Error adding person:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});