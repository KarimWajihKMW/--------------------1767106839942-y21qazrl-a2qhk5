document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Management ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlElement = document.documentElement;

    // Check Local Storage or System Preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        updateIcons(true);
    } else {
        htmlElement.classList.remove('dark');
        updateIcons(false);
    }

    // Toggle Theme
    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
            updateIcons(false);
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
            updateIcons(true);
        }
        // Re-render to update dynamic JS styles if necessary
        renderCategories();
        renderJobs(jobs);
    });

    function updateIcons(isDark) {
        if (isDark) {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    // --- State Management ---
    const initialJobs = [
        {
            id: 1,
            title: "شيف مشويات ومقبلات",
            company: "مطعم المذاق الأصيل",
            location: "الرياض",
            type: "دوام كامل",
            salary: "4500 - 5500",
            date: "منذ ساعتين",
            tags: ["مطاعم بشكل عام", "طبخ"],
            description: "مطلوب شيف متخصص في المشويات والمقبلات الشامية للعمل في مطعم راقي بالرياض. خبرة لا تقل عن 3 سنوات."
        },
        {
            id: 2,
            title: "عامل نظافة وتطهير",
            company: "شركة كلين سيرفس",
            location: "جدة",
            type: "عقد",
            salary: "2000 - 2500",
            date: "منذ 4 ساعات",
            tags: ["عمال نظافة", "خدمات"],
            description: "مطلوب عمال نظافة للعمل بنظام العقود في مجمعات تجارية. توفر الشركة السكن والمواصلات."
        },
        {
            id: 3,
            title: "أخصائية شعر ومكياج",
            company: "مركز لمسات للجمال",
            location: "الدمام",
            type: "دوام كامل",
            salary: "5000 + عمولة",
            date: "منذ يوم",
            tags: ["خدمه التجميل", "نساء"],
            description: "صالون تجميل في الدمام يبحث عن أخصائية شعر ومكياج بخبرة عالية. بيئة عمل نسائية بالكامل."
        },
        {
            id: 4,
            title: "حارس ومسؤول استراحة",
            company: "شاليهات النسيم",
            location: "الرياض",
            type: "دوام جزئي",
            salary: "3000",
            date: "منذ يومين",
            tags: ["استراحات", "حراسة"],
            description: "مطلوب حارس لمتابعة استراحة خاصة، يشمل العمل ري الأشجار والتنظيف ومتابعة الحجوزات."
        },
        {
            id: 5,
            title: "عامل مساعد (تحميل وتنزيل)",
            company: "مؤسسة النقل السريع",
            location: "مكة",
            type: "يومية",
            salary: "150 ريال/يوم",
            date: "منذ 3 أيام",
            tags: ["عمال بشكل عام", "نقل"],
            description: "عمل يومي للتحميل والتنزيل مع مؤسسة نقل عفش. الدفع يومي بنهاية الدوام."
        },
        {
            id: 6,
            title: "كاشير مطعم",
            company: "برجر هاوس",
            location: "جدة",
            type: "دوام كامل",
            salary: "4000",
            date: "منذ أسبوع",
            tags: ["مطاعم بشكل عام", "كاشير"],
            description: "مطلوب كاشير سعودي للعمل في سلسلة مطاعم. يشترط اللباقة وحسن المظهر."
        },
        {
            id: 7,
            title: "مسوق إلكتروني",
            company: "شركة التقنية",
            location: "عن بعد",
            type: "عمل حر",
            salary: "حسب المشروع",
            date: "منذ أسبوع",
            tags: ["تسويق", "إدارة"],
            description: "نبحث عن مسوق إلكتروني محترف لإدارة حملات إعلانية على منصات التواصل الاجتماعي."
        }
    ];

    const categories = [
        "الكل", 
        "مطاعم بشكل عام", 
        "عمال بشكل عام", 
        "استراحات", 
        "خدمه التجميل", 
        "عمال نظافة",
        "تسويق",
        "إدارة",
        "هندسة"
    ];

    const postsCategories = [
        "مطاعم بشكل عام", 
        "عمال بشكل عام", 
        "استراحات", 
        "خدمه التجميل", 
        "عمال نظافة"
    ];

    // Load jobs from localStorage or fallback to initialJobs
    let jobs = JSON.parse(localStorage.getItem('jobs')) || initialJobs;

    // Save to localStorage immediately if it doesn't exist to sync with detail page
    if (!localStorage.getItem('jobs')) {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }

    let activeCategory = "الكل";

    // --- DOM Elements ---
    const jobsGrid = document.getElementById('jobs-grid');
    const jobCount = document.getElementById('job-count');
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const noResults = document.getElementById('no-results');
    const categoriesContainer = document.getElementById('categories-container');
    
    // Modal Elements
    const modal = document.getElementById('job-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addJobForm = document.getElementById('add-job-form');

    // --- Functions ---

    function saveJobs() {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }

    function renderCategories() {
        categoriesContainer.innerHTML = categories.map(cat => {
            const isActive = activeCategory === cat;
            const hasPostsBtn = postsCategories.includes(cat);
            
            const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border";
            const activeClasses = isActive 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';

            const badgeClasses = isActive
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';

            let buttonContent = `<span>${cat}</span>`;
            
            if (hasPostsBtn) {
                buttonContent += `
                    <span class="${badgeClasses} text-[10px] px-2 py-0.5 rounded-full transition-colors font-bold">
                        المنشورات
                    </span>
                `;
            }

            return `
            <button 
                onclick="filterByCategory('${cat}')"
                class="${baseClasses} ${activeClasses}">
                ${buttonContent}
            </button>
            `;
        }).join('');
    }

    window.filterByCategory = (category) => {
        activeCategory = category;
        renderCategories();
        filterJobs();
    };

    function renderJobs(jobsToRender) {
        jobsGrid.innerHTML = '';
        
        if (jobsToRender.length === 0) {
            noResults.classList.remove('hidden');
            jobCount.innerText = '0 وظيفة';
            return;
        }
        
        noResults.classList.add('hidden');
        jobCount.innerText = `${jobsToRender.length} وظيفة`;

        jobsToRender.forEach(job => {
            const card = document.createElement('div');
            // Added cursor-pointer and click event to navigate to details
            card.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow group relative overflow-hidden cursor-pointer';
            
            // Navigate to details page on click
            card.onclick = () => {
                window.location.href = `job-details.html?id=${job.id}`;
            };

            card.innerHTML = `
                <div class="absolute top-0 right-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400">
                            ${job.company.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">${job.title}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">${job.company}</p>
                        </div>
                    </div>
                    ${job.date.includes('ساعة') || job.date.includes('ساعتين') || job.date === 'الآن' ? 
                        '<span class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium">جديد</span>' : ''}
                </div>

                <div class="flex flex-wrap gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${job.location}
                    </div>
                    <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${job.type}
                    </div>
                    <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${job.salary} ر.س
                    </div>
                </div>

                <div class="flex justify-between items-center mt-4 border-t dark:border-gray-700 pt-4">
                    <span class="text-xs text-gray-400 dark:text-gray-500">${job.date}</span>
                    <!-- stopPropagation prevents the card click event -->
                    <button onclick="event.stopPropagation(); alert('تم تقديم طلبك لوظيفة: ${job.title} بنجاح!')" class="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
                        التقدم السريع
                    </button>
                </div>
            `;
            jobsGrid.appendChild(card);
        });
    }

    function filterJobs() {
        const query = searchInput.value.toLowerCase();
        const location = locationFilter.value;
        
        const filtered = jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query);
            const matchesLocation = location === "" || job.location === location;
            const matchesCategory = activeCategory === "الكل" || 
                                    job.tags.some(tag => tag === activeCategory) || 
                                    job.tags.some(tag => tag.includes(activeCategory));

            return matchesSearch && matchesLocation && matchesCategory;
        });

        renderJobs(filtered);
    }

    // --- Event Listeners ---
    searchInput.addEventListener('input', filterJobs);
    locationFilter.addEventListener('change', filterJobs);

    openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    addJobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(addJobForm);
        const newJob = {
            id: Date.now(),
            title: formData.get('title'),
            company: formData.get('company'),
            location: formData.get('location'),
            type: formData.get('type'),
            salary: formData.get('salary') || 'غير محدد',
            date: 'الآن',
            tags: ['جديد', 'عام'],
            description: formData.get('description') || 'لا يوجد وصف إضافي.'
        };

        jobs.unshift(newJob);
        saveJobs(); // Save to local storage
        renderJobs(jobs);
        modal.classList.add('hidden');
        addJobForm.reset();
        
        alert('تم نشر الوظيفة بنجاح!');
    });

    // --- Initialization ---
    renderCategories();
    renderJobs(jobs);
});