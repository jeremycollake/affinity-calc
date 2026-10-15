# affinity-calc
Web CPU affinity mask calculator.

Part of the Bitsum WordPress plug-in, facilitating customizations for internal use.

## Use:
[cpu_affinity_calculator]

- affinity-calc.php is the WordPress shortcode (the old rows="N" attribute is still accepted)
- affinity-calc.js does the math (64-bit masks with BigInt)
- affinity-calc.css is the styling (light and dark)

Features: logical processor count (detected from the browser, adjustable), quick select (All, None, Invert, Even, Odd), live hex and decimal masks that can be typed in either form, a ready-to-copy `start /affinity` command, and shareable links (`#mask=0x55500`).

This is hosted at https://bitsum.com/tools/cpu-affinity-calculator/

(c)2019 Jeremy Collake <jeremy@bitsum.com>
