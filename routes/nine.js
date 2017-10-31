const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const nineService = require('../references/nineService.js');

router.post('/nine', function(req, res, next) {
    console.log("************nine post start************");
    console.log("************nine post parameter************");
    console.log(req.body);
    var inputAll = [];
    var inputParam = {};
    console.log(typeof req.body.question);
    if (typeof req.body.question == 'object') {
        for (var i = 0; i < req.body.question.length; i++) {
            inputParam.question = req.body.question[i];
            inputParam.answer = req.body.answer[i];
            inputAll.push(nineService.insertNineQuestion(inputParam));
        }
    } else {
        inputParam.question = req.body.question;
        inputParam.answer = req.body.answer;
        inputAll.push(nineService.insertNineQuestion(inputParam));
    }

    Promise.all(inputAll).then(function(result) {
        console.log(result);
        res.json({ 'result': 'success' });
    }).catch(function(err) {
        console.log(err);
        res.json({ 'result': 'fail' });
    });
});

router.get('/nine', function(req, res, next) {
    console.log("************nine get start************");
    console.log("************nine get parameter************");
    console.log(req.query);
    var qusetionCount;
    if (req.query.qusetionCount == undefined) {
        qusetionCount = 6;
    }
    var returnQuestion = [];
    nineService.selectNineQuestion(0, 30, Math.floor(qusetionCount / 3)).then(function(result) {
        for (var i = 0; i < result.length; i++) {
            result[i].answer = result[i].answer.split(',');
            returnQuestion.push(result[i]);
        }
        qusetionCount = qusetionCount - result.length;
        return nineService.selectNineQuestion(30, 60, Math.floor(qusetionCount / 2));
    }).then(function(result) {
        for (var i = 0; i < result.length; i++) {
            result[i].answer = result[i].answer.split(',');
            returnQuestion.push(result[i]);
        }
        qusetionCount = qusetionCount - result.length;
        return nineService.selectNineQuestion(60, 100, qusetionCount);
    }).then(function(result) {
        for (var i = 0; i < result.length; i++) {
            result[i].answer = result[i].answer.split(',');
            returnQuestion.push(result[i]);
        }
        returnQuestion = shuffle(returnQuestion);
        res.json(returnQuestion);
    }).catch(function(err) {
        console.log(err);
    });
});

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

router.put('/nine', function(req, res, next) {
    console.log("************nine put start************");
    console.log("************nine put parameter************");
    console.log(req.body);
    var inputAll = [];
    var inputParam = {};
    for (var i = 0; i < req.body.length; i++) {
        if (req.body[i].answer_yn != undefined && req.body[i].answer_yn != null && req.body[i].exam_yn != 0) {
            inputParam.id = req.body[i].id;
            inputParam.answer_yn = req.body[i].answer_yn;
            inputAll.push(nineService.updateNineQuestion(inputParam));
        }
    }

    Promise.all(inputAll).then(function(result) {
        console.log(result);
        res.json({ 'result': 'success' });
    }).catch(function(err) {
        console.log(err);
        res.json({ 'result': 'fail' });
    });
});

module.exports = router;
