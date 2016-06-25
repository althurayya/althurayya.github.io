# holder.py 
# global variables used for formatting KML files. 

kmlHolder ="""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<!-- http://alraqmiyyat.org/projects/ -->
<!-- caution! this is work in progress -->
<Document>
  <!-- Begin Style Definitions -->
      <ScreenOverlay>
         <name>Maxim Romanov 2013</name>
         <Icon> <href>http://alraqmiyyat.org/logo/RMb.png</href></Icon>
         <overlayXY x="0" y="1" xunits="fraction" yunits="fraction"/>
         <screenXY x="0.01" y=".99" xunits="fraction" yunits="fraction"/>
         <rotationXY x="0" y="0" xunits="fraction" yunits="fraction"/>
         <size x="40" y="54" xunits="pixels" yunits="pixels"/>
      </ScreenOverlay>
     
      <Style id="capital">
        <IconStyle>
          <color>ff1478FF</color>
          <scale>1</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/city.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <scale>1</scale>
        </LabelStyle>
      </Style>

      <Style id="provcap">
        <IconStyle>
          <color>ff1478FF</color>
          <scale>.75</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/city.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <scale>0.75</scale>
        </LabelStyle>
      </Style>      

      <Style id="settl">
        <IconStyle>
          <color>ff1478FF</color>
          <scale>.5</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/city.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <scale>0.75</scale>
        </LabelStyle>
      </Style>

      <Style id="castle">
        <IconStyle>
          <color>ff1478FF</color>
          <scale>0.5</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/castleA.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <scale>0.75</scale>
        </LabelStyle>
      </Style>

      <Style id="battle">
        <IconStyle>
          <color>ff1400FA</color>
          <scale>1</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/battleA.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <scale>0.75</scale>
        </LabelStyle>
      </Style>

      <Style id="rPoint">
        <IconStyle>
          <color>ff143CB4</color>
          <scale>.25</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/town.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <color>ff143CB4</color>
          <scale>0.5</scale>
        </LabelStyle>
      </Style>

      <Style id="island">
        <IconStyle>
          <color>ffFF7800</color>
          <scale>.5</scale>
          <Icon>
             <href>http://alraqmiyyat.org/icons/city.png</href>
          </Icon>
        </IconStyle>
        <LabelStyle>
          <color>ffFF7800</color>
          <scale>0.75</scale>
        </LabelStyle>
      </Style>

    <Style id="province1">
            <IconStyle>
                    <Icon>
                    </Icon>
            </IconStyle>
            <LabelStyle>
            <scale>1.25</scale>
            </LabelStyle>
            <ListStyle>
            </ListStyle>
    </Style>
    <Style id="province2">
            <IconStyle>
                    <Icon>
                    </Icon>
            </IconStyle>
            <LabelStyle>
            <scale>1.25</scale>
            </LabelStyle>
            <ListStyle>
            </ListStyle>
    </Style>
    <StyleMap id="province">
            <Pair>
                    <key>normal</key>
                    <styleUrl>#province1</styleUrl>
            </Pair>
            <Pair>
                    <key>highlight</key>
                    <styleUrl>#province2</styleUrl>
            </Pair>
    </StyleMap>


    <Style id="jund1">
            <IconStyle>
                    <Icon>
                    </Icon>
            </IconStyle>
            <LabelStyle>
            <color>ffFF78B4</color>
            <scale>1</scale>
            </LabelStyle>
            <ListStyle>
            </ListStyle>
    </Style>
    <Style id="jund2">
            <IconStyle>
                    <Icon>
                    </Icon>
            </IconStyle>
            <LabelStyle>
            <color>ffFF78B4</color>
            <scale>1</scale>
            </LabelStyle>
            <ListStyle>
            </ListStyle>
    </Style>
    <StyleMap id="jund">
            <Pair>
                    <key>normal</key>
                    <styleUrl>#jund1</styleUrl>
            </Pair>
            <Pair>
                    <key>highlight</key>
                    <styleUrl>#jund2</styleUrl>
            </Pair>
    </StyleMap>


    <Style id="region1">
            <IconStyle>
                    <Icon>
                    </Icon>
            </IconStyle>
            <LabelStyle>
            <color>ff14E7FF</color>
            <scale>.8</scale>
            </LabelStyle>
            <ListStyle>
            </ListStyle>
    </Style>
    <Style id="region2">
            <IconStyle>
                    <Icon>
                    </Icon>
            </IconStyle>
            <LabelStyle>
            <color>ff14E7FF</color>
            <scale>.8</scale>
            </LabelStyle>
            <ListStyle>
            </ListStyle>
    </Style>
    <StyleMap id="region">
            <Pair>
                    <key>normal</key>
                    <styleUrl>#region1</styleUrl>
            </Pair>
            <Pair>
                    <key>highlight</key>
                    <styleUrl>#region2</styleUrl>
            </Pair>
    </StyleMap>
    

      	<Style id="route">
		<IconStyle>
			<Icon>
			</Icon>
		</IconStyle>
		<LineStyle>
			<color>ff143CB4</color>
			<width>4</width>
		</LineStyle>
	</Style>
      
  <!-- End Style Definitions -->

   <Folder>
      <name>Georeferences Toponyms from Brill's Atlas of Islam</name>
      %s   
   </Folder>

   <Folder>
      <name>Routes</name>
      %s
   </Folder>
   
</Document>
</kml>"""

