var plays = require("./plays.json");//剧目

function statement(invoice) {
    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(totalAmount(invoice))}\n`;
    result += `You earned ${totalVolumeCredits(invoice)} credits\n`;
    return result;
}
/**
 * 客户订单总费用
 * @param {object} invoice 客户演出订单
 */
function totalAmount(invoice){
    let result = 0;
    for(let perf of invoice.performances){
        result += amountFor(perf);
    }
    return result;
}

/**
 * 计算一场演出的费用
 * @param {object} aPerformance 一场演出
 */
function amountFor(aPerformance){
    let result = 0;
    switch (playFor(aPerformance).type) {
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
 * @param {object} invoice 客户演出订单
 */
function totalVolumeCredits(invoice){
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

/**
 * 单场演出观众量积分
 * @param {object} aPerformance 单场演出
 */
function volumeCreditsFor(aPerformance){
    let result = 0;
     // add volume credits
     result += Math.max(aPerformance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("commdy" == playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
    }
    return result;
}
/**
 * 格式化美元
 * @param {Number} aNumber 小钱钱
 */
function usd(aNumber){
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber/100);
}

function playFor(aPerformance){
    return plays[aPerformance.playID];
}

exports.statement = statement;