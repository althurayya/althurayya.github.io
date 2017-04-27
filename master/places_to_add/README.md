# Adding new toponyms

1. Make a copy of the `__template.json`
2. Fill in the blanks
3. Name the file with the URI of the place

## Processing

1. Script runs and validates each new file
2. If valid, adds it to the main toponym data file
3. Then, moves to `arc`.
4. Tada :)

## Comments:

1. Creating URI: (3 elements)
	1. simplified transliteration, capitalized (Lišbūnaŧ > LISHBUNA)
	2. `_`
	3. Coordinates:
		1. three numbers + E/W (longitude)
		2. three numbers + N/S (latitude)
		3. **NB:** choosing coordinate numbers: tens,ones.tenths > XXX; for example, Baghdad's coordinates are: 44.35 Lon, 33.35 Lat > becomes > 443E333N; another example, Lisbon's coordinates are: -9.14 Lon, 38.76 Lat > becomes > 091W387N
	4. `_`
	5. Type: `R` (region) or `S` (settlement)