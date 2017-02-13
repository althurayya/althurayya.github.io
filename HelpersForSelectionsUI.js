/**
 * Created by rostam on 31.10.16.
 */
var pathColors = {};
var itin_opts = ['Shortest', 'Optimal'];
var pathTypes = d3.set(itin_opts); // can add back 'Through Centers' eventually..
var pathInitialSelections = d3.set(itin_opts);
pathColors[itin_opts[0]] = '#f00';
pathColors[itin_opts[1]] = '#345C1D';

function selectionsUI(identifier, initialSelections, colors) {
    var space = d3.select(identifier).selectAll('input')
        .data(pathTypes.values())
        .enter().append("label");

    space.append("input")
        .attr('type', 'checkbox')
        .property('checked', function(d) {
            return initialSelections === undefined || initialSelections.has(d)
        })
        .attr("value", function(d) { return d });

    space.append("span")
        .attr('class', 'key')
        .style('background-color', function(d) { return colors[d] });

    space.append("span")
        .text(function(d) { return d })
        .attr("class", "english");
}
selectionsUI('#itinerary-options', pathInitialSelections, pathColors);

var selectedTypes = function(identifier) {
    return d3.selectAll('#' + identifier + ' input[type=checkbox]')[0].filter(function(elem) {
        return elem.checked;
    }).map(function(elem) {
        return elem.value;
    })
};