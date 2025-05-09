// nutrient_definitions.js

const NUTRIENT_IDS = {
    // Anahtar ID'ler (FDC tarafından genellikle kullanılır)
    CALORIES_KCAL: 1008, // Energy, kcal
    CALORIES_KJ: 1062,   // Energy, kJ (FDC ID, not typically in Survey 'number')
    PROTEIN: 1003,
    FAT: 1004,
    CARBS_BY_DIFFERENCE: 1005,
    CARBS_BY_SUMMATION: 1050, // Less common, but exists
    FIBER: 1079, // Fiber, total dietary
    SUGARS_TOTAL_FOUNDATION: 1063, // Foundation: "Sugars, total including NLEA" (was 1063 for Sugars, Total)
                                  // Survey FNDDS might use specific sugar types or a general one.
    SUGARS_TOTAL_SURVEY: 2000, // Placeholder - Survey often uses Nutrient 'number' like "269" for Total Sugars.
                               // Check surveyDownload.json for actual 'nutrient.name' like "Sugars, total" or "Total Sugars".
    CHOLESTEROL: 1253,
    SODIUM: 1093,
    // İhtiyaç duyulan diğer besinler
    FAT_SATURATED: 1258, // Fatty acids, total saturated
    // ... diğer yağ asitleri eklenebilir
};

const NUTRIENT_NUMBERS = { // Survey (FNDDS) 'nutrient.number' alanı için
    CALORIES_KCAL: "208", // Energy (kcal)
    CALORIES_KJ: "268",   // Energy (kJ)
    PROTEIN: "203",       // Protein
    FAT: "204",           // Total lipid (fat)
    CARBS_BY_DIFFERENCE: "205", // Carbohydrate, by difference
    FIBER: "291",         // Fiber, total dietary
    SUGARS: "269",        // Total sugars (Bu numara FNDDS için yaygındır)
    CHOLESTEROL: "601",   // Cholesterol
    SODIUM: "307",        // Sodium, Na
    FAT_SATURATED: "606", // Fatty acids, total saturated
};

const NUTRIENT_NAMES = {
    CALORIES: "Energy", // General term, unitName (kcal/kJ) specifies
    PROTEIN: "Protein",
    FAT: "Total lipid (fat)",
    CARBS_DIFFERENCE: "Carbohydrate, by difference",
    CARBS_SUMMATION: "Carbohydrate, by summation", // More specific, less common
    FIBER: "Fiber, total dietary",
    // For sugars, names can vary. Relying on ID or number is safer if possible.
    SUGARS_SURVEY: "Total Sugars", // Example name in Survey data, or "Sugars, total"
    SUGARS_FOUNDATION: "Sugars, total including NLEA", // Common in Foundation
    CHOLESTEROL: "Cholesterol",
    SODIUM: "Sodium, Na",
    FAT_SATURATED: "Fatty acids, total saturated",
};

const NUTRIENT_UNITS = {
    KCAL: "kcal",
    KJ: "kJ",
    G: "g",
    MG: "mg",
    UG: "µg" // microgram
};

// Besin öğesini bulmak için genel bir yardımcı fonksiyon
function findNutrient(foodNutrients, criteriaArray) {
    if (!foodNutrients || !Array.isArray(criteriaArray)) return null;
    for (const criteria of criteriaArray) {
        const nutrient = foodNutrients.find(n => {
            if (!n || !n.nutrient) return false; // Ensure n and n.nutrient exist

            const nutrientData = n.nutrient; // nutrientData can be n.nutrient (Foundation) or n itself (Survey sometimes)

            // FDC data usually has n.nutrient.id, n.nutrient.name, n.nutrient.unitName
            // Survey data (FNDDS) usually has n.nutrient.number, n.nutrient.name, n.nutrient.unitName
            // Sometimes nutrient details are directly on 'n' if n.nutrient is not structured deeply.
            const id = nutrientData.id;
            const number = nutrientData.number;
            const name = nutrientData.name ? nutrientData.name.toLowerCase() : '';
            const unitName = nutrientData.unitName ? nutrientData.unitName.toLowerCase() : '';

            let idMatch = true;
            if (criteria.id) { // Check FDC ID
                idMatch = (id === criteria.id);
            }

            let numberMatch = true;
            if (criteria.number) { // Check Survey Number
                numberMatch = (number === criteria.number);
            }
            
            let nameMatch = true;
            if (criteria.name) { // Check Name (case-insensitive)
                nameMatch = name.includes(criteria.name.toLowerCase());
            }

            let unitMatch = true;
            if (criteria.unitName) { // Check Unit (case-insensitive)
                unitMatch = (unitName === criteria.unitName.toLowerCase());
            }
            
            return idMatch && numberMatch && nameMatch && unitMatch;
        });

        // 'amount' can be directly on 'n' or on 'n.nutrient' depending on JSON structure
        const amountValue = (nutrient && typeof nutrient.amount === 'number') ? nutrient.amount : 
                            (nutrient && nutrient.nutrient && typeof nutrient.nutrient.amount === 'number') ? nutrient.nutrient.amount : null;

        if (amountValue !== null) {
            // Return the whole nutrient object 'n' so 'amount' can be accessed correctly
            // along with its original structure. If we only return n.nutrient, amount might be missed for Survey.
            return { ...nutrient, amount: amountValue }; // Ensure amount is directly accessible on the returned object
        }
    }
    return null; // No matching nutrient found
}