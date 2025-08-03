document.getElementById('excelFile').addEventListener('change', function (e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
        let data = new Uint8Array(event.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let firstSheet = workbook.SheetNames[0];
        let excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
        chrome.storage.local.set({ bookingData: excelData }, () => {
            alert("✅ Excel Loaded Successfully!");
        });
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('startFill').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: startAutoFill
        });
    } else {
        alert("⚠ No active tab found!");
    }
});

function startAutoFill() {
    chrome.storage.local.get("bookingData", (data) => {
        if (!data.bookingData) {
            alert("⚠ No booking data found!");
            return;
        }
        window.postMessage({ type: "AUTO_FILL", payload: data.bookingData }, "*");
    });
}
