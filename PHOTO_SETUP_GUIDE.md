# 📸 Photo Setup Guide for Booking Auto-Fill

## 📁 Folder Structure
```
booking-auto-fill/
├── photos/                    # यहाँ सभी photos रखें
│   ├── rahul.jpg
│   ├── priya.jpg
│   ├── amit.jpg
│   └── sunita.jpg
├── data.xlsx                  # Excel file with photo paths
├── manifest.json
├── popup.html
└── popup.js
```

## 📋 Excel File Format
आपकी `data.xlsx` फाइल में यह columns होने चाहिए:

| Name | Gender | TouristType | IDType | IDValue | Age | PhotoPath |
|------|--------|-------------|--------|---------|-----|-----------|
| राहुल कुमार | Male | Domestic | Aadhar | 123456789012 | 25 | photos/rahul.jpg |
| प्रिया शर्मा | Female | Domestic | PAN | ABCDE1234F | 28 | photos/priya.jpg |
| अमित सिंह | Male | International | Passport | A1234567 | 32 | photos/amit.jpg |
| सुनीता वर्मा | Female | Domestic | Aadhar | 987654321098 | 45 | photos/sunita.jpg |

## 📸 Photo Requirements

### ✅ Supported Formats:
- **JPG/JPEG** (recommended)
- **PNG**
- **GIF**
- **BMP**

### 📏 Recommended Size:
- **Width:** 200-800 pixels
- **Height:** 200-800 pixels
- **File Size:** Under 2MB

### 🎯 Photo Types:
- **Passport Photos** (35x45mm)
- **Aadhar Card Photos**
- **Profile Pictures**
- **ID Card Photos**

## 🔧 How to Add Photos:

### Method 1: Copy Photos to Folder
1. अपनी photos को `photos/` folder में copy करें
2. Excel में path लिखें: `photos/filename.jpg`

### Method 2: Use Absolute Path
1. Full path लिखें: `C:\Users\YourName\Pictures\photo.jpg`
2. या: `D:\Photos\visitor1.jpg`

### Method 3: Use Online URL
1. Online photo का URL लिखें: `https://example.com/photo.jpg`

## 📝 Example Excel Data:

```
Name,Gender,TouristType,IDType,IDValue,Age,PhotoPath
राहुल कुमार,Male,Domestic,Aadhar,123456789012,25,photos/rahul.jpg
प्रिया शर्मा,Female,Domestic,PAN,ABCDE1234F,28,photos/priya.jpg
अमित सिंह,Male,International,Passport,A1234567,32,photos/amit.jpg
सुनीता वर्मा,Female,Domestic,Aadhar,987654321098,45,photos/sunita.jpg
```

## ✅ Testing Your Setup:

1. **Photos को photos/ folder में रखें**
2. **Excel में PhotoPath column add करें**
3. **Extension reload करें**
4. **Test करें - photo automatically upload होगा**

## 🚨 Important Notes:

- **Photo file names में spaces न रखें**
- **File extensions (.jpg, .png) सही लिखें**
- **Path में forward slashes (/) use करें**
- **Photos का size छोटा रखें (under 2MB)**

## 🔍 Troubleshooting:

### ❌ Photo नहीं upload हो रहा:
- Check file path in Excel
- Verify photo file exists
- Check file format (JPG/PNG)
- Ensure file size < 2MB

### ❌ Extension error दे रहा है:
- Reload extension
- Check console for errors
- Verify photo path format

## 📞 Support:
अगर कोई problem है तो console में error देखें और बताएं! 