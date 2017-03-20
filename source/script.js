//{done: Number, extras: Number}
const SPRINT_TASKS = [
  {done: 1, extras: 0},
  {done: 2, extras: 0}
];
const SPRINT_ISSUES = [
  {done: 10, extras: 0},
  {done: 8, extras: 0}
];

const SPRINT_START_DAY = '3/15/2017'; //month/day
const SPRINT_DAYS = 10;
const INITIAL_SPRINT_TASKS = 11;
const INITIAL_SPRINT_POINTS = 28;
const EXCEPTION_DAYS = [];

/*---- Don't edit bellow -----------------------*/
let getDays = (startDay, sprintDays, exceptionDays) => {
  let days = [0];
  let exceptionDates = exceptionDays.map((date) => {
    return new Date(date).getTime();
  });

  for (let i = 1; i < sprintDays; i ++) {
    let date = new Date(startDay);
    date.setDate(date.getDate() + i);

    while (
      date.getDay() === 0
      || date.getDay() === 6
      || exceptionDates.includes(date.getTime())
    ) {
      sprintDays ++;
      i ++;
      date.setDate(date.getDate() + 1);
    }

    days.push((date.getDate()) + '/' + (date.getMonth() + 1));
  }

  return days;
}
const DAYS = getDays(SPRINT_START_DAY, SPRINT_DAYS, EXCEPTION_DAYS);

let getDoneCoords = (sprint, initial) => {
  let coords = [initial];
  let done = initial;
  let extras = 0;

  for (let i = 0; i < sprint.length; i ++) {
    done -= sprint[i].done;
    extras += sprint[i].extras;
    coords.push(done + extras);
  }

  return coords;
}

let getExtrasCoords = (sprint) => {
  let coords = [0];
  let extras = 0;

  for (let i = 0; i < sprint.length; i ++) {
    extras += sprint[i].extras;
    coords.push(extras);
  }

  return coords;
}

let getIdealLineCoords = (total, days) => {
  let totalDays = days.length;
  let totalPerDay = total / (totalDays - 1);
  let idealLineCoords = [];

  for (let i = 0; i < totalDays; i ++) {
    idealLineCoords.push(total - totalPerDay * i);
  }

  return idealLineCoords;
}

let generateChart = (id, chartData) => {
  return new Chart(
    document.getElementById(id),
    {
      type: 'line',
      data: chartData
    }
  );
}

let getDataConfig = (dataLabel, chartLineColor, chartLineData) => {
  return {
    label: dataLabel,
    fill: false,
    lineTension: 0.1,
    backgroundColor: "#fff",
    borderColor: chartLineColor,
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: "rgba(0,0,0,.5)",
    pointBackgroundColor: "#000",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: chartLineColor,
    pointHoverBorderColor: chartLineColor,
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: chartLineData,
    spanGaps: false
  }
}

let round = (number, limit) => {
  return +(Math.round(number + "e+" + limit)  + "e-" + limit);
}

let getAveragePerDay = (doneCoords, days) => {
  let remaining = doneCoords[doneCoords.length - 1];
  let remainingDays = days.length - doneCoords.length;

  return round(remaining / remainingDays, 2);
}

const LINES_TASKS = [
  getDataConfig("Ideal", "rgba(0, 0, 0,.5)", getIdealLineCoords(INITIAL_SPRINT_TASKS, DAYS)),
  getDataConfig("Tasks", "rgba(0,121,191,1)", getDoneCoords(SPRINT_TASKS, INITIAL_SPRINT_TASKS)),
  getDataConfig("Extras", "rgba(255,171,74,.5)", getExtrasCoords(SPRINT_TASKS)),
  getDataConfig("Average per day: " + getAveragePerDay(getDoneCoords(SPRINT_TASKS, INITIAL_SPRINT_TASKS), DAYS), "#000", [0])
];
const LINES_ISSUES = [
  getDataConfig("Ideal", "rgba(0, 0, 0,.5)", getIdealLineCoords(INITIAL_SPRINT_POINTS, DAYS)),
  getDataConfig("Issues", "rgba(0,121,191,1)", getDoneCoords(SPRINT_ISSUES, INITIAL_SPRINT_POINTS)),
  getDataConfig("Extras", "rgba(255,171,74,.5)", getExtrasCoords(SPRINT_ISSUES)),
  getDataConfig("Average per day: " + getAveragePerDay(getDoneCoords(SPRINT_ISSUES, INITIAL_SPRINT_POINTS), DAYS), "#000", [0])
];

let dataTasks = {
  labels: DAYS,
  datasets: LINES_TASKS
};
let dataIssues = {
  labels: DAYS,
  datasets: LINES_ISSUES
};

generateChart("myTasksChart", dataTasks);
generateChart("myIssuesChart", dataIssues);