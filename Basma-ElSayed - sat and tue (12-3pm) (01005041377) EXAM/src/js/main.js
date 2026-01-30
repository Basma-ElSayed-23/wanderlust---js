
//sidebar active with holiday to go to dashboard//

document.addEventListener('click', function(e) {
const target = e.target.closest('#go-dashboard-btn, .empty-state .btn-primary, #go-dashboard-long-weekends');
 if (target) {
    e.preventDefault();
    location.hash = 'dashboard';
    if (typeof showView === 'function') showView('dashboard');

    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.classList.remove('active');
    });
    const dashboardItem = document.querySelector('.nav-item[data-view="dashboard"]');

   if (dashboardItem) {
       dashboardItem.classList.add('active');
    }
 }
});

 let countryTimeInterval;

document.addEventListener('DOMContentLoaded', () =>{
localStorage.removeItem('wanderlust_selected_country');
localStorage.removeItem('wanderlust_selected_country_name');
localStorage.removeItem('wanderlust_selected_year');

    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
   
 const plansKey = 'wanderlust_my_plans';

//global variabls
   let selectedCountry = '';
    let selectedCountryName = '';
    let selectedCity = '';
    let selectedYear = '2026';
    let selectedCountryCode = '';
    let selectedLatitude = 30;
    let selectedLongitude = 31;

    let myPlans = JSON.parse(localStorage.getItem(plansKey)) || [] ;

    //switch to show views//
    function showView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewId}-view`); 
        if (targetView){
            targetView.classList.add('active');
        }


        let title = 'Dashboard'; 
         let subtitle = 'Welcome back! Ready to plan your next adventure?';

        switch (viewId) {
             case 'dashboard':
                title ='Dashboard'
                subtitle = 'Welcome back! Ready to plan your next adventure?'
                break;

            case 'holidays':
                title ='Holidays'
                subtitle = 'Explore public holidays around the world'
                loadHolidays();
                
                break;

                case 'events':
                title ='Events'
                subtitle = 'Find concerts, sports, and entertainment'
                loadEvents();
                break;

                case 'weather':
                title ='Weather'
                subtitle = 'Check forecasts for any destination'
                loadWeather();
                break;

                case 'long-weekends':
                title ='Long Weekends'
                subtitle = 'Find the perfect mini-trip opportunities'
                loadLongWeekends();
                break;

                case 'currency':
                title ='Currency'
                subtitle = 'Convert currencies with live exchange rates'
                convertCurrency();
                break;
                
               

                case 'sun-times':
                title ='Sun Times'
                subtitle = 'Check sunrise and sunset times worldwide'
                break;

                case 'my-plans':
                title ='My Plans'
                subtitle = 'Your saved holidays, events, and trip ideas all in one place'
                loadMyPlans();
                break;
            default:
                break;
        }

        pageTitle.textContent = title;
        pageSubtitle.textContent = subtitle;

        document.getElementById('sidebar').classList.remove('active');

        // if (viewId === 'holidays'){
        //  loadHolidays();
        // }
        
        ///////////////////////////////////////////////////////////////////////////////////////////////

    }
    
     //click on links of sidbars
    navItems.forEach(item => {
        item.addEventListener('click' , (e) => {
            e.preventDefault();
            const viewId = item.getAttribute('data-view');
            location.hash = viewId;
       

            // to update active class 
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

        });
    });



    //hash from window (#)

  window.addEventListener('hashchange' , () => {
    const hash = location.hash.replace('#' , '');
    if (hash) showView(hash);
  });

  const inishialView = location.hash.replace('#' , '') || 'dashboard';
  showView(inishialView);

//

function restoreSavedSelection(){
    const savedCountryCode = localStorage.getItem('wanderlust_selected_country');
    const savedCountryName = localStorage.getItem('wanderlust_selected_country_name');
    const savedYear = localStorage.getItem('wanderlust_selected_year') || '2026';

    const countrySelect = document.getElementById('global-country');
     const yearSelect = document.getElementById('global-year');
     const bar = document.getElementById('selected-destination');

     if (countrySelect) countrySelect.value = '';
     if (yearSelect) yearSelect.value= savedYear;
     if (bar) bar.style.display = 'none';

     //restore only (if) all of both exist//
     if (!savedCountryCode  || ! savedCountryName) return;
   
     selectedCountryCode = savedCountryCode;
     selectedCountryName = savedCountryName;
     selectedYear = savedYear;


const savedLatitude = localStorage.getItem('wanderlust_selected_latitude');
const savedLongitude = localStorage.getItem('wanderlust_selected_longitude');

if (savedLatitude && savedLongitude) {
    selectedLatitude = parseFloat(savedLatitude);
    selectedLongitude = parseFloat(savedLongitude);
}


    if (countrySelect) countrySelect.value = savedCountryCode;
    if (yearSelect) yearSelect.value = savedYear;

    
    if (bar) bar.style.display = 'flex';

  const countryNameEl = document.getElementById('selected-country-name');
  if (countryNameEl) countryNameEl.textContent = savedCountryName;

const cityNameEl = document.getElementById('selected-city-name');
if (cityNameEl) cityNameEl.textContent = '';

const flags = document.getElementById('selected-country-flag');
if (flags){
flags.src = `https://flagcdn.com/w40/${savedCountryCode.toLowerCase()}.png`
} 
}
restoreSavedSelection();
///////////////////////////////////////////////////////////////////////////////////////////////////////////

   //https://date.nager.at/api/v3/AvailableCountries
   const NAGER_API = 'https://date.nager.at/api/v3';
   

   async function loadCountries() {
    try {
        const response = await fetch(`${NAGER_API}/AvailableCountries`);
        const countries = await response.json();
        countries.sort((a,b)=> a.name.localeCompare(b.name));
        const select = document.getElementById('global-country');
        select.innerHTML = '<option value ="">Select Country</option>';

countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.countryCode;
    option.textContent = country.name;
    select.appendChild(option);
});
console.log('✅ countries loading succsesfully' , countries.length);
    }catch (error){
        console.log('❌ Error of loading countries' , error );
    }
   }
   loadCountries();
  
