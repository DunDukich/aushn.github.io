const initialData = {
    buses: [
        { id: 1, busNumber: "101", govNumber: "А123ВС77", brand: "ЛиАЗ-5292", year: 2021, mileage: 124500, status: "active" },
        { id: 2, busNumber: "102", govNumber: "В456КН77", brand: "МАЗ-203", year: 2020, mileage: 98500, status: "active" },
        { id: 3, busNumber: "103", govNumber: "С789МР77", brand: "ЛиАЗ-4292", year: 2019, mileage: 158300, status: "maintenance" },
        { id: 4, busNumber: "104", govNumber: "Т321ОР77", brand: "ГАЗ-Vector Next", year: 2022, mileage: 67400, status: "active" }
    ],
    routes: [
        { id: 1, number: "1", description: "Центральный вокзал — Университет — Южный район", length: 12.5, avgTime: 45, plannedTrips: 10, busesCount: 5 },
        { id: 2, number: "2", description: "Северный парк — Бизнес-квартал — ТЦ «Город»", length: 18.2, avgTime: 60, plannedTrips: 8, busesCount: 4 },
        { id: 3, number: "3", description: "Промзона — Технопарк — Экспоцентр", length: 15.7, avgTime: 55, plannedTrips: 9, busesCount: 6 },
        { id: 4, number: "4", description: "Аэропорт — Центр — Речной порт", length: 22.3, avgTime: 75, plannedTrips: 7, busesCount: 3 }
    ],
    personnel: [
        { id: 1, tabNum: "001", name: "Иванов П.П.", position: "Водитель", birthDate: "1980-05-15", hireDate: "2015-03-10", busNumber: "101" },
        { id: 2, tabNum: "002", name: "Смирнова А.И.", position: "Кондуктор", birthDate: "1990-03-12", hireDate: "2018-05-22", busNumber: "102" }
    ],
    routeLists: [
        { id: 1, routeNum: "1", busNumber: "101", date: "2025-01-15", tripsCompleted: 10, driver: "Иванов П.П.", conductor: "Смирнова А.И." },
        { id: 2, routeNum: "2", busNumber: "102", date: "2025-01-15", tripsCompleted: 8, driver: "Петров Д.С.", conductor: "Кузнецова Л.В." }
    ],
    reviews: [
        { id: 1, name: "Мария", rating: 5, date: "12 янв", text: "Маршрут №1 идет строго по расписанию, салон чистый, водитель вежливый." },
        { id: 2, name: "Андрей", rating: 4, date: "10 янв", text: "Нравится, что можно оплатить картой. Хотелось бы чаще видеть автобусы на линии вечером." },
        { id: 3, name: "Елена", rating: 5, date: "8 янв", text: "Доступная посадка с коляской, спасибо экипажу за помощь!" }
    ]
};

let data = loadData();
let nextId = {
    buses: data.buses.length + 1,
    routes: data.routes.length + 1,
    personnel: data.personnel.length + 1,
    routeLists: data.routeLists.length + 1
};
let authState = { email: null };

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initMobileMenu();
    initModals();
    initBackToTop();
    initCounterAnimation();
    bindForms();
    renderAll();
    updateAuthUI();
});

function renderAll() {
    loadBusesTable();
    loadRoutesTable();
    loadReviews();
    updateMetrics();
}

function initNavigation() {
    const links = document.querySelectorAll(".nav-link, .hero-actions a");
    links.forEach(link => {
        link.addEventListener("click", e => {
            const target = link.getAttribute("href");
            if (target?.startsWith("#")) {
                e.preventDefault();
                const id = target.slice(1);
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                updateActiveNav(id);
                history.pushState(null, "", `#${id}`);
            }
        });
    });
}

function updateActiveNav(id) {
    document.querySelectorAll(".nav-link").forEach(l => {
        l.classList.toggle("active", l.getAttribute("data-page") === id);
    });
}

function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("mainNav");
    btn?.addEventListener("click", () => {
        nav?.classList.toggle("active");
    });
    document.addEventListener("click", e => {
        if (!nav?.contains(e.target) && !btn?.contains(e.target)) {
            nav?.classList.remove("active");
        }
    });
}

