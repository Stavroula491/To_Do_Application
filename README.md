# To_Do_Application

Steps:
1. Clone the repo.
2. Install dependencies.
3. Set up a PostgreSQL database:
   -Create a datadase (e.g., to_do)
   -Create the required tables:
   '''sql

  CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );

  INSERT INTO category(name) VALUES (your_category_name);

   CREATE TABLE pending_tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR(250),
    category_id INTEGER REFERENCES category(id)
  );

   CREATE TABLE completed_tasks (
    id SERIAL PRIMARY KEY,
    task VARCHAR(250),
    category_id INTEGER REFERENCES category(id)
  );
   '''
4. In the index.js replace the following with your details
  const db = new pg.Client({
  user: username,
  host: "localhost",
  database: databse_name,
  password: yourpassword,
  port: 5432,
  });

5. Run the application.
