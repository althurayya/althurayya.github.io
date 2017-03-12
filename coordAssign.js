/**
 *
 */
//d3.json("Muqaddasi_all_shortest_paths.json", function(error, data) {
d3.text("Muqaddasi_all_shortest_paths_noDuplicates.txt", function(error, data) {
    //console.log(JSON.stringify(d3.csv.parseRows(data)[0]))
    var newURIs = {};
    var pathsLen = d3.csv.parseRows(data).length;
    var i, j, source, destination;
    d3.select("#listPath_btn").on("click", function(){
        i = d3.select('#path_index').property("value");
        var path = d3.csv.parseRows(data)[i];
        //j = d3.select('#dest_index').property("value");
        //
        //if (i == null || i == ""|| i >= sourceLen)
        //    i= 0;
        //source = Object.keys(data)[i];
        //
        //if (j == null || j == "" || j >= Object.keys(data[source]))
        //    j = 0;
        //destination = Object.keys(data[source])[j];
        d3.select("#pathsDiv").style("display", "block");
//d3.select("#saveToFile_btn").style("display", "block");
        listPathFromText (path);
    });
    d3.select("#pathsDiv")
        //.select("ul")
        .append("input")
        .attr("type", "button")
        .attr("id", "findPath_btn")
        .attr("value", "Show path!")
        .style("display", "inline")
        .on('click', function () {
            var tmp = d3.select('#source_select').property('value');
            var s = tmp.split(",")[0];
            tmp = d3.select('#dest_select').property('value');
            var e = tmp.split(",")[0];
            // First argument in function is the source value, which is the main parent node (li).
            // We filter the content and get node type 3 to prevent getting the children
            // while getting the parent's value.
            findPathConsideringIntermediates(s, e, "");
        });

    d3.select("#pathsDiv")
        //.select("ul")
        .append("input")
        .attr("type", "button")
        .attr("id", "submitURIs_btn")
        .attr("value", "Assign URIs!")
        .style("display", "inline-block")
        .on('click', function () {
            var texts = d3.selectAll('Input[id^="text_"]')
            texts.each(function () {
                var arabicName = d3.select(this.parentNode).text();
                var cornuTopUri = d3.select(this).property("value");
                if (!(arabicName in newURIs) && cornuTopUri !== "") {
                    newURIs[arabicName] = cornuTopUri;
                    localStorage.setItem(arabicName, cornuTopUri);
                }
            });
            d3.select("#saveToFile_btn").style("display", "block")
        });
    d3.select("#pathsDiv")
        //.select("ul")
        .append("input")
        .attr("type", "button")
        .attr("id", "nxtPath_btn")
        .attr("value", "Next Path!")
        .style("display", "inline-block")
        .on('click', function () {
            i++;
            //var destLen = Object.keys(data[source]).length;
            d3.select("#path_index").property("value", i);
            //d3.select("#dest_index").property("value", j);
            //nextPath(i, j, source, destination, sourceLen, destLen, data[source][destination])
            if (i < pathsLen) {
                path = d3.csv.parseRows(data)[i];
                //source = Object.keys(data)[i];
                listPathFromText(path);
            }
            //else if (j >= destLen && i < sourceLen){
            //    j = 0;
            //    i++;
            //    source = Object.keys(data)[i];
            //    destination = Object.keys(data[source])[j];
            //    listPathFromText(source, destination, data[source][destination]);
            //}
            else if (i >= pathsLen){
                d3.select("#pathsDiv").html("");
                d3.select("#pathsDiv").append("p")
                    .text("No more paths to show!");
                d3.select("#saveToFile_btn").style("display", "none");
            }
        });
    d3.select("#saveToFile_btn").on("click", function () {
        saveNewUrisToFile(newURIs);
    });
});

function change(type) {
    selectValue = d3.select('#' + type + '_select').property('value');
};

d3.json('testURIs.json',function(error,data) {
    if(localStorage.length == 0) {
        Object.keys(data).forEach(function (key) {
            localStorage.setItem(key, data[key]);
        });
    }
});

function listPathFromText (stops) {
    var coordPattern = /_\d{3}\w\d{3}\w_/;

    d3.select("#listDiv").html("");
    d3.select("#pathsDiv")
        .insert("div",":first-child")
        .attr('id', "listDiv")
        .append("ul").attr("id", "ul_source");
    var any_unavailable_coord = false;
    //.append("li").attr("id", "source").text(source);
    for (var i = 0; i < stops.length; i++) {
        var str = stops[i];
        d3.select("#ul_source")
            .append("li").attr("id", "stop_" + i)
            .text(str);
        var n = str.search(coordPattern);
        if (n == -1) {
            d3.select("#stop_" + i)
                .append("input")
                .attr("type", "text")
                .attr("id", "text_" + i)
                .on("focus", function() {
                    d3.select(this).property("value", clicked_lat+","+clicked_lng)
                });
            if (localStorage.getItem(str) !== null) {
                d3.select("#text_"+i)
                    .attr("value", localStorage.getItem(str))
            } else {
                any_unavailable_coord = true;
            }
        }
    }
    //if(!any_unavailable_coord) {
    //}
    var selectSource = selectStop("source_select", "source")
        ,sourceOptions = selectSource.selectAll('option').data(stops); // Data join
    // Enter selection
    sourceOptions.enter().append("option").text(function (d) {
        return d;
    });

    var selectDest = selectStop("dest_select", "dest")
        ,destOptions = selectDest.selectAll('option').data(stops); // Data join
    // Enter selection
    destOptions.enter().append("option").text(function (d) {
        return d;
    });
}

var selectStop = function(id, type) {
    return d3.select("#ul_source")
        .append("select").attr("id", id)
        .style("display", "block")
        .on("change", function () {
            change(type);
        })

}
d3.select("#saveToFile_btn").on("click", function () {
    saveNewUrisToFile(this, "clicked");
});
function saveNewUrisToFile(newUris) {
    //localStorage.clear();
    var blob = new Blob([JSON.stringify(JSON.stringify(localStorage))],
        {type: "text/plain;charset=utf-8"});
    saveAs(blob, "testURIs.json");
}
//$('Input[id^="text_"]').on('focus', function() {
//    console.log(this.id);
//}).on('blur', function() {
//    console.log(this.id);
//});
$(':focus').attr("value", clicked_lat+","+clicked_lng)
var active_text = document.activeElement.id;

function nextPath(sourceIndex, destIndex, source, destination, sourceLen, destLen, data){
    //console.log("data: "+data)
    if (destIndex < destLen && sourceIndex < sourceLen) {
        destination = Object.keys(data[source])[destIndex];
        //source = Object.keys(data)[i];
        listPathFromText(source, destination, data[source][destination]);
    }
    else if (destIndex >= destLen && sourceIndex < sourceLen){
        destIndex = 0;
        sourceIndex++;
        source = Object.keys(data)[sourceIndex];
        destination = Object.keys(data[source])[destIndex];
        listPathFromText(source, destination, data);
    }
    else if (destIndex >= destLen && sourceIndex >= sourceLen){
        d3.select("#pathsDiv").html("");
        d3.select("#pathsDiv").append("p")
            .text("No more paths to show!");
        d3.select("#saveToFile_btn").style("display", "none");
    }
}