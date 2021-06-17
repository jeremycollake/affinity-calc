<?php
function cpu_affinity_calculator($atts) {
	$atts = array_change_key_case((array)$atts, CASE_LOWER);
	$rows = shortcode_atts(array('rows' => '8',), $atts)["rows"];

	$dir = str_replace($_SERVER['DOCUMENT_ROOT'], "", __DIR__);
	$ret = "<script src=\"$dir/affinity-calc.js\" type=\"text/javascript\"></script>"
		. "<table class=\"table table-striped\">";

	for($cur_row=0;$cur_row<$rows;$cur_row++) {
		$ret .= "<tr>";
		for($cur_col=0;$cur_col<(64/$rows);$cur_col++) {
			$cpu = ($cur_col*$rows)+$cur_row;
			$ret .= sprintf("<td><input type=\"checkbox\" id=\"cpu%d\" name=\"cpu%d\" onclick=\"cpuCheck_event()\" class=\"cpu_selector\"> <label for=\"cpu%d\">CPU %d</label></td>", $cpu, $cpu, $cpu, $cpu);
		}
		$ret .= "</tr>";
	}
	$ret .= "</table>"
		. "<input type=\"button\" value=\"invert\" id=\"btnInvert\" onclick=\"invert_event()\">"
		. "<input type=\"button\" value=\"clear\" id=\"btnClear\" onclick=\"clear_event()\">"
		. "<br />"
		. "<label for=\"mask_hex\">CPU Affinity Bitmask (hex):</label> <input type=\"text\" size=\"26\" id=\"mask_hex\" name=\"mask_hex\" onchange=\"cpuMask_event()\">";
	return $ret;
}
?>