# KaloriTakip - Calorie & Macro Tracker

KaloriTakip is a client-side web application designed for comprehensive calorie and macronutrient tracking. It helps users monitor their daily food intake, log custom meals, track weight, and visualize progress through reports. All data is stored locally in the user's browser, ensuring privacy and offline functionality.

## Key Features

*   **Daily Logging:** Track calories, protein, carbohydrates, and fats for breakfast, lunch, and dinner.
*   **Extensive Food Database:** Search and add foods from a pre-loaded database (utilizing FDC Foundation and Survey data structures, as seen in `nutrient_definitions.js`).
*   **Custom Food Creation:**
    *   Define and save your own food items and recipes.
    *   Specify nutritional information per portion or per 100g.
    *   Custom foods are integrated into the search functionality.
*   **Interactive Dashboard ("Günlük" Page):**
    *   View total consumed calories for the day.
    *   Track macronutrient intake (protein, carbs, fat) with progress bars against daily targets.
    *   See calorie summaries for each meal (Breakfast, Lunch, Dinner).
*   **Detailed Nutrient Breakdown:**
    *   Access daily totals for key nutrients like total fat, cholesterol, sodium, total carbohydrates, dietary fiber, and sugars.
    *   Visualize macronutrient distribution with a simple pie chart.
*   **Date Navigation & Calendar:**
    *   Easily switch between days using previous/next day buttons.
    *   Select a specific date using an integrated pop-up calendar.
    *   "Today," "Yesterday," and "Tomorrow" indicators for quick reference.
*   **Weight Tracking:**
    *   Log your daily weight in kilograms.
    *   View saved weight for the selected day.
*   **Reporting & Visualization ("Raporlar" Page):**
    *   Generate monthly reports.
    *   View charts for daily calorie intake trends.
    *   View charts for daily weight changes over the selected month.
    *   Filter reports by month and year.
*   **Data Portability (Data Management Section):**
    *   **Export Data:** Backup all your data (daily logs, custom foods, weight records) to a JSON file. A modal displays the JSON data for easy copying.
    *   **Import Data:** Restore your data from a previously exported JSON file. (Note: This will overwrite existing data).
*   **Responsive Design:** Optimized for a good user experience on both desktop and mobile devices (primarily styled for a mobile-first view).
*   **Offline Functionality:** Works offline after initial load, as all data is stored in the browser's local storage.
*   **Localized Interface:** The current user interface is primarily in Turkish.

## Technologies Used

*   **HTML5**
*   **CSS3:** (Flexbox, Grid, Custom Properties for theming)
*   **JavaScript (ES6+):** (DOM manipulation, event handling, data management, calculations)
*   **Chart.js:** For rendering charts on the reports page.
*   **Font Awesome:** For icons throughout the application.
*   **Local Storage:** For all client-side data persistence.
*   **No Backend:** This is a purely client-side application.

## How It Works

KaloriTakip is a single-page application (SPA) that runs entirely in your web browser. It leverages the browser's `localStorage` to save all user-generated data, including:
*   Daily meal logs for each date.
*   Custom food definitions.
*   Daily weight entries.

This approach means your data remains private on your device, and the application can function without an active internet connection after the initial assets (HTML, CSS, JS, food data JSONs) are loaded.

## Setup

1.  **Download or Clone:** Get all the project files.
2.  **File Structure:** Ensure the following files and directories are present in the root directory:
    *   `index.html`
    *   `style.css`
    *   `script.js`
    *   `nutrient_definitions.js`
    *   `custom_foods.js`
    *   `FoodData_Central_foundation_food_json_2025-04-24.json` (food database)
    *   `surveyDownload.json` (food database)
    *   `Note: While the core food data comes from USDA FoodData Central, you have the flexibility to add your own food items and even entire datasets to personalize your experience.`
    *   `js/` (directory)
        *   `chart.min.js` (Chart.js library)
    *   `css/` (directory)
        *   `all.min.css` (Font Awesome CSS)
    *   `webfonts/` (directory containing Font Awesome font files, relative to `css/all.min.css`)
