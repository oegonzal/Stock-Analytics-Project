var webdriver = require('selenium-webdriver'),
    vars = require('../../../config/vars.js');

//TODO: GET LEVEL II DATA

var browserAutomater = function() {
  //Selenium for NOde
  var By = webdriver.By,
      until = webdriver.until;

  /********* Functions **********/

  function chaseLogin(){
      var driver = new webdriver.Builder()
          //.forBrowser('firefox')
          //.usingServer('http://localhost:5000')
          .forBrowser('chrome')
          .build();

      driver.get('https://www.chase.com/');

      driver.wait(function() {
          return driver.findElement(By.id('usr_name_home')).isDisplayed();
      }, 10000);
      driver.findElement(By.id('usr_name_home')).sendKeys(vars.u2);
      driver.findElement(By.id('usr_password_home')).sendKeys(vars.p2);
      driver.findElement(By.className('loginBtn')).click();
      //driver.quit();
  }

  function ameritradeLogin(){

    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build();

    //binds
    driver.selectOption = selectOption.bind(driver);

    var _text;
    driver.get('https://www.tdameritrade.com/home.page')
    .then(function(){
      driver.wait( until.elementIsVisible(driver.findElement(By.id('userid'))), 60 * 1000 );
    })
    .then(function(){
      driver.findElement(By.id('userid')).sendKeys(vars.u1);
      driver.findElement(By.id('password')).sendKeys(vars.p1);
      driver.findElement(By.css('#form-login > div.main-header-login-fields > button')).click();
    })
    .then(function(){
      driver.wait(until.elementLocated(By.className('securityP')), 60 * 1000) //#loginBlock > div.resetPass > p:nth-child(2)
      .then(function(element){
        driver.findElement(By.className('securityP')).getAttribute("textContent")
        .then(function(text){
          _text = text;
        });
      });
    })
    .then(function(){
      driver.wait(until.elementLocated(By.css('.dijitInputContainer > input')), 60 * 1000)
      .then(function(element){
        if(_text.includes("your first pet?")) element.sendKeys('Rosie');
        else if(_text.includes("girlfriend")) element.sendKeys('Melissa');
        else if(_text.includes("father's")) element.sendKeys('Ignacio');
        else element.sendKeys('Vallarta');
      });
    })
    .then(function(){
      //submit
      driver.findElement(By.css('.dijitButtonNode')).click();
    })
    .then(function(){
      driver.wait(until.elementLocated(By.id('navTrade')), 60 * 1000)
      .then(function(element){
        driver.wait(until.elementIsVisible(element), 60 * 1000)
        .then(function(){
          driver.navigate().to('https://invest.ameritrade.com/grid/p/site#r=jPage/cgi-bin/apps/u/JaguarEnhancedEquityTrade');
        });
      });
    })
    .then(function(){
      driver.sleep(5 * 1000);
    })
    .then(function(){
      driver.switchTo().frame("main");
    })
    .then(function(){
      driver.wait(until.elementLocated(By.css('#r11 > tr:nth-child(2) > td:nth-child(4) > input')), 5 * 1000)
      .then(function(element){
        driver.wait(until.elementIsVisible(element), 5 * 1000)
        .then(function(){

            var action = 'buy',
                symbol = 'NUGT',
                quantity = '10',
                price = '10',
                orderType = 'market',
                timeInForce = 'day',
                actionSelector;

            if(action === 'buy') actionSelector = '#r11 > tr:nth-child(2) > td:nth-child(1) > input[type="radio"]';
            else if(action === 'sell') actionSelector = '#r11 > tr:nth-child(3) > td:nth-child(1) > input[type="radio"]';
            else if(action === 'buytocover') actionSelector = '#r11 > tr:nth-child(4) > td:nth-child(1) > input[type="radio"]';
            else if(action === 'sellshort') actionSelector = '#r11 > tr:nth-child(5) > td:nth-child(1) > input[type="radio"]';
            
            driver.findElement(By.css(actionSelector))
            .then(function(element){
              driver.executeScript("arguments[0].scrollIntoView(true);", element)
              .then(function(){
                driver.findElement(By.css('#r11 > tr:nth-child(2) > td:nth-child(1) > input[type="radio"]')).click();
              });
            });
            
            driver.findElement(By.css('#r11 > tr:nth-child(2) > td:nth-child(4) > input')).sendKeys(quantity);
            driver.findElement(By.css('#r11 > tr:nth-child(2) > td:nth-child(8) > input')).sendKeys(symbol); 
            driver.findElement(By.id('price')).sendKeys(price); 
            driver.selectOption(By.css('#r21 > tr:nth-child(2) > td:nth-child(2) > select'), orderType);
            driver.selectOption(By.css('#r31 > tr:nth-child(2) > td:nth-child(2) > select'), timeInForce); //Time-in-force  //day, moc (for order type: market)
            driver.findElement(By.id('place')).click();
        });
      });
    })
    .then(function(){
      driver.sleep(5 * 1000);
    })
    .then(function(){
      driver.wait(until.elementLocated(By.id('placeInner')), 60 * 1000)
      .then(function(element){
        driver.wait(until.elementIsVisible(element), 60 * 1000)
        .then(function(){
          //comment for now, do not execute trades yet
          //driver.findElement(By.id('placeInner')).click();
        });
      });
    })
    .then(function(){
      //driver.sleep(5 * 1000).then(function(){ driver.quit(); });
    })
  }

  function selectOption(selector, item){
      var selectList, desiredOption;

      selectList = this.findElement(selector);
      selectList.click();

      selectList.findElements(By.tagName('option'))
          .then(function findMatchingOption(options){
              options.some(function(option){
                  option.getAttribute('value').then(function doesOptionMatch(text){
                      if (item === text){
                          desiredOption = option;
                          return true;
                      }
                  });
              });
          })
          .then(function clickOption(){
              if (desiredOption){
                  desiredOption.click();
              }
          });
  };

  return {
    ameritradeLogin: ameritradeLogin,
    chaseLogin: chaseLogin
  }
}

