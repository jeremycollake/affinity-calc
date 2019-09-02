function pad0(num, width) { 
    var zeros;
    for(i=0;i<width;i++) {
        zeros+="0";
    }
    return (zeros + num).substr(-width); 
}

function long2hex (num) {
    return ( pad0((num>>>24).toString(16),2) +
    pad0((num>>16 & 255).toString(16),2) +
    pad0((num>>8 & 255).toString(16),2) +
    pad0((num & 255).toString(16),2) );
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
    word=parseInt(word, 16);
    for(i=0; i<16; i++) {        
        $cpuElem=document.getElementById("cpu" + (iBegin+i));
        $cpuElem.checked=(word>>>i)&1;
    }
}

function cpuMask_event() {
    mask=pad0(document.getElementById("mask_hex").value.toUpperCase().replace("0X",""),16);
    mask_high=mask.substr(0,8);
    mask_low=mask.substr(8,8);

    mark_cpus_16bit(mask_low.substr(4,4), 0);
    mark_cpus_16bit(mask_low.substr(0,4), 16);
    mark_cpus_16bit(mask_high.substr(4,4), 32);
    mark_cpus_16bit(mask_high.substr(0,4), 48);
}

function invert_event() {    
    var cpus=document.getElementsByClassName("cpu_selector");    
    for(var i=0;i<cpus.length;i++) {
        cpus[i].checked=!cpus[i].checked;
    }
    cpuCheck_event();
}

function clear_event() {
    var cpus=document.getElementsByClassName("cpu_selector");
    for(var i=0;i<cpus.length;i++) {
        cpus[i].checked=false;
    }
    cpuCheck_event();
}