function formatHolidayDate(dateStr) {
    const date = new Date (dateStr);
    return {
        day : date.getDate(),
        month : date.toLocaleString('en-US', {month: 'short'}),
        weekday : date.toLocaleDateString('en-US' , {weekday: 'long'}),
    };
}


//////////////////////////////////////////////////////////

function showToast (message, type = 'info'){
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
const toast = document.createElement('div');
toast.className = `toast toast-${type}`;
toast.innerHTML = `<i class="fa-solid fa-circle-info"></i>
<span>${message}</span>`;
toastContainer.appendChild(toast);
setTimeout(() => toast.classList.add('show'), 100);

setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(()=> toast.remove() , 300);
},3000);
}

//close bttn//
const clearBtn = document.getElementById('clear-selection-btn');

   if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        const bar = document.getElementById('selected-destination');
        const infoSection = document.getElementById('dashboard-country-info-section');
       

      
        if (bar) bar.style.display = 'none';
        if (infoSection) infoSection.style.display = 'none';
        

        const select = document.getElementById('global-country');
        if (select) select.value = '';

        selectedCountryCode = '';
        selectedCountryName = '';
         
   showToast('Selection Cleared');
    });
   }

 

// global countries//

document.getElementById('global-country').addEventListener('change' , function(){
    const selectedOption = this.options[this.selectedIndex];

    selectedCountryName = selectedOption.textContent?.trim() || '';
    selectedCountryCode = this.value || '' ;

    ///
    if(selectedCountryCode && selectedCountryName){
        localStorage.setItem('wanderlust_selected_country', selectedCountryCode);
        localStorage.setItem('wanderlust_selected_country_name', selectedCountryName);
    }
   
const bar = document.getElementById('selected-destination');

if (bar) {
    bar.style.display = selectedCountryName ? 'flex' : 'none';

    const countryNameEl = document.getElementById('selected-country-name');
    if (countryNameEl) countryNameEl.textContent = selectedCountryName;

const cityNameEl = document.getElementById('selected-city-name');
if (cityNameEl) cityNameEl.textContent = '';

const flags = document.getElementById('selected-country-flag');
if (flags && selectedCountryCode){ 
    flags.src = `https://flagcdn.com/w80/${selectedCountryCode.toLowerCase()}.png`;
}
}
updateHolidayCount();
});


