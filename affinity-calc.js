function pad2(num, size) { 
    return ('00' + num).substr(-size); 
}

function pad16(num, size) { 
    return ('0000000000000000' + num).substr(-size); 
}

function long2hex (num) {
    return ( pad2((num>>>24).toString(16),2) +
    pad2((num>>16 & 255).toString(16),2) +
    pad2((num>>8 & 255).toString(16),2) +
    pad2((num & 255).toString(16),2) );
}

function cpuCheck_event() {
    var mask_low = 0;
    var mask_high = 0;
    for (i = 0; i < 32; i++) {
        if (document.getElementById("cpu" + i).checked) {
            mask_low |= (1 << i);       
        }
    }
    for (i = 32; i < 64; i++) {        
        if (document.getElementById("cpu" + i).checked) {        
            mask_high |= (1 << i);
        }
    }
    document.getElementById("mask_hex").value = "0x" + long2hex(mask_high).toUpperCase() + long2hex(mask_low).toUpperCase();
}

function mark_cpus_16bit(word, iBegin) {
    console.log("word " + word + " at index " + iBegin);
    word=parseInt(word, 16);
    for(i=0; i<16; i++) {        
        $cpuElem=document.getElementById("cpu" + (iBegin+i));
        $cpuElem.checked=(word>>>i)&1;
    }
}

function cpuMask_event() {
    mask=pad16(document.getElementById("mask_hex").value.toUpperCase().replace("0X",""),16);
    mask_high=mask.substr(0,8);
    mask_low=mask.substr(8,8);

    console.log("mask low " + mask_low + " high " + mask_high);

    mark_cpus_16bit(mask_low.substr(4,4), 0);
    mark_cpus_16bit(mask_low.substr(0,4), 16);
    mark_cpus_16bit(mask_high.substr(4,4), 32);
    mark_cpus_16bit(mask_high.substr(0,4), 48);
}
