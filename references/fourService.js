const Promise = require('bluebird');
const pool = require('./db_pool.js');

exports.insertFourQuestion = function(inputParam) {
    return new Promise(function(resolve, reject) {
        var queryStr = 'INSERT INTO Questions(';
        queryStr += 'question, ';
        queryStr += 'answer, ';
        queryStr += 'callCounts, ';
        queryStr += 'answerCounts, ';
        queryStr += 'type) ';
        queryStr += 'VALUES(';
        queryStr += '\"' + inputParam.question + '\", ';
        queryStr += '\"' + inputParam.answer + '\", ';
        queryStr += '0, ';
        queryStr += '0, ';
        queryStr += '1) ';
        queryStr += 'ON DUPLICATE KEY UPDATE ';
        queryStr += 'question = \"' + inputParam.question + '\", ';
        queryStr += 'type = 1, ';
        queryStr += 'answer = CONCAT(answer , \", ' + inputParam.answer + '\") ';
       	console.log(queryStr);
        pool.query(queryStr, function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

exports.selectFourQuestion = function(formPercent, toPercnet, count) {
    return new Promise(function(resolve, reject) {
        var queryStr = 'SELECT ';
        queryStr += 'id, ';
        queryStr += 'question, ';
        queryStr += 'answer, ';
        queryStr += 'type, ';
        queryStr += '(SELECT 0 AS exam_yn FROM dual) AS exam_yn, ';
        queryStr += '(SELECT 0 AS answer_yn FROM dual) AS answer_yn, ';
        queryStr += 'ifnull((answerCounts/callCounts*100), 100) AS answerPercent ';
        queryStr += 'FROM Questions ';
        queryStr += 'WHERE type = 1 ';
        queryStr += 'AND ifnull((answerCounts/callCounts*100), 100) BETWEEN ' + formPercent + ' AND ' + toPercnet +' ';
        queryStr += 'ORDER BY rand() ';
        queryStr += 'LIMIT ' + count;
        pool.query(queryStr, function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

exports.updateFourQuestion = function(inputParam) {
    return new Promise(function(resolve, reject) {
        var queryStr = 'UPDATE Questions SET ';
        queryStr += 'callCounts = callCounts + 1, ';
        if(inputParam.answer_yn == 0) {
        	queryStr += 'answerCounts = answerCounts ';
        } else {
        	queryStr += 'answerCounts = answerCounts + 1 ';
        }
        queryStr += 'WHERE type = 1 ';
        queryStr += 'AND id = ' + inputParam.id;
        console.log(queryStr);
        pool.query(queryStr, function(error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
}