document.getElementById('global-search-btn').addEventListener('click',async function (e){
    e.preventDefault();

    if (!selectedCountryCode) {
    showToast('please choose the country first' , 'warning')
    return;
    }

 const infoSection = document.getElementById('dashboard-country-info-section');
 const countryInfo = document.getElementById('dashboard-country-info');
 
     selectedYear = document.getElementById('global-year').value || '2026';

      localStorage.setItem('wanderlust_selected_year' , selectedYear);

   

 showLoadingOverlay('loading information of country...');
 if (infoSection) infoSection.style.display = 'block';
 if (countryInfo) countryInfo.style.display = 'none';

 try{
    const res = await fetch (`https://restcountries.com/v3.1/alpha/${selectedCountryCode}`);
    if (!res.ok) throw new Error('There is a problem loading country data');

    const [data] = await res.json();

selectedLatitude = data.latlng?.[0] || 30;
selectedLongitude = data.latlng?.[1] || 31;


localStorage.setItem('wanderlust_selected_latitude', selectedLatitude);
localStorage.setItem('wanderlust_selected_longitude', selectedLongitude)


    hideLoadingOverlay();
   if (countryInfo) countryInfo.style.display = 'block';

   const timezone = data.timezones ? data.timezones[0] : 'UTC+00:00';
   startDashboardClock(timezone);
   
    document.querySelector('.dashboard-country-title h3').textContent = data.name.common;

    const official = document.querySelector('.official-name');
    if (official) official.textContent = data.name.official || data.name.common;

    const flag = document.querySelector('.dashboard-country-flag');
    if (flag) flag.src = data.flags.png || data.flag.svg;
    
   const region = document.querySelector('.region');
   if (region) {
    region.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.region} • ${data.subregion || data.region}`;
   }
   const values = document.querySelectorAll('.dashboard-country-detail .value');
   if (values.length >= 7) {
            // for capital //
    values[0].textContent = data.capital?.[0] || 'N/A';
           //population//
    values[1].textContent = data.population.toLocaleString('en-US'); 
          //area//
    values[2].textContent = data.area.toLocaleString('en-US') + 'km2'; 
        //continents//
    values[3].textContent = data.continents?.[0] || data.region || 'N/A';
        //phone code //
    const callingCode = data.idd?.root + (data.idd?.suffixes?.[0] || '');
     values[4].textContent = callingCode || 'N/A';
     // Driving Side //
     const drivingSide = data.car?.side;
     values[5].textContent = drivingSide === 'right' ? 'Right' : drivingSide === 'left' ? 'Left' : 'N/A';
    //Week Starts//
   values[6].textContent = data.startOfWeek || 'Monday';
  }
   
  const mapLink = document.querySelector('.btn-map-link');
  if (mapLink) {
    mapLink.href = data.maps.googleMaps;
    mapLink.target = '_blank';
  }

/////////ffffffffffffffffffffffff

const currencyTags = document.querySelector('.dashboard-country-extra:nth-child(1) .extra-tags');
if (currencyTags && data.currencies) {
currencyTags.innerHTML = '';
Object.entries(data.currencies).forEach(([code, currency]) => {
    const tag = document.createElement('span');
    tag.className = 'extra-tag';
    tag.textContent = `${currency.name} (${code}  ${currency.symbol || ''})`;
    currencyTags.appendChild(tag);
} );

}

//languages///

const languageTags = document.querySelector('.dashboard-country-extra:nth-child(2) .extra-tags');
if (languageTags && data.languages){
    languageTags.innerHTML = '';
    Object.values(data.languages).forEach(langu => {
        const tag = document.createElement('span');
        tag.className = 'extra-tag';
        tag.textContent = langu;
        languageTags.appendChild(tag);
    });
}

// update Neighbors//
const neighborsTags = document.querySelector('.dashboard-country-extra:nth-child(3) .extra-tags');
if (neighborsTags && data.borders && data.borders.length > 0) {
    neighborsTags.innerHTML = '';
    data.borders.forEach(border => {
        const tag = document.createElement('span');
        tag.className = 'extra-tag border-tag';
        tag.textContent = border;
        neighborsTags.appendChild(tag);
    });
}else if (neighborsTags){
    neighborsTags.innerHTML = '<span class = "extra-tag"> No exists land borders</span>';
}
showToast(`Exploring ${data.name.common}!` , 'success')
 console.log('download is done' , data.name.common);

 } catch (error){
console.error('There is a problem with the data', error);
hideLoadingOverlay();
showToast('Please try again ,there is a problem with the data', 'error');
 }
});


function startDashboardClock(timezoneStr){
if (countryTimeInterval) clearInterval(countryTimeInterval);

const dashboardTimeEl = document.getElementById('country-local-time');
const dashboardZoneEl = document.querySelector('.local-time-zone');
const headerTimeEl = document.getElementById('current-datetime');

function update(){
    const offsetpart = timezoneStr.replace('UTC', '');
    const sign = offsetpart.startsWith('-') ? -1 : 1;
    const [hours, minutes] = offsetpart.substring(1).split(':').map(Number);
    const totalOffsetMinutes = sign * (hours * 60 + (minutes || 0 ));
    const currentTime = new Date();
    const utcDate = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000));
    const localDate = new Date(utcDate.getTime() +(totalOffsetMinutes * 60000));
     const timeString = localDate.toLocaleTimeString('en-US' , {
         hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
            });

   //date//
   const dateString = localDate.toLocaleDateString('en-US',{
    weekday: 'short',
    month: 'short',
    day: 'numeric'
   });

   // update the elements of page//
  if (dashboardTimeEl) dashboardTimeEl.textContent = timeString;
  if (dashboardZoneEl) dashboardZoneEl.textContent = timezoneStr;
   if (headerTimeEl) headerTimeEl.textContent = `${dateString}, ${timeString}`;
  }
update();
// countryTimeInterval = setInterval(update, 1000);

}
//

function showLoadingOverlay(message = 'About to Loading...'){
    const overlay = document.getElementById('loading-overlay');
    const textLoad = document.getElementById('loading-text');

    if (overlay) overlay.classList.remove('hidden');
    if (textLoad) textLoad.textContent = message;
    }
    function hideLoadingOverlay(){
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');
    }
    async function updateHolidayCount() {
        if (!selectedCountryCode || !selectedYear ) return;

        try{
        const response = await fetch(`${NAGER_API}/PublicHolidays/${selectedYear}/${selectedCountryCode}`);
        const holiday = await response.json();

        const statHolidays = document.getElementById('stat-holidays');
        if( statHolidays){
            statHolidays.textContent = holiday.length;
        }
    }catch(error){
        console.error('There is a problem when updating holidays count;', error);
    }
}


    async function loadHolidays() {
        const content = document.getElementById('holidays-content');
        const emptyState = document.getElementById('empty-holidays');
        const selection = document.getElementById('holidays-selection');

        if (!selectedCountryCode) {
            if (content) content.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            return;

////////////ffff
//////////ffffffffffff

        }
        if (emptyState) emptyState.style.display = 'none';
        showLoadingOverlay ('please wait, the holiday is being loaded...');

        try {
        const response = await fetch(`${NAGER_API}/PublicHolidays/${selectedYear}/${selectedCountryCode}`);
        const holidays = await response.json();

        hideLoadingOverlay();

        if (selection) {
            selection.innerHTML = `
            <div class="current-selection-badge">
                <img src="https://flagcdn.com/w40/${selectedCountryCode.toLowerCase()}.png" alt="${selectedCountryName}" class="selection-flag">
                <span>${selectedCountryName}</span>
                <span class="selection-year">${selectedYear}</span>
              </div>
            `;

            if (holidays.length === 0){
                content.innerHTML = '<div class="empty-state"><h3> No holidays found</h3></div>';
                return;
            }
        }
        content.innerHTML = '';
        holidays.forEach(holiday => {
            const dateInfo = formatHolidayDate(holiday.date);
            const isSaved = myPlans.some(p => p.id ===holiday.date && p.type === 'holiday');

            const card = document.createElement('div');
            card.className = 'holiday-card';
            card.innerHTML = `<div class = "holiday-card-header">
           <div class = "holiday-date-box">
           <span class ="day">${dateInfo.day}</span>
           </div>
           <button class = "holiday-action-btn" data-id = "${holiday.date}" data-name = "${holiday.name}" data-type = "holiday">
           <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart"></i>
           </button>
           </div>
           <h3>${holiday.localName || holiday.name}</h3>
           <p class = "holiday-name">${holiday.name}</p>
           <div class ="holiday-card-footer"> <span class="holiday-day-badge">
        <i class="fa-regular fa-calendar"></i> ${dateInfo.weekday}</span>
        <span class="holiday-type-badge">${holiday.types[0] || 'public'}</span>
           </div>
            `;
            content.appendChild(card);
        });
        document.querySelectorAll('.holiday-action-btn').forEach(btn => {
            btn.addEventListener('click' , function(){
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const type = this.getAttribute('data-type');
                togglePlan(id , name , type , this);
            });
        });
     showToast(`Loaded ${holidays.length} holidays` , 'success');
        } catch(error){
        hideLoadingOverlay();
        console.error('Error for loading holidays' , error);
        showToast('Error for loading holidays' , 'error');
        content.innerHTML = '<div class ="empty-state"><h3>Error for loading holidays</h3></div>';
        }
    }

async function loadLongWeekends() {
    const content = document.getElementById('lw-content');

    if (!selectedCountryCode) {
    if (content) content.style.display = 'none';

    const emptyState = document.getElementById('empty-long-weekends');

    if (emptyState) emptyState.style.display = 'flex';

    return;
}

    showLoadingOverlay('Find long weekends....');
    try{
        const response = await fetch (`${NAGER_API}/LongWeekend/${selectedYear}/${selectedCountryCode}`);
        const longWeekends = await response.json();

        hideLoadingOverlay();

        if (!longWeekends || longWeekends.length === 0){
            content.innerHTML = '<div class = "empty-state"><h3> long weekends not found </h3></div>';
            return;
        }
        content.innerHTML = '';
        longWeekends.forEach((lw, index) => {
        const needsBridge = lw.needBridgeDay;
        const dayCount = lw.dayCount;
        const startDate = new Date(lw.startDate);
        const endDate = new Date(lw.endDate);
        const isSaved = myPlans.some(p => p.id === `lw-${selectedCountryCode}-${index}` && p.type === 'longweekend');
      
        const card = document.createElement('div');
        card.className = 'lw-card';
        card.innerHTML = `<div class="lw-card-header">
                <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i>${dayCount} Days </span>
                <button class="holiday-action-btn" data-id = "lw-${selectedCountryCode}-${index}" data-name = "Long Weekend ${index + 1}" data-type = "longweekend">
                <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart"></i></button>
              </div>
              <h3>Long Weekend #${index + 1}</h3>
              <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${startDate.toLocaleDateString('en-US', {month: 'short', day:'numeric'})} - 
              ${endDate.toLocaleDateString('en-US', {month: 'short', day:'numeric', year: 'numeric'})}
              </div>
              <div class="lw-info-box ${needsBridge ? 'warning' : 'success'}">
              <i class="fa-solid fa-${needsBridge ? 'info' : 'check'}-circle"></i> 
              ${needsBridge ? 'requires taking a bridge day off' : 'No extra days off Needed !'}</div>`;
              content.appendChild(card);

        });
    
        document.querySelectorAll('.holiday-action-btn').forEach(btn => {
            btn.addEventListener('click' , function(){
           const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
             const type = this.getAttribute('data-type');
             togglePlan (id , name , type , this);
            });
        });
             
       showToast(`found ${longWeekends.length} long weekends` , 'success');
    }catch (error) {
        hideLoadingOverlay();
        console.error('Error loading long weekends:' , error);
        showToast('Error loading long weekends' , 'error');
    }
}
   
//togglePlan function//
function togglePlan(id, name , type, button ){
const existingIndex = myPlans.findIndex(p => p.id === id && p.type === type);
if (existingIndex > -1)  {
   myPlans.splice(existingIndex, 1);
   button.querySelector('i').classList.remove('fa-solid');
   button.querySelector('i').classList.add('fa-regular');
   showToast('Removed from plans' , 'info');
}else {
myPlans.push({id , name , type , country: selectedCountryName });
button.querySelector('i').classList.remove('fa-regular');
   button.querySelector('i').classList.add('fa-solid');
   showToast('Added to plans' , 'success');
} 
localStorage.setItem(plansKey, JSON.stringify(myPlans));
updatePlansCount();
updateMyPlansTabsCount();

}
    
document.getElementById('clear-all-plans-btn')?.addEventListener('click', () => {
    myPlans = []
    localStorage.removeItem(plansKey);
    updatePlansCount();
    loadMyPlans();
    updateMyPlansTabsCount();
    showToast('All Plans Cleared', 'info');
});

     
    function updatePlansCount(){
        const badge = document.getElementById('plans-count');
    const statSaved = document.getElementById('stat-saved');
    
    if (badge) {
        if (myPlans.length > 0){
        badge.textContent = myPlans.length;
        badge.classList.remove('hidden');
        }else {
            badge.classList.add('hidden');
        }
    }
if (statSaved) {
    statSaved.textContent= myPlans.length;
}
    }
    


function updateMyPlansTabsCount() {
    const allBtns = document.querySelector('.plan-filter[data-filter="all"]');
    if (allBtns) {
        const countSpan = allBtns.querySelector('.filter-count');
        if (countSpan) {
            countSpan.textContent = myPlans.length;
        }
    }
 const holidaysBtns = document.querySelector('.plan-filter[data-filter="holiday"]');

    if (holidaysBtns) {
    const countSpan = holidaysBtns.querySelector('.filter-count');
    if (countSpan){
        countSpan.textContent = myPlans.filter(p => p.type === 'holiday').length;
    }
  }

const eventsBtns = document.querySelector('.plan-filter[data-filter="event"]');
if (eventsBtns) {
    const countSpan = eventsBtns.querySelector('.filter-count');

    if (countSpan) {
        countSpan.textContent = myPlans.filter(p => p.type === 'event').length;
    }
}

const lwBtns = document.querySelector('.plan-filter[data-filter = "longweekend"]');
 if (lwBtns) {
        const countSpan = lwBtns.querySelector('.filter-count');

        if (countSpan) {
            countSpan.textContent = myPlans.filter(p => p.type === 'longweekend').length;
        }
    }
/////////////////////////
}

   function loadMyPlans(){
        const content = document.getElementById('plans-content');

        if (!selectedCountryCode) {
            content.innerHTML = `
            <div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-heart-globe"></i></div>
              <h3>No Saved Plans Yet</h3>
              <p>Start exploring and save holidays, events, or long weekends you like!</p>
              <button class="btn-primary" id="start-exploring-btn">
               <i class="fa-solid fa-compass"></i> Start Exploring
              </button>
            </div>
            `;
        
         document.getElementById('start-exploring-btn')?.addEventListener('click', () => {
            location.hash = 'dashboard';
         });
    
         return;
        
        }
          else {  
        content.innerHTML = '';
        myPlans.forEach((plan) => {
            const card = document.createElement('div');
            card.className = 'saved-plans-card';
            card.dataset.type = plan.type;
            let dateDisplay = '';
            let dayNum = '';
            let monthShort = '';

            if (plan.id && plan.id.match(/\d{4}-\d{2}-\d{2}/)) {
                const date = new Date(plan.id);
                dayNum = date.getDate();
                monthShort = date.toLocaleDateString('en-US', {month: 'short'}).toUpperCase();
                dateDisplay = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        
        

            let badgeClass = 'holiday-badge';
            if (plan.type === 'event' ) badgeClass = 'event-badge';
            if (plan.type === 'longweekend') badgeClass = 'longweekend-badge';

        

        card.innerHTML = `
        <div class="saved-plan-header">
        ${dayNum ? `
            <div class="saved-plan-date-box">
            <span class = "month">${monthShort}</span>
            </div>`:
            `<div class = "saved-plan-badge ${badgeClass}">
            ${plan.type.toUpperCase()}
            </div>
            `}
           <button class="holiday-action-btn saved" data-id="${plan.id}" data-type="${plan.type}">
                <i class="fa-solid fa-heart"></i> 
              </button>
              </div>
               <div class="saved-plan-body">
               <h3>${plan.name}</h3>
               ${plan.localName ? `<p class = "saved-plan-local-name">${plan.localName}</p>` : ''}

               <div class= "saved-plan-footer">
               ${dateDisplay ? `<span class="saved-plan-day-badge">
                <i class="fa-regular fa-calendar"></i>${dateDisplay}
                </span> ` : ''}
                <span class= "saved-plan-type-badge ${badgeClass}">${plan.type}</span>
                </div>
                 <button class="saved-plan-remove-btn" data-id="${plan.id}" data-type="${plan.type}">
                 <i class="fa-solid fa-trash"></i> Remove </button> `;

                 content.appendChild(card);
        });

      //Add Event to remove bttn//
      document.querySelectorAll('.saved-plan-remove-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation();


    const id = this.getAttribute('data-id');
    const type = this.getAttribute('data-type');

    const plan = myPlans.find(p => p.id === id && p.type === type);

    if (plan) {
    showConfirmDialog(plan.name, () => {
        const index = myPlans.findIndex(p => p.id === id && p.type === type);
     
        if (index > -1){
            myPlans.splice(index, 1);
            localStorage.setItem(plansKey, JSON.stringify(myPlans));
            updatePlansCount();
            updateMyPlansTabsCount();
            loadMyPlans();
            showToast(  'The plan has been deleted'    ,   'success');
        }
    });
    }
    });
      });
    }
                        updateMyPlansTabsCount();
    
// function showSuccessDialog(){
//           const overlay = document.createElement('div');
//             overlay.className = 'confirm-dialog-overlay';

//               overlay.innerHTML = `<div class = "confirm-dialog success-dialog">
//                     <div class = "confirm-dialog-icon success">
//                     <i class="fa-solid fa-check"></i>
//                     </div>   
//                     <h3>Removed</h3> 
//                     <p>The plan has been removed.</p>        
//                    </div>`;

//                    document.body.appendChild(overlay);

//                    //will close after 1.5 second////
//                    setTimeout(() => {
//                     overlay.remove();
//                    }, 1500);
//                  }   
    
    document.getElementById('go-dashboard-btn')?.addEventListener('click', () => {
        location.hash = 'dashboard';
    });
    

   //ConfirmDialog//

function showConfirmDialog(planName, onConfirm){
    Swal.fire({
        icon:'warning',
        title: 'Remove plan?',
        text: `Are you sure you want to remove "${planName}"?`,
       showCancelButton: true,
       confirmButtonText: 'Yes, remove it.',
       cancelButtonText: 'Cancel',
       confirmButtonColor: '#d32f2f',
       cancelButtonColor: '#757575',
       reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed){
            onConfirm();
            Swal.fire({
                icon: 'success',
                title: 'Removed',
                timer: 1200,
                showConfirmButton: false
     });
    }
  });
  }
    }


//event function//

   async function loadEvents(){
    const content = document.getElementById('events-content');
    const selection = document.querySelector('#events-view .view-header-selection');

    if (!selectedCountryCode){
    content.innerHTML = `
     <div class="empty-state">
            <div class="empty-icon">
            <i class="fa-solid fa-ticket"></i>
            </div>
            <h3>No country Selected</h3>
            <p>Select a country and city from the dashboard to discover events</p>
            <button class="btn-primary" onclick="location.hash='dashboard'">
              <i class="fa-solid fa-globe"></i> Go to Dashboard
              </button>
           </div>
    `;
    return;
    }



    if (selection) {
        selection.innerHTML = `
        <div class="current-selection-badge">
                <img src="https://flagcdn.com/w40/${selectedCountryCode.toLowerCase()}.png" alt="${selectedCountryName}" class="selection-flag">
                <span>${selectedCountryName}</span>
              </div>
              `;
    }


    showLoadingOverlay('Searching for events....');

    try{ //const API_KEY = 'VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y';
        const API_KEY = 'VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y';
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&countryCode=${selectedCountryCode}&size=20`;
     
        const response = await fetch(url);

        if (!response.ok){
            throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        hideLoadingOverlay();

        if (!data._embedded || !data._embedded.events || data._embedded.events.length === 0 ){
        content.innerHTML = `
        <div class="empty-state" style = "grid-column: 1 / -1;">
            <div class="empty-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
            <h3>No Events found</h3>
            <p>Select a country and city from the dashboard to discover events</p>
            </div>
        `;
        showToast(`No Country Selected in ${selectedCountryName}`, 'info');
        return;
        }
        //Show Events//
       const events = data._embedded.events;
       content.innerHTML = '';

       events.forEach(event => {
     const eventId = event.id;
     const isSaved = myPlans.some(p => p.id === eventId && p.type === 'event');

     const eventName = event.name || 'United Event';
     const eventDate = event.dates?.start?.localDate || 'TBA';
     const eventTime = event.dates?.start?.localTime || '';
     const venue = event._embedded?.venues?.[0]?.name || 'Venue TBA';
     // const city = event._embedded?.venues?.[0]?.city?.name || '';/////////////f
     const country = event._embedded?.venues?.[0]?.country?.name || '';
     const category = event.classifications?.[0]?.segment?.name || 'Event';
     const image = event.images?.[0]?.url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop';
     const ticketUrl = event.url || '#';

    let formattedDateTime = eventDate;
    if (eventDate && eventDate !== 'TBA'){
        try {
            const dateObj = new Date(eventDate);
            formattedDateTime = dateObj.toLocaleDateString('en=US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            if (eventTime){
                const timeObj = new Date (`${eventDate}T${eventTime}`);
                const timeStr = timeObj.toLocaleTimeString('en-US', {
                 hour: '2-digit',
                 minute: '2-digit',
                 hour12: true
                });
                formattedDateTime += 'at' + timeStr;
            }
        }
            catch(e) {
                formattedDateTime = eventDate;
            }
        }
    let locationStr = venue;
    if (country) locationStr += `${country}`;
        
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
     <div class="event-card-image">
                <img src="${image}" alt="${eventName}"
                onerror="this.src='https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop'">
                <span class="event-card-category">${category}</span>
                <button class="event-card-save event-save-btn"
                data-id="${eventId}"
                data-name="${eventName.replace(/"/g,'&quot;')}"
                data-date="${eventDate}"
                data-time="${eventTime}"
                data-venue="${venue.replace(/"/g,'&quot;')}"
                data-country="${country}"
                data-category="${category}"
                data-image="${image}"
                data-url="${ticketUrl}"
                data-type="event">
                <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart"></i></button>
              </div>
              <div class="event-card-body">
                <h3>${eventName}</h3>
                <div class="event-card-info">
                  <div><i class="fa-regular fa-calendar"></i>${formattedDateTime}</div>
                  <div><i class="fa-solid fa-location-dot"></i>${locationStr}</div>
                </div>
                <div class="event-card-footer">
                  <button class="btn-event event-save-btn"
                  data-id="${eventId}"
                data-name="${eventName.replace(/"/g,'&quot;')}"
                data-date="${eventDate}"
                data-time="${eventTime}"
                data-venue="${venue.replace(/"/g,'&quot;')}"
                data-country="${country}"
                data-category="${category}"
                data-image="${image}"
                data-url="${ticketUrl}"
                data-type="event">
                  <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart"></i> ${isSaved ? 'solid' : 'regular'}</button>
                  <a href="${ticketUrl}" target="_blank" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
                </div>
              </div>
    `;
    content.appendChild(card);
    });
  document.querySelectorAll('.event-save-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const eventData = {
            id : this.getAttribute('data-id'),
            name : this.getAttribute('data-name'),
            type : this.getAttribute('data-type'),
            date: this.getAttribute('data-date'),
            time : this.getAttribute('data-time'),
           venue : this.getAttribute('data-venue'),
           country : this.getAttribute('data-country'),
          category : this.getAttribute('data-category'),
          image : this.getAttribute('data-image'),
          url : this.getAttribute('data-url'),
        };
         toggleEventPlan(eventData, this);
    });
  });
  showToast(`Found ${events.length} events in ${selectedCountryName}`, 'success');
    } catch (error) {
  hideLoadingOverlay();
  console.error('Error when loading events', error);
  showToast('please try again ,Failed to load events', 'error');
  content.innerHTML = `
             <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <h3>Error when Loading Events</h3>
              <p>Please try again, Something went wrong</p>
              <button class="btn-primary" onclick="loadEvents()">
              <i class="fa-solid fa-rotate"></i> Try Again </button>
            </div>`;
   }
}