function initModals() {
    document.querySelectorAll("[data-modal-target]").forEach(btn => {
        btn.addEventListener("click", () => openModal(btn.dataset.modalTarget));
    });
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
    });
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", e => {
            if (e.target === modal) closeModal(modal);
        });
    });

    document.getElementById("loginBtn")?.addEventListener("click", () => openModal("loginModal"));
}

function openModal(id) {
    document.getElementById(id)?.classList.add("active");
}

function closeModal(modal) {
    modal?.classList.remove("active");
}

function bindForms() {
    const busForm = document.getElementById("addBusForm");
    busForm?.addEventListener("submit", e => {
        e.preventDefault();
        data.buses.push({
            id: nextId.buses++,
            busNumber: valueOf("busNumber"),
            govNumber: valueOf("govNumber"),
            brand: valueOf("busBrand"),
            year: Number(valueOf("busYear")),
            mileage: Number(valueOf("busMileage")),
            status: "active"
        });
        busForm.reset();
        closeModal(busForm.closest(".modal"));
        loadBusesTable();
        updateMetrics();
        persist();
        toast("Автобус добавлен", "success");
    });

    const routeForm = document.getElementById("addRouteForm");
    routeForm?.addEventListener("submit", e => {
        e.preventDefault();
        data.routes.push({
            id: nextId.routes++,
            number: valueOf("routeNum"),
            description: valueOf("routeDescription"),
            length: Number(valueOf("routeLength")),
            avgTime: Number(valueOf("routeTime")),
            plannedTrips: Number(valueOf("routeTrips")),
            busesCount: Number(valueOf("routeBuses"))
        });
        routeForm.reset();
        closeModal(routeForm.closest(".modal"));
        loadRoutesTable();
        updateMetrics();
        persist();
        toast("Маршрут добавлен", "success");
    });

    const personnelForm = document.getElementById("addPersonnelForm");
    personnelForm?.addEventListener("submit", e => {
        e.preventDefault();
        data.personnel.push({
            id: nextId.personnel++,
            tabNum: valueOf("personnelTabNum"),
            name: valueOf("personnelName"),
            position: valueOf("personnelPosition"),
            birthDate: valueOf("personnelBirthDate"),
            hireDate: valueOf("personnelHireDate"),
            busNumber: valueOf("personnelBus")
        });
        personnelForm.reset();
        closeModal(personnelForm.closest(".modal"));
        updateMetrics();
        persist();
        toast("Сотрудник добавлен", "success");
    });

    const routeListForm = document.getElementById("addRouteListForm");
    routeListForm?.addEventListener("submit", e => {
        e.preventDefault();
        data.routeLists.push({
            id: nextId.routeLists++,
            routeNum: valueOf("routeListRoute"),
            busNumber: valueOf("routeListBus"),
            date: valueOf("routeListDate"),
            tripsCompleted: Number(valueOf("routeListTrips")),
            driver: valueOf("routeListDriver"),
            conductor: valueOf("routeListConductor")
        });
        routeListForm.reset();
        closeModal(routeListForm.closest(".modal"));
        updateMetrics();
        persist();
        toast("Путевой лист сформирован", "success");
    });

    const contactForm = document.getElementById("contactForm");
    contactForm?.addEventListener("submit", e => {
        e.preventDefault();
        contactForm.reset();
        toast("Сообщение отправлено. Мы ответим в течение дня.", "info");
    });

    const loginForm = document.getElementById("loginForm");
    loginForm?.addEventListener("submit", e => {
        e.preventDefault();
        const email = valueOf("loginEmail");
        const password = valueOf("loginPassword");
        if (email === "demo@gorodtrans.ru" && password === "demo123") {
            authState.email = email;
            closeModal(loginForm.closest(".modal"));
            loginForm.reset();
            updateAuthUI();
            toast("Вы вошли как demo", "success");
        } else {
            toast("Неверные данные", "info");
        }
    });

    const reviewForm = document.getElementById("reviewForm");
    reviewForm?.addEventListener("submit", e => {
        e.preventDefault();
        if (!authState.email) {
            toast("Войдите, чтобы оставить отзыв", "info");
            return;
        }
        data.reviews.unshift({
            id: data.reviews.length + 1,
            name: authState.email,
            rating: Number(valueOf("reviewRating")),
            date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
            text: valueOf("reviewText")
        });
        reviewForm.reset();
        loadReviews();
        persist();
        toast("Отзыв опубликован", "success");
    });
}

