var db       = require('nano')('http://192.168.0.110:5984/watchlog')
    , params   = {include_docs: true, descending: false}
;
var Excel = require('exceljs');
var workbook = new Excel.Workbook();
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
workbook.properties.date1904 = true;
var sheettxLog = workbook.addWorksheet('txLog');
var sheetbatteryLog = workbook.addWorksheet('batteryLog');
var sheetresourceLog = workbook.addWorksheet('resourceLog');
sheettxLog.columns = [
    { header: 'episodeId', key: 'episodeId', width: 10 },
    { header: 'txnType', key: 'txnType', width: 10 },
    { header: 'logTime', key: 'logTime', width: 10 },
    { header: 'sessionId', key: 'sessionId', width: 10 },
    //{ header: 'txnId', key: 'txnId', width: 10 },
    { header: 'tizenId', key: 'tizenId', width: 10 },
    { header: 'endPoint', key: 'endPoint', width: 10 },
];
sheetbatteryLog.columns = [
    { header: 'episodeId', key: 'episodeId', width: 10 },
    { header: 'battery', key: 'battery', width: 10 },
    { header: 'logTime', key: 'logTime', width: 10 },
    { header: 'sessionId', key: 'sessionId', width: 10 },
    { header: 'tizenId', key: 'tizenId', width: 10 },
];
sheetresourceLog.columns = [
    { header: 'episodeId', key: 'episodeId', width: 10 },
    { header: 'cpu', key: 'cpu', width: 10 },
    { header: 'mem', key: 'mem', width: 10 },
    { header: 'logTime', key: 'logTime', width: 10 },
    { header: 'sessionId', key: 'sessionId', width: 10 },
    { header: 'tizenId', key: 'tizenId', width: 10 },
];
db.list(params, function(error,body,headers) {
    //console.log(body);
    console.log(body.rows.length);
    for(var i = 0; i < body.rows.length; i++) {
        //console.log(body.rows[i].doc);
        if(body.rows[i].doc.logType == 'txLog'){
            console.log(body.rows[i].doc.txnType);
            sheettxLog.addRow({id: i+1, episodeId:body.rows[i].doc.episodeId, txnType: body.rows[i].doc.txnType, logTime:body.rows[i].doc.logTime, sessionId:body.rows[i].doc.sessionId,tizenId:body.rows[i].doc.tizenId,endPoint:body.rows[i].doc.endPoint});
        }
        else if (body.rows[i].doc.logType == 'batteryLog'){
            sheetbatteryLog.addRow({id: i+1, episodeId:body.rows[i].doc.episodeId, battery: body.rows[i].doc.battery, logTime:body.rows[i].doc.logTime, sessionId:body.rows[i].doc.sessionId,tizenId:body.rows[i].doc.tizenId});
        }
        else if (body.rows[i].doc.logType == 'resourceLog'){
            sheetresourceLog.addRow({id: i+1, episodeId:body.rows[i].doc.episodeId, cpu: body.rows[i].doc.cpu, mem: body.rows[i].doc.mem, logTime:body.rows[i].doc.logTime, sessionId:body.rows[i].doc.sessionId,tizenId:body.rows[i].doc.tizenId});
        }
    }
    workbook.xlsx.writeFile('couchdb2xlsx/couchdb2xlsx.xlsx')
        .then(function() {
            console.log('done');
        });
});
