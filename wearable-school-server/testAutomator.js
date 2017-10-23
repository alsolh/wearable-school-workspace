var Excel = require('exceljs');
const { execSync } = require('child_process');


var workbook = new Excel.Workbook();
workbook.xlsx.readFile('/home/alsolh/code/wearable-school-workspace/wearable-school-server/EpisodePlan-SingleWatch.xlsx')
    .then(function() {
        var worksheet = workbook.getWorksheet('Sheet1');
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
            if(rowNumber > 1){
            console.log("Row " + rowNumber + " = " + JSON.stringify(row.values[2]) + ','+ JSON.stringify(row.values[4]) + ','  + JSON.stringify(row.values[6]) + ',' + JSON.stringify(row.values[8]));
            require('child_process').execSync('/usr/bin/node /home/alsolh/code/wearable-school-workspace/wearable-school-server/server.js --episodeId ' + row.values[2]+ ' --mode ' + JSON.stringify(row.values[4]) + ' --frequency ' + JSON.stringify(row.values[6]) + ' --profile ' + JSON.stringify(row.values[8]), {stdio:[0,1,2]});
            }
        });
    });

