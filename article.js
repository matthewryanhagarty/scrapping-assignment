
$(".scrape-btn").on("click", function(event) {

    axios.get("https://blog.feedspot.com/music_blogs/").then(function(response) {

        var $ = cheerio.load(response.data);
      
        var results = [];
      
        $("a.tlink").each(function(i, element) {
      
          var title = $(element).text();
      
          var link = $(element).attr("href");
      
          results.push({
            title: title,
            link: link
          });
        })
        
      });

});


