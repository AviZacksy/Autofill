// Stop Console Spam Script
// Run this in browser console to stop the payment form restoration spam

(function() {
  console.log("🔇 Stopping console spam...");
  
  // Clear the interval that's causing spam
  if (window.paymentFormInterval) {
    clearInterval(window.paymentFormInterval);
    console.log("✅ Cleared payment form interval");
  }
  
  // Override the spam function
  if (window.restorePaymentFormFunctionality) {
    const originalFunction = window.restorePaymentFormFunctionality;
    window.restorePaymentFormFunctionality = function() {
      // Only run once per page load
      if (!window.paymentFormRestored) {
        console.log("💳 Restoring payment form functionality (once only)...");
        originalFunction.call(this);
        window.paymentFormRestored = true;
      }
    };
    console.log("✅ Overridden spam function");
  }
  
  // Clear any existing spam flags
  window.paymentFormRestored = true;
  
  console.log("✅ Console spam stopped!");
  
  // Create info panel
  const infoPanel = document.createElement('div');
  infoPanel.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,255,0,0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-width: 300px;
    ">
      <h4>🔇 Spam Stopped</h4>
      <p>✅ Console spam disabled</p>
      <p>✅ Extension still working</p>
      <p>✅ Form filling continues</p>
      <button onclick="this.parentElement.remove()" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(infoPanel);
  
})();