window.loadEvents = loadEvents;  
   
///
    
function toggleEventPlan (eventData , button){
  const existingIndex = myPlans.findIndex(p => p.id === eventData.id && p.type === 'event');
  
  if (existingIndex > -1){
    myPlans.splice(existingIndex, 1);

    document.querySelectorAll(`[data-id="${eventData.id}"][data-type="event"]`).forEach(btn => {
        const icon = btn.querySelector('i');

        if (icon) {icon.classList.remove('fa-solid');
                   icon.classList.add('fa-regular');
        }
        if (btn.classList.contains('btn-event')) {
         btn.innerHTML = '<i class="fa-regular fa-heart"></i> save';
        }
    });
    showToast('Event removed from plans', 'info');
  } else {
      myPlans.push({
        id: eventData.id,
            name: eventData.name,
            type: 'event',
            date: eventData.date,
            time: eventData.time,
           venue: eventData.venue,
          category: eventData.category,
          image: eventData.image,
          url: eventData.url,
          country: selectedCountryName,
          countryCode: selectedCountryCode,
          savedAt: new Date().toISOString()
      });
      document.querySelectorAll(`[data-id="${eventData.id}"][data-type="event"]`).forEach(btn => {
        const icon = btn.querySelector('i');

        if (icon){
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }

        if (btn.classList.contains('btn-event')) {
            btn.innerHTML = '<i class="fa-solid fa-heart"></i> Saaved';
        }
      });
      showToast('Event added to plans!', 'success');
  }
  localStorage.setItem(plansKey,JSON.stringify(myPlans));
  updatePlansCount();
  updateMyPlansTabsCount();
}
///////////////fffffffffffff///////

