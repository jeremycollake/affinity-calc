// CPU affinity mask calculator (see affinity-calc.php).
// A mask is a 64-bit number where bit N selects logical processor N. BigInt keeps all 64 bits exact.
(function () {
	'use strict';

	var MAX = 64;
	var COUNTS = [1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64];
	var MAX_MASK = (1n << 64n) - 1n;

	function detectedCount() {
		var n = navigator.hardwareConcurrency;
		return Number.isInteger(n) && n >= 1 && n <= MAX ? n : 0;
	}

	function highestBit(m) {
		return m === 0n ? -1 : m.toString(2).length - 1;
	}

	function parseHex(text) {
		var s = text.trim().replace(/^0x/i, '').replace(/[\s_,]/g, '');
		if (s === '') {
			return 0n;
		}
		if (!/^[0-9a-f]{1,16}$/i.test(s)) {
			return null;
		}
		return BigInt('0x' + s);
	}

	function parseDec(text) {
		var s = text.trim().replace(/[\s_,]/g, '');
		if (s === '') {
			return 0n;
		}
		if (!/^[0-9]{1,20}$/.test(s)) {
			return null;
		}
		var m = BigInt(s);
		return m > MAX_MASK ? null : m;
	}

	function copyText(text, button) {
		var done = function () {
			var old = button.textContent;
			button.textContent = 'Copied';
			setTimeout(function () { button.textContent = old; }, 1500);
		};
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(done, function () {});
		}
	}

	function init(root, useHash) {
		var boxes = Array.prototype.slice.call(root.querySelectorAll('input.acx-cpu'));
		var countSel = root.querySelector('.acx-count');
		var hexIn = root.querySelector('.acx-hex');
		var decIn = root.querySelector('.acx-dec');
		var progIn = root.querySelector('.acx-prog');
		var cmdOut = root.querySelector('.acx-cmd');
		var status = root.querySelector('.acx-status');
		var err = root.querySelector('.acx-err');
		var detected = detectedCount();
		var count = 0;

		// Processor count choices, marking the one the browser reports for this device.
		var counts = COUNTS.slice();
		if (detected && counts.indexOf(detected) === -1) {
			counts.push(detected);
			counts.sort(function (a, b) { return a - b; });
		}
		counts.forEach(function (n) {
			var o = document.createElement('option');
			o.value = String(n);
			o.textContent = n === detected ? n + ' (this device)' : String(n);
			countSel.appendChild(o);
		});

		function mask() {
			var m = 0n;
			boxes.forEach(function (b, i) {
				if (b.checked) {
					m |= 1n << BigInt(i);
				}
			});
			return m;
		}

		function setCount(n) {
			count = n;
			countSel.value = String(n);
			boxes.forEach(function (b, i) {
				var off = i >= n;
				b.parentNode.hidden = off;
				if (off) {
					b.checked = false;
				}
			});
		}

		// Show enough processors for every bit of a typed or linked mask.
		function fitCount(m) {
			var need = highestBit(m) + 1;
			if (need > count) {
				var next = counts.filter(function (n) { return n >= need; })[0] || MAX;
				setCount(next);
			}
		}

		function setMask(m) {
			fitCount(m);
			boxes.forEach(function (b, i) {
				b.checked = ((m >> BigInt(i)) & 1n) === 1n;
			});
		}

		function showError(text) {
			err.textContent = text;
			err.hidden = !text;
		}

		function render(source) {
			var m = mask();
			var hex = '0x' + m.toString(16).toUpperCase();
			if (source !== 'hex') {
				hexIn.value = hex;
			}
			if (source !== 'dec') {
				decIn.value = m.toString(10);
			}
			cmdOut.textContent = 'start /affinity ' + hex + ' ' + (progIn.value.trim() || 'program.exe');
			var selected = boxes.filter(function (b) { return b.checked; }).length;
			status.textContent = selected + ' of ' + count + ' logical processors selected';
			if (useHash && window.history && history.replaceState) {
				var base = location.pathname + location.search;
				history.replaceState(null, '', m === 0n ? base : base + '#mask=' + hex);
			}
		}

		var actions = {
			all: function () { boxes.forEach(function (b, i) { b.checked = i < count; }); },
			none: function () { boxes.forEach(function (b) { b.checked = false; }); },
			invert: function () { boxes.forEach(function (b, i) { b.checked = i < count ? !b.checked : false; }); },
			even: function () { boxes.forEach(function (b, i) { b.checked = i < count && i % 2 === 0; }); },
			odd: function () { boxes.forEach(function (b, i) { b.checked = i < count && i % 2 === 1; }); }
		};

		root.addEventListener('click', function (e) {
			var btn = e.target.closest('button');
			if (!btn || !root.contains(btn)) {
				return;
			}
			if (btn.dataset.action && actions[btn.dataset.action]) {
				actions[btn.dataset.action]();
				showError('');
				render();
			} else if (btn.dataset.copy) {
				var text = btn.dataset.copy === 'hex' ? hexIn.value : btn.dataset.copy === 'dec' ? decIn.value : cmdOut.textContent;
				copyText(text, btn);
			}
		});

		root.querySelector('.acx-grid').addEventListener('change', function () {
			showError('');
			render();
		});

		countSel.addEventListener('change', function () {
			setCount(parseInt(countSel.value, 10));
			showError('');
			render();
		});

		hexIn.addEventListener('input', function () {
			var m = parseHex(hexIn.value);
			if (m === null) {
				showError('Enter a hexadecimal mask of up to 16 digits, such as 0xFF.');
				return;
			}
			showError('');
			setMask(m);
			render('hex');
		});

		decIn.addEventListener('input', function () {
			var m = parseDec(decIn.value);
			if (m === null) {
				showError('Enter a decimal mask from 0 to 18446744073709551615.');
				return;
			}
			showError('');
			setMask(m);
			render('dec');
		});

		progIn.addEventListener('input', function () { render('prog'); });

		// Start with this device's processor count (or all 64), then any mask from a shared link.
		setCount(detected || MAX);
		var linked = useHash ? /^#mask=(?:0x)?([0-9a-f]{1,16})$/i.exec(location.hash) : null;
		if (linked) {
			setMask(BigInt('0x' + linked[1]));
		}
		render();
	}

	function start() {
		Array.prototype.forEach.call(document.querySelectorAll('.acx'), function (root, i) {
			init(root, i === 0);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start);
	} else {
		start();
	}
})();
