document.addEventListener('DOMContentLoaded', () => {
    // --- HTML Element References ---
    // Header
    const prevDayBtn = document.getElementById('prevDayBtn');
    const dateDisplayContainer = document.getElementById('dateDisplayContainer');
    const currentDateText = document.getElementById('currentDateText');
    const nextDayBtn = document.getElementById('nextDayBtn');
    const openAddFoodModalHeaderBtn = document.getElementById('openAddFoodModalHeaderBtn');

    // Main Pages
    const dailyLogPage = document.getElementById('dailyLogPage');
    const reportsPage = document.getElementById('reportsPage');

    // Daily Overview Card
    const consumedCaloriesDisplay = document.getElementById('consumedCaloriesDisplay');
    const totalProteinDisplay = document.getElementById('totalProteinDisplay');
    const proteinProgress = document.getElementById('proteinProgress');
    const totalCarbsDisplay = document.getElementById('totalCarbsDisplay');
    const carbsProgress = document.getElementById('carbsProgress');
    const totalFatDisplay = document.getElementById('totalFatDisplay');
    const fatProgress = document.getElementById('fatProgress');

    // Meal Cards
    const mealElements = {
        breakfast: { list: document.getElementById('breakfastList'), calories: document.getElementById('breakfastTotalCalories'), card: document.getElementById('mealCardBreakfast') },
        lunch: { list: document.getElementById('lunchList'), calories: document.getElementById('lunchTotalCalories'), card: document.getElementById('mealCardLunch') },
        dinner: { list: document.getElementById('dinnerList'), calories: document.getElementById('dinnerTotalCalories'), card: document.getElementById('mealCardDinner') },
    };
    const mealSectionsContainer = document.querySelector('.meal-sections-container'); // For event delegation

    // Custom Food Button
    const openAddCustomFoodModalBtn = document.getElementById('openAddCustomFoodModalBtn');

    // Daily Details Card
    const detailsTotalFat = document.getElementById('detailsTotalFat');
    const detailsCholesterol = document.getElementById('detailsCholesterol');
    const detailsSodium = document.getElementById('detailsSodium');
    const detailsTotalCarbs = document.getElementById('detailsTotalCarbs');
    const detailsDietaryFiber = document.getElementById('detailsDietaryFiber');
    const detailsTotalSugars = document.getElementById('detailsTotalSugars');
    const detailsTotalProtein = document.getElementById('detailsTotalProtein');
    const summaryPieChartDiv = document.getElementById('summaryPieChart');
    const distProteinPercentSpan = document.getElementById('distProteinPercent');
    const distCarbsPercentSpan = document.getElementById('distCarbsPercent');
    const distFatPercentSpan = document.getElementById('distFatPercent');

    // Quick Actions Card (Weight)
    const dailyWeightInput = document.getElementById('dailyWeightInput');
    const saveWeightButton = document.getElementById('saveWeightButton');
    const weightFeedbackMessage = document.getElementById('weightFeedbackMessage');

    // Footer Navigation
    const navDailyLog = document.getElementById('navDailyLog');
    const navReports = document.getElementById('navReports');

    // Reports Page
    const reportMonthSelect = document.getElementById('reportMonth');
    const reportYearSelect = document.getElementById('reportYear');
    const generateReportButton = document.getElementById('generateReportButton');
    let caloriesChartInstance = null;
    let weightChartInstance = null;
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataInput = document.getElementById('importDataInput');
    const importExportFeedback = document.getElementById('importExportFeedback');

    // Export Data Modal (NEW)
    const exportDataModal = document.getElementById('exportDataModal');
    const exportDataTextarea = document.getElementById('exportDataTextarea');
    const copyExportDataBtn = document.getElementById('copyExportDataBtn');


    // Add Food Modal
    const addFoodModal = document.getElementById('addFoodModal');
    const foodSearchInput = document.getElementById('foodSearchInput');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');
    const selectedFoodPreviewArea = document.getElementById('selectedFoodPreviewArea');
    const previewFoodName = document.getElementById('previewFoodName');
    const previewFoodPortionInfo = document.getElementById('previewFoodPortionInfo');
    const previewFoodCalories = document.getElementById('previewFoodCalories');
    const previewFoodProtein = document.getElementById('previewFoodProtein');
    const previewFoodCarbs = document.getElementById('previewFoodCarbs');
    const previewFoodFat = document.getElementById('previewFoodFat');
    const foodQuantityInput = document.getElementById('foodQuantity');
    const quantityUnitSelect = document.getElementById('quantityUnitSelect');
    const mealTypeSelect = document.getElementById('mealTypeSelect');
    const confirmAddFoodButton = document.getElementById('confirmAddFoodButton');

    // Add Custom Food Modal
    const addCustomFoodModal = document.getElementById('addCustomFoodModal');
    const customFoodNameInput = document.getElementById('customFoodNameInput');
    const customFoodCaloriesInput = document.getElementById('customFoodCaloriesInput');
    const customFoodProteinInput = document.getElementById('customFoodProteinInput');
    const customFoodCarbsInput = document.getElementById('customFoodCarbsInput');
    const customFoodFatInput = document.getElementById('customFoodFatInput');
    const saveCustomFoodButton = document.getElementById('saveCustomFoodButton');
    const customFoodEntryTypeGroup = document.getElementById('customFoodEntryTypeGroup');
    const customFoodNameLabel = document.getElementById('customFoodNameLabel');
    const customFoodCaloriesLabel = document.getElementById('customFoodCaloriesLabel');
    const customFoodProteinLabel = document.getElementById('customFoodProteinLabel');
    const customFoodCarbsLabel = document.getElementById('customFoodCarbsLabel');
    const customFoodFatLabel = document.getElementById('customFoodFatLabel');


    // Calendar Modal Elements
    const calendarModal = document.getElementById('calendarModal');
    const calendarPrevMonthBtn = document.getElementById('calendarPrevMonthBtn');
    const calendarNextMonthBtn = document.getElementById('calendarNextMonthBtn');
    const calendarMonthYearText = document.getElementById('calendarMonthYearText');
    const calendarDaysGrid = document.getElementById('calendarDaysGrid');
    const calendarGoToTodayBtn = document.getElementById('calendarGoToTodayBtn');

    // --- Global State ---
    let allFoodsData = [];
    let loggedData = {};
    let currentSelectedFood = null;
    const todayDate = new Date();
    const todayYear = todayDate.getFullYear();
    const todayMonth = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const todayDay = todayDate.getDate().toString().padStart(2, '0');
    let currentDate = `${todayYear}-${todayMonth}-${todayDay}`;

    let calendarViewDate = new Date(currentDate + 'T00:00:00');

    const CUSTOM_FOOD_STORAGE_KEY = 'calorieTrackerCustomFoods_v3';
    const DEFAULT_TARGETS = { calories: 2000, protein: 75, carbs: 250, fat: 60 };


    // --- Initialization ---
    function initializeApp() {
        updateHeaderDateDisplay();
        loadDailyLog(currentDate);
        setupEventListeners();
        setupCustomFoodModalDynamicLabels();
        loadFoodData().then(() => {
            loadCustomFoodEntriesIntoAllFoodsData();
        });
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Header
        prevDayBtn.addEventListener('click', () => changeDate(-1));
        nextDayBtn.addEventListener('click', () => changeDate(1));
        dateDisplayContainer.addEventListener('click', openCalendar);
        openAddFoodModalHeaderBtn.addEventListener('click', () => openModal(addFoodModal));

        if (mealSectionsContainer) {
            mealSectionsContainer.addEventListener('click', (event) => {
                const mealCardHeader = event.target.closest('.meal-card-header');
                const addItemButton = event.target.closest('.add-item-to-meal-btn');
                const removeItemButton = event.target.closest('.remove-food-btn');

                if (addItemButton) {
                    event.stopPropagation();
                    const mealType = addItemButton.dataset.meal;
                    mealTypeSelect.value = mealType;
                    openModal(addFoodModal);
                } else if (removeItemButton) {
                    event.stopPropagation();
                    const mealType = removeItemButton.dataset.meal;
                    const itemIndex = parseInt(removeItemButton.dataset.index);
                    if (loggedData[currentDate] && loggedData[currentDate].meals[mealType] && !isNaN(itemIndex)) {
                        loggedData[currentDate].meals[mealType].splice(itemIndex, 1);
                        saveDailyLog(currentDate);
                        renderMealList(mealType, currentDate);
                        updateAllSummariesForDate(currentDate);
                    }
                } else if (mealCardHeader) {
                    const list = mealCardHeader.nextElementSibling;
                    if (list && list.classList.contains('meal-items-list')) {
                        list.classList.toggle('open');
                        const chevron = mealCardHeader.querySelector('.meal-expand-icon i');
                        if (chevron) {
                            chevron.classList.toggle('fa-chevron-down');
                            chevron.classList.toggle('fa-chevron-up');
                        }
                    }
                }
            });
        }

        openAddCustomFoodModalBtn.addEventListener('click', () => {
            resetCustomFoodModal();
            openModal(addCustomFoodModal);
        });
        saveCustomFoodButton.addEventListener('click', handleSaveCustomFood);

        saveWeightButton.addEventListener('click', handleSaveWeight);

        navDailyLog.addEventListener('click', () => navigateToPage('dailyLogPage'));
        navReports.addEventListener('click', () => {
            navigateToPage('reportsPage');
            populateReportFilters();
            generateReport();
        });

        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.dataset.modalId;
                if (modalId) {
                    const modalToClose = document.getElementById(modalId);
                    if (modalToClose) closeModal(modalToClose);
                }
            });
        });
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal') && event.target.classList.contains('active')) {
                closeModal(event.target);
            }
        });

        foodSearchInput.addEventListener('input', handleFoodSearch);
        confirmAddFoodButton.addEventListener('click', handleAddFoodItem);
        quantityUnitSelect.addEventListener('change', handleQuantityUnitChange);

        document.addEventListener('click', function(event) {
            if (foodSearchInput && searchResultsDropdown && selectedFoodPreviewArea && addFoodModal.classList.contains('active')) {
                if (!foodSearchInput.contains(event.target) && !searchResultsDropdown.contains(event.target) && !selectedFoodPreviewArea.contains(event.target)) {
                    searchResultsDropdown.classList.remove('visible');
                }
            }
        });

        generateReportButton.addEventListener('click', generateReport);
        if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);
        if (importDataInput) importDataInput.addEventListener('change', importData);
        if (copyExportDataBtn) copyExportDataBtn.addEventListener('click', copyExportDataToClipboard); // NEW event listener

        calendarPrevMonthBtn.addEventListener('click', () => handleCalendarNav(-1));
        calendarNextMonthBtn.addEventListener('click', () => handleCalendarNav(1));
        calendarDaysGrid.addEventListener('click', handleCalendarDayClick);
        calendarGoToTodayBtn.addEventListener('click', goToTodayInCalendar);

        if (customFoodEntryTypeGroup) {
            customFoodEntryTypeGroup.addEventListener('change', updateCustomFoodModalLabels);
        }
    }

    // --- Date Display Update ---
    function updateHeaderDateDisplay() {
        const dateObj = new Date(currentDate + 'T00:00:00');
        const options = { day: 'numeric', month: 'long' };
        let formattedDate = dateObj.toLocaleDateString('tr-TR', options);
        const todayForCompare = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
        const d = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const diffTime = d.getTime() - todayForCompare.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) formattedDate = `Bugün (${formattedDate})`;
        else if (diffDays === -1) formattedDate = `Dün (${formattedDate})`;
        else if (diffDays === 1) formattedDate = `Yarın (${formattedDate})`;
        currentDateText.textContent = formattedDate;
    }

    // --- Date Management ---
    function changeDate(days) {
        const date = new Date(currentDate + 'T00:00:00');
        date.setDate(date.getDate() + days);
        currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        updateHeaderDateDisplay();
        loadDailyLog(currentDate);
        if (reportsPage.classList.contains('active-page')) {
            populateReportFilters();
            generateReport();
        }
    }

    function getStorageKey(date) { return `calorieTracker-${date}-v3`; }

    function loadDailyLog(date) {
        const key = getStorageKey(date);
        const storedLog = localStorage.getItem(key);
        loggedData[date] = storedLog ? JSON.parse(storedLog) : {
            meals: { breakfast: [], lunch: [], dinner: [] },
            weight: null,
            targets: { ...DEFAULT_TARGETS }
        };
        if (!loggedData[date].targets) loggedData[date].targets = { ...DEFAULT_TARGETS };
        renderAllMealListsForDate(date);
        updateAllSummariesForDate(date);
        if(dailyWeightInput) dailyWeightInput.value = loggedData[date].weight || '';
        const dateForMsg = new Date(date + 'T00:00:00');
        if(weightFeedbackMessage) {
            weightFeedbackMessage.textContent = loggedData[date].weight ? `${dateForMsg.toLocaleDateString('tr-TR', {day:'numeric', month:'long'})} için kayıtlı kilo: ${loggedData[date].weight} kg` : '';
            weightFeedbackMessage.style.color = 'var(--accent-primary)';
        }
    }

    function saveDailyLog(date) {
        const key = getStorageKey(date);
        if (loggedData[date]) {
            if (!loggedData[date].targets) loggedData[date].targets = { ...DEFAULT_TARGETS };
            localStorage.setItem(key, JSON.stringify(loggedData[date]));
        }
    }

    // --- Food Data Loading & Processing ---
    async function loadFoodData() {
        try {
            const [foundationResponse, surveyResponse] = await Promise.all([
                fetch('./FoodData_Central_foundation_food_json_2025-04-24.json').catch(e => { console.warn("Foundation data fetch failed", e); return {ok: false}; }),
                fetch('./surveyDownload.json').catch(e => { console.warn("Survey data fetch failed", e); return {ok: false}; })
            ]);
            let foundationData = { FoundationFoods: [] }, surveyData = { SurveyFoods: [] };
            if (foundationResponse.ok) foundationData = await foundationResponse.json();
            else console.warn('Foundation JSON dosyası yüklenemedi veya bulunamadı.');
            if (surveyResponse.ok) surveyData = await surveyResponse.json();
            else console.warn('Survey JSON dosyası yüklenemedi veya bulunamadı.');
            allFoodsData = [];
            if (foundationData.FoundationFoods) processFoodData(foundationData.FoundationFoods, "Foundation");
            if (surveyData.SurveyFoods) processFoodData(surveyData.SurveyFoods, "Survey");
            console.log(`Toplam ${allFoodsData.length} yiyecek (veritabanından) yüklendi.`);
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
        }
    }

    function processFoodData(foods, source) {
        if (!Array.isArray(foods)) {
            console.warn(`${source} verisi bir dizi değil veya tanımsız. Alınan veri:`, foods);
            return;
        }
        foods.forEach(food => {
            if (food && food.description && Array.isArray(food.foodNutrients)) {
                let calorieNutrient = findNutrient(food.foodNutrients, [
                    { id: NUTRIENT_IDS.CALORIES_KCAL, unitName: NUTRIENT_UNITS.KCAL }, { name: NUTRIENT_NAMES.CALORIES, unitName: NUTRIENT_UNITS.KCAL }, { number: NUTRIENT_NUMBERS.CALORIES_KCAL, unitName: NUTRIENT_UNITS.KCAL }
                ]);
                let calories = calorieNutrient ? calorieNutrient.amount : 0;
                if (calories === 0) {
                    let kjNutrient = findNutrient(food.foodNutrients, [
                        { id: NUTRIENT_IDS.CALORIES_KJ, unitName: NUTRIENT_UNITS.KJ }, { name: NUTRIENT_NAMES.CALORIES, unitName: NUTRIENT_UNITS.KJ }, { number: NUTRIENT_NUMBERS.CALORIES_KJ, unitName: NUTRIENT_UNITS.KJ }
                    ]);
                    if (kjNutrient && kjNutrient.amount > 0) calories = kjNutrient.amount / 4.184;
                }
                const protein = (findNutrient(food.foodNutrients, [{ id: NUTRIENT_IDS.PROTEIN, name: NUTRIENT_NAMES.PROTEIN, unitName: NUTRIENT_UNITS.G }, {number: NUTRIENT_NUMBERS.PROTEIN, name: NUTRIENT_NAMES.PROTEIN, unitName: NUTRIENT_UNITS.G}]) || {}).amount || 0;
                const fat = (findNutrient(food.foodNutrients, [{ id: NUTRIENT_IDS.FAT, name: NUTRIENT_NAMES.FAT, unitName: NUTRIENT_UNITS.G }, {number: NUTRIENT_NUMBERS.FAT, name: NUTRIENT_NAMES.FAT, unitName: NUTRIENT_UNITS.G}]) || {}).amount || 0;
                let carbs = (findNutrient(food.foodNutrients, [
                    { id: NUTRIENT_IDS.CARBS_BY_DIFFERENCE, name: NUTRIENT_NAMES.CARBS_DIFFERENCE, unitName: NUTRIENT_UNITS.G }, { id: NUTRIENT_IDS.CARBS_BY_SUMMATION, name: NUTRIENT_NAMES.CARBS_SUMMATION, unitName: NUTRIENT_UNITS.G }, { number: NUTRIENT_NUMBERS.CARBS_BY_DIFFERENCE, name: NUTRIENT_NAMES.CARBS_DIFFERENCE, unitName: NUTRIENT_UNITS.G}
                ]) || {}).amount || 0;
                const fiber = (findNutrient(food.foodNutrients, [{id: NUTRIENT_IDS.FIBER, name: NUTRIENT_NAMES.FIBER, unitName: NUTRIENT_UNITS.G}, {number: NUTRIENT_NUMBERS.FIBER, name: NUTRIENT_NAMES.FIBER, unitName: NUTRIENT_UNITS.G}]) || {}).amount || 0;
                let sugars = (findNutrient(food.foodNutrients, [
                    {id: NUTRIENT_IDS.SUGARS_TOTAL_SURVEY, name: NUTRIENT_NAMES.SUGARS_SURVEY, unitName: NUTRIENT_UNITS.G, number: NUTRIENT_NUMBERS.SUGARS}, {id: NUTRIENT_IDS.SUGARS_TOTAL_FOUNDATION, name: NUTRIENT_NAMES.SUGARS_FOUNDATION, unitName: NUTRIENT_UNITS.G}
                ]) || {}).amount || 0;
                const cholesterol = (findNutrient(food.foodNutrients, [{id: NUTRIENT_IDS.CHOLESTEROL, name: NUTRIENT_NAMES.CHOLESTEROL, unitName: NUTRIENT_UNITS.MG, number: NUTRIENT_NUMBERS.CHOLESTEROL}]) || {}).amount || 0;
                const sodium = (findNutrient(food.foodNutrients, [{id: NUTRIENT_IDS.SODIUM, name: NUTRIENT_NAMES.SODIUM, unitName: NUTRIENT_UNITS.MG, number: NUTRIENT_NUMBERS.SODIUM}]) || {}).amount || 0;
                let foodPortions = [];
                if (food.foodPortions && Array.isArray(food.foodPortions)) {
                    foodPortions = food.foodPortions.filter(p => p.gramWeight && (p.portionDescription || p.modifier)).map(p => ({ description: p.portionDescription ? `${p.portionDescription}${p.modifier ? ' ('+p.modifier+')' : ''}` : p.modifier, gramWeight: p.gramWeight }));
                }
                if (calories > 0 || protein > 0 || fat > 0 || carbs > 0) {
                    allFoodsData.push({
                        name: food.description, caloriesPer100g: parseFloat(calories.toFixed(1)), proteinPer100g: parseFloat(protein.toFixed(1)), carbsPer100g: parseFloat(carbs.toFixed(1)), fatPer100g: parseFloat(fat.toFixed(1)), fiberPer100g: parseFloat(fiber.toFixed(1)), sugarsPer100g: parseFloat(sugars.toFixed(1)), cholesterolPer100g: parseFloat(cholesterol.toFixed(1)), sodiumPer100g: parseFloat(sodium.toFixed(1)), source: source, fdcId: food.fdcId || food.foodCode, isCustomEntry: false, foodPortions: foodPortions
                    });
                }
            }
        });
    }

    // --- UI Rendering: Meal Lists & Summaries ---
    function renderAllMealListsForDate(date) { for (const mealType in mealElements) renderMealList(mealType, date); }
    function renderMealList(mealType, date) {
        const mealUI = mealElements[mealType]; if (!mealUI) return;
        mealUI.list.innerHTML = ''; let mealTotalCalories = 0; const dayData = loggedData[date];
        if (dayData && dayData.meals && dayData.meals[mealType]) {
            dayData.meals[mealType].forEach((food, index) => {
                const li = document.createElement('li'); const foodItemInfoDiv = document.createElement('div'); foodItemInfoDiv.classList.add('food-item-info');
                const nameSpan = document.createElement('span'); nameSpan.classList.add('name'); nameSpan.textContent = food.name;
                const detailsSpan = document.createElement('span'); detailsSpan.classList.add('details');
                const quantityDisplay = food.unit === 'g' ? food.quantity.toFixed(0) : food.quantity.toFixed(1);
                const unitText = food.unit === 'g' ? 'g' : (food.unit === 'porsiyon' ? ' pors.' : ` ${food.unit}`);
                detailsSpan.textContent = `${quantityDisplay}${unitText} - P:${food.protein.toFixed(1)}g, K:${food.carbs.toFixed(1)}g, Y:${food.fat.toFixed(1)}g`;
                foodItemInfoDiv.appendChild(nameSpan); foodItemInfoDiv.appendChild(detailsSpan);
                const foodItemActionsDiv = document.createElement('div'); foodItemActionsDiv.style.display = 'flex'; foodItemActionsDiv.style.alignItems = 'center';
                const caloriesSpan = document.createElement('span'); caloriesSpan.classList.add('food-item-calories'); caloriesSpan.textContent = `${food.calories.toFixed(0)} kcal`;
                const removeButton = document.createElement('button'); removeButton.classList.add('remove-food-btn'); removeButton.innerHTML = '<i class="fas fa-times-circle"></i>'; removeButton.setAttribute('aria-label', 'Yiyeceği sil'); removeButton.dataset.meal = mealType; removeButton.dataset.index = index;
                foodItemActionsDiv.appendChild(caloriesSpan); foodItemActionsDiv.appendChild(removeButton);
                li.appendChild(foodItemInfoDiv); li.appendChild(foodItemActionsDiv);
                mealUI.list.appendChild(li); mealTotalCalories += food.calories;
            });
        }
        mealUI.calories.textContent = `${mealTotalCalories.toFixed(0)} Kalori`;
    }
    function updateAllSummariesForDate(date) {
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0, totalSugars = 0, totalCholesterol = 0, totalSodium = 0;
        const dayData = loggedData[date];
        if (dayData && dayData.meals) {
            for (const mealType in dayData.meals) {
                if (dayData.meals.hasOwnProperty(mealType) && Array.isArray(dayData.meals[mealType])) {
                    dayData.meals[mealType].forEach(food => {
                        totalCalories += food.calories || 0; totalProtein += food.protein || 0; totalCarbs += food.carbs || 0; totalFat += food.fat || 0;
                        totalFiber += food.fiber || 0; totalSugars += food.sugars || 0; totalCholesterol += food.cholesterol || 0; totalSodium += food.sodium || 0;
                    });
                }
            }
        }
        consumedCaloriesDisplay.textContent = totalCalories.toFixed(0);
        totalProteinDisplay.textContent = `${totalProtein.toFixed(1)}g`; totalCarbsDisplay.textContent = `${totalCarbs.toFixed(1)}g`; totalFatDisplay.textContent = `${totalFat.toFixed(1)}g`;
        const targets = (dayData && dayData.targets) || DEFAULT_TARGETS;
        proteinProgress.style.width = `${Math.min(100, (totalProtein / (targets.protein || 1)) * 100)}%`;
        carbsProgress.style.width = `${Math.min(100, (totalCarbs / (targets.carbs || 1)) * 100)}%`;
        fatProgress.style.width = `${Math.min(100, (totalFat / (targets.fat || 1)) * 100)}%`;
        detailsTotalProtein.textContent = `${totalProtein.toFixed(1)}g`; detailsTotalCarbs.textContent = `${totalCarbs.toFixed(1)}g`; detailsTotalFat.textContent = `${totalFat.toFixed(1)}g`;
        detailsDietaryFiber.textContent = `${totalFiber.toFixed(1)}g`; detailsTotalSugars.textContent = `${totalSugars.toFixed(1)}g`;
        detailsCholesterol.textContent = `${totalCholesterol.toFixed(0)}mg`; detailsSodium.textContent = `${totalSodium.toFixed(0)}mg`;
        const totalCaloricMacros = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
        let pPercent = 0, cPercent = 0, fPercent = 0;
        if (totalCaloricMacros > 0) {
            pPercent = ((totalProtein * 4) / totalCaloricMacros) * 100; cPercent = ((totalCarbs * 4) / totalCaloricMacros) * 100; fPercent = ((totalFat * 9) / totalCaloricMacros) * 100;
        }
        distProteinPercentSpan.textContent = `${pPercent.toFixed(0)}%`; distCarbsPercentSpan.textContent = `${cPercent.toFixed(0)}%`; distFatPercentSpan.textContent = `${fPercent.toFixed(0)}%`;
        updateCssPieChart(pPercent, cPercent, fPercent);
    }
    function updateCssPieChart(proteinP, carbsP, fatP) {
        const pColor = getComputedStyle(document.documentElement).getPropertyValue('--protein-color').trim();
        const cColor = getComputedStyle(document.documentElement).getPropertyValue('--carbs-color').trim();
        const fColor = getComputedStyle(document.documentElement).getPropertyValue('--fat-color').trim();
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim();
        let gradientString = `${bgColor} 0% 100%`;
        if (proteinP + carbsP + fatP > 0.1) {
            const pEnd = proteinP; const cEnd = proteinP + carbsP; const pDisplayEnd = Math.min(pEnd, 100); const cDisplayEnd = Math.min(cEnd, 100);
            gradientString = `${pColor} 0% ${pDisplayEnd.toFixed(1)}%, ${cColor} ${pDisplayEnd.toFixed(1)}% ${cDisplayEnd.toFixed(1)}%, ${fColor} ${cDisplayEnd.toFixed(1)}% 100%`;
        }
        if (summaryPieChartDiv) summaryPieChartDiv.style.backgroundImage = `conic-gradient(${gradientString})`;
    }

    // --- Modal Management ---
    function openModal(modalElement) {
        if (modalElement) {
            modalElement.classList.add('active');
            if (modalElement.id === 'addFoodModal') {
                foodSearchInput.value = ''; searchResultsDropdown.innerHTML = ''; searchResultsDropdown.classList.remove('visible');
                selectedFoodPreviewArea.classList.remove('visible'); foodQuantityInput.value = ''; currentSelectedFood = null;
            }
        }
    }
    function closeModal(modalElement) { if (modalElement) modalElement.classList.remove('active'); }

    // --- Calendar Modal Logic ---
    function openCalendar() { calendarViewDate = new Date(currentDate + 'T00:00:00'); renderCalendar(); openModal(calendarModal); }
    function renderCalendar() {
        const year = calendarViewDate.getFullYear(); const month = calendarViewDate.getMonth();
        calendarMonthYearText.textContent = calendarViewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
        calendarDaysGrid.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dayOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
        for (let i = 0; i < dayOffset; i++) { const emptyCell = document.createElement('span'); emptyCell.classList.add('empty-day'); calendarDaysGrid.appendChild(emptyCell); }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('span'); dayCell.textContent = day; dayCell.dataset.day = day; dayCell.dataset.month = month; dayCell.dataset.year = year;
            const cellDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            if (cellDateStr === currentDate) dayCell.classList.add('selected-day-marker');
            const todayCheck = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
            const cellDateCheck = new Date(year, month, day);
            if (cellDateCheck.getTime() === todayCheck.getTime()) dayCell.classList.add('today-marker');
            calendarDaysGrid.appendChild(dayCell);
        }
    }
    function handleCalendarNav(offset) { calendarViewDate.setMonth(calendarViewDate.getMonth() + offset); renderCalendar(); }
    function handleCalendarDayClick(event) {
        const target = event.target;
        if (target.tagName === 'SPAN' && target.dataset.day) {
            const day = parseInt(target.dataset.day); const month = parseInt(target.dataset.month); const year = parseInt(target.dataset.year);
            currentDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            updateHeaderDateDisplay(); loadDailyLog(currentDate);
            if (reportsPage.classList.contains('active-page')) { populateReportFilters(); generateReport(); }
            closeModal(calendarModal);
        }
    }
    function goToTodayInCalendar() { calendarViewDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()); renderCalendar(); }

    // --- Add Food Modal Logic ---
    function normalizeTextForSearch(text) {
        if (!text) return "";
        return text.toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function handleFoodSearch(e) {
        const searchTermRaw = e.target.value.trim();
        searchResultsDropdown.innerHTML = '';

        if (searchTermRaw.length < 2) {
            searchResultsDropdown.classList.remove('visible');
            return;
        }

        const normalizedSearchTerm = normalizeTextForSearch(searchTermRaw);
        const searchTermsArray = normalizedSearchTerm.split(' ').filter(term => term.length > 0);

        if (searchTermsArray.length === 0) {
            searchResultsDropdown.classList.remove('visible');
            return;
        }

        const filteredFoods = allFoodsData.filter(food => {
            const normalizedFoodName = normalizeTextForSearch(food.name);
            return searchTermsArray.every(term => normalizedFoodName.includes(term));
        }).slice(0, 10);

        if (filteredFoods.length > 0) {
            filteredFoods.forEach(food => {
                const div = document.createElement('div');
                div.textContent = food.name;
                div.addEventListener('click', () => selectFoodForPreview(food));
                searchResultsDropdown.appendChild(div);
            });
            searchResultsDropdown.classList.add('visible');
        } else {
            searchResultsDropdown.classList.remove('visible');
        }
    }

    function updateCustomFoodModalLabels() {
        const selectedTypeRadio = document.querySelector('input[name="customFoodEntryType"]:checked');
        if (!selectedTypeRadio) return;
        const selectedType = selectedTypeRadio.value;
        if (selectedType === "100g") {
            customFoodNameLabel.textContent = "Yiyecek Adı:"; customFoodNameInput.placeholder = "Örn: Çiğ Badem";
            customFoodCaloriesLabel.textContent = "Kalori (kcal / 100g):"; customFoodCaloriesInput.placeholder = "100g başına kalori";
            customFoodProteinLabel.textContent = "Protein (g / 100g):"; customFoodProteinInput.placeholder = "100g başına protein";
            customFoodCarbsLabel.textContent = "Karbonhidrat (g / 100g):"; customFoodCarbsInput.placeholder = "100g başına karbonhidrat";
            customFoodFatLabel.textContent = "Yağ (g / 100g):"; customFoodFatInput.placeholder = "100g başına yağ";
        } else {
            customFoodNameLabel.textContent = "Yiyecek Adı (Porsiyon Bilgisiyle):"; customFoodNameInput.placeholder = "Örn: Ev Yapımı Kurabiye (1 adet)";
            customFoodCaloriesLabel.textContent = "Kalori (kcal / porsiyon):"; customFoodCaloriesInput.placeholder = "Porsiyon başına kalori";
            customFoodProteinLabel.textContent = "Protein (g / porsiyon):"; customFoodProteinInput.placeholder = "Porsiyon başına protein";
            customFoodCarbsLabel.textContent = "Karbonhidrat (g / porsiyon):"; customFoodCarbsInput.placeholder = "Porsiyon başına karbonhidrat";
            customFoodFatLabel.textContent = "Yağ (g / porsiyon):"; customFoodFatInput.placeholder = "Porsiyon başına yağ";
        }
    }
    function setupCustomFoodModalDynamicLabels() {
        if(openAddCustomFoodModalBtn) {
            openAddCustomFoodModalBtn.addEventListener('click', () => {
                const portionRadio = document.getElementById('entryTypePortion');
                if (portionRadio) portionRadio.checked = true;
                updateCustomFoodModalLabels();
            });
        }
    }

    function selectFoodForPreview(food) {
        currentSelectedFood = food;
        searchResultsDropdown.classList.remove('visible');
        foodSearchInput.value = food.name;
        previewFoodName.textContent = food.originalName || food.name;
        quantityUnitSelect.innerHTML = '';
        const baseCalories = food.caloriesPer100g || 0; const baseProtein = food.proteinPer100g || 0;
        const baseCarbs = food.carbsPer100g || 0; const baseFat = food.fatPer100g || 0;
        if (food.isCustomEntry) {
            if (food.baseUnit === "100g") {
                previewFoodPortionInfo.textContent = `100g`; previewFoodCalories.textContent = baseCalories.toFixed(0);
                previewFoodProtein.textContent = baseProtein.toFixed(1); previewFoodCarbs.textContent = baseCarbs.toFixed(1); previewFoodFat.textContent = baseFat.toFixed(1);
                const gramOption = document.createElement('option'); gramOption.value = "g"; gramOption.textContent = "gram"; gramOption.dataset.gramWeight = "1";
                quantityUnitSelect.appendChild(gramOption); quantityUnitSelect.value = "g"; foodQuantityInput.value = "100"; foodQuantityInput.placeholder = "Miktar (g)";
            } else {
                previewFoodPortionInfo.textContent = `1 porsiyon`; previewFoodCalories.textContent = baseCalories.toFixed(0);
                previewFoodProtein.textContent = baseProtein.toFixed(1); previewFoodCarbs.textContent = baseCarbs.toFixed(1); previewFoodFat.textContent = baseFat.toFixed(1);
                const porsiyonOption = document.createElement('option'); porsiyonOption.value = "porsiyon"; porsiyonOption.textContent = "porsiyon";
                quantityUnitSelect.appendChild(porsiyonOption); quantityUnitSelect.value = "porsiyon"; foodQuantityInput.value = "1"; foodQuantityInput.placeholder = "Pors. Adedi";
            }
        } else {
            const gramOption = document.createElement('option'); gramOption.value = "g"; gramOption.textContent = "gram"; gramOption.dataset.gramWeight = "1";
            quantityUnitSelect.appendChild(gramOption);
            if (food.foodPortions && food.foodPortions.length > 0) {
                food.foodPortions.forEach(portion => {
                    if (portion.gramWeight && portion.description) {
                        const portionOption = document.createElement('option'); portionOption.value = portion.gramWeight.toString();
                        portionOption.textContent = `${portion.description} (${portion.gramWeight.toFixed(0)}g)`; portionOption.dataset.gramWeight = portion.gramWeight.toString(); portionOption.dataset.portionName = portion.description;
                        quantityUnitSelect.appendChild(portionOption);
                    }
                });
            }
            quantityUnitSelect.value = "g"; foodQuantityInput.value = "100"; foodQuantityInput.placeholder = "Miktar (g)";
            updatePreviewForSelectedUnit();
        }
        selectedFoodPreviewArea.classList.add('visible'); foodQuantityInput.focus();
    }

    function handleQuantityUnitChange() {
        if (!currentSelectedFood) return;
        const selectedOption = quantityUnitSelect.options[quantityUnitSelect.selectedIndex]; const unitValue = selectedOption.value;
        if (currentSelectedFood.isCustomEntry) {
            if (currentSelectedFood.baseUnit === "100g") foodQuantityInput.value = "100";
            else foodQuantityInput.value = "1";
        } else {
            if (unitValue === "g") { foodQuantityInput.value = "100"; foodQuantityInput.placeholder = "Miktar (g)"; }
            else { foodQuantityInput.value = "1"; foodQuantityInput.placeholder = "Pors. Adedi"; }
            updatePreviewForSelectedUnit();
        }
    }

    function updatePreviewForSelectedUnit() {
        if (!currentSelectedFood || currentSelectedFood.isCustomEntry) return;
        const selectedOption = quantityUnitSelect.options[quantityUnitSelect.selectedIndex];
        const baseGramWeightForUnit = parseFloat(selectedOption.dataset.gramWeight);
        let displayPortionInfo = "100g"; let effectiveGramWeightForPreview = 100;
        if (selectedOption.value !== "g") {
            displayPortionInfo = selectedOption.dataset.portionName || "1 porsiyon";
            effectiveGramWeightForPreview = baseGramWeightForUnit;
        }
        const factor = effectiveGramWeightForPreview / 100.0;
        previewFoodPortionInfo.textContent = displayPortionInfo;
        previewFoodCalories.textContent = (currentSelectedFood.caloriesPer100g * factor).toFixed(0);
        previewFoodProtein.textContent = (currentSelectedFood.proteinPer100g * factor).toFixed(1);
        previewFoodCarbs.textContent = (currentSelectedFood.carbsPer100g * factor).toFixed(1);
        previewFoodFat.textContent = (currentSelectedFood.fatPer100g * factor).toFixed(1);
    }

    function handleAddFoodItem() {
        if (!currentSelectedFood) { alert("Lütfen listeden bir yiyecek seçin."); return; }
        const quantity = parseFloat(foodQuantityInput.value);
        if (isNaN(quantity) || quantity <= 0) { alert("Lütfen geçerli bir miktar girin."); return; }
        const selectedMealType = mealTypeSelect.value; let foodToAdd;
        const baseValues = {
            calories: currentSelectedFood.caloriesPer100g || 0, protein: currentSelectedFood.proteinPer100g || 0, carbs: currentSelectedFood.carbsPer100g || 0, fat: currentSelectedFood.fatPer100g || 0,
            fiber: currentSelectedFood.fiberPer100g || 0, sugars: currentSelectedFood.sugarsPer100g || 0, cholesterol: currentSelectedFood.cholesterolPer100g || 0, sodium: currentSelectedFood.sodiumPer100g || 0,
        };
        if (currentSelectedFood.isCustomEntry) {
            let finalNutrients = {}; let unitForLog;
            if (currentSelectedFood.baseUnit === "100g") {
                const factor = quantity / 100.0; Object.keys(baseValues).forEach(key => finalNutrients[key] = baseValues[key] * factor); unitForLog = 'g';
            } else {
                Object.keys(baseValues).forEach(key => finalNutrients[key] = baseValues[key] * quantity); unitForLog = 'porsiyon';
            }
            foodToAdd = {
                id: `food-${Date.now()}`, name: currentSelectedFood.originalName || currentSelectedFood.name, quantity: quantity,
                calories: parseFloat(finalNutrients.calories.toFixed(0)), protein: parseFloat(finalNutrients.protein.toFixed(1)), carbs: parseFloat(finalNutrients.carbs.toFixed(1)), fat: parseFloat(finalNutrients.fat.toFixed(1)),
                fiber: parseFloat(finalNutrients.fiber.toFixed(1)), sugars: parseFloat(finalNutrients.sugars.toFixed(1)), cholesterol: parseFloat(finalNutrients.cholesterol.toFixed(1)), sodium: parseFloat(finalNutrients.sodium.toFixed(1)),
                fdcId: currentSelectedFood.fdcId, isCustomEntryItem: true, unit: unitForLog
            };
        } else {
            const selectedUnitOption = quantityUnitSelect.options[quantityUnitSelect.selectedIndex];
            const unitGramWeight = parseFloat(selectedUnitOption.dataset.gramWeight);
            const unitNameForLog = selectedUnitOption.value === "g" ? "g" : (selectedUnitOption.dataset.portionName || "porsiyon");
            const totalGrams = selectedUnitOption.value === "g" ? quantity : quantity * unitGramWeight; const factor = totalGrams / 100.0;
            foodToAdd = {
                id: `food-${Date.now()}`, name: currentSelectedFood.name, quantity: quantity,
                calories: parseFloat((baseValues.calories * factor).toFixed(0)), protein: parseFloat((baseValues.protein * factor).toFixed(1)), carbs: parseFloat((baseValues.carbs * factor).toFixed(1)), fat: parseFloat((baseValues.fat * factor).toFixed(1)),
                fiber: parseFloat((baseValues.fiber * factor).toFixed(1)), sugars: parseFloat((baseValues.sugars * factor).toFixed(1)), cholesterol: parseFloat((baseValues.cholesterol * factor).toFixed(1)), sodium: parseFloat((baseValues.sodium * factor).toFixed(1)),
                fdcId: currentSelectedFood.fdcId, isCustomEntryItem: false, unit: unitNameForLog
            };
        }
        if (!loggedData[currentDate].meals[selectedMealType]) loggedData[currentDate].meals[selectedMealType] = [];
        loggedData[currentDate].meals[selectedMealType].push(foodToAdd);
        saveDailyLog(currentDate); renderMealList(selectedMealType, currentDate); updateAllSummariesForDate(currentDate); closeModal(addFoodModal);
    }

    // --- Custom Food Modal Logic ---
    function resetCustomFoodModal() {
        customFoodNameInput.value = ''; customFoodCaloriesInput.value = ''; customFoodProteinInput.value = ''; customFoodCarbsInput.value = ''; customFoodFatInput.value = '';
        const portionRadio = document.getElementById('entryTypePortion'); if (portionRadio) portionRadio.checked = true;
        updateCustomFoodModalLabels();
    }
    function handleSaveCustomFood() {
        const foodName = customFoodNameInput.value.trim(); const calories = parseFloat(customFoodCaloriesInput.value);
        const protein = parseFloat(customFoodProteinInput.value) || 0; const carbs = parseFloat(customFoodCarbsInput.value) || 0; const fat = parseFloat(customFoodFatInput.value) || 0;
        const entryType = document.querySelector('input[name="customFoodEntryType"]:checked').value;
        if (!foodName) { alert(entryType === "portion" ? "Lütfen yiyeceğe bir ad verin (porsiyon bilgisiyle)." : "Lütfen yiyeceğe bir ad verin."); return; }
        if (isNaN(calories) || calories < 0) { alert("Lütfen geçerli bir kalori değeri girin."); return; }
        const newCustomFoodEntry = {
            name: foodName, isCustomEntry: true, baseUnit: entryType, calories: calories, protein: protein, carbs: carbs, fat: fat,
            fiber: 0, sugars: 0, cholesterol: 0, sodium: 0, fdcId: `custom-${Date.now()}`
        };
        let customFoodEntries = JSON.parse(localStorage.getItem(CUSTOM_FOOD_STORAGE_KEY)) || [];
        const existingEntryIndex = customFoodEntries.findIndex(cf => cf.name.toLowerCase() === foodName.toLowerCase() && cf.baseUnit === entryType);
        if (existingEntryIndex > -1) {
            if (!confirm(`"${foodName}" (${entryType === "100g" ? "100g başına" : "porsiyon başına"}) adında bir yiyecek bilgisi zaten mevcut. Üzerine yazılsın mı?`)) return;
            customFoodEntries[existingEntryIndex] = newCustomFoodEntry;
        } else customFoodEntries.push(newCustomFoodEntry);
        localStorage.setItem(CUSTOM_FOOD_STORAGE_KEY, JSON.stringify(customFoodEntries));
        alert(`"${foodName}" yiyecek bilgisi kaydedildi!`); closeModal(addCustomFoodModal); loadCustomFoodEntriesIntoAllFoodsData();
    }
    function loadCustomFoodEntriesIntoAllFoodsData() {
        allFoodsData = allFoodsData.filter(food => !food.isCustomEntry);
        const customFoodEntries = JSON.parse(localStorage.getItem(CUSTOM_FOOD_STORAGE_KEY)) || [];
        customFoodEntries.forEach(customEntry => {
            let nameForSearch = customEntry.name;
            if (customEntry.baseUnit === "100g") nameForSearch = `${customEntry.name} (Özel - 100g)`;
            else nameForSearch = `${customEntry.name} (Özel - Pors.)`;
            allFoodsData.push({
                name: nameForSearch, originalName: customEntry.name, caloriesPer100g: customEntry.calories, proteinPer100g: customEntry.protein, carbsPer100g: customEntry.carbs, fatPer100g: customEntry.fat,
                fiberPer100g: customEntry.fiber || 0, sugarsPer100g: customEntry.sugars || 0, cholesterolPer100g: customEntry.cholesterol || 0, sodiumPer100g: customEntry.sodium || 0,
                isCustomEntry: true, baseUnit: customEntry.baseUnit, fdcId: customEntry.fdcId, foodPortions: []
            });
        });
    }

    // --- Weight Management ---
    function handleSaveWeight() {
        const weight = parseFloat(dailyWeightInput.value);
        if (!isNaN(weight) && weight > 0) {
            if (!loggedData[currentDate]) loggedData[currentDate] = { meals: { breakfast: [], lunch: [], dinner: [] }, weight: null, targets: { ...DEFAULT_TARGETS } };
            loggedData[currentDate].weight = weight; saveDailyLog(currentDate);
            const dateForMsg = new Date(currentDate + 'T00:00:00');
            if(weightFeedbackMessage) {
                weightFeedbackMessage.textContent = `${dateForMsg.toLocaleDateString('tr-TR', {day:'numeric', month:'long'})} için kilo kaydedildi: ${weight} kg`;
                weightFeedbackMessage.style.color = 'var(--accent-primary)';
                setTimeout(() => { if (weightFeedbackMessage.textContent.includes('için kilo kaydedildi')) weightFeedbackMessage.textContent = ''; }, 3000);
            }
            if (reportsPage.classList.contains('active-page')) generateReport();
        } else {
            if(weightFeedbackMessage) { weightFeedbackMessage.textContent = "Lütfen geçerli bir kilo girin."; weightFeedbackMessage.style.color = 'var(--accent-secondary)'; }
        }
    }

    // --- Page Navigation ---
    function navigateToPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
        const targetPage = document.getElementById(pageId); if(targetPage) targetPage.classList.add('active-page');
        if(navDailyLog) navDailyLog.classList.toggle('active-nav', pageId === 'dailyLogPage');
        if(navReports) navReports.classList.toggle('active-nav', pageId === 'reportsPage');
    }

    // --- Reports Page Logic ---
    function populateReportFilters() {
        const years = new Set(); const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        if(reportMonthSelect) {
            reportMonthSelect.innerHTML = ''; months.forEach((month, index) => { const option = document.createElement('option'); option.value = index; option.textContent = month; reportMonthSelect.appendChild(option); });
        }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('calorieTracker-') && key.endsWith('-v3')) {
                const dateStr = key.substring('calorieTracker-'.length, key.length - '-v3'.length);
                if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                     try { const year = new Date(dateStr + 'T00:00:00').getFullYear(); if(!isNaN(year)) years.add(year); } catch (e) { /* Ignore */ }
                }
            }
        }
        if(reportYearSelect) {
            reportYearSelect.innerHTML = ''; const sortedYears = Array.from(years).sort((a,b) => b - a);
            if (sortedYears.length === 0) sortedYears.push(new Date().getFullYear());
            sortedYears.forEach(year => { const option = document.createElement('option'); option.value = year; option.textContent = year; reportYearSelect.appendChild(option); });
            const currentDisplayDate = new Date(currentDate + 'T00:00:00');
            if(reportMonthSelect) reportMonthSelect.value = currentDisplayDate.getMonth();
            if (sortedYears.includes(currentDisplayDate.getFullYear())) reportYearSelect.value = currentDisplayDate.getFullYear();
            else if (sortedYears.length > 0) reportYearSelect.value = sortedYears[0];
        }
    }
    function destroyCharts() { if (caloriesChartInstance) caloriesChartInstance.destroy(); if (weightChartInstance) weightChartInstance.destroy(); caloriesChartInstance = null; weightChartInstance = null; }
    function generateReport() {
        destroyCharts(); if(!reportMonthSelect || !reportYearSelect) return;
        const selectedMonth = parseInt(reportMonthSelect.value); const selectedYear = parseInt(reportYearSelect.value);
        if (isNaN(selectedMonth) || isNaN(selectedYear)) { alert("Lütfen geçerli bir ay ve yıl seçin."); return; }
        const calorieData = [], weightData = [], labels = []; const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`; labels.push(day.toString());
            const dailyLogRaw = localStorage.getItem(getStorageKey(dateStr)); let dCalories = null, dWeight = null;
            if (dailyLogRaw) {
                const dailyLog = JSON.parse(dailyLogRaw);
                if (dailyLog.meals) {
                    dCalories = 0; for (const mealType in dailyLog.meals) { if (dailyLog.meals.hasOwnProperty(mealType) && Array.isArray(dailyLog.meals[mealType])) dailyLog.meals[mealType].forEach(f => dCalories += f.calories || 0); }
                }
                dWeight = dailyLog.weight ? parseFloat(dailyLog.weight) : null;
            }
            calorieData.push(dCalories); weightData.push(dWeight);
        }
        const chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
        const chartGridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--font-family').trim();
        const commonChartOptions = (suggestedMin, suggestedMax, stepSize, beginAtZero = false, yLabel = "") => ({
            responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: chartTextColor, font: { family: fontFamily } } }, tooltip: { titleFont: { family: fontFamily}, bodyFont: { family: fontFamily}} },
            scales: { y: { beginAtZero, suggestedMin, suggestedMax, ticks: { color: chartTextColor, stepSize, font: { family: fontFamily } }, grid: { color: chartGridColor }, title: { display: !!yLabel, text: yLabel, color: chartTextColor, font: { family: fontFamily, weight: '500' }}}, x: { ticks: { color: chartTextColor, font: { family: fontFamily }, maxTicksLimit: (daysInMonth > 15 ? Math.ceil(daysInMonth / 2) : daysInMonth) }, grid: { display: false } } }
        });
        const validCals = calorieData.filter(c => c !== null && !isNaN(c)); let maxCal = validCals.length > 0 ? Math.max(0, ...validCals) : (DEFAULT_TARGETS.calories);
        const calStep = Math.max(50, Math.ceil((maxCal * 0.1) / 50) * 50); const sugMaxCal = maxCal > 0 ? Math.ceil((maxCal + calStep * 0.5) / calStep) * calStep : (DEFAULT_TARGETS.calories);
        const caloriesChartCanvas = document.getElementById('caloriesChart');
        if (caloriesChartCanvas) caloriesChartInstance = new Chart(caloriesChartCanvas.getContext('2d'), { type: 'bar', data: { labels, datasets: [{ label: 'Günlük Alınan Kalori', data: calorieData, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim(), backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() + '99', borderWidth: 1, spanGaps: true }] }, options: commonChartOptions(0, sugMaxCal, calStep, true, "Kalori (kcal)") });
        const validWeights = weightData.filter(w => w !== null && !isNaN(w)); let minW = validWeights.length > 0 ? Math.min(...validWeights) : 50; let maxW = validWeights.length > 0 ? Math.max(...validWeights) : 100; let wStep = 1;
        if (validWeights.length > 0) { const range = maxW - minW; if (range < 0.1 && validWeights.length === 1) { minW -= 1; maxW +=1; wStep = 0.5; } else if (range < 0.1 && validWeights.length > 1) { minW -= 0.5; maxW +=0.5; wStep = 0.2; } else if (range < 5) wStep = 0.5; else wStep = Math.max(1, Math.ceil((range * 0.15) / 1) * 1); }
        const sugMinW = validWeights.length > 0 ? Math.floor((minW - wStep * 0.5) / wStep) * wStep : 40; const sugMaxW = validWeights.length > 0 ? Math.ceil((maxW + wStep * 0.5) / wStep) * wStep : 120;
        const weightChartCanvas = document.getElementById('weightChart');
        if (weightChartCanvas) weightChartInstance = new Chart(weightChartCanvas.getContext('2d'), { type: 'line', data: { labels, datasets: [{ label: 'Günlük Kilo', data: weightData, borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim(), backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() + '33', borderWidth: 2, tension: 0.1, fill: false, spanGaps: true }] }, options: commonChartOptions(sugMinW, sugMaxW, wStep, false, "Kilo (kg)") });
    }

    // --- Data Export/Import Functions ---
    function exportData() {
        const dataToExport = { customFoods: JSON.parse(localStorage.getItem(CUSTOM_FOOD_STORAGE_KEY)) || [], dailyLogs: {} };
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('calorieTracker-') && key.endsWith('-v3')) {
                const dateStr = key.substring('calorieTracker-'.length, key.length - '-v3'.length);
                dataToExport.dailyLogs[dateStr] = JSON.parse(localStorage.getItem(key));
            }
        }
        const jsonString = JSON.stringify(dataToExport, null, 2);

        if (exportDataTextarea && exportDataModal) {
            exportDataTextarea.value = jsonString;
            // Reset copy button state in case it was used before
            if (copyExportDataBtn) {
                copyExportDataBtn.innerHTML = '<i class="fas fa-copy"></i> Panoya Kopyala';
                copyExportDataBtn.disabled = false;
            }
            openModal(exportDataModal);
        } else {
            console.error("Export modal elements not found!");
            alert("Dışa aktarma arayüzü yüklenemedi. Lütfen konsolu kontrol edin.");
        }
    }

    function copyExportDataToClipboard() {
        if (!exportDataTextarea || !copyExportDataBtn) return;

        exportDataTextarea.select();
        exportDataTextarea.setSelectionRange(0, 999999); // For mobile devices

        navigator.clipboard.writeText(exportDataTextarea.value)
            .then(() => {
                const originalText = copyExportDataBtn.innerHTML;
                copyExportDataBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
                copyExportDataBtn.disabled = true;
                setTimeout(() => {
                    copyExportDataBtn.innerHTML = originalText;
                    copyExportDataBtn.disabled = false;
                }, 2000);
            })
            .catch(err => {
                console.error('Veri panoya kopyalanamadı: ', err);
                // Fallback or error message if direct copy fails
                try {
                    // Deprecated but might work as a fallback
                    document.execCommand('copy');
                    const originalText = copyExportDataBtn.innerHTML;
                    copyExportDataBtn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı (Fallback)!';
                    copyExportDataBtn.disabled = true;
                    setTimeout(() => {
                        copyExportDataBtn.innerHTML = originalText;
                        copyExportDataBtn.disabled = false;
                    }, 2000);
                } catch (fallbackErr) {
                     console.error('Fallback kopyalama da başarısız oldu: ', fallbackErr);
                    alert('Otomatik kopyalama başarısız oldu. Lütfen metni manuel olarak seçip kopyalayın.');
                }
            });
    }

    function importData(event) {
        const file = event.target.files[0]; if (!file) { if(importExportFeedback) { importExportFeedback.textContent = 'Dosya seçilmedi.'; importExportFeedback.style.color = 'var(--text-secondary)'; } return; }
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result); const confirmed = confirm("UYARI: Mevcut tüm veriler silinip içe aktarılan verilerle değiştirilecektir. Bu işlem geri alınamaz. Emin misiniz?");
                if (!confirmed) { if(importDataInput) importDataInput.value = ''; if(importExportFeedback) { importExportFeedback.textContent = 'İçe aktarma iptal edildi.'; importExportFeedback.style.color = 'var(--text-secondary)'; } return; }
                Object.keys(localStorage).forEach(key => { if (key === CUSTOM_FOOD_STORAGE_KEY || (key.startsWith('calorieTracker-') && key.endsWith('-v3'))) localStorage.removeItem(key); });
                if (importedData.customFoods) localStorage.setItem(CUSTOM_FOOD_STORAGE_KEY, JSON.stringify(importedData.customFoods));
                if (importedData.dailyLogs) { for (const dateStr in importedData.dailyLogs) { if (importedData.dailyLogs.hasOwnProperty(dateStr) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) localStorage.setItem(getStorageKey(dateStr), JSON.stringify(importedData.dailyLogs[dateStr])); } }
                if(importExportFeedback) { importExportFeedback.textContent = 'Veriler başarıyla içe aktarıldı! Değişikliklerin görülmesi için sayfa yenilenecek.'; importExportFeedback.style.color = 'var(--accent-primary)'; }
                setTimeout(() => { location.reload(); }, 2500);
            } catch (error) { console.error("İçe aktarma hatası:", error); if(importExportFeedback) { importExportFeedback.textContent = `Hata: ${error.message}. Lütfen geçerli bir yedekleme dosyası seçin.`; importExportFeedback.style.color = 'var(--accent-secondary)'; }
            } finally { if(importDataInput) importDataInput.value = ''; }
        };
        reader.readAsText(file);
    }

    // --- START THE APP ---
    initializeApp();
});