placemarkHolder = """
 <Placemark>
    <name>%s</name>
    <description><![CDATA[
    <b>URI:</b> %s <br>

    <h1>HAI-Online</h1>
    <b>Source:</b> HAI-Online<br>
    <b>Toponym:</b> %s<br>
    <b>Toponym Type:</b> %s<br>
    <b>Coordinates:</b> %s<br>
    (<b>NB: coordinates are approximate!</b>)<br>
    <b>Source Map:</b> %s<br>
    <b>Source Map Sector:</b> %s<br>
    <b>Procedural:</b> Georeferenced with QGIS from <b>HAI-Online</b><br>
    <b>HAI-Online</b>: <i>An Historical Atlas of Islam</i>.
    Edited by: Hugh Kennedy. Brill Online, 2013. Reference.<br>
    Tufts University.
    26 November 2013 <a href="http://referenceworks.brillonline.com/entries/historical-atlas-of-islam/">http://referenceworks.brillonline.com</a>
    ]]></description>
    <styleUrl>#%s</styleUrl>
    <Point>
       <coordinates>%s,0</coordinates>
    </Point>
 </Placemark>
"""

routeHolder = """
	<Placemark>
		<name>%s</name>
                <description><![CDATA[
                <h1>HAI-Online</h1>
                <b>Source:</b> HAI-Online<br>
                (<b>NB: Route is a straight line between two points!</b>)<br>
                <b>Source Map:</b> %s<br>
                <b>Procedural:</b> Georeferenced with QGIS from <b>HAI-Online</b><br>
                <b>HAI-Online</b>: <i>An Historical Atlas of Islam</i>.
                Edited by: Hugh Kennedy. Brill Online, 2013. Reference.<br>
                Tufts University.
                26 November 2013 <a href="http://referenceworks.brillonline.com/entries/historical-atlas-of-islam/">http://referenceworks.brillonline.com</a>
                ]]></description>		
		<styleUrl>#route</styleUrl>
		<LineString>
			<extrude>1</extrude>
			<tessellate>1</tessellate>
			<coordinates>
			   %s
			</coordinates>
		</LineString>
	</Placemark>
"""

pelagiosHead="""
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix osgeo: <http://data.ordnancesurvey.co.uk/ontology/geometry/> .
@prefix pelagios: <http://pelagios.github.io/vocab/terms#> .
@prefix pleiades: <http://pleiades.stoa.org/places/vocab#> .
@prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix spatial: <http://geovocab.org/spatial#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
"""

pelagiosPlace="""
<http://www.alraqmiyyat.org/althurayya/%s> a pelagios:PlaceRecord ; # URI
  dcterms:title "%s" ; # transliterated toponym
  dcterms:description "%s" ; # category of toponym
  dcterms:subject <http://pleiades.stoa.org/vocabularies/place-types/settlement> ;
  # a list of different spellings
  %s
  pleiades:hasLocation [ geo:lat "%s"^^xsd:double ; geo:long "%s"^^xsd:double ] ; # coordinates
  .
"""

pleiadesName = 'pleiades:hasName [ rdfs:label "%s" ] ; #%s'

jsonPlaceHolder = """
var places = { data:[
%s
]}
"""

jsonPlaceItem = '''{
    "source": "%s",
    "lat": %s,
    "lon": %s,
    "value": 1,
    "arTitle": "%s",
    "arBW": "%s",
    "translitTitle": "%s",
    "UStranslitTitle": "%s",
    "translitSimpleTitle": "%s",
    "eiSearch" : "%s",
    "topType": "%s",
    "topURI": "%s",
    },''' # sourceMap, lat, lon, arabic, buckwalter, translit, UStranslitTitle, translitSimple (for search), topType, topURI

jsonRouteHolder = """
var routes = { data:[
%s
]}
"""

jsonEditedRouteHolder = """
var routesEditedData = { data:[
%s
]}
"""

jsonRouteItem = '''{
    "RouteID" : "%s",
    "type": "LineString",
    "coordinates": [%s],
    },''' # routeID, type (?), array of coordinates
