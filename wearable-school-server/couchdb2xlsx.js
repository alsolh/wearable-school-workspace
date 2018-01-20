//var cleanFileNames = ',EP001-1509299906898,EP002-1509302394376,EP003-1509308689493,EP004-1509310506823,EP005-1509312324174,EP006-1509314143314,EP007-1509315961515,EP008-1509317780039,EP009-1509336190700,EP010-1509338018220,EP011-1509347393435,EP012-1509349217413,EP013-1509364267672,EP014-1509381592185,EP015-1509383442390,EP016-1509385268508,EP017-1509433562784,EP018-1509437392727,EP019-1509118433651,EP020-1509120251970,EP021-1509122069583,EP022-1509123889431,EP023-1509125709446,EP024-1509127530741,EP025-1509130651633,EP026-1509132477150,EP027-1509134296896,EP028-1509136115522,EP029-1509137934144,EP030-1509139754836,EP031-1509141574508,EP032-1509143395291,EP033-1509145209902,EP034-1509147031139,EP035-1509148851989,EP036-1509150669474,EP037-1509164711812,EP038-1509166531519,EP039-1509168350871,EP040-1509170169631,EP041-1509387249304,EP042-1509173819219,EP043-1509175648656,EP044-1509177467815,EP045-1509182190944,EP046-1509184015331,EP047-1509185835686,EP048-1509187657951,EP049-1509189472083,EP050-1509191291876,EP051-1509193113643,EP052-1509195159227,EP053-1509196984759,EP054-1509198809957,EP055-1509200630737,EP056-1509202449150,EP057-1509204264523,EP058-1509207933595,EP059-1509209916969,EP060-1509211739142,EP061-1509213560155,EP062-1509215385434,EP063-1509217204167,EP064-1509219023430,EP065-1509390596416,EP066-1509392430158,EP067-1509394249017,EP068-1509396066476,EP069-1509397884014,EP070-1509399702679,EP071-1509401521838,EP072-1509403340635,EP073-1509099091000,EP074-1509223116739,EP075-1509224936158,EP076-1509226753554,EP077-1509228570413,EP078-1509230389012,EP079-1509232206877,EP080-1509234025699,EP081-1509235838946,EP082-1509237657658,EP083-1509250944549,EP084-1509256573082,EP085-1509258393972,EP086-1509260212213,EP087-1509262030567,EP088-1509263849802,EP089-1509265663330,EP090-1509268674308,EP091-1509270502929,EP092-1509272319968,EP093-1509274137022,EP094-1509275962531,EP095-1509277780796,EP096-1509279599206,EP097-1509281413335,EP098-1509284577680,EP099-1509286402898,EP100-1509288221993,EP101-1509290039338,EP102-1509291857751,EP103-1509293676080,EP104-1509429613766,';
var cleanFileNames = ',EP106-1509800954127,EP105-1509798882573,EP108-1509796618779,EP107-1509794237764,';
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
    { header: 'txnId', key: 'txnId', width: 10 },
];
sheetbatteryLog.columns = [
    { header: 'episodeId', key: 'episodeId', width: 10 },
    { header: 'battery', key: 'battery', width: 10 },
    { header: 'logTime', key: 'logTime', width: 10 },
    { header: 'sessionId', key: 'sessionId', width: 10 },
    { header: 'tizenId', key: 'tizenId', width: 10 },
    { header: 'txnId', key: 'txnId', width: 10 },
];
sheetresourceLog.columns = [
    { header: 'episodeId', key: 'episodeId', width: 10 },
    { header: 'cpu', key: 'cpu', width: 10 },
    { header: 'mem', key: 'mem', width: 10 },
    { header: 'logTime', key: 'logTime', width: 10 },
    { header: 'sessionId', key: 'sessionId', width: 10 },
    { header: 'tizenId', key: 'tizenId', width: 10 },
    { header: 'txnId', key: 'txnId', width: 10 },
];
db.list(params, function(error,body,headers) {
    //console.log(body);
    console.log(body.rows.length);
    for(var i = 0; i < body.rows.length; i++) {
        if((cleanFileNames.indexOf(',' + body.rows[i].doc.episodeId + ',') > -1) || body.rows[i].doc.episodeId == null) {
            //console.log(body.rows[i].doc);
            if (body.rows[i].doc.logType == 'txLog') {
                console.log(body.rows[i].doc.txnType);
                sheettxLog.addRow({
                    id: i + 1,
                    episodeId: body.rows[i].doc.episodeId,
                    txnType: body.rows[i].doc.txnType,
                    logTime: body.rows[i].doc.logTime,
                    sessionId: body.rows[i].doc.sessionId,
                    tizenId: body.rows[i].doc.tizenId,
                    endPoint: body.rows[i].doc.endPoint,
                    txnId: body.rows[i].doc.txnId
                });
            }
            else if (body.rows[i].doc.logType == 'batteryLog') {
                sheetbatteryLog.addRow({
                    id: i + 1,
                    episodeId: body.rows[i].doc.episodeId,
                    battery: body.rows[i].doc.battery,
                    logTime: body.rows[i].doc.logTime,
                    sessionId: body.rows[i].doc.sessionId,
                    tizenId: body.rows[i].doc.tizenId,
                    txnId: body.rows[i].doc.txnId
                });
            }
            else if (body.rows[i].doc.logType == 'resourceLog') {
                sheetresourceLog.addRow({
                    id: i + 1,
                    episodeId: body.rows[i].doc.episodeId,
                    cpu: body.rows[i].doc.cpu,
                    mem: body.rows[i].doc.mem,
                    logTime: body.rows[i].doc.logTime,
                    sessionId: body.rows[i].doc.sessionId,
                    tizenId: body.rows[i].doc.tizenId,
                    txnId: body.rows[i].doc.txnId
                });
            }
        }
    }
    workbook.xlsx.writeFile('couchdb2xlsx/couchdb2xlsx.xlsx')
        .then(function() {
            console.log('done');
        });
});
