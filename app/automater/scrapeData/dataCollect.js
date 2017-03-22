var request = require('request'),
    cheerio = require('cheerio'),
    URL = require('url-parse'),
    fs = require('fs'),
    textToSpeech = require('../browserAutomater/browserAutomater.js'),
    Stock = require('../../models/stock.model'),
    Dashboard = require('../../models/stock.dashboard.model.js'),
    analysis = require('../stockAnalysis/stockAnalysis.js'),
    phantomjs = require('phantomjs'),
    Horseman = require('node-horseman'),
    helper = require('../helper.js');

//TODO: RUN CYCLE REQUEST DURING REAL TIME OF STOCK MARKET HOURS

var dataCollect = function(){

  /////////////////////////////////////////////// GET HISTORICAL DATA OF STOCKS ///////////////////////////////////////
  function storeStocksHistoricalData(stockList, options){
    for(var item in stockList){
      var symbol = stockList[item];

      //to make synchronoius use recursion on storeStocksHistoricalData(stockList) not forloop within it. Recurse last step in save function or error and add extra param with incrementing index to get next stock in stocklist
      (function(symbol){
        Stock.findOne({ index: symbol }, function(err, stock){
          if(err){
            console.log("There was an error finding symbol " + symbol);
          }
          else if(stock){
            //stock found -> update historical data
            getCSV(symbol, function(data){

              var rsiParams = { range: options.RSI_range, smoothingC: options.RSI_smoothingC };
              analysis.stockRSIScore(data, rsiParams, function(RSI){
                console.log("RSI(" + symbol +", " + rsiParams.range + ", " + rsiParams.smoothingC + ") = " + RSI);
              });

              var stdDeviationParams = { start_day: options.SD_start_day, range: options.SD_range };
              analysis.priceStdDeviation(data, stdDeviationParams, function(data){
                console.log("SD(" + symbol + ", " + stdDeviationParams.start_day + ", " + stdDeviationParams.range + ") = " + JSON.stringify(data));
              });

              analysis.avgDayRange(data, {range: options.avgRange_range}, function(avg){
                console.log("AverageRange(" + symbol + ", " + options.avgRange_range + ") = " + avg);
              });

              stock.data = data;
              stock.save( function(err){
                if(err) console.log("Could not save symbol " + symbol + " to database");
                // else console.log("INFO: " + symbol + " updated successfully.");
              });
            });
          }
          else{
            //no stock found -> add stock
            getCSV(symbol, function(data){
              var stock = new Stock({
                index: symbol,
                data: data
              });
              stock.save(function(err){
                if(err) console.log("Could not save symbol " + symbol + "to database");
                // else console.log("INFO: " + symbol + " stored successfully.");
              });
            });  
          }
        });
      }(symbol));
    }

    Stock.findOne({index: 'NUGT'}, function(error, response){
      //console.log("NUGT: " + JSON.stringify(response.data));
    })
  };

  function getCSV(stock, callback){ //http://chart.finance.yahoo.com/table.csv?s=DUST&a=7&b=13&c=2016&d=8&e=13&f=2016&g=d&ignore=.csv
    var stockData;

    request('http://chart.finance.yahoo.com/table.csv?s=' + stock, function(error, response, body){
      if(error){
        console.log("There was an error with retrieving the CSV file");
      }

      if (!error && response.statusCode == 200) {
          var historicalData = helper.formatHistoricalData(response.body); 
          callback(historicalData);
      }
      else{
        var empty = [];
        callback(empty);
      }
    });
  }


  /////////////////////////// LOOK FOR WORD + VISIT NEW LINKS N LEVELS DEEP TO FIND WORD - SCRAPE ///////////////////////
  function executeCrawl(website, word){
      var START_URL = website;
          SEARCH_WORD = word,
          MAX_PAGES_TO_VISIT = 10,
          pagesVisited = {},
          numPagesVisited = 0,
          pagesToVisit = [],
          url = new URL(START_URL),
          baseUrl = url.protocol + "//" + url.hostname,

      //Begin Crawl
      pagesToVisit.push(START_URL); //call before crawl
      crawl();


      //helper functions
      function crawl() {
        if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
          console.log("Reached max limit of number of pages to visit.");
          return;
        }
        var nextPage = pagesToVisit.pop();
        if (nextPage in pagesVisited) {
          // We've already visited this page, so repeat the crawl
          crawl();
        } else {
          // New page we haven't visited
          visitPage(nextPage, crawl);
        }
      };


      function visitPage(url, callback) {
        // Add page to our set
        pagesVisited[url] = true;
        numPagesVisited++;

        // Make the request
        console.log("Visiting page " + url);
        request(url, function(error, response, body) {
           // Check status code (200 is HTTP OK)
           if(response.statusCode !== 200) {
             console.log("Status code: " + response.statusCode);
             callback();
             return;
           }
           // Parse the document body
           var $ = cheerio.load(body);
           var isWordFound = searchForWord($, SEARCH_WORD);
           if(isWordFound) {
             console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
           } else {
             collectInternalLinks($);
             // In this short program, our callback is just calling crawl()
             callback();
           }
        });
      };


      function searchForWord($, word) {
        var bodyText = $('html > body').text().toLowerCase();
        return(bodyText.indexOf(word.toLowerCase()) !== -1);
      };


      function collectInternalLinks($) {
          var relativeLinks = $("a[href^='/']");
          console.log("Found " + relativeLinks.length + " relative links on page");
          relativeLinks.each(function() {
              pagesToVisit.push(baseUrl + $(this).attr('href'));
          });
      };
  }

  /////////////////////////////////// SCRAPE NEWS //////////////////////////////////////////////

  function searchGoogleNews(params, callback){ //name: crude oil, gold prices, etc
    var horseman = new Horseman({phantomPath: phantomjs.path}),
        query = params.keywords.replace(' ', '+'),
        item_start = params.start || 0, //increment by 10s to choose 
        sort = params.sort || 'sbd'; //sbd: sort by date OR sbr: sort by relevance
    
    var url = 'https://www.google.com/#q=' + query + '&tbm=nws&tbs=' + sort + ':1&start=' + item_start;
    
    console.log("Inside searchGoogleNews");
    console.log("About to query: " + url);

    var os = require('os');
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    console.log("----------- Current IP being used: " + addresses);

    //* Most Common User Agents: (Used to prevent bot from getting flagged) *//
    var userAgentsList = [
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/602.2.14 (KHTML, like Gecko) Version/10.0.1 Safari/602.2.14",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36",
      "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0",
      "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko"
    ];

    try{
      var userAgentItem = userAgentsList[Math.floor(Math.random()*userAgentsList.length)];
      horseman 
      .userAgent(userAgentItem)
      .open(url)
      .wait(3 * 1000)
      .html('#rso')
      .then((html) => {

        console.log("Html returned of: " + url);

        html = '<html>'  + html + '</html>';
        var $ = cheerio.load(html),
            articles = [],
            item = {};

        $('._cy').each( function(index) {
            item = {};
            item.title = $(this).find('div > div > div > h3').text().trim();
            item.link = $(this).find('div > div > div > h3 > a').attr('href');
            item.source = $(this).find('div > div > div > div.slp > span:nth-child(1)').text().trim();
            item.date = $(this).find('div > div > div > div.slp > span:nth-child(3)').text().trim();
            item.body = $(this).find('div > div > div > div:nth-child(3)').text().trim();

            articles.push(item);
          });

        callback(articles);
        horseman.close();
      });
    }
    catch(error){
      console.log("Error: " + JSON.stringify(error));
      callback(articles, error)
    }
  }

  function saveArticlesInDB(keywords, articles){
    Dashboard.findOne({name: keywords}, function(error, dashboard){
      if(error){ console.log("There was an error querying for dashboard");}
      else if(dashboard){
        dashboard.articles = articles;
        dashboard.save(function(error){
          if(error) {console.log("ERROR: Could not update changes to " + name + " dashboard");}
        })
      }
      else{
        var dashboard = new Dashboard({name: keywords, articles: articles});
        dashboard.save(function(error){
          if(error) {console.log("ERROR: Could not create " + name + " dashboard.");}
        });
      }
    });
  }

  function getArticleText(link, callback){

    var content = "";

    try{
      if(link === "") throw "empty string for link";
      if(typeof link !== "string") "link is not a string";
    }
    catch(exception){
      console.log(exception);
      callback(exception);
    }

    // console.log("About to query: " + link);
    // var horsemanOptions = {phantomPath: phantomjs.path, timeout: 5000, interval: 50},
    //     horseman = new Horseman(horsemanOptions);

    // horseman 
    //   .userAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2725.0 Safari/537.36')
    //   .on('error', function(msg, trace){
    //     console.log("ERROR: horseman, " + msg);
    //     consolelog("Trace: " + trace);
    //   })
    //   .on('timeout', function(msg){
    //     console.log("TIMEOUT: horseman, " + msg);
    //   })
    //   .on('loadStarted', function(){
    //     console.log("Horseman load started message");
    //   })
    //   .open(link)
    //   .wait(3 * 1000)
    //   .html('body')
    //   .then((body) => {


    request.get(link, {timeout: 5000}, function(error, response, body){

      if(error){ console.log(error); }
      else{
        if(typeof response !== "undefined" && response.statusCode !== 200){ console.log("ERROR: None 200 Status Code: " + response.statusCode); }
        var $ = cheerio.load(body);

        console.log("Just got body of: " + link);

        $('p').each(function(index, element){

          console.log("Inside each");
          
          var text = $(this).text().trim().replace(/(\r\n|\n|\r)/gm,"");
          content = content + " " + text + "\n";
        });
        
        callback(content);
      }


    //request js
    })
    .on('error', function(e){
      console.log(e);
      callback("Error getting content");
    })
    .end();


    ////Horseman
    // })
    // .close();
  }

  //////////////////////////////////// SCRAPE CALENDAR EVENTS //////////////////////////////////
  function getImportantUpcomingEvents(){

  }


  //////////////////////////////////// SCRAPE DATA ////////////////////////////////////////////
  function scrapeAllData(){
    percentAdvance();
  }


  function percentAdvance(){
    request("http://www.barchart.com/stocks/percentadvance.php?_dtp1=0", function(error, response, body) {
      if(error) {
          console.log("Error: " + error);
      }

      try {
          if(typeof response == "undefined") throw "Response is undefined";
          if(response.statusCode !== 200) console.log("Status code: " + response.statusCode);

          var $ = cheerio.load(body);

          $('table#dt1 > tbody tr').each(function( index ) {
              var symbol = $(this).find('.ds_symbol > a').text().trim(),
                name = $(this).find('.ds_name > a').text().trim(),
                last = $(this).find('.ds_last').text().trim(),
                change = $(this).find('.ds_change > span').text().trim(),
                percent = $(this).find('.ds_pctchange > span').text().trim(),
                high = $(this).find('.ds_high').text().trim(),
                low = $(this).find('.ds_low').text().trim(),
                volume = $(this).find('.ds_volume').text().trim();

          fs.appendFileSync('app/automater/scrapeData/percentadvance.txt', symbol + '\t' +  name + '\t' + last + '\t' + change + '\t' + percent + '\t' +  high + '\t' + low + '\t' + volume + '\n');
        });

      }
      catch(err) {
        console.log("Error: " + err);
      }
    });
  };


  //SCRAPE ETF INFORMATION

  //https://www.vaneck.com/vaneck-vectors/equity-etfs/gdx/holdings/
  function getHoldingRatiosForEtf(){

  }

  /////////////////////////// REPEAT REALTIME STOCK QUERY FOR LATEST NEWS AND DATA ////////////////////////////////////
  function cycleQuery() {
    var time = 0;
    timer();

    function timer(){
      console.log("It has been " + time + " minutes since last run!");
      time += 2;
      setTimeout(timer, 120 * 1000);
    };
  };

  ////////////////////////// FUNCTIONS FOR CALCULATION ///////////////////////////////////////////

  //NUGT follows GDM/GDX and UWTI follows S&P GSCI Crude Oil

  //This method should take an index and a leveraged ETF and calculate what the mean and SD of the leverage target
  function leverageFund(etf, index, range, callback){ //etf: uwti //index: OIL
    //iPath S&P GSCI Crude Oil TR ETN (OIL) designed to provide with exposure to the S&P GSCI® Crude Oil Total Return Index.  
    // request('http://chart.finance.yahoo.com/table.csv?s=' + index + '&a=8&b=3&c=2016&d=9&e=3&f=2016&g=d&ignore=.csv', function(body, request, body){

    // });
    getCSV(etf, function(etfData){
      getCSV(index, function(indexData){
        var sum = 0,
            avg = 0,
            changeEtf = 0,
            changeIndex = 0,
            SD = 0,
            r = 0,
            ratios = [],
            data = {};

        for(var i = 0; i < range; i++){
          changeEtf = Math.abs(etfData[i + 1].adj_close - etfData[i].adj_close)/etfData[i + 1].adj_close;
          changeIndex = Math.abs(indexData[i + 1].adj_close - indexData[i].adj_close)/indexData[i + 1].adj_close;
          r = changeEtf/changeIndex;
          ratios.push(r);
          sum += r;
        }

        avg = sum/range;
        sum = 0;
        data.avg = avg;

        for(var i = 0; i < range; i++){
          sum += ((ratios[i] - avg)*(ratios[i] - avg));
        }
        avg = sum/range;
        SD = Math.sqrt(avg);
        data.SD = SD;

        callback(data);
      });
    });
  }

  //Make a function that shows you how much exposure you are getting on a leverage ETF for the prcie bought
  //and what the compound is
  function leverageETFPrice(){
    
  }

  //function that will make a prob for etf going up based on holdings
  function probOfEtfChange(){

  }

  function getUSDPrediction(){

  }

  //for gold
  function getETFHoldings(ETF, callback){ //gdx
    request('https://www.vaneck.com/vaneck-vectors/equity-etfs/' + ETF + '/holdings/', function(error, response, body){
      if(error) {
          console.log("Error: " + error);
      }

      try {
          if(typeof response == "undefined") throw "Response is undefined";
          if(response.statusCode !== 200) console.log("Status code: " + response.statusCode);

          var $ = cheerio.load(body),
              holdings = [];


          $('#ctl00_ctl00_cphMain_cphMain_dzMain_columnDisplay_ctl00_controlcolumn_ctl02_WidgetHost_WidgetHost_widget_ccContent > div > div.table-container-m > div > table > tbody > tr').each(function(index, element){
            var item =  {
                          holding_name :  $(this).find('td.leftAlign').text().trim(),
                          ticker :        $(this).find(':nth-child(3) > div').text().trim(),
                          shares :        $(this).find(':nth-child(4)').text().trim(),
                          market_value :  $(this).find(':nth-child(5)').text().trim(),
                          percent_assets : $(this).find(':nth-child(8)').text().trim()
                        }

            holdings.push(item);
          });

          callback(holdings);

        }

      catch(error){
        console.log("Error: " + JSON.stringify(error));
      }
    });
  }

  //stockfetcher.com
  function stockFetcher(options){

  }

  //US dollar info, DXY index
  function usd(){

  }

  //Yahoo Fincance API for stock data
  //https://www.npmjs.com/package/yahoo-finance 

  //technical algorithms
  //https://www.quantopian.com/posts/how-to-code-resistance-areas
  //http://stockcharts.com/school/doku.php?id=chart_school:chart_analysis:support_and_resistance
  //http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:pivot_points

  return {
    storeStocksHistoricalData: storeStocksHistoricalData,
    executeCrawl : executeCrawl,
    searchGoogleNews: searchGoogleNews,
    saveArticlesInDB: saveArticlesInDB,
    scrapeAllData : scrapeAllData,
    cycleQuery: cycleQuery,
    getArticleText: getArticleText,
    getETFHoldings: getETFHoldings,
    leverageFund: leverageFund
  }
};

module.exports = dataCollect();



/*
  http://finance.yahoo.com/news/four-highly-effective-trading-indicators-193000721.html
  https://www.dailyfx.com/forex/education/trading_tips/daily_trading_lesson/2014/05/12/Three-most-popular-indicators.html
  http://tradingsim.com/blog/day-trading-chart-indicators/
  ---Moving Average, RSI, Stochastic, & MACD indicator (also commodity channel index (CCI))

  Day trading:
  ----Price action


  http://www.netpicks.com/most-useful-day-trading-indicators/
  https://invest.ameritrade.com/grid/p/site#r=jPage/https://education.ameritrade.com/tdaeducation/grid/topics-futures?c_name=invest_VENDOR#p=&s=popularity&d=r&essentialsMediaType=COURSE,VIDEO,PLAYLIST&essentialsProgress=&essentialsLevel=


  
*/