module.exports = browserAutomater();



/* Websites to scrape:
    
    Yahoo finance
    Bloomberg
    Google news
    Seeking Alpha
    NASDAQ
    StockTwits
    MarketWatch
    http://finviz.com/
    http://stockcharts.com/school/doku.php?id=chart_school
    Fed website
    Calendar on ameritrade and bloomberg
    http://www.stockta.com/cgi-bin/analysis.pl?symb=QQQ
  
  Download PhantomJs to automate online tasks (web surfing)
  So I can access my accounts online and data inside them
  
  Make window shell commands/window program, execute with node, and pipe the forwarding address
  to node in order to public url of my localhost running

  Run shell scripts from node process to communicate with phantomjs process

  Make UI for my gold, oil, economy, and pharma dashboards

  D3js -> make your own like stockcharts.com and use their equations

  Machine learning -> risk scores and timing scores

  Calendar alerts -> SMS

  
  
  Data:
  Calls/Puts
  Look at white journal for complete list




  Future:
  cost tracker (input to mobile device, bill accountant, finance goal setter, timing to reach goal along with needed percentage each week)
*/


/*
//Does it only once
//setTimeout(function() { console.log("setTimeout: It's been one second!"); }, 1000);

//Does it repeatedly
//setInterval(function() { console.log("setInterval: It's been one second!"); }, 1000);

//To unhook a timer keep track of the return value
function never_call () {
  console.log("You should never call this function");
}

var id1 = setTimeout(never_call, 1000);
var id2 = setInterval(never_call, 1000);

clearTimeout(id1);
clearInterval(id2); 

*/


