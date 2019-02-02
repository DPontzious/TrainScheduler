var config = {
    apiKey: "AIzaSyAVcCQSvEe_0jEcorSc1f-a_FMUhfKpB8c",
    authDomain: "trainhw-2e232.firebaseapp.com",
    databaseURL: "https://trainhw-2e232.firebaseio.com",
    projectId: "trainhw-2e232",
    storageBucket: "trainhw-2e232.appspot.com",
    messagingSenderId: "867741478808"
};

firebase.initializeApp(config);
var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainStart = $("#first-train-input").val().trim();
    var trainStartConv = moment(trainStart, "HH:mm");
    var trainFreq = parseInt($("#frequency-input").val().trim());
    if (!trainStartConv._isValid) {
        alert('First Train Time must be in the format HH:mm');
    }
    // console.log('wtf', trainFreq, typeof trainFreq);
    if (trainFreq !== trainFreq) {
        // console.log('TRAIN FREAK IS NOT A NUMBER');
        alert('Frequency must be a number');
    }
    var currentTime = moment().format("hh:mm");
    // console.log("momemt", currentTime);
    // current time minus the start time in minutes
    var differenceInTime = moment().diff(moment(trainStartConv), "minutes");
    // console.log("mins from start", differenceInTime);
    var remainder = differenceInTime % trainFreq;
    // console.log("remainder", remainder)
    var nextTrainMins = trainFreq - remainder;
    console.log("next train mins", nextTrainMins)
    var nextArrivalTime = moment().add(nextTrainMins, "minutes").format("hh:mm");
    // console.log("time diff", minsAway);
    var newTrain = {
        name: trainName,
        destination: trainDest,
        start: trainStart,
        frequency: trainFreq,
        next: nextArrivalTime,
        minutesAway: nextTrainMins,
    };
    database.ref().push(newTrain);
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainStartConv = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().frequency;
    var nextArrivalTime = childSnapshot.val().next;
    var nextTrainMins = childSnapshot.val().minutesAway;
    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArrivalTime),
        $("<td>").text(nextTrainMins)
    );
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});
