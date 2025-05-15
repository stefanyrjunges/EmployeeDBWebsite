//Importing express framework to build the server
const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

//Starting the server
app.listen(PORT, () => {
  console.log(`Server listening... http://localhost:${PORT}`);
});

//Creating empty array
let employees = [];

//Middleware
//Parsing data from form
app.use(bodyParser.urlencoded({extended: true}));
//Setting EJS as view engine
app.set("view engine", "ejs");
  
//Home/guidelines page
app.get("/", (req, res) => {
  res.render("guidelines", {activeTab: "guidelines"});
});

//Index page to manage employees
app.get("/index", (req, res) => {
  res.render("index", {employees, activeTab: "manage"});
});

//Add new employee page
app.get("/add", (req, res) => {
  res.render("add", {activeTab: "add"});
});

//Adding new employee
app.post("/add", (req, res) => {
  //Getting uset input from form
  const {fName, lName, role, salary} = req.body;

  //Form validation
  if (!fName || !lName || !role || !salary) {
    return res.status(400).send("Please fill in all the forms.");
  }

  //Setting a unique ID for the new employee added or starting with 1 if there's no one
  const id = employees.length ? employees[employees.length - 1].id + 1 : 1;
  
  //Adding new employee
  employees.push({id, fName, lName, role, salary: parseInt(salary)});

  //Sending success message
  console.log("Employee added succesfully", employees);

  //Redirecting to index page
  res.redirect("/index");
});

//Updating information of employee
app.get("/updateInfo/:id", (req, res) => {

  //Finding employee's ID
  const employee = employees.find((employee) => employee.id === parseInt(req.params.id));
  
  //If employee was found, send user to update page
  if (employee) {
    res.render("update", {employee, activeTab: "index"});
    //If employee was not found, send error message
  } else {
    res.status(404).send("Employee not found");
  }
});

app.post("/update", (req, res) => {
    //Getting user input from the form
    const {id, fName, lName, role, salary} = req.body;
    
    //Finding index corresponding to the employee
    const employeeIndex = employees.findIndex((employee) => employee.id === parseInt(id));

    //If employee exists, update information
    if (employeeIndex !== -1) {
      employees[employeeIndex] = {id: parseInt(id), fName, lName, role, salary: parseInt(salary)};

      //Redirecting to index page
      res.redirect("/index");

      //If employee doesn't exist, send error message
    } else {
      res.status(404).send("Employee not found");
    }
  });
  

//Deleting employee
app.post("/delete", (req, res) => {
  //Getting employee ID
  const { id } = req.body;

  //Finding employee to delete
  employees = employees.filter((employee) => employee.id !== parseInt(id));

  //Redirecting to index page
  res.redirect("/index");
});

//Chart page for data visualisation
app.get("/chart", (req, res) => {
  res.render("chart", { activeTab: "chart" });
});

//Getting data that will be displayed on the chart
app.get("/refresh/chart-data", (req, res) => {
  const employeeNames = employees.map((employee) => `${employee.fName} ${employee.lName}`);
  const employeeSalaries = employees.map((employee) => employee.salary);
  const employeeIDs = employees.map((employee) => employee.id);

  res.json({employeeNames, employeeSalaries, employeeIDs});
});