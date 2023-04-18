const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDataBaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDataBaseAndServer();

//API-1
//Scenario-1
app.get("/todos/", async (request, response) => {
  const { status, priority, search_q } = request.query;
  let getTodoQuery = null;
  let getTodo = null;
  switch (true) {
    case status !== undefined:
      getTodoQuery = `
    SELECT * FROM todo WHERE status LIKE 
     '${status}%'`;
      getTodo = await db.all(getTodoQuery);
      response.send(getTodo);
      break;
    case priority !== undefined:
      getTodoQuery = `
    SELECT * FROM todo WHERE priority = '${priority}'`;
      getTodo = await db.all(getTodoQuery);
      response.send(getTodo);
      break;
    case priority !== undefined && status !== undefined:
      getTodoQuery = `
    SELECT * FROM todo WHERE priority = '${priority} AND status = ${IN}%'`;
      getTodo = await db.all(getTodoQuery);
      response.send(getTodo);
      break;
    case search_q !== undefined:
      getTodoQuery = `
    SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;
      getTodo = await db.all(getTodoQuery);
      response.send(getTodo);
      break;
  }
});

//API-2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT * FROM todo WHERE id = '${todoId}'`;
  const getTodo = await db.get(getTodoQuery);
  response.send(getTodo);
});

//API-3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addTodoQuery = `
  INSERT INTO todo(id, todo, priority, status) 
  VALUES('${id}', '${todo}', '${priority}', '${status}')`;
  await db.run(addTodoQuery);
  response.send("Todo Successfully Added");
});

//API-4
//Scenario-1
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo, status, priority } = request.body;
  let updateTodoQuery = null;
  switch (true) {
    case todo !== undefined:
      updateTodoQuery = `UPDATE todo 
      SET status = '${todo}' WHERE id = '${todoId}'`;
      await db.run(updateTodoQuery);
      response.send("Todo Updated");
      break;
    case status !== undefined:
      updateTodoQuery = `UPDATE todo 
      SET status = '${status}' WHERE id = '${todoId}'`;
      await db.run(updateTodoQuery);
      response.send("Status Updated");
      break;
    case priority !== undefined:
      updateTodoQuery = `UPDATE todo 
      SET status = '${priority}' WHERE id = '${todoId}'`;
      await db.run(updateTodoQuery);
      response.send("Priority Updated");
      break;
  }
});

//API-5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM todo WHERE id = '${todoId}'`;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});
module.exports = app;
