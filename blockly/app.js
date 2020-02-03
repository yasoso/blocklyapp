var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var data_log =[]
var interval_log = []


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, './demos/')));
app.use(express.static(path.join(__dirname, './blockly_accessible_uncompressed.js')));
app.use(express.static(path.join(__dirname, './msg/')));
app.use(express.static(path.join(__dirname, './blockly_compressed.js')));
app.use(express.static(path.join(__dirname, './blocks_compressed.js')));
app.use(express.static(path.join(__dirname, './generators/')));
app.use(express.static(path.join(__dirname, './javascript_compressed.js')));
app.use(express.static(path.join(__dirname, './blocks/')));
app.use(express.static(path.join(__dirname, './python_compressed.js')));
app.use(express.static(path.join(__dirname, './core/')));
app.use(express.static(path.join(__dirname, './generators')));
app.use(express.static(path.join(__dirname, './lua_compressed.js')));
app.use(express.static(path.join(__dirname, './theme_scripts/')));
app.use(express.static(path.join(__dirname, './lua_compressed.js')));
app.use(express.static(path.join(__dirname, './php_compressed.js')));
app.use(express.static(path.join(__dirname, './dart_compressed.js')));



app.use('/', indexRouter);
app.use('/users', usersRouter);


// 静的ファイルは無条件に公開
app.use('/blockly', express.static('/blockly'));
app.use('/blockly_compressed.js', express.static('../blockly/blockly_compressed.js'))
app.use('/blocks_compressed.js', express.static('../blockly/blocks_compressed.js'))
app.use('/javascript_compressed.js', express.static('../blockly/javascript_compressed.js'))
app.use('/blocks/', express.static('../blockly/blocks'))
app.use('/media', express.static('../blockly/media/'))
app.use('/generators', express.static('../blockly/generators/'))
app.use('/msg/', express.static('../blockly/msg/'))
app.use('/python_compressed.js', express.static('../blockly/python_compressed.js'))
app.use('/core', express.static('../blockly/core/'))
app.use('/lua_compressed.js', express.static('../blockly/lua_compressed.js'))
app.use('/php_compressed.js', express.static('../blockly/php_compressed.js'))
app.use('/dart_compressed.js', express.static('../blockly/dart_compressed.js'))


app.use(function (req, res, next) {
    console.log('request', req.url, req.body, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});


app.post('/post', function (req, res) {
    res.set('Content-Type', 'application/json');
    // リクエストボディを出力
    res.send("成功")
    data_log = req.body
    console.log(data_log);

    exportCSV(data_log)
})

app.post('/interval', function (req, res) {

    res.set('Content-Type', 'application/json');
    // リクエストボディを出力
    res.send("成功")
    interval_log = req.body
    intervalCSV(interval_log);
})


// jsonをcsvで保存するfunction
function exportCSV(content) {
    Object.assign = require('object-assign')
    require('date-utils');
    const Json2csvParser = require('json2csv').Parser;
    var fs = require('fs');
    var newLine = "\r\n";
    var fields = ['time', 'code', 'runcount']

    const json2csvParser = new Json2csvParser({
        fields: fields,
        header: false
    });
    const csv = json2csvParser.parse(content) + newLine;

    fs.appendFile('log/run_log.csv', csv, 'utf8', function (err) {
        if (err) {
            console.log('保存できませんでした');
        } else {
            console.log('runlog保存できました');
        }
    });
}

function intervalCSV(content) {
    Object.assign = require('object-assign')
    require('date-utils');
    const Json2csvParser = require('json2csv').Parser;
    var fs = require('fs');
    var newLine = "\r\n";
    var fields = ['time', 'code', 'block_count','delete_count','pageX', 'pageY']

    const json2csvParser = new Json2csvParser({
        fields: fields,
        header: false
    });

    const csv = json2csvParser.parse(content) + newLine;

    fs.appendFile('log/interval_log.csv', csv, 'utf8', function (err) {
        if (err) {
            console.log('保存できませんでした');
        } else {
            console.log('interval保存できました');
        }
    });
}
// var time_interval = 60000
// setInterval(function () {
//     intervalCSV(interval_log)
// }, time_interval);

module.exports = app;
