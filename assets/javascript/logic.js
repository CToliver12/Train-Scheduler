/* Global moment Firebase */

//Initialize Firebase
var config = {
    apiKey: "AIzaSyD3fsEqYjicYEvxsb3AMS44QhdFC47bHBs",
    authDomain: "train-scheduler-b5573.firebaseapp.com",
    databaseURL: "https://train-scheduler-b5573.firebaseio.com",
    projectId: "train-scheduler-b5573",
    storageBucket: "train-scheduler-b5573.appspot.com",
    messagingSenderId: "489305603297"
};
  
firebase.initializeApp(config);

//Create a variable to reference the database 
var database = firebase.database();

//Variables.
//--------
//Initial Train Schedule Values. 

var name= ""; 
var destination = ""; 
var frequency = 0; 
var firstTrain = ""; 
var minutesAway = 0; 
var schedule = []; 
var firstTrainTotalMin = 0; 
var trainTime = 0; 
var currentTimeTotalMin = 0; 
var nextArrivalInMin = 0;
var nextArrival = ""; 

//Button for adding Trains 
$("#addTrainBtn").on("click", function(){

//Don't refresh the page 
event.preventDefault(); 

//Grabs user input and assign to variables 
var trainName = $("#trainNameInput").val().trim(); 
var trainTimeInput= $("#trainTimeInput").val().trim();
var destination = $("#destinationInput").val().trim();
var frequencyInput = $("#frequencyInput").val().trim();

//Convert current time to minutes. 
convertCurrentTimeToMinutes(); 

//Convert first train time to minutes. 
convertCurrentTrainToMinutes (trainTimeInput);

//if frequency is less than a day.
if (frequency < 1440){

	//Create train schedule using first train time and frequency.
	createTrainSchedule(firstTrainTotalMin, frequency); 

	//Determine next train using current time and schedule
	determineNextTrain(currentTimeTotalMin, schedule);

	//Determine minutes till next arrival.
	determineMinutesAway (nextArrivalInMin, currentTimeTotalMin);  

	// else if the frequency is greater than a day...
}else{ 

	//Simply set the next arrival time using first train time 
	//and using the reminder of the frequency divided by a day 
	nextArrivalInMin = firstTrainTotalMin + (frequency%1440);

	//Determine the next train based on current time and next arrival 
	determineNextTrain (currentTimeTotalMin, nextArrivalInMin); 

	//Determine minutes away using first train total in minuetes and frequency
	minutesAway = parseFloat(firstTrainTotalMin) + parseFloat(frequency);
}

	//Convert next train to hours and minutes for display
	convertNextTrainToHoursMin(nextArrivalInMin);

	//clear text-boxes 
	$("#trainNameInput").val("");
	$("#trainTimeInput").val("");
	$("#destinationInput").val("");
	$("#frequencyInput").val("");


//Push data to database. 
database.ref().push({
	trainName: trainName,
	trainTimeInput: trainTimeInput,
	destination: destination, 
	frequencyInput: frequencyInput, 

});
}); 

//When changes occurs it will print them to console and html 
database.ref().on("value", function(snapshot) {

	//Print the initial data to the console. 
	console.log(snapshot.val()); 

	//Log the value of various properties 
	console.log(snapshot.val().trainName);
	console.log(snapshot.val().lineName); 
	console.log(snapshot.val().destination);
	console.log(snapshot.val().trainTimeInput); 
	console.log(snapshot.val().frequencyInput); 
})





