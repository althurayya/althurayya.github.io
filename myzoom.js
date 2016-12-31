/**
 * Created by rostam on 09.09.16.
 */
var indZoom = {};
var mintsize,maxtsize;
function index_zoom(markers,type_size) {
    Object.keys(markers).forEach(function (key) {
        var size=type_size[marker_properties[key].type];
        if(indZoom[size] == undefined) indZoom[size] = [];
        indZoom[size].push(key);
    });
    //mintsize = Math.min(Object.values(type_size));
    //maxtsize = Math.max(Object.values(type_size));
}


/*
 * Show/Hide the labels based on the zoom level.
 */
function myzoom() {
    var currentZoom = map.getZoom();
    if(currentZoom - prevZoom < 0) {
        var comp_size = Math.floor((max_zoom - currentZoom) / 2) + 1;
        comp_size -= 1;
        if(indZoom[comp_size]!=undefined) {
            indZoom[comp_size].forEach(function (iz) {
                markers[iz].setLabelNoHide(false);
            });
        }
    } else {
        var comp_size = Math.floor((max_zoom - currentZoom) / 2) + 1;
        if(indZoom[comp_size]!=undefined) {
            indZoom[comp_size].forEach(function (iz) {
                markers[iz].setLabelNoHide(true);
            });
        }
    }
    prevZoom = currentZoom;
}