// const OPEN_METEO_URL =
//   'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006' +
//   '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index' +
//   '&hourly=temperature_2m,weather_code,precipitation_probability' +
//   '&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant' +
//   '&timezone=auto';
// ========================== WEATHER 

const MeotUrl = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006' +
'&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index' +
'&hourly=temperature_2m,weather_code,precipitation_probability' +
'&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant' + 
'&timezone=auto';

function weatherToUi(code){
  if (code === 0) return { text: 'Clear sky', icon: 'sun', theme: 'weather-sunny'};
  if ([1,2].includes(code)) return {text: 'partly cloudy', icon: 'cloud-sun', theme: 'weather-sunny'};
  if (code === 3) return { text: 'Overcast', icon: 'cloud', theme: 'weather-cloudy'};
  if ([45,48].includes(code)) return {text: 'Fog', icon: 'smog', theme: 'weather-cloudy'};
  if ([51, 53, 55].includes(code)) return {text: 'Drizzle', icon: 'cloud-rain', theme: 'weather-rainy' };
  if ([61, 63, 65].includes(code)) return {text: 'Rain', icon: 'cloud-showers-heavy', theme: 'weather-rainy'};
  if ([71, 73, 75].includes(code)) return {text: 'Snow', icon: 'snowflake', theme: 'weather-snowy'};
  if ([80, 81, 82].includes(code)) return {text: 'Rain showers', icon: 'cloud-showers-heavy', theme: 'weather-rainy'};
  if ([95, 96, 99].includes(code)) return {text: 'Thunderstorm', icon: 'bolt', theme: 'weather-stormy'};
  
  return { text: 'Unknown', icon: 'cloud', theme: 'weather-cloudy'};
}


