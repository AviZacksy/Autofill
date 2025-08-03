async function humanType(el, text) {
    if (!el) return;
    el.focus();
    el.value = "";
    for (let char of text) {
        el.value += char;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
    }
}

function selectDropdown(selector, value) {
    let el = document.querySelector(selector);
    if (el) {
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

window.addEventListener("message", async (event) => {
    if (event.data.type === "AUTO_FILL") {
        let data = event.data.payload[0]; // Excel first row

        await humanType(document.querySelector('#name'), data.Name);
        selectDropdown('#gender', data.Gender);
        selectDropdown('#touristType', data["Tourist Type"]);
        selectDropdown('#idType', data["ID Type"]);
        await humanType(document.querySelector('#idNumber'), data["ID Proof Value"]);
        await humanType(document.querySelector('#age'), data.Age);

        // Scroll randomly for natural feel
        window.scrollTo(0, Math.random() * 300);
    }
});
