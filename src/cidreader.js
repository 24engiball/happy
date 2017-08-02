const smartcard = require('smartcard');
const Devices = smartcard.Devices;
const devices = new Devices();
const CommandApdu = smartcard.CommandApdu;
const pcsc1 = require('pcsclite');
const pcsc = pcsc1();
const legacy = require('legacy-encoding');
const md5 = require('md5');
let cmdIndex = 0;
let inGetImage = false;

let imgTemp = '';
const fs = require('fs');

var image = "";
var fullname_th = "";
var fullname_en = "";
var address_full = "";
var birthday_full = "";
var cid = "";

var pathName = __dirname;
var dirAsset = pathName + '/assets';
const opn = require('opn');
var readfile = require("./readfile.js");
var canReload =false;

//image encode base 64
var encodeData = [];
 
 
var dir = dirAsset + '/tmp'; //'./src/assets/tmp';



function showCid(cid) {
    var str = cid; // 1-1005-01040-23-1
    var out = "";
    var res = str.split("");

    for (var i = 0; i <= res.length - 1; i++) {
        if (i == 0) {
            out += res[0] + "-";
        } else if (i == 4) {
            out += res[i] + "-";
        } else if (i == 9) {
            out += res[i] + "-";
        } else if (i == 11) {
            out += res[i] + "-";
        }
        else {

            out += res[i];

        }
    }
    
    $("#cid").html(out);
  readfile.callCheck();
}
function showImage(mImgName = "") {
    //alert('OK');
    //todo : src

    //var imgnames = dir+'/out.jpg?timestamp=' + new Date().getTime();

    $('#showImage').html("<img id='pImg' src='" + mImgName + "' class='img-fluid d-block w-100' style='width:130px;height:200px;'>");
    console.log(mImgName);

}
function EngName(name) {
    var en_name = name.substr(100, 100);
    console.log(en_name);
}
function showFullname(fullname = "") {
    var name = fullname.split(" ");

    var output = "";
    output = name[0].replace("#", " ");
    output = output;
    output = output.replace("##", " ");

    fullname_th = output;//เก็บค่า fullname th

    var en_name = fullname.substr(100, 100);
    en_name = en_name.replace("#", "");
    en_name = en_name;
    en_name = en_name.replace("##", " ");

    fullname_en = en_name; // เก็บค่า fullname en
    $('#fullname').html(fullname_th);

    showBirthday(fullname);
}
function showBirthday(birthday = '') {

    var str = birthday;//"นาย#ณัฐพล##จันทร์ปาน Mr.#Natthaphon##Chanpan 253608071�";
    var res = str.length;
    var out = str.substr(res - 11, 9);

    var year = out.substr(0, 4);
    var month = out.substr(4, 2);
    var day = out.substr(6, 2);

    var birth = day + "/" + month + "/" + year;

    birthday_full = birth;//เก็บค่า birthday
    $("#birthday").html(birthday_full);
}
function showAddress(address = "") {
    address = address.replace("#", " ");
    address = address;
    address = address.replace("####", " ");
    address = address;
    address = address.replace("#", " ");
    address = address;
    address = address.replace("#", " ");
    address = address.substr(0, address.length - 2);

    address_full = address;//เก็บค่า address
    $("#address").html(address_full);

 
}



let haveCard = false;


devices.on('device-activated', event => {
    const currentDevices = event.devices;
    let device = event.device;
    console.log(`Device '${device}' activated, devices: ${currentDevices}`);
    for (let prop in currentDevices) {
        console.log("Devices: " + currentDevices[prop]);
    }

    device.on('card-inserted', event => {
        canReload=true;
        readfile.canReload=true;
        haveCard = true;
        mImgTemp = '';
        imgTemp = '';
        cmdIndex = 0;
        let card = event.card;
        //console.log(`Card '${card.getAtr()}' inserted into '${event.device}'`);

        card.on('command-issued', event => {
            console.log(`Command '${event.command}' issued to '${event.card}' `);
        });

        card.on('response-received', event => {

            showCid(cid);
            if (inGetImage) {
                //    console.log('read image ' +imgTemp);

                // readImageOneLine(card);
            } else {

                //console.log('no read image ' +imgTemp);
            }
            // console.log(`Response '${event.response}' received from '${event.card}' in response to '${event.command}'`);
        });


        card
            .issueCommand(new CommandApdu(new CommandApdu({ bytes: [0x00, 0xA4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x00, 0x54, 0x48, 0x00, 0x01] })))
            .then((response) => {
                console.log(response);
                readData(card);

            }).catch((error) => {
                console.error(error);
            });


    });
    device.on('card-removed', event => {
      if(canReload)  readfile.onCardRemove();
        console.log(`Card removed from '${event.name}' `);
        //   tempImg = dir+'/blankimg.png';

        showImage(tempImg);
        $("#tab1").trigger("click");

        ptlink = '';
        fullname_th = '';
        address_full = '';
        birthday_full = '';
        cid = '';
        $('#fullname').html('');
        $("#address").html('');
        $("#birthday").html('');
        $("#cid").html('');



    });

});



