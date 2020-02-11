var config = {
    apiKey: "AIzaSyBA41TDeDRPvC3Ux_NzNhL7LlKPj5rDqU0",
    authDomain: "train-scheduler-604ab.firebaseapp.com",
    databaseURL: "https://train-scheduler-604ab.firebaseio.com",
    projectId: "train-scheduler-604ab",
    storageBucket: "train-scheduler-604ab.appspot.com",
    messagingSenderId: "1020243769071",
    appId: "1:1020243769071:web:dc4a2194dd643a6d55cd1a"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    var trainName = $("#train-name-input")
        .val()
        .trim();
    var destination = $("#destination-input")
        .val()
        .trim();
    var firstTrainTime = moment(
        $("#first-train-time-input")
            .val()
            .trim(),
        "HH:mm"
    ).format("X");
    var frequency = $("#frequency-input")
        .val()
        .trim();

    var newTrain = {
        name: trainName,
        destination: destination,
        time: firstTrainTime,
        frequency: frequency
    };

    database.ref().push(newTrain);

    $('#myModal').modal("show");

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    var firstTimeConverted = moment(firstTrainTime, "X").subtract(1, "years");

    var currentTime = moment();

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var tRemainder = diffTime % frequency;

    var minutesAway = frequency - tRemainder;

    var addedMinutes = moment().add(minutesAway, "minutes");

    var nextArrival = moment(addedMinutes).format("LT");

    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),
    )
        .addClass("table-danger");

    $("#train-table > tbody").append(newRow);
});