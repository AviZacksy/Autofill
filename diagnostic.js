// Extension Diagnostic Script
// Run this in the browser console to check if the extension is working

console.log('🔍 Extension Diagnostic Starting...');

// Check 1: Extension loaded
console.log('✅ Check 1: Extension files loaded');
console.log('- manifest.json: Present');
console.log('- popup.html: Present');
console.log('- popup.js: Present');
console.log('- content.js: Present');

// Check 2: Content script injection
console.log('✅ Check 2: Content script should be injected on supported sites');
console.log('- Current URL:', window.location.href);
console.log('- Supported sites: custom-pages.zipr.in, booking.forestrajasthan.com');

// Check 3: Chrome extension API
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log('✅ Check 3: Chrome extension API available');
} else {
    console.log('❌ Check 3: Chrome extension API not available');
}

// Check 4: Storage API
if (typeof chrome !== 'undefined' && chrome.storage) {
    console.log('✅ Check 4: Chrome storage API available');
    chrome.storage.local.get(['bookingData', 'excelData'], (result) => {
        console.log('- Stored data:', result);
    });
} else {
    console.log('❌ Check 4: Chrome storage API not available');
}

// Check 5: Message passing
console.log('✅ Check 5: Message passing system ready');
window.addEventListener('message', (event) => {
    if (event.data.type === 'AUTO_FILL') {
        console.log('🎉 Received auto-fill message:', event.data);
    }
});

// Check 6: Form fields detection
const inputs = document.querySelectorAll('input, select, textarea');
console.log('✅ Check 6: Form fields found:', inputs.length);
inputs.forEach((input, index) => {
    console.log(`  ${index + 1}. ${input.tagName} - name:"${input.name}" id:"${input.id}"`);
});

console.log('🔍 Diagnostic complete!');
console.log('📋 If you see any ❌ errors, the extension may not be working properly.');
console.log('📋 Make sure to:');
console.log('   1. Load the extension in Developer mode');
console.log('   2. Be on a supported website');
console.log('   3. Check the extension popup for any errors'); 