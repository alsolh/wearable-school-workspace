var Excel = require('exceljs');
var startFrom = 48;
var targetWatch = 'all';
var isMac = /^darwin/.test(process.platform);
const { execSync } = require('child_process');
try{
execSync('killall tshark');
}
catch (err){
    console.log(err.message)
}

var workbook = new Excel.Workbook();
workbook.xlsx.readFile('/Users/student/IdeaProjects/wearable-school-workspace/wearable-school-server/EpisodePlan-AllCases.xlsx')
    .then(function() {
        var worksheet = workbook.getWorksheet('Sheet1');
        worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
            if(rowNumber > startFrom){
            console.log("Row " + rowNumber + " = " + JSON.stringify(row.values[2]) + ','+ JSON.stringify(row.values[4]) + ','  + JSON.stringify(row.values[6]) + ',' + JSON.stringify(row.values[8]));
            require('child_process').execSync('node /Users/student/IdeaProjects/wearable-school-workspace/wearable-school-server/server.js --episodeId ' + row.values[2]+ ' --mode ' + JSON.stringify(row.values[4]) + ' --frequency ' + JSON.stringify(row.values[6]) + ' --profile ' + JSON.stringify(row.values[8])  + ' --targetWatch ' + targetWatch, {stdio:[0,1,2]});
            execSync('killall tshark');
            if(isMac){
                var stdout = execSync('sudo pfctl -f /etc/pf.conf');
                var stdout = execSync('sudo pfctl -d');
                var stdout = execSync('sudo dnctl -q flush');
            }
            }
        });
    });

