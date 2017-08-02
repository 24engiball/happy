const fs = require('fs');
var exec = require('child_process').exec;
var pathName = __dirname;
var dirAsset = pathName + '/../../../epy/';
var hFilepath = dirAsset + "height.txt";
var hpyPath = dirAsset + "hpy.py";
var wFilepath = dirAsset + "weight.txt";
var wpyPath = dirAsset + "wpy.py";
var pFilepath = dirAsset + "pressure.txt";
var ppyPath = dirAsset + "ppy.py";

var pHeight = 0;
var pWeight = 0;
function execute(command, callback) {
    exec(command, function (error, stdout, stderr) { callback(stdout); });
};
module.exports = {

    callCheck: () => {
        pyHeight();
        pyWeight()
        pyPressure()
    },

    onCardRemove: () => {
        $(".heightDiv").html("");
        $("div.weightDiv").html("");
        $(".pressureDiv").html("");
        $(".bmiResultDiv").html("");
        $("#cid").html("")
        $('#fullname').html("");
     //   $("#progressbar li").removeClass("active");
        $( ".previous" ).trigger( "click" );
        $( ".previous" ).trigger( "click" );
        $( ".previous" ).trigger( "click" );
        $( ".previous" ).trigger( "click" );

    }


}


function readHeight() {
    fs.readFile(hFilepath, 'utf-8', (err, data) => {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
        $(".heightDiv").html("ส่วนสูงของคุณคือ " + data + " เซนติเมตร");
        pHeight = data;
        callBmi(pHeight, pWeight);
    });
}


function pyHeight() {

    // call the function
    execute('python ' + hpyPath, function (output) {
        readHeight();
    });
}


function readWeight() {
    fs.readFile(wFilepath, 'utf-8', (err, data) => {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
        $("div.weightDiv").html("นํ้าหนักของคุณคือ " + data + " กก");
        pWeight = data;
        callBmi(pHeight, pWeight);
    });
}


function pyWeight() {

    // call the function
    execute('python ' + wpyPath, function (output) {
        console.log('python ' + wpyPath);
        readWeight();
    });
}



function readPressure() {
    fs.readFile(pFilepath, 'utf-8', (err, data) => {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
        $(".pressureDiv").html("ค่าความดันของคุณคือ " + data + "");
    });
}


function pyPressure() {
    // call the function
    execute('python ' + ppyPath, function (output) {
        readPressure();
    });
}


function callBmi(pHeight, pWeight) {
    console.log(pHeight + " " + pWeight);
    var bmi = 0;
    if (pHeight != 0 && pWeight != 0) {
        bmi = pWeight / ((pHeight * pHeight) / 10000)

        $(".bmiResultDiv").html("ค่า BMI ของคุณคือ " + bmi.toFixed(2) + "");
    }


}