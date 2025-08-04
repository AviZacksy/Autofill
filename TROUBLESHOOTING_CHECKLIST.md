# 🔧 Extension Troubleshooting Checklist

## 🚨 If Extension Doesn't Work - Follow This Checklist

### Step 1: Basic Installation Check
- [ ] Did you extract the ZIP file to a folder?
- [ ] Did you select the FOLDER (not individual files) when loading?
- [ ] Is Developer mode enabled in Chrome?
- [ ] Does the extension appear in the extensions list?

### Step 2: Extension Status Check
- [ ] Open `chrome://extensions/`
- [ ] Look for "Booking Auto Fill" in the list
- [ ] Check if there are any error messages (red text)
- [ ] Try clicking "Reload" on the extension

### Step 3: Website Check
- [ ] Are you on a supported website?
  - `https://custom-pages.zipr.in/*`
  - `https://booking.forestrajasthan.com/*`
- [ ] Try opening `test-extension.html` in your browser to test

### Step 4: Excel File Check
- [ ] Does your Excel file have these columns?
  - Name
  - Age
  - Gender
  - TouristType
  - IDType
  - IDValue
- [ ] Is the file not corrupted?
- [ ] Try uploading the file again

### Step 5: Browser Console Check
- [ ] Press F12 to open Developer Tools
- [ ] Go to Console tab
- [ ] Look for any red error messages
- [ ] Copy and paste any errors you see

### Step 6: Extension Popup Check
- [ ] Click the extension icon
- [ ] Does the popup open?
- [ ] Can you upload an Excel file?
- [ ] Do you see user data after upload?
- [ ] Are the buttons enabled?

### Step 7: Manual Testing
- [ ] Upload an Excel file
- [ ] Select a user from dropdown
- [ ] Select a visitor number
- [ ] Click "Manual Trigger" button
- [ ] Check if form fields get filled

## 🆘 Common Error Messages & Solutions

### "Could not load extension"
**Solution**: Make sure you extracted to a folder and selected the folder (not files)

### "No data available. Please upload Excel file first."
**Solution**: Upload an Excel file with correct format

### "Extension not working on this page"
**Solution**: Make sure you're on a supported website

### "Permission denied"
**Solution**: Enable Developer mode in Chrome

### "Script error"
**Solution**: Check browser console for specific error details

## 📞 When to Contact Support

Contact support if:
- [ ] You've followed all steps above
- [ ] You're still getting errors
- [ ] The extension loads but doesn't fill forms

**Include in your support request:**
- Screenshot of the error
- Your Chrome version
- Your operating system
- Steps you followed
- Any error messages from console

## 🧪 Test the Extension

1. Open `test-extension.html` in Chrome
2. Upload an Excel file through the extension
3. Click "Manual Trigger"
4. Check if form fields get filled

This will help verify if the extension is working correctly. 