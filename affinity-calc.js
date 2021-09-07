function pad0(num, width) {
    let zeros;
    for (let i = 0; i < width; i++) {
        zeros += "0";
    }
    return (zeros + num).substr(-width);
}

function long2hex(num) {
    return (pad0((num >>> 24).toString(16), 2) +
        pad0((num >> 16 & 255).toString(16), 2) +
        pad0((num >> 8 & 255).toString(16), 2) +
        pad0((num & 255).toString(16), 2));
}

function cpuCheck_event() {
    let maskLow = 0;
    let maskHigh = 0;
    for (let i = 0; i < 32; i++) {
        if (document.getElementById("cpu" + i).checked) {
            maskLow |= (1 << i);
        }
    }
    for (let i = 32; i < 64; i++) {
        if (document.getElementById("cpu" + i).checked) {
            maskHigh |= (1 << i);
        }
    }
    document.getElementById("mask-hex").value = "0x" + long2hex(maskHigh).toUpperCase() + long2hex(maskLow).toUpperCase();
}

function mark_cpus_16bit(word, iBegin) {
    word = parseInt(word, 16);
    for (let i = 0; i < 16; i++) {
        $cpuElem = document.getElementById("cpu" + (iBegin + i));
        $cpuElem.checked = (word >>> i) & 1;
    }
}

function cpuMask_event() {
    let mask = pad0(document.getElementById("mask-hex").value.toUpperCase().replace("0X", ""), 16);
    let maskHigh = mask.substr(0, 8);
    let maskLow = mask.substr(8, 8);

    mark_cpus_16bit(maskLow.substr(4, 4), 0);
    mark_cpus_16bit(maskLow.substr(0, 4), 16);
    mark_cpus_16bit(maskHigh.substr(4, 4), 32);
    mark_cpus_16bit(maskHigh.substr(0, 4), 48);
}

function invert_event() {
    for (const cpu of document.getElementsByClassName("cpu-checkbox")) {
        cpu.checked = !cpu.checked;
    }
    cpuCheck_event();
}

function clear_event() {
    for (const cpu of document.getElementsByClassName("cpu-checkbox")) {
        cpu.checked = false;
    }
    cpuCheck_event();
}