devices.on('device-deactivated', event => {
    console.log(`Device '${event.device}' deactivated, devices: [${event.devices}]`);
});


let mImgTemp = '';
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
let ptlink = '';
function readData(card) {

    card
        .issueCommand((new CommandApdu({ bytes: [0x80, 0xb0, 0x00, 0x04, 0x02, 0x00, 0x0d] })))
        .then((response) => {
            console.log(`readCid '${response.toString('hex')}`);

            card
                .issueCommand((new CommandApdu({ bytes: [0x00, 0xc0, 0x00, 0x00, 0x0d] })))
                .then((response) => {

                    response = response.slice(0, -2);

                    cid = response.toString(); //cid
                    if (cid == '') {
                        readData(card)
                    } else {
                        showCid(cid);
                        console.log(`Response readCid ${cid} : ${response}`);
                        ptlink = md5(cid);

                        console.log(`Response ptlink ${ptlink}`);

                        readFullname(card);
                    }
                    // cid = cidRes;

                    //  readFullname(card);
                }).catch((error) => {
                    console.error(error);
                });


        }).catch((error) => {
            console.error(error);
        });

}

function readFullname(card) {


    card
        .issueCommand((new CommandApdu({ bytes: [0x80, 0xb0, 0x00, 0x11, 0x02, 0x00, 0xd1] })))
        .then((response) => {

            card
                .issueCommand((new CommandApdu({ bytes: [0x00, 0xc0, 0x00, 0x00, 0xd1] })))
                .then((response) => {
                    //   var x=  iconv.convert(response); // returns "a va"
                    var buffer = legacy.decode(response, "tis620");
                    console.log(`Response readFullname '${buffer}`)
                    $('#fullname').html(buffer);
                    mFullName = buffer.toString();
                    //showFullname(mFullName);
                    showFullname(mFullName);
               //     readAddress(card);

                }).catch((error) => {
                    console.error(error);
                });


        }).catch((error) => {
            console.error(error);
        });

}

var mFullName = '';

function readAddress(card) {

    card
        .issueCommand((new CommandApdu({ bytes: [0x80, 0xb0, 0x15, 0x79, 0x02, 0x00, 0x64] })))
        .then((response) => {

            card
                .issueCommand((new CommandApdu({ bytes: [0x00, 0xc0, 0x00, 0x00, 0x64] })))
                .then((response) => {
                    var buffer = legacy.decode(response, "tis620");
                    if (buffer == '') {
                        readAddress(card)
                    } else {

                        showAddress(buffer);
                        readImageOneLine(card);


                    }

                }).catch((error) => {
                    console.error(error);
                });


        }).catch((error) => {
            console.error(error);
        });

}

let checkMod = 0;
function readImageOneLine(card) {
    let ccc = 252;
    let xwd;
    let xof = (cmdIndex) * ccc + 379;
    if (cmdIndex == 20)
        xwd = 38;
    else
        xwd = ccc;
    // console.log('tttt ' + xof);

    let sp2 = (xof >> 8) & 0xff;

    // console.log('tttt2 ' + (xof >> 8));

    let sp3 = xof & 0xff;
    let sp6 = xwd & 0xff;
    let spx = xwd & 0xff;
    let CMD1 = [0x80, 0xb0, sp2, sp3, 0x02, 0x00, sp6];
    let CMD2 = [0x00, 0xc0, 0x00, 0x00, sp6];

    card
        .issueCommand((new CommandApdu({ bytes: CMD1 })))
        .then((response) => {
            //console.log(`Response image2 '${response.toString('hex')}`)
            card
                .issueCommand((new CommandApdu({ bytes: CMD2 })))
                .then((response) => {

                    imgTemp = imgTemp + response.toString('base64').replace('kAA=', '');//.slice(0,-2).toString('base64');
                    checkMod++;
                    //  }

                    if (cmdIndex < 20) {
                        if (cmdIndex == 0) {
                            if (!fs.existsSync(dirAsset)) {
                                fs.mkdirSync(dirAsset);
                            }
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }


                        }
                        if (cmdIndex > 2) {
                            var tImg = 'data:image/jpeg;base64,' + imgTemp;
                            $('#pImg').attr('src', tImg);
                        }



                        ++cmdIndex;
                        inGetImage = true;
                        readImageOneLine(card);
                    } else {
                        let mImgTemp = imgTemp;

                        inGetImage = false;
                        // var stream = fs.createWriteStream("my_file.txt", { mode: 0o755 });
                        // stream.once('open', function (fd) {
                        //     stream.write(mImgTemp);
                        //     stream.end();
                        // });
                        var imgname = dir + '/out.jpg';
                        fs.writeFile(imgname, mImgTemp, 'base64', { mode: 777 }, function (err) {


                            imgname = imgname + '?timestamp=' + new Date().getTime();
                            showImage(imgname);

                        });


                    }

                }).catch((error) => {
                    console.error(error);
                });


        }).catch((error) => {
            console.error(error);
        });

}

var tempImg = dir + '/blankimg.png';
//showImage(tempImg);