3.  **Open:** Open the `index.html` file in your preferred web browser.

## Usage Guide

### Daily Logging (Tab: "Günlük" - Daily)

1.  **Navigate Date:** Use the `<` and `>` buttons in the header or click the date display to open the calendar and select a specific day.
2.  **Add Food:**
    *   Click the `+` icon in the header.
    *   Alternatively, click the `+` icon on a specific meal card (e.g., "Kahvaltı" - Breakfast, "Öğle Yemeği" - Lunch, "Akşam Yemeği" - Dinner).
3.  **Search Food:** In the "Yiyecek Ekle" (Add Food) modal:
    *   Type the name of the food in the "Yiyecek Ara" (Search Food) input.
    *   Select a food from the dropdown results. A preview of its nutritional information (per 100g or per default serving) will appear.
4.  **Specify Quantity:**
    *   Enter the amount in the "Miktar" (Quantity) input.
    *   Select the appropriate unit from the dropdown (e.g., "gram", or other portion sizes if available for the selected food).
5.  **Select Meal:** Choose the meal ("Kahvaltı", "Öğle Yemeği", "Akşam Yemeği") from the "Öğün Seçin" (Select Meal) dropdown.
6.  **Confirm:** Click "Yiyeceği Ekle" (Add Food to Meal). The food will be added to the selected meal list, and daily summaries will update.

### Adding Custom Foods

1.  On the "Günlük" (Daily) page, scroll down and click the "Yeni Yiyecek Bilgisi Ekle" (Add New Food Info) button.
2.  In the "Yeni Yiyecek Bilgisi Ekle" (Add Custom Food) modal:
    *   **Entry Type:** Choose "Porsiyon Başına" (Per Portion) or "100 Gram Başına" (Per 100g).
    *   **Food Name:** Enter a descriptive name (e.g., "Homemade Cookie (1 piece)" if per portion).
    *   **Nutrients:** Fill in Calories (kcal), Protein (g), Carbohydrates (g), and Fat (g) for the specified entry type.
3.  **Save:** Click "Yiyecek Bilgisini Kaydet" (Save Food Info). This custom food will now be available in your food search.

### Tracking Weight

1.  On the "Günlük" (Daily) page, find the "Günlük Kilo Takibi" (Daily Weight Tracking) card.
2.  Enter your current weight in kilograms into the input field.
3.  Click "Kaydet" (Save). A confirmation message will appear.

### Viewing Reports (Tab: "Raporlar" - Reports)

1.  Navigate to the "Raporlar" (Reports) tab using the footer navigation.
2.  **Select Period:** Choose the desired "Ay" (Month) and "Yıl" (Year) from the dropdowns.
3.  **Generate:** Click "Raporu Göster" (Show Report).
4.  **View Charts:**
    *   "Günlük Alınan Kalori Grafiği" (Daily Consumed Calorie Chart).
    *   "Günlük Kilo Değişim Grafiği" (Daily Weight Change Chart).

### Data Management (in "Raporlar" Page)

1.  **Export Data:**
    *   Click "Verileri Dışa Aktar" (Export Data).
    *   A modal will appear ("Dışa Aktarılan Veri" - Exported Data) containing all your application data in JSON format.
    *   Click "Panoya Kopyala" (Copy to Clipboard) or manually select and copy the text. Save this JSON data in a safe place.
2.  **Import Data:**
    *   Click the "Verileri İçe Aktar..." (Import Data...) button.
    *   Select a valid JSON file that was previously exported from this application.
    *   **CAUTION:** A confirmation prompt will appear. Importing data will **overwrite all current data** in your browser's local storage. This action cannot be undone.
    *   If confirmed, the data will be imported, and the page will typically reload to reflect the changes.

## Note on Localization

The current user interface and some hardcoded text elements are in Turkish. The food database files (`FoodData_Central_foundation_food_json_2025-04-24.json`, `surveyDownload.json`) contain food descriptions primarily in English, but these are parsed and displayed within the Turkish UI.
