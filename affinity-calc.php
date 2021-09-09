<?php
function cpu_affinity_calculator($atts) {
	$atts = array_change_key_case((array)$atts, CASE_LOWER);
	$rows = shortcode_atts(array('rows' => '8',), $atts)["rows"];

	$dir = str_replace($_SERVER['DOCUMENT_ROOT'], "", __DIR__);
	$ret = "<script src=\"$dir/affinity-calc.js?ver=09092021000\" type=\"text/javascript\"></script>"
		. "<table class=\"table table-striped\">";

	for($cur_row=0;$cur_row<$rows;$cur_row++) {
		$ret .= "<tr>";
		for($cur_col=0;$cur_col<(64/$rows);$cur_col++) {
			$cpu = ($cur_col*$rows)+$cur_row;
			$ret .= sprintf("<td><input type=\"checkbox\" id=\"cpu%d\" name=\"cpu%d\" onclick=\"AffinityCalc.cpuCheck_event()\" class=\"cpu-checkbox\"> <label for=\"cpu%d\">CPU %d</label></td>", $cpu, $cpu, $cpu, $cpu);
		}
		$ret .= "</tr>";
	}
	$ret .= "</table>"
		. "<input type=\"button\" value=\"invert\" id=\"btnInvert\" onclick=\"AffinityCalc.invert_event()\">"
		. "<input type=\"button\" value=\"clear\" id=\"btnClear\" onclick=\"AffinityCalc.clear_event()\">"
		. "<br />"
		. "<label for=\"mask-hex\">CPU Affinity Bitmask (hex):</label> <input type=\"text\" size=\"26\" id=\"mask-hex\" name=\"mask-hex\" onchange=\"AffinityCalc.cpuMask_event()\">";
	return $ret;
}
?>