// Simple Extension Test Script
// Run this in browser console to test the extension without conflicts

(function() {
  console.log("🧪 Testing Extension Functionality...");
  
  // Test data with uppercase names
  const testData = [
    {
      Name: "RAHUL KUMAR",
      Gender: "Male",
      TouristType: "Indian",
      IDType: "Aadhar",
      IDValue: "123456789012",
      Age: "25",
      PhotoPath: "photos/rahul.jpg"
    }
  ];
  
  // Clear any existing extension state
  if (window.extensionLoaded) {
    delete window.extensionLoaded;
    console.log("🔄 Cleared existing extension state");
  }
  
  if (window.autoFillInProgress) {
    delete window.autoFillInProgress;
    console.log("🔄 Cleared auto-fill progress flag");
  }
  
  // Simulate extension message
  console.log("📤 Sending test data to extension...");
  window.postMessage({ 
    type: "AUTO_FILL", 
    payload: testData, 
    visitorIndex: 0 
  }, "*");
  
  console.log("✅ Test message sent! Check console for extension activity.");
  
  // Create test info panel
  const infoPanel = document.createElement('div');
  infoPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-width: 300px;
    ">
      <h4>🧪 Extension Test</h4>
      <p>✅ Test data sent</p>
      <p>🔤 Name: RAHUL KUMAR</p>
      <p>🇮🇳 Type: Indian</p>
      <p>📝 Check console for results</p>
      <button onclick="this.parentElement.remove()" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(infoPanel);
  
})();
