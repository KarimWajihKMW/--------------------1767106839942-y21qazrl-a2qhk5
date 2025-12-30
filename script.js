document.addEventListener('DOMContentLoaded', () => {
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
            tags: ["مطاعم بشكل عام", "طبخ"]
        },
        {
            id: 2,
            title: "عامل نظافة وتطهير",
            company: "شركة كلين سيرفس",
            location: "جدة",
            type: "عقد",
            salary: "2000 - 2500",
            date: "منذ 4 ساعات",
            tags: ["عمال نظافة", "خدمات"]
        },
        {
            id: 3,
            title: "أخصائية شعر ومكياج",
            company: "مركز لمسات للجمال",
            location: "الدمام",
            type: "دوام كامل",
            salary: "5000 + عمولة",
            date: "منذ يوم",
            tags: ["خدمه التجميل", "نساء"]
        },
        {
            id: 4,
            title: "حارس ومسؤول استراحة",
            company: "شاليهات النسيم",
            location: "الرياض",
            type: "دوام جزئي",
            salary: "3000",
            date: "منذ يومين",
            tags: ["استراحات", "حراسة"]
        },
        {
            id: 5,
            title: "عامل مساعد (تحميل وتنزيل)",
            company: "مؤسسة النقل السريع",
            location: "مكة",
            type: "يومية",
            salary: "150 ريال/يوم",
            date: "منذ 3 أيام",
            tags: ["عمال بشكل عام", "نقل"]
        },
        {
            id: 6,
            title: "كاشير مطعم",
            company: "برجر هاوس",
            location: "جدة",
            type: "دوام كامل",
            salary: "4000",
            date: "منذ أسبوع",
            tags: ["مطاعم بشكل عام", "كاشير"]
        },
        {
            id: 7,
            title: "مسوق إلكتروني",
            company: "شركة التقنية",
            location: "عن بعد",
            type: "عمل حر",
            salary: "حسب المشروع",
            date: "منذ أسبوع",
            tags: ["تسويق", "إدارة"]
        }
    ];

    // Added the specific categories requested by the user at the beginning
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

    let jobs = [...initialJobs];
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

    function renderCategories() {
        categoriesContainer.innerHTML = categories.map(cat => `
            <button 
                onclick="filterByCategory('${cat}')"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap 
                ${activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}">
                ${cat}
            </button>
        `).join('');
    }

    // Make filterByCategory global so HTML onclick can see it
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
            card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group relative overflow-hidden';
            card.innerHTML = `
                <div class="absolute top-0 right-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-gray-500">
                            ${job.company.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-gray-900 leading-tight">${job.title}</h3>
                            <p class="text-sm text-gray-500">${job.company}</p>
                        </div>
                    </div>
                    ${job.date.includes('ساعة') || job.date.includes('ساعتين') ? 
                        '<span class="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-medium">جديد</span>' : ''}
                </div>

                <div class="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
                    <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ${job.location}
                    </div>
                    <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${job.type}
                    </div>
                    <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${job.salary} ر.س
                    </div>
                </div>

                <div class="flex justify-between items-center mt-4 border-t pt-4">
                    <span class="text-xs text-gray-400">${job.date}</span>
                    <button onclick="alert('تم تقديم طلبك لوظيفة: ${job.title} بنجاح!')" class="text-blue-600 font-semibold text-sm hover:underline">
                        التقدم للوظيفة &larr;
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
            // Enhanced category matching: Check both tags and exact category match in title or tag
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

    // Modal Logic
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
            tags: ['جديد', 'عام'] // Default tags for user created jobs
        };

        jobs.unshift(newJob);
        renderJobs(jobs);
        modal.classList.add('hidden');
        addJobForm.reset();
        
        // Optional: Show success feedback
        alert('تم نشر الوظيفة بنجاح!');
    });

    // --- Initialization ---
    renderCategories();
    renderJobs(jobs);
});