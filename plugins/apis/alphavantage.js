const Discord = require("discord.js");
const config = require("../../util/configLoader");
const fetch = require("node-fetch");
let requestsRemaining = 5;
let uptimeAtLastReset = process.uptime();

let currencyListDownloaded = false;
let currencies = [];

function parseCurrencyList(text) {
    let split = text.split("\n");
    split.shift();
    for (let currency of split) {
        currencies.push(currency.split(",")[0]);
    }
}

module.exports = {
    name: "Alpha Vantage",
    author: "theLMGN",
    version: 1,
    description: "Currency conversion and stock exchange commands.",
    requiresConfig: "alphaVantageKey",
    commands: [
        {
            name: "currency",
            usage: "float amount=50, word sourceCurrency=GBP, word targetCurrency=BTC",
            description: "Currency conversions",
            category: "Utilities",
            execute: async (client, m, a) => {
                if (!currencyListDownloaded) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("428: Currency list not loaded.", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter("Please try again later.") });
                }
                if (requestsRemaining < 1) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor("429: Ratelimited!", "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter(`Try again in ${60 - Math.floor(process.uptime() - uptimeAtLastReset)} seconds.`) });
                }
                if (!currencies.includes(a.sourceCurrency.toUpperCase())) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor(`404: ${a.sourceCurrency} is not a recognised currency.`, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter("This command only accepts 3 arguments, {amount} {source currency} {to currency}") });
                }

                if (!currencies.includes(a.targetCurrency.toUpperCase())) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setAuthor(`404: ${a.targetCurrency} is not a recognised currency.`, "https://cdn.discordapp.com/attachments/423185454582464512/425761155940745239/emote.png")
                        .setColor("#ff3860")
                        .setFooter("This command only accepts 3 arguments, {amount} {source currency} {to currency}") });
                }
                if (a.targetCurrency.toUpperCase() == a.sourceCurrency.toUpperCase()) {
                    return m.reply({ embed: new Discord.MessageEmbed()
                        .setTitle(`${a.amount} ${a.sourceCurrency} = ${a.amount} ${a.targetCurrency}`)
                        .setColor("#3273dc")
                        .setFooter("Currency conversion powered by alphavantage.io") });
                }
                requestsRemaining -= 1;
                let ftch = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${a.sourceCurrency}&to_currency=${a.targetCurrency}&apikey=${config.alphaVantageKey}`);
                let j = await ftch.json();
                if (j["Error Message"]) {
                    ftch = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${a.targetCurrency}&to_currency=${a.sourceCurrency}&apikey=${config.alphaVantageKey}`);
                    j = await ftch.json();
                    if (j["Error Message"]) { throw new Error(j["Error Message"]); }
                    let c = j["Realtime Currency Exchange Rate"]["4. To_Currency Name"];
                    j["Realtime Currency Exchange Rate"]["4. To_Currency Name"] = j["Realtime Currency Exchange Rate"]["2. From_Currency Name"];
                    j["Realtime Currency Exchange Rate"]["2. From_Currency Name"] = c;
                    j["Realtime Currency Exchange Rate"]["5. Exchange Rate"] = 1 / parseFloat(j["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
                }
                let exchange = j["Realtime Currency Exchange Rate"];
                let fromName = exchange["2. From_Currency Name"];
                let toName = exchange["4. To_Currency Name"];
                let rate = parseFloat(exchange["5. Exchange Rate"]);
                return m.reply({ embed: new Discord.MessageEmbed()
                    .setTitle(`${a.amount} ${fromName} = ${a.amount * rate} ${toName}`)
                    .setColor("#3273dc")
                    .setFooter("Currency conversion powered by alphavantage.io") });
            }
        }
    ],
    events: [
        {
            name: "ready",
            exec: async function(c) {
                setInterval(() => {
                    requestsRemaining = 5;
                    uptimeAtLastReset = process.uptime();
                }, 60000);
                console.log("[AlphaVantage] Downloading list of real currencies");
                let realFetch = await fetch("https://www.alphavantage.co/physical_currency_list/");
                parseCurrencyList(await realFetch.text());

                console.log("[AlphaVantage] Downloading list of virtual currencies");
                let digitalFetch = await fetch("https://www.alphavantage.co/digital_currency_list/");
                parseCurrencyList(await digitalFetch.text());
                currencyListDownloaded = true;
                console.log(`[AlphaVantage] ${currencies.length} currencies loaded.`);
            }
        }
    ]
};
