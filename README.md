# Building al-Ṯurayyā 1.0

## Features:

### Technical

1. Data:
	1. Split/Rejoin Toponyms (Split: `./places/`)
	2. Split/Rejoin Routes (Split: `./routes/`)
	3. Scripts for doing this in `./scripts/`
	4. Workflow: Edit individual GEOJSON files > reassemble into one master file (one for places, one for routes — or, perhaps, one that has both?!)

1. Flap:
	1. ~~Information on the project~~
	2. Information on a toponym: Search modern references
		1. A short blob from some resource?
		2. Check modern references for a TOPONYM:
			1. `http://referenceworks.brillonline.com/search?s.q=` + TOPONYM + `baghdad&s.f.s2_parent=&search-go=Search` (this can be also made resource specific)
			2. `http://referenceworks.brillonline.com/search?s.q=` + TOPONYM + `&s.f.s2_parent=s.f.cluster.Encyclopaedia+of+Islam&search-go=Search`
			3. `http://www.iranicaonline.org/articles/search/keywords:` + TOPONYM
			4. `https://en.wikipedia.org/wiki/Special:Search/` + TOPONYM
			5. Additionally, searches for the REGION to which a TOPONYM belongs
	3. Information on a toponym: Classical references
		1. List of sources to check:
			1. `0561Samcani.Ansab` (NIS)
			2. `0900AbuCabdAllahHimyari.RawdMictar` (TOP)
			2. `0911Suyuti.LubbLubab` (NIS)
		1. Pulling MD files from `github` by URI links
		2. Manually align...
		3. Additionally, searches for the REGION to which a TOPONYM belongs
	4. Regions:
		1. ~~List of regions~~
		2. Clicking on a region:
			1. Places and routes associated with that region become red
			2. Center on the selected region (use the metropole as a center point?)
			2. Other places and routes: grey and thinner
2. Map:
	1. ~~Multiple maping layers~~
	2. ~~Search for a toponym~~
	3. Visualizations of regions (see Flap)
	2. Toponyms formatted according to their types
		1. Settlements: a) different sizes --- sized by types; b) names shown depending on the zoom level; c) colored by regions
			1. Metropoles : original level zoom
			2. Capitals : original level zoom + 1
			3. Towns: original level zoom + 2
			4. Villages: original level zoom + 3
			5. Waystations: original level zoom + 4
		2. Geographical features:
			1. Bodies of waters: Blue 
			2. Mountains: Brown
			3. Regions: Dark green
		3. Routes:
			1. ~~colored by regions~~

# Other things:

1. Places (circles) must be drawn over the routes, not the other way around (i.e., places layer to be added after the routes layer)
2. When a region is selected > center on it (metropole/capital of the region?); specific coordinates and zoom level? (can be stored in `index.js`)


# Flap viz

## Flap: English Information of a Toponym

### Toponym: Tarablus

*Ṭarābulus (or Aṭrābulus) al-S̲h̲ām*
(2,111 words)
, the Greek Tripolis, called “of Syria” in the Arabic sources to distinguish it from Ṭarābulus al-G̲h̲arb [q.v.] “of the West”, Tripoli in Libya, an historic town of the Mediterranean coast of the Levant, to the north of D̲j̲ubayl and Batrūn [q.vv.]. It lies partly on and partly beside a hill at the exit of a deep ravine through which flows a river, the Nahr Ḳadīs̲h̲a (Arabic, Abū ʿAlī). West of it stretches a very fertile plain covered with woods, which terminate in a peninsula on which lies the port of al-Mīnā. The harbour is protected by a series of rocky islets lying in front of it and by the remains of an old wall.

* Further :
	* Link to E of Islam (link to the article; search link)
	* Link to Iranica (search link)
	* Link to Wikipedia (search link)
	* Link to Pleiades (search link)


## Flap: Primary Sources

### Toponym: Trablus (in Arabic)

**List of sources**:
* Yaqut's Mu'jam al-Buldan
	* option1 > expanding and showing the actual text
	* option2 > expanding and showing the actual text
* Sam`ani's Ansab
	* option1 >
	* option2 >