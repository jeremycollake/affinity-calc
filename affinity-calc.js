class AffinityCalc {
    static pad0(num, width) {
        let zeros;
        for (let i = 0; i < width; i++) {
            zeros += "0";
        }
        return (zeros + num).substr(-width);
    }

    static long2hex(num) {
        return (this.pad0((num >>> 24).toString(16), 2) +
            this.pad0((num >> 16 & 255).toString(16), 2) +
            this.pad0((num >> 8 & 255).toString(16), 2) +
            this.pad0((num & 255).toString(16), 2));
    }

    static mark_cpus_16bit(word, iBegin) {
        word = parseInt(word, 16);
        for (let i = 0; i < 16; i++) {
            let $cpuElem = document.getElementById("cpu" + (iBegin + i));
            if ($cpuElem) {
                $cpuElem.checked = (word >>> i) & 1;
            }
        }
    }

    static cpuCheck_event() {
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
        document.getElementById("mask-hex").value = "0x" + this.long2hex(maskHigh).toUpperCase() + this.long2hex(maskLow).toUpperCase();
    }

    static cpuMask_event() {
        let mask = this.pad0(document.getElementById("mask-hex").value.toUpperCase().replace("0X", ""), 16);
        let maskHigh = mask.substr(0, 8);
        let maskLow = mask.substr(8, 8);

        this.mark_cpus_16bit(maskLow.substr(4, 4), 0);
        this.mark_cpus_16bit(maskLow.substr(0, 4), 16);
        this.mark_cpus_16bit(maskHigh.substr(4, 4), 32);
        this.mark_cpus_16bit(maskHigh.substr(0, 4), 48);
    }

    static invert_event() {
        for (const cpu of document.getElementsByClassName("cpu-checkbox")) {
            cpu.checked = !cpu.checked;
        }
        this.cpuCheck_event();
    }

    static clear_event() {
        for (const cpu of document.getElementsByClassName("cpu-checkbox")) {
            cpu.checked = false;
        }
        this.cpuCheck_event();
    }
}