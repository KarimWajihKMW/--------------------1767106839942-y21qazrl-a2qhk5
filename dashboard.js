document.addEventListener('DOMContentLoaded', () => {
    // --- Safe Storage Copy --- 
    // (Reused to ensure consistency with main script)
    const storage = (() => {
        try {
            const s = window.localStorage;
            s.getItem; 
            return s;
        } catch (e) {
            const mem = {};
            return {
                getItem: (k) => mem[k] || null,
                setItem: (k, v) => mem[k] = v,
                removeItem: (k) => delete mem[k]
            };
        }
    })();

    // --- Theme Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlElement = document.documentElement;

    const storedTheme = storage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        updateIcons(true);
    } else {
        htmlElement.classList.remove('dark');
        updateIcons(false);
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            storage.setItem('theme', 'light');
            updateIcons(false);
        } else {
            htmlElement.classList.add('dark');
            storage.setItem('theme', 'dark');
            updateIcons(true);
        }
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

    // --- Dashboard Logic ---
    
    // Dummy initial data fallback (same as index to avoid empty dashboard if opened directly)
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
            description: "مطلوب شيف متخصص في المشويات والمقبلات الشامية للعمل في مطعم راقي بالرياض."
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
            description: "مطلوب عمال نظافة للعمل بنظام العقود."
        }
    ];

    let jobs = [];
    try {
        const storedJobsData = storage.getItem('jobs');
        jobs = storedJobsData ? JSON.parse(storedJobsData) : initialJobs;
        // If we fell back to initial, save it
        if (!storedJobsData) storage.setItem('jobs', JSON.stringify(jobs));
    } catch (e) {
        jobs = initialJobs;
    }

    function renderStats() {
        document.getElementById('total-jobs').textContent = jobs.length;
        // Mock data for views and applications
        document.getElementById('total-views').textContent = jobs.length * 153;
        document.getElementById('total-applications').textContent = Math.floor(jobs.length * 12.5);
    }

    function renderTable() {
        const tbody = document.getElementById('jobs-table-body');
        const emptyState = document.getElementById('empty-state');
        
        tbody.innerHTML = '';

        if (jobs.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        jobs.forEach(job => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-200';
            
            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="font-semibold text-gray-900 dark:text-white">${job.title}</div>
                    <div class="text-xs text-gray-500">${job.company}</div>
                </td>
                <td class="px-6 py-4 text-sm">${job.date}</td>
                <td class="px-6 py-4">
                    <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-full">${job.type}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <span class="w-2 h-2 rounded-full bg-green-500"></span>
                        نشط
                    </span>
                </td>
                <td class="px-6 py-4">
                    <button onclick="deleteJob(${job.id})" class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="حذف الوظيفة">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.deleteJob = (id) => {
        if (confirm('هل أنت متأكد من رغبتك في حذف هذه الوظيفة؟')) {
            jobs = jobs.filter(job => job.id != id);
            storage.setItem('jobs', JSON.stringify(jobs));
            renderTable();
            renderStats();
        }
    };

    renderStats();
    renderTable();
});