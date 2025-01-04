let count2 = 0;
let totalExercises = 0;
let streak = 0;

function getTodayDate(currentDate) {
    if (!currentDate) currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
}

function logExercise() {
    const today = getTodayDate();
    let exerciseData = JSON.parse(localStorage.getItem('exerciseData')) || {};

    if (!exerciseData[today]) {
        exerciseData[today] = 1;
    } else {
        exerciseData[today] += 1;
    }

    localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
    updateDisplay2();
}

function updateDisplay2() {
    const today = getTodayDate();
    let exerciseData = JSON.parse(localStorage.getItem('exerciseData')) || {};

    count2 = exerciseData[today] || 0;

    streak = 0;
    let currentDate = new Date(today);
    while (exerciseData[getTodayDate(currentDate)] !== undefined) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    totalExercises = Object.values(exerciseData).reduce((acc, value) => acc + value, 0);

    console.log('Updated stats:', { count2, totalExercises, streak });
}
