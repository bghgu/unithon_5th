var Promise = require('bluebird');
var pool = require('./db_pool.js');

exports.selectRandomQuestion = function(formPercent, toPercnet, count) {
    return new Promise(function(resolve, reject) {
        var queryStr = 'SELECT ';
        queryStr += 'id, ';
        queryStr += 'question, ';
        queryStr += 'answer, ';
        queryStr += 'type, ';
        queryStr += '(SELECT 0 AS exam_yn FROM dual) AS exam_yn, '
        queryStr += '(SELECT 0 AS answer_yn FROM dual) AS answer_yn, '
        queryStr += 'ifnull((answerCounts/callCounts*100), 100) AS answerPercent '
        queryStr += 'FROM Questions ';
        queryStr += 'WHERE ifnull((answerCounts/callCounts*100), 100) BETWEEN ' + formPercent + ' AND ' + toPercnet +' ';
        queryStr += 'ORDER BY rand() ';
        queryStr += 'LIMIT ' + count;
        pool.query(queryStr, function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}

exports.updateRandomQuestion = function(inputParam) {
    return new Promise(function(resolve, reject) {
        var queryStr = 'UPDATE Questions SET ';
        queryStr += 'callCounts = callCounts + 1, ';
        if(inputParam.answer_yn == 0) {
        	queryStr += 'answerCounts = answerCounts ';
        } else {
        	queryStr += 'answerCounts = answerCounts + 1 ';
        }
        queryStr += 'WHERE id = ' + inputParam.id;
        pool.query(queryStr, function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}