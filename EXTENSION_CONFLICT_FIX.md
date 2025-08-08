# 🔧 Extension Conflict Fix Guide

## ❌ Problem: Extension Not Working on Same Website

When you try to use the extension on the same booking website where it's already installed, it shows errors. But it works fine on different websites.

## 🔍 Root Cause

This happens because:
1. **Duplicate function definitions** in the extension
2. **Multiple instances** of the extension running
3. **Version conflicts** between different extension versions
4. **Browser caching** of old extension code

## ✅ Solutions

### Method 1: Clear Extension State (Recommended)

1. **Open browser console** (F12)
2. **Run this command** to clear extension state:
```javascript
// Clear extension state
delete window.extensionLoaded;
delete window.autoFillInProgress;
delete window.extensionVersion;
console.log("🔄 Extension state cleared!");
```

3. **Reload the page** (Ctrl+F5)
4. **Try the extension again**

### Method 2: Use Test Script

1. **Copy the test script** from `test-extension-simple.js`
2. **Paste in browser console** on the booking website
3. **Check console** for extension activity

### Method 3: Hard Refresh

1. **Press Ctrl+Shift+R** (hard refresh)
2. **Clear browser cache** for the website
3. **Disable and re-enable** the extension

### Method 4: Extension Reload

1. **Go to Chrome Extensions** (chrome://extensions/)
2. **Find "Booking AutoFill"**
3. **Click the refresh/reload button**
4. **Reload the booking website**

## 🧪 Testing Steps

1. **Upload the new CSV file** (`new-users.csv`)
2. **Select a user** from the dropdown
3. **Click "Start Auto-Fill"**
4. **Check console** for success messages

## 📊 Expected Console Messages

✅ **Success:**
```
📦 Booking AutoFill Extension v2.1.1 loaded
🔤 Converted name to uppercase: 'rahul kumar' → 'RAHUL KUMAR'
✅ Filled name: RAHUL KUMAR (converted from: rahul kumar)
```

❌ **Error:**
```
⚠️ Extension already loaded, skipping...
⚠️ Auto-fill already in progress, skipping...
```

## 🚨 If Still Not Working

1. **Check if extension is enabled**
2. **Try in incognito mode**
3. **Disable other extensions** temporarily
4. **Use a different browser** (Firefox/Edge)
5. **Contact support** with console errors

## 📝 Quick Fix Commands

**Clear everything:**
```javascript
delete window.extensionLoaded;
delete window.autoFillInProgress;
delete window.extensionVersion;
delete window.formFillingCompleted;
delete window.lastFormCompletion;
location.reload();
```

**Test extension:**
```javascript
// Copy and paste the test-extension-simple.js content
```

## 🎯 Success Indicators

- ✅ Console shows "Extension loaded"
- ✅ Names are converted to UPPERCASE
- ✅ Form fields get filled automatically
- ✅ No error messages in console
- ✅ Success banner appears

## 📞 Need Help?

If the extension still doesn't work:
1. **Screenshot the console errors**
2. **Note the website URL**
3. **Describe what happens when you click "Start Auto-Fill"**
4. **Share the error messages**