function weatherFmtLabel(dateStr, isToday = false) {
    const d = new Date(dateStr);
    const day = d.toLocaleDateString('en-US', {weekday: 'short'});
    const dd = d.toLocaleDateString('en-US', {day: '2-digit', month: 'short'});
   return {
    label: isToday ? 'Today' : day,
    date: dd
   };
}


function weatherFmtTimeLabel(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {hour: '2-digit', minute:'2-digit', hour12: true });
}

/////////////////////////////////////////
 /////////////////////////////////////////

async function loadWeather() {
    const content = document.getElementById('weather-content');
    if (!content) return;
    if (!selectedCountryCode || !selectedCountryName) {
        content.innerHTML = `
           <div class="empty-state">
              <div class="empty-icon">
              <i class="fa-solid fa-cloud-sun"></i>
              </div>
              <h3>No Country Selected</h3>
              <p>Select a country and city from the dashboard to see the weather forecast</p>
              <button class="btn-primary" onclick="location.hash='dashboard'">
              <i class="fa-solid fa-globe"></i> Go to Dashboard </button>
            </div>
        `;
        return;
    }

    showLoadingOverlay('Loading weather forecast....');

    try{
        const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${selectedLatitude}&longitude=${selectedLongitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`;
        const res = await fetch(WEATHER_API);

        if (!res.ok) throw new Error('Failed to fetch weather');

        const data = await res.json();
        hideLoadingOverlay();

        const current = data.current;
        const daily = data.daily;
        const hourly = data.hourly;

        const currentUi = weatherToUi(current.weather_code);

        const max0 = daily.temperature_2m_max?.[0];
        const min0 = daily.temperature_2m_min?.[0];
        const precipMax0 = daily.precipitation_probability_max?.[0] ?? 0;

      const cityName = selectedCountryName;
      const dateTitle = new Date(current.time).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      });
    content.innerHTML = `
             <div class="weather-hero-card ${currentUi.theme}">
              <div class="weather-location">
                <i class="fa-solid fa-location-dot"></i>
                <span>${cityName}</span>
                <span class="weather-time">${dateTitle}</span>
              </div>
              <div class="weather-hero-main">
                <div class="weather-hero-left">
                  <div class="weather-hero-icon"><i class="fa-solid fa-${currentUi.icon}"></i></div>
                  <div class="weather-hero-temp">
                    <span class="temp-value">${Math.round(current.temperature_2m)}</span>
                    <span class="temp-unit">°C</span>
                  </div>
                </div>
                <div class="weather-hero-right">
                  <div class="weather-condition">${currentUi.text}</div>
                  <div class="weather-feels">Feels like ${Math.round(max0)}°C</div>
                  <div class="weather-high-low">
                    <span class="high"><i class="fa-solid fa-arrow-up"></i> ${Math.round(min0)}°</span>
                    <span class="low"><i class="fa-solid fa-arrow-down"></i> ${Math.round(min0)}°</span>
                  </div>
                </div>
              </div>
            </div>
            
             <div class="weather-details-grid">
              <div class="weather-detail-card">
                <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Humidity</span>
                  <span class="detail-value">${current.relative_humidity_2m}%</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Wind</span>
                  <span class="detail-value">${Math.round(current.wind_speed_10m)} km/h</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
                <div class="detail-info">
                  <span class="detail-label">UV Index</span>
                  <span class="detail-value">${(current.uv_index ?? 0).toFixed(2)}</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Precipitation</span>
                  <span class="detail-value">${precipMax0}%</span>
                </div>
              </div>
            </div>
            <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
              <div class="hourly-scroll" id="hourly-scroll"></div>
             </div>
         <div class="weather-section">
           <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
         <div class="forecast-list" id="forecast-list"></div>
             </div>
    `
     
const hourlyWrap = document.getElementById('hourly-scroll');

if (hourlyWrap && hourly?.time?.length) {
    const nowIso = current.time;
    let startIndex = hourly.time.findIndex(t => t >= nowIso);

    if (startIndex < 0) startIndex = 0;

 const endIndex = Math.min(startIndex + 12, hourly.time.length);

 const items = [];

 for (let i = startIndex; i < endIndex; i++)  {
        const t = hourly.time[i];
        const temp = hourly.temperature_2m[i];
        const code = hourly.weather_code[i];
        const ui = weatherToUi(code);

        const label = (i === startIndex) ? 'Now' : weatherFmtTimeLabel(t);


        
        items.push(`
            <div class ="hourly-item ${i === startIndex ? 'now' : ''}">
            <span class="hourly-time">${label}</span>
            <div class="hourly-icon"><i class="fa-solid fa-${ui.icon}"></i></div>
            <span class="hourly-temp">${Math.round(temp)}°</span>
            </div>
            `);
    }
    hourlyWrap.innerHTML = items.join('');
 }

const forecastList = document.getElementById('forecast-list');
if (forecastList && daily?.time?.length) {
 const days = [];

 for (let i = 0; i < Math.min(7, daily.time.length); i++) {
 const { label, date } = weatherFmtLabel(daily.time[i], i === 0);
 const ui = weatherToUi(daily.weather_code[i]);
 const tMax = daily.temperature_2m_max[i];
 const tMin = daily.temperature_2m_min[i];
 const pr = daily.precipitation_probability_max?.[i] ?? 0;

 days.push(`
    <div class="forecast-day ${i === 0 ? 'today' : ''}">
                  <div class="forecast-day-name">
                  <span class="day-label">${label}</span>
                  <span class="day-date">${date}</span>
                  </div>
                  <div class="forecast-icon"><i class="fa-solid fa-${ui.icon}"></i></div>
                  <div class="forecast-temps">
                  <span class="temp-max">${Math.round(tMax)}°</span>
                  <span class="temp-min">${Math.round(tMin)}°</span></div>
                  <div class="forecast-precip"><i class="fa-solid fa-droplet"></i><span>10%</span></div>
                </div>
                <div class="forecast-precip">
                ${pr > 0 ? `<i class="fa-solid fa-droplet"></i><span>${pr}%</span>` : ''}
                </div>
                 `);
}
forecastList.innerHTML = days.join('');
}

showToast(`Weather loaded for ${selectedCountryName}`, 'success');
    }
    catch (err) {
  hideLoadingOverlay();
  console.error(err);
    

    
const content = document.getElementById('weather-content');
if (content) {
    content.innerHTML = `
    <div class="empty-state">
              <div class="empty-icon">
              <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3>Failed to load weather</h3>
              <p>please try again</p>
              <button class="btn-primary" id="retry-weather-btn">
              <i class="fa-solid fa-rotate"></i> Try Again </button>
            </div>
    `;
    document.getElementById('retry-weather-btn')?.addEventListener('click', loadWeather);
}
showToast('Failed to load weather', 'error');
    }
 }

 ///

async function convertCurrency() {
    const amountInput = document.getElementById('currency-amount');
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const resultDiv = document.getElementById('currency-result');

    const amount = parseFloat(amountInput?.value) || 1;
    const from = fromSelect?.value;
    const to = toSelect?.value;

    if (!from || !to) {
        showToast ('Choose the two currencies first', 'warning');

        return;
    }


    showLoadingOverlay('We are currently retrieving the exchange rate...');


 try {
       let url;
       let data;
       let rate;
       let converted;
     
       const apiKey = '805842951e5953ad31497176';
 
       if (amount > 0) {
         url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;

         const res = await fetch(url);

         if(res.ok) {
            data = await res.json();

            if(data.result === 'success') {
             converted = data.conversion_result.toFixed(2);
             rate = data.conversion_rate.toFixed(4);
         }
       }
    }

  if (resultDiv) {
        resultDiv.innerHTML = `
              <div class="conversion-display">
                <div class="conversion-from">
                  <span class="amount">${amount.toFixed(2)}</span>
                  <span class="currency-code">${from}</span>
                </div>
                <div class="conversion-equals"><i class="fa-solid fa-equals"></i></div>
                <div class="conversion-to">
                  <span class="amount">${converted}</span>
                  <span class="currency-code">${to}</span>
                </div>
              </div>
              <div class="exchange-rate-info">
                <p>1 ${from} = ${rate} ${to}</p>
                <small>Last updated: ${new Date(data.time_last_update_utc || Date.now()).toLocaleString('ar-EG')}</small>
              </div>
            </div>
        `;
  
        resultDiv.style.display = 'block';
  }

    showToast('The conversion completed successfully', 'success');

}
 catch (err){
    console.error('Currency Error:', err);
 
    showToast('Price fetching failed , try again later or check online', 'error');
} 

 finally {
    hideLoadingOverlay();
}
}

        document.getElementById('convert-btn')?.addEventListener('click', convertCurrency);


const swapBtn = document.getElementById('swap-currencies-btn');

swapBtn?.addEventListener('click', () => {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const amountInput = document.getElementById('currency-amount');
    const resultDiv = document.getElementById('currency-result');


const temp = fromSelect.value;
fromSelect.value = toSelect.value;
toSelect.value = temp;

if (amountInput.value) {
    convertCurrency();
}

if (resultDiv) resultDiv.style.display = 'none';
});

});