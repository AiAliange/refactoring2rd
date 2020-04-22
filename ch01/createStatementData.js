var _plays = require("./plays.json"); //剧目

exports.createStatementData = createStatementData;

function createStatementData(invoice) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
}

function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
}
/**
 * 工厂函数
 * @param {object} aPerformance 一场表演  
 * @param {*} aPlay 一个剧目
 */
function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`Unknown type: ${aPlay.type}`);
    }
}

/**
 * 演出计算器：
 * 重构目的：支持更多类型的戏剧（comedy， tragedy），以及支持他们各自的价格计算和观众量积分计算。
 * 重构手段：以多态取代条件表达式
 */
class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    /**
     * 计算一场演出的费用
     */
    get amount() {
        throw new Error('Subclass responsibility');
    }

    /**
     * 单场演出观众量积分
     */
    get volumeCredits(){
        return Math.max(this.performance.audience - 30, 0);
    }
}


class TragedyCalculator extends PerformanceCalculator {
    get amount(){
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount(){
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits(){
        return  super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

/**
 * 客户订单总费用
 * @param {object} data 客户演出订单
 */
function totalAmount(data) {
    return data.performances.reduce((total, p) =>
        total + p.amount, 0);
}

/**
 * 客户订单总积分
 * @param {object} data 客户演出订单
 */
function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => {
        return total + p.volumeCredits;
    }, 0);
}

function playFor(aPerformance) {
    return _plays[aPerformance.playID];
}