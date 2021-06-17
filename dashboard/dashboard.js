var camera = L.layerGroup();
var storm = L.layerGroup();
var stormConnector = L.layerGroup();

var LeafIcon = L.Icon.extend({
    options: {
       iconSize: [30, 25]
    }
});
var addressPoints = [
[37.33599088459085, -121.90100678702434, "500"],
[37.336043, -121.901061, "5000"],
[37.336046, -121.901052, "500"],
[37.336048, -121.901043, "1300"],
[37.336049, -121.901024, "500"],
[37.336051, -121.901015, "123"],
[37.336054, -121.900997, "123"],
[37.336056, -121.900984, "590"],
[37.33605, -121.900961, "5000"],
[37.336062, -121.900937, "121"],
[37.336061, -121.900929, "200"],
[37.336065, -121.900906, "200"],
[37.336073, -121.900865, "200"],
[37.336062, -121.900937, "200"],
[37.336061, -121.900929, "200"],
[37.336065, -121.900906, "200"],
[37.336163, -121.899727, "200"],
[37.336291, -121.898621, "200"],

[37.33613094475551, -121.9007880867161, "200"],
[37.33622712496456, -121.8997289866019, "200"],
[37.33648326466506, -121.89875058684619, "123"]

];
addressPoints = addressPoints.map(function (p) { return [p[0], p[1]]; });
var heat = L.heatLayer(addressPoints, { radius: 20 });

// San Jose City owned traffic camera data
// Get data from https://gisdata-csj.opendata.arcgis.com/datasets/city-owned-traffic-signals/geoservice?geometry=-122.459%2C37.176%2C-121.592%2C37.367
var cameraIcon = new LeafIcon({iconUrl: 'images/cctv-icon.png'});

for ( var i=0; i < cameraLocation.features.length; ++i )
{
	var slideshowContent = '';
	var maxNumber1 = Math.floor(Math.random() * 6);
	var maxNumber2 = Math.floor(Math.random() * 6);
	//slideshowContent += "<div class=\"main\" ><b>"+ cameraLocation.features[i].attributes.INTERSECTIONNAME1 + "</b></br><img class=\"imaging\" src=\"images/"+maxNumber1+".jfif\"></img></br>";
	//slideshowContent += "</br><img class=\"imaging\" src=\"images/"+maxNumber2+".jfif\"></img></br></div>";
	//slideshowContent += cameraLocation.features[i].geometry.y +":: "+ cameraLocation.features[i].geometry.x;
	slideshowContent += "<div class=\"main\" ><b>"+ cameraLocation.features[i].attributes.INTERSECTIONNAME1 + "</b></br><img class=\"imaging\" src=\"images/flood/flood"+maxNumber1+".png\"></img></br>";
	slideshowContent += "</br><img class=\"imaging\" src=\"images/flood/flood"+maxNumber2+".png\"></img></br></div>";

	L.marker( [cameraLocation.features[i].geometry.y, cameraLocation.features[i].geometry.x], {icon: cameraIcon} )
	  .bindPopup(slideshowContent)
	  .addTo( camera );
};

LeafIcon = L.Icon.extend({
    options: {
       iconSize: [15, 15]
    }
});

// San Jose Strom Manholes
for ( var i=0; i < stormManHoles.features.length; ++i )
{
	var popupData = "<b>Facility ID :</b>"+ stormManHoles.features[i].properties.FACILITYID +
				"</br><b> DEM Elevation :</b>" + stormManHoles.features[i].properties.DEMELEV +
				"</br><b> Rim Elevation :</b>" + stormManHoles.features[i].properties.RIMELEV +
				"</br><b> Invert Elevation :</b>" + stormManHoles.features[i].properties.INVERTELEV +
				"</br><b> Manhole Type :</b>" + stormManHoles.features[i].properties.MHTYPE +
				"</br><b> Cover Type :</b>" + stormManHoles.features[i].properties.CVTYPE +
				"</br><b> Wall Material :</b>" + stormManHoles.features[i].properties.WALLMAT +
				"</br><b> Owned By :</b>" + stormManHoles.features[i].properties.OWNEDBY +
				"</br><b> Lat long :</b>" + stormManHoles.features[i].geometry.coordinates[1] +" , "+ stormManHoles.features[i].geometry.coordinates[0]

   L.circleMarker( [stormManHoles.features[i].geometry.coordinates[1], stormManHoles.features[i].geometry.coordinates[0]], {color: '#2E511D', radius: 5} )
	  .bindPopup( "<b>Storm Manhole</b></br>"+ popupData )
	  .addTo( storm );
}


var polylinePoints;
var arrow;
// Storm Gravity main data
for ( var i=0; i < stormGravity.features.length; ++i )
{
	var tmpPath = stormGravity.features[i].geometry.coordinates;
	var polyLineArray=[];
	for ( var j=0; j < tmpPath.length; j++ )
	{
		polyLineArray.push(tmpPath[j].reverse());
	}
	arrow = L.polyline(polyLineArray, {color: '#44B50D'}).addTo( stormConnector );
	L.polylineDecorator(arrow, {
		patterns: [
			{offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true, color: '#44B50D'}})}
		]
    }).addTo(stormConnector);
}

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
	streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

var map = L.map('map', {
	fullscreenControl: true,
	center: [37.33667553597995 , -121.88952448518998],
	zoom: 15,
	layers: [streets]
});
map.addLayer(heat);
var baseLayers = {
	"Streets": streets,
	"Grayscale": grayscale
};

var overlays = {
	"Cameras": camera,
	"Storm holes" : storm,
	"Storm Pipes" : stormConnector
};

L.control.layers(baseLayers, overlays).addTo(map);