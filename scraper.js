var google = require('google');
var Xray = require('x-ray');
var xray = new Xray();
var content;

google.resultsPerPage = 25;
google.timeSpan = 'm';
var nextCounter = 0;
var linksArray = [];
var linkIndex = 0;

module.exports = function (keyword, callback) {
   google("source:bloomberg news:"+keyword, function (err, next, links){
      if (err) console.error(err);
      
      for (var i = 0; i < links.length; ++i, ++linkIndex) {
         linksArray[linkIndex] = (links[i].link);
         console.log(linksArray[linkIndex]);
      }
      /*if (nextCounter < 1 && next) {
         nextCounter += 1;
         next();
      }else {*/
         expandLink(0);
      //}
   });

   var contentArray = [];

   function expandLink(ind) {
      if (linksArray[ind]){
         xray(linksArray[ind], 'p', [''])(function (err, xray){
            if (err) console.log(err);
            
            if (xray) {
               var content = xray.join();
               //console.log(content);
               contentArray[ind] = content;
            }

            if (ind < linkIndex - 1) {
               //console.log(ind);
               expandLink(ind+1);
            }
            else {
               callback(contentArray);
            }
         });
      } else if (ind < linkIndex - 1) {
         expandLink(ind + 1);
      } else {
         callback(contentArray);
      }
   }
};