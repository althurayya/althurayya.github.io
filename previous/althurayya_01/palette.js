function palette() {
	var seeds = Array('00','CC','33','66','99','FF', 'F0', 'F8', 'C8', 'C0');
	var palette = [];
	for ( i=0; i<10; i++ ) {
		for ( j=0; j<10; j++ ) {
			for( k=0; k<10; k++ ) {
				palette.push( '#' + seeds[i] + seeds[j] + seeds[k] );
			}
		}
	}
	return palette
}  