/*

http://www.netinstructions.com/how-to-make-a-simple-web-crawler-in-javascript-and-node-js/
http://www.netinstructions.com/simple-web-scraping-with-node-js-and-javascript/

Improvements to crawler
Handle any request errors
Collect absolute links, but check that they belong to the same domain and then add them to the pagesToVisit array
Read in the starting URL and the word to search for as command line arguments
Use a different User-Agent if there are any problems making requests to websites that filter based on those HTTP headers


Unique API Key: 8bf7f31c837e6b14704f36bcee1d3414

API Documentation: getHistory, getQuote

You can customize your queries using the inputs found in the API documentation. The unique API key is to be used in your API queries. See below for an example.

getHistory sample query: http://marketdata.websol.barchart.com/getHistory.json?key=8bf7f31c837e6b14704f36bcee1d3414&symbol=IBM&type=daily&startDate=20150503000000

getQuote sample query: http://marketdata.websol.barchart.com/getQuote.json?key=8bf7f31c837e6b14704f36bcee1d3414&symbols=ZC*1,IBM,GOOGL,^EURUSD

API Overview:

With the Barchart OnDemand complimentary API service you have access to 15-minute delayed market data for BATS (US equities) and global Forex pairs, and end-of-day (including historical) market data for US equities from AMEX, NASDAQ, NYSE and futures from CBOT, CME, COMEX and NYMEX.

The getQuote API includes up to 2,500 queries per day and up to 100 symbols per query. The getHistory API includes up to 1,500 historical queries per day (one symbol per query) and up to 2-years of daily history and 3-months of minute-based intervals (OHLC).

When your daily API account query limit is reached, the data will be disabled then reset until the next day.


Yahoo finance:
Link for csv file: 
http://chart.finance.yahoo.com/table.csv?s=DUST&a=7&b=13&c=2016&d=8&e=13&f=2016&g=d&ignore=.csv

BarChart data api (For Front End):
http://www.barchartondemand.com/api/getQuote
http://barchartondemand.com/api.php
https://github.com/barchart/barchart-ondemand-client-js
(866) 333-7587
*/

/*
//links for getting good info to trade commodities: including energy sector
https://www.thebalance.com/how-to-start-trading-commodities-online-809250


//link for text-to-voice (limited)
https://www.ivona.com/us/account/speechcloud/status
https://github.com/tmanderson/ivona-node


//Twilio tutorial
https://www.twilio.com/docs/tutorials?filter-product=sms&filter-language=node.js&filter-platform=server


//Tunnel local ports to public ones, eg) for testing localhost server with remote servers. 
//ngrok allows tunneling of public server through your firewall to access specific localhost port
https://twilio.radicalskills.com/library/localhost-visible-to-twilio.html
https://twilio.radicalskills.com/projects/send-sms/1.html


//twilio messageing api
https://www.twilio.com/docs/api/rest/message#instance


//About VPN and proxies and how to stream online freely
https://www.quora.com/How-do-I-fix-Error-Loading-Media-File-not-found-on-Putlocker

//Making window OS programs
https://msdn.microsoft.com/en-us/library/windows/desktop/ff381409(v=vs.85).aspx
*/


/*
http://stackoverflow.com/questions/27686162/fill-form-and-visit-webpage-with-nodejs
There are multiple tools/frameworks in different sizes that you can use. 
Basically the keyword you want to search for is end-to-end testing. 
Popular packages are Zombie.js or Nightwatch.js.

According to the context you might also consider a headless browser that is scripted 
with javascript such as Casper.js or Phantom.js


//scheduled tasks on windows or cron tasks on linux
http://stackoverflow.com/questions/814757/headless-internet-browser


//Headless browsing
http://engineering.shapesecurity.com/2015/01/detecting-phantomjs-based-visitors.html

//Selenium

//Horseman
https://github.com/johntitus/node-horseman


//websites
https://www.toptal.com/data-science/algorithmic-trading-a-practical-tale-for-engineers
https://www.thebalance.com/how-to-start-trading-commodities-online-809250

*/