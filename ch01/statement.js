var csd = require("./createStatementData.js");

function statement(invoice) {
    return renderHtml(csd.createStatementData(invoice));
}

// html

function renderHtml(data){
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += `<table>`;
    result += `<tr><th>play</th><th>seats</th><th>cost</th></tr>`
    for (let perf of data.performances) {
        result += `<tr><td> ${perf.play.name}</td><td>${perf.audience}</td><td>${usd(perf.amount)}</td><tr>\n`;
    }
    result += `</table>`;
    result += `<p>Amount owed is ${usd(data.totalAmount)}</p>\n`;
    result += `<p>You earned ${data.totalVolumeCredits} credits</p>\n`;
    return result;
}

// 文本
function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}

/**
 * 格式化美元
 * @param {Number} aNumber 小钱钱
 */
function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber / 100);
}

exports.statement = statement;