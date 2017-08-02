const fs = require('fs');
var exec = require('child_process').exec;
var pathName = __dirname;
var dirAsset = pathName + '/../../../epy/';
var hFilepath = dirAsset+"height.txt";
var hpyPath = dirAsset+"hpy.py";
var wFilepath = dirAsset+"weight.txt";
var wpyPath = dirAsset+"wpy.py";
var pFilepath = dirAsset+"pressure.txt";
var ppyPath = dirAsset+"ppy.py";


function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};
pyHeight();
pyWeight()
pyPressure()

  function readHeight(){
   fs.readFile(hFilepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
    });
  }


function pyHeight(){

// call the function
execute('python ' + hpyPath, function(output) {
    readHeight();
});
}


  function readWeight(){
   fs.readFile(wFilepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
    });
  }


function pyWeight(){

// call the function
execute('python ' + wpyPath, function(output) {
    console.log('python ' + wpyPath);
    readWeight();
});
}



  function readPressure(){
   fs.readFile(pFilepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
    });
  }


function pyPressure(){

// call the function
execute('python ' + ppyPath, function(output) {
    readPressure();
});
}

