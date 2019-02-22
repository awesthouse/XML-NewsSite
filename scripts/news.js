//SETTING VARIABLES
const preurl = "https://tek.westerdals.no/~gonrol/ajaxProxy/getRSS.php?url=";
const nav = $("nav");
const imgNotFound = "./img/img_notfound.jpg";

//JSON LIST WITH NEWSSITE RSS FEEDS
const newsSitesJSON = {
    sites: [
        {id: 1, name: "NRK Vitenskap", url: "http://www.nrk.no/viten/toppsaker.rss"},
        {id: 2, name: "BBC", url: "http://feeds.bbci.co.uk/news/world/rss.xml"},
        {id: 3, name: "VG", url: "https://www.vg.no/rss/feed/?categories=1097"},
        {id: 4, name: "NRK Nyheter", url: "http://www.nrk.no/nyheter/toppsaker.rss"},
        {id: 5, name: "Aftenposten", url: "https://www.aftenposten.no/rss/"}
    ]
}

//FUNCTION GOES THROUGH NEWSSITES AND APPENDS THE NAMES TO THE NAVIGATION IN A LI-TAG WITH SITE-ID AS AN ATTRIBUTE
$.each(newsSitesJSON.sites, function(i, site) {
    let title = site.name;
    let siteid = site.id;
    nav.append("<li dataid=" + siteid + ">" + title + "</li>");
})

//FUNCTION RETURNING THE JSON LIST - TAKES ONE PARAMETER THAT CHECKS SITE-IDS TO THE SITE-ID THAT WAS CLICKED
function getNewsSite(siteid) {
    siteid = siteid - 1; //simple fix on array positioning
    return newsSitesJSON.sites[siteid]; //returns a json array with only the newssite that was clicked
}

//ON CLICK - RUNS FUNCTION getNews
$('nav li').on("click", getNews);


function getNews() {
    //variables
    let htmlText = "";
    let siteid = $(this).attr("dataid"); //gets site-id that was stored in the dataid attribute
    let newsSite = getNewsSite(siteid); //runs function getNewsSite with site-id as parameter
    let newsName = newsSite.name;
    let newsUrl = newsSite.url;
    let fullUrl = preurl + newsUrl; //appends newsurl to preurl already set

    $("#title").html(newsName); //sets newssite title to title-section html

    $.ajax(
        {
            method: "GET",
            dataType: "xml",
            url: fullUrl
        }
    )
    .done(function(newsXML) {
        //console.log(newsXML);
        $(newsXML).find("item").each(function() {
            let title = $("title", this).text();
            let description = $("description", this).text();
            let link = $("link", this).text();
            let creator = $("dc\\:creator", this).text();
            let pubDate = $("pubDate", this).text();
            let imageurl = $("enclosure", this).attr("url");

            //IF THE XML DOESN'T USE ENCLOSURE, SEARCH FOR MEDIA:THUMBNAIL AND SET IMAGEURL VARIABLE
            if(imageurl == null) {
                imageurl = $("media\\:thumbnail", this).attr("url");
            }
            //IF IMAGE-URL DOESN'T EXCIST - SET IMAGE TO 'IMAGE NOT FOUND' PLACEHOLDER
            if(imageurl.length == 0) {
                imageurl = imgNotFound;
            }

            //SET AND APPEND ARTICLES TO htmlText variable
            htmlText += `
                
                <article class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2">
                    <p class="mb-1">${pubDate}</p>
                    <a href="${link}">
                        <img src="${imageurl}" class="img-fluid" alt="${title}" />
                        <h5 class="mt-2">${title}</h5>
                    </a>
                    <p>${description}</p>
                </article>
                
            `;
        }) //end newsXML.find function

        //APPEND VARIABLE htmlText to div #articles
        $("#articles").html(htmlText);

    }) //end done
    .fail(function(){
        alert("News could not be loaded.");
    }) //end fail
}