function valueOf(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function loadBusesTable() {
    const tbody = document.getElementById("busesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    data.buses.forEach(bus => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${bus.busNumber}</td>
            <td>${bus.govNumber}</td>
            <td>${bus.brand}</td>
            <td>${bus.year}</td>
            <td>${bus.mileage.toLocaleString("ru-RU")} км</td>
            <td>${statusPill(bus.status)}</td>
            <td><button class="btn btn-ghost btn-sm" aria-label="Удалить" onclick="deleteBus(${bus.id})"><i class="fas fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
}

function loadRoutesTable() {
    const tbody = document.getElementById("routesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    data.routes.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.number}</td>
            <td>${r.description}</td>
            <td>${r.length} км</td>
            <td>${r.avgTime} мин</td>
            <td>${r.plannedTrips}</td>
            <td>${r.busesCount}</td>
        `;
        tbody.appendChild(tr);
    });
}

function loadReviews() {
    const container = document.getElementById("reviewsList");
    if (!container) return;
    container.innerHTML = "";
    data.reviews.forEach(r => {
        const div = document.createElement("div");
        div.className = "review";
        div.innerHTML = `
            <div class="name">${r.name}</div>
            <div class="date">${r.date}</div>
            <div class="rating">${"★".repeat(Math.round(r.rating))}${"☆".repeat(5 - Math.round(r.rating))}</div>
            <p>${r.text}</p>
        `;
        container.appendChild(div);
    });
}

function statusPill(status) {
    if (status === "maintenance") {
        return `<span class="status-pill status-warn"><i class="fas fa-wrench"></i> ТО</span>`;
    }
    if (status === "busy") {
        return `<span class="status-pill status-busy"><i class="fas fa-bolt"></i> Занят</span>`;
    }
    return `<span class="status-pill status-ok"><i class="fas fa-circle"></i> В работе</span>`;
}

function deleteBus(id) {
    data.buses = data.buses.filter(b => b.id !== id);
    loadBusesTable();
    updateMetrics();
    persist();
    toast("Автобус удалён", "info");
}

function updateMetrics() {
    setText("metricBuses", data.buses.length);
    setText("metricRoutes", data.routes.length);
    setText("metricRouteLists", data.routeLists.length);
    setText("metricPersonnel", data.personnel.length);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function toast(message, type = "info") {
    const box = document.getElementById("toastContainer");
    if (!box) return;
    const div = document.createElement("div");
    div.className = `toast ${type}`;
    div.textContent = message;
    box.appendChild(div);
    setTimeout(() => div.remove(), 3200);
}

function initCounterAnimation() {
    const counters = document.querySelectorAll(".stat-number");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
}

function updateAuthUI() {
    const label = document.getElementById("loginBtnLabel");
    const reviewSubmit = document.getElementById("reviewSubmit");
    const reviewHint = document.getElementById("reviewHint");
    const loggedIn = Boolean(authState.email);
    if (label) label.textContent = loggedIn ? authState.email : "Войти";
    if (reviewSubmit) reviewSubmit.disabled = !loggedIn;
    if (reviewHint) reviewHint.textContent = loggedIn ? "Вы можете отправить отзыв." : "Доступно только для авторизованных пользователей.";
}

function persist() {
    localStorage.setItem("gt-data", JSON.stringify(data));
}

function loadData() {
    try {
        const stored = localStorage.getItem("gt-data");
        return stored ? JSON.parse(stored) : structuredClone(initialData);
    } catch (e) {
        return structuredClone(initialData);
    }
}

function animateCounter(el) {
    const target = Number(el.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current.toLocaleString("ru-RU");
    }, 16);
}

function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 300);
    });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
