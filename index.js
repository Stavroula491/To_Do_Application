import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// details to connect to the database
const db = new pg.Client({
  user: 'username',
  host: "localhost",
  database: 'database_name',
  password: 'youpassword',
  port: 5432,
});

db.connect();

let currentCatID = 1;

async function checkTasks() {
    const result = await db.query(
        "SELECT pending_tasks.id, task, category_id, name, color FROM pending_tasks JOIN category ON category.id = category_id WHERE category_id = $1;",
        [currentCatID]
    );
    let tasks = [];
    result.rows.forEach((tasky) => {
        tasks.push(tasky);
    });
    return tasks;
}

async function checkCompleted() {
    const result = await db.query(
        "SELECT completed_tasks.id, task, category_id, name, color FROM completed_tasks JOIN category ON category.id = category_id WHERE category_id = $1;",
        [currentCatID]
    );
    let completed = [];
    result.rows.forEach((compl) => {
        completed.push(compl);
    });
    return completed;
}

async function getCategories(){
    const result = await db.query("SELECT * FROM category");

    let categories = [];
    result.rows.forEach((categ) => {
        categories.push(categ)
    });

    return categories;
}

async function checkCategory() {
    const result = await db.query(
        "SELECT name FROM category WHERE id = $1;",[currentCatID]
    )
    let category = [];
    result.rows.forEach((categ) => {
        category.push(categ)
    })
    return category;
}


app.get("/", async (req, res) => {
    const data = await checkTasks();
    const data2 = await checkCompleted();
    const data3 = await getCategories();
    const data4 = await checkCategory();
    res.render("index.ejs", {data: data, data2: data2, data3: data3, data4: data4});
});

app.post("/submit", async (req, res) => {
    let task_input = req.body.task_to_do.trim();
    let category_input = currentCatID
    db.query("INSERT INTO pending_tasks (task, category_id) VALUES ($1, $2)", [task_input, category_input]);
    res.redirect("/");
});

app.post("/category", async (req,res) => {
    currentCatID = req.body.categoryID
    res.redirect("/");
});

app.post('/delete', async (req, res) => {
    const tasktoDelete = req.body.tasktoDelete
    await db.query("DELETE FROM pending_tasks WHERE id = $1", [tasktoDelete]);
    res.redirect("/");
});

app.post('/update', async (req, res) => {
    const idtoComple = req.body.tasktoComplete
    const taskToUpdate = await db.query("SELECT * FROM pending_tasks WHERE id = $1;", [idtoComple])
    const taskToUpdate_task = [];
    taskToUpdate.rows.forEach((row) => {
        taskToUpdate_task.push(row);
    });
    db.query("DELETE FROM pending_tasks WHERE id = $1;", [taskToUpdate_task[0].id])
    db.query("INSERT INTO completed_tasks (task, category_id) VALUES ($1, $2)", [taskToUpdate_task[0].task, taskToUpdate_task[0].category_id]);
    res.redirect("/");
});

app.post('/doagain', async (req, res) => {
    const idtoDoAgain = req.body.tasktoRedo
    const taskToDoAgain = await db.query("SELECT * FROM completed_tasks WHERE id = $1;", [idtoDoAgain]);
    const taskToDoAgain_task = [];
    taskToDoAgain.rows.forEach((row) => {
        taskToDoAgain_task.push(row);
    });
    db.query("DELETE FROM completed_tasks WHERE id = $1;", [taskToDoAgain_task[0].id]);
    db.query("INSERT INTO pending_tasks (task, category_id) VALUES ($1, $2)", [taskToDoAgain_task[0].task, taskToDoAgain_task[0].category_id]);
    res.redirect("/");

});

app.post('/deletecomp', async (req, res) => {
    const idtoDelete = req.body.idDeleteCompl
    db.query("DELETE FROM completed_tasks WHERE id =$1;", [idtoDelete])
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
