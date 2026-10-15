<?php
// CPU affinity mask calculator shortcode (cpu_affinity_calculator). Registered in bitsum-wp.php.
// Renders 64 logical processor toggles, quick-select buttons and live hex, decimal and command outputs;
// affinity-calc.js does the math and affinity-calc.css the styling.
// The old rows="N" attribute is still accepted; the grid now flows 8 processors per row.

define( 'AFFINITY_CALC_VER', '2026101501' ); // cache buster for the JS and CSS

function affinity_calc_enqueue() {
	wp_enqueue_style( 'affinity-calc', plugins_url( 'affinity-calc.css', __FILE__ ), array(), AFFINITY_CALC_VER );
	wp_enqueue_script( 'affinity-calc', plugins_url( 'affinity-calc.js', __FILE__ ), array(), AFFINITY_CALC_VER, true );
}

// Load the stylesheet in the head on pages that use the calculator, so it doesn't render unstyled first.
add_action( 'wp_enqueue_scripts', function () {
	if ( is_singular() && has_shortcode( (string) get_post_field( 'post_content', get_queried_object_id() ), 'cpu_affinity_calculator' ) ) {
		affinity_calc_enqueue();
	}
} );

function cpu_affinity_calculator( $atts ) {
	affinity_calc_enqueue();

	$quick = array(
		'all'    => 'All',
		'none'   => 'None',
		'invert' => 'Invert',
		'even'   => 'Even (0, 2, 4…)',
		'odd'    => 'Odd (1, 3, 5…)',
	);

	$ret  = '<div class="acx" data-max="64">';
	$ret .= '<div class="acx-top">';
	$ret .= '<label class="acx-count-label">Logical processors <select class="acx-count" aria-describedby="acx-count-hint"></select></label>';
	$ret .= '<div class="acx-quick" role="group" aria-label="Quick select">';
	foreach ( $quick as $action => $label ) {
		$ret .= sprintf( '<button type="button" class="acx-btn" data-action="%s">%s</button>', $action, $label );
	}
	$ret .= '</div></div>';
	$ret .= '<p class="acx-hint" id="acx-count-hint">Set this to the number of logical processors on the PC you are configuring.</p>';

	$ret .= '<div class="acx-grid">';
	for ( $cpu = 0; $cpu < 64; $cpu++ ) {
		$ret .= sprintf( '<label class="acx-chip"><input type="checkbox" class="acx-cpu" value="%1$d"><span>CPU %1$d</span></label>', $cpu );
	}
	$ret .= '</div>';
	$ret .= '<p class="acx-status" aria-live="polite"></p>';

	$ret .= '<div class="acx-out">';
	$ret .= '<div class="acx-row"><label for="acx-hex">Affinity mask (hex)</label><div class="acx-field"><input type="text" id="acx-hex" class="acx-hex" spellcheck="false" autocomplete="off" inputmode="text" value="0x0"><button type="button" class="acx-btn acx-copy" data-copy="hex">Copy</button></div></div>';
	$ret .= '<div class="acx-row"><label for="acx-dec">Decimal</label><div class="acx-field"><input type="text" id="acx-dec" class="acx-dec" spellcheck="false" autocomplete="off" inputmode="numeric" value="0"><button type="button" class="acx-btn acx-copy" data-copy="dec">Copy</button></div></div>';
	$ret .= '<p class="acx-err" role="alert" hidden></p>';
	$ret .= '<div class="acx-row"><label for="acx-prog">Program</label><div class="acx-field"><input type="text" id="acx-prog" class="acx-prog" spellcheck="false" autocomplete="off" value="notepad.exe"></div></div>';
	$ret .= '<div class="acx-row"><span class="acx-label">Command</span><div class="acx-field"><code class="acx-cmd">start /affinity 0x0 notepad.exe</code><button type="button" class="acx-btn acx-copy" data-copy="cmd">Copy</button></div></div>';
	$ret .= '</div>';
	$ret .= '<noscript><p class="acx-hint">The calculator needs JavaScript.</p></noscript>';
	$ret .= '</div>';
	return $ret;
}
