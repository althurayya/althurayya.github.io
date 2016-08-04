# Building al-Ṯurayyā 1.0

## Features:

### Technical

1. CSS:
	1. Change main Latin font to `Brill` (?)
	2. Change Arabic font to `Amiri` (web-based)

1. Data:
	1. Split/Rejoin Toponyms (Split: `./places/`)
	2. Split/Rejoin Routes (Split: `./routes/`)
	3. Scripts for doing this in `./scripts/`
	4. Workflow: Edit individual GEOJSON files > reassemble into one master file (one for places, one for routes — or, perhaps, one that has both?!)

1. Flap:
	1. ~~Information on the project~~
	2. Information on a toponym
	3. Information from primary sources
	4. Regions:
		1. List of regions
		2. Clicking on a region:
			1. Places and routes associated with that region become red
			2. Other places and routes: grey and thinner
2. Map:
	1. ~~Multiple maping layers~~
	2. Search for a toponym
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
		3. Routes:
			1. colored by regions