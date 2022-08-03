const file = "example1.txt";

const readFile = (filename) => {
  const fs = require("fs");
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    var employeesList = data.replace(' ', '').split("\r\n");
    const list = buildEmployeesData(employeesList);
    countIncidences(list);
    return employeesList;
  });
}

const countIncidences = (list = []) => {
  const result = list.map((employee, index, array) => {
    for (let i = index + 1; i < array.length; i++) {
      const pair = `${employee.name}-${array[i].name}`;
      const currentDays = employee.schedule.map((value) => value.day);
      const filteredDays = array[i].schedule
        .map((d) => d.day)
        .filter((d) => currentDays.includes(d));
      let counter = 0;
      filteredDays.map((day) => {
        const currentRange = employee.schedule.find((e) => e.day === day).range;
        const comparisonRange = array[i].schedule.find(
          (e) => e.day === day
        ).range;
        if (
          currentRange[0] <= comparisonRange[1] &&
          currentRange[0] >= comparisonRange[0]
        ) {
          counter++;
          return;
        }
        if (
          currentRange[1] <= comparisonRange[1] &&
          currentRange[1] >= comparisonRange[0]
        ) {
          counter++;
          return;
        }
      });
      console.log(pair + ": " + counter);
    }
  });
};

const buildEmployeesData = (array = [""]) => {
  const data = array.map((employee) => {
    const row = employee.split("=");
    const name = row.shift();
    let schedule = row.shift();
    schedule = schedule.split(",");
    schedule = schedule.map((value) => {
      const day = value.substring(0, 2);
      let range = value
        .substring(2)
        .split("-")
        .map((value) =>
          parseFloat(parseFloat(value.replace(":", ".")).toFixed(2))
        );
      return { day, range };
    });
    return {
      name,
      schedule,
    };
  });
  return data;
};

readFile(file);
