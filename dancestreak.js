// Global variables to store exercise stats
let count3 = 0;
let totalDances = 0;
let streak2 = 0;

// Function to get today's date as a string (YYYY-MM-DD format)
function getTodayDate(currentDate) {
    if (!currentDate) currentDate = new Date(); // Default to current date if no argument is passed
    return currentDate.toISOString().split('T')[0];
}

// Function to log an exercise
function logDance() {
    const today = getTodayDate();
    let danceData = JSON.parse(localStorage.getItem('danceData')) || {};

    // Update the exercise count for today
    if (!danceData[today]) {
        danceData[today] = 1;
    } else {
        danceData[today] += 1;
    }

    localStorage.setItem('danceData', JSON.stringify(danceData));
    updateDisplay4(); // Update stats globally
}

// Function to update and store exercise stats globally
function updateDisplay4() {
    const today = getTodayDate();
    let danceData = JSON.parse(localStorage.getItem('danceData')) || {};

    // Update today's exercise count
    count3 = danceData[today] || 0;

    // Calculate the exercise streak
    streak2 = 0;
    let currentDate = new Date(today);
    while (danceData[getTodayDate(currentDate)] !== undefined) {
        streak2++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate the total number of exercises
    totalDances = Object.values(danceData).reduce((acc, value) => acc + value, 0);

    console.log('Updated stats:', { count3, totalDances, streak2 }); // Log updated values
}
