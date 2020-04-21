var _plays = require("./plays.json"); //剧目

exports.createStatementData = createStatementData;

function createStatementData(invoice){
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

/**
 * 客户订单总费用
 * @param {object} data 客户演出订单
 */
function totalAmount(data) {
    return data.performances.reduce((total, p) => 
        total + p.amount
    , 0);
}

/**
 * 计算一场演出的费用
 * @param {object} aPerformance 一场演出
 */
function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`Unkown type:${playFor(aPerformance).type}\n`);
    }
    return result;
}

/**
 * 客户订单总积分
 * @param {object} data 客户演出订单
 */
function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => {
        return total + p.volumeCredits;}
    , 0);
}

/**
 * 单场演出观众量积分
 * @param {object} aPerformance 单场演出
 */
function volumeCreditsFor(aPerformance) {
    let result = 0;
    // add volume credits
    result += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("commdy" == aPerformance.play.type) {
        result += Math.floor(aPerformance.audience / 5);
    }
    return result;
}


function playFor(aPerformance) {
    return _plays[aPerformance.playID];
}