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
        { id: 1, tabNum: "001", name: "Иванов П.П.", position: "Водитель", category: "обслуживание", birthDate: "1980-05-15", address: "ул. Центральная, 10", phoneHome: "+7 495 100-00-01", phoneWork: "+7 495 200-00-01", hireDate: "2015-03-10", busNumber: "101" },
        { id: 2, tabNum: "002", name: "Смирнова А.И.", position: "Кондуктор", category: "обслуживание", birthDate: "1990-03-12", address: "ул. Лесная, 4", phoneHome: "+7 495 100-00-02", phoneWork: "+7 495 200-00-02", hireDate: "2018-05-22", busNumber: "102" },
        { id: 3, tabNum: "003", name: "Петров Д.С.", position: "Инженер", category: "итр", birthDate: "1985-07-01", address: "ул. Парковая, 7", phoneHome: "+7 495 100-00-03", phoneWork: "+7 495 200-00-03", hireDate: "2016-09-10", busNumber: "" },
        { id: 4, tabNum: "004", name: "Кузнецова Л.В.", position: "Диспетчер", category: "администрация", birthDate: "1988-02-20", address: "ул. Речная, 12", phoneHome: "+7 495 100-00-04", phoneWork: "+7 495 200-00-04", hireDate: "2017-11-05", busNumber: "" }
    ],
    routeLists: [
        { id: 1, routeNum: "1", busNumber: "101", date: "2025-01-15", tripsCompleted: 10, driver: "Иванов П.П.", conductor: "Смирнова А.И." },
        { id: 2, routeNum: "2", busNumber: "102", date: "2025-01-15", tripsCompleted: 8, driver: "Петров Д.С.", conductor: "Кузнецова Л.В." },
        { id: 3, routeNum: "3", busNumber: "103", date: "2025-01-15", tripsCompleted: 7, driver: "Иванов П.П.", conductor: "Смирнова А.И." }
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
    routeLists: data.routeLists.length + 1,
    reviews: data.reviews.length + 1
};
let editingContext = { type: null, id: null };
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
    loadRouteListsTable();
    loadPersonnelTable();
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
    if (!modal) return;
    modal.classList.remove("active");
    if (modal.querySelector("form")) {
        editingContext = { type: null, id: null };
    }
}

function bindForms() {
    const busForm = document.getElementById("addBusForm");
    busForm?.addEventListener("submit", e => {
        e.preventDefault();
        const isEdit = editingContext.type === "bus";
        if (editingContext.type === "bus") {
            data.buses = data.buses.map(b => b.id === editingContext.id ? {
                ...b,
                busNumber: valueOf("busNumber"),
                govNumber: valueOf("govNumber"),
                brand: valueOf("busBrand"),
                year: Number(valueOf("busYear")),
                mileage: Number(valueOf("busMileage"))
            } : b);
        } else {
            data.buses.push({
                id: nextId.buses++,
                busNumber: valueOf("busNumber"),
                govNumber: valueOf("govNumber"),
                brand: valueOf("busBrand"),
                year: Number(valueOf("busYear")),
                mileage: Number(valueOf("busMileage")),
                status: "active"
            });
        }
        busForm.reset();
        closeModal(busForm.closest(".modal"));
        editingContext = { type: null, id: null };
        loadBusesTable();
        updateMetrics();
        persist();
        toast(isEdit ? "Автобус обновлён" : "Автобус добавлен", "success");
    });

    const routeForm = document.getElementById("addRouteForm");
    routeForm?.addEventListener("submit", e => {
        e.preventDefault();
        const isEdit = editingContext.type === "route";
        if (editingContext.type === "route") {
            data.routes = data.routes.map(r => r.id === editingContext.id ? {
                ...r,
                number: valueOf("routeNum"),
                description: valueOf("routeDescription"),
                length: Number(valueOf("routeLength")),
                avgTime: Number(valueOf("routeTime")),
                plannedTrips: Number(valueOf("routeTrips")),
                busesCount: Number(valueOf("routeBuses"))
            } : r);
        } else {
            data.routes.push({
                id: nextId.routes++,
                number: valueOf("routeNum"),
                description: valueOf("routeDescription"),
                length: Number(valueOf("routeLength")),
                avgTime: Number(valueOf("routeTime")),
                plannedTrips: Number(valueOf("routeTrips")),
                busesCount: Number(valueOf("routeBuses"))
            });
        }
        routeForm.reset();
        closeModal(routeForm.closest(".modal"));
        editingContext = { type: null, id: null };
        loadRoutesTable();
        updateMetrics();
        persist();
        toast(isEdit ? "Маршрут обновлён" : "Маршрут добавлен", "success");
    });

    const personnelForm = document.getElementById("addPersonnelForm");
    personnelForm?.addEventListener("submit", e => {
        e.preventDefault();
        const isEdit = editingContext.type === "personnel";
        const payload = {
            tabNum: valueOf("personnelTabNum"),
            name: valueOf("personnelName"),
            position: valueOf("personnelPosition"),
            category: valueOf("personnelCategory"),
            birthDate: valueOf("personnelBirthDate"),
            address: valueOf("personnelAddress"),
            phoneHome: valueOf("personnelPhoneHome"),
            phoneWork: valueOf("personnelPhoneWork"),
            hireDate: valueOf("personnelHireDate"),
            busNumber: valueOf("personnelBus")
        };
        if (editingContext.type === "personnel") {
            data.personnel = data.personnel.map(p => p.id === editingContext.id ? { ...p, ...payload, id: p.id } : p);
        } else {
            data.personnel.push({
                id: nextId.personnel++,
                ...payload
            });
        }
        personnelForm.reset();
        closeModal(personnelForm.closest(".modal"));
        editingContext = { type: null, id: null };
        loadPersonnelTable();
        updateMetrics();
        persist();
        toast(isEdit ? "Сотрудник обновлён" : "Сотрудник добавлен", "success");
    });

    const routeListForm = document.getElementById("addRouteListForm");
    routeListForm?.addEventListener("submit", e => {
        e.preventDefault();
        const isEdit = editingContext.type === "routeList";
        const payload = {
            routeNum: valueOf("routeListRoute"),
            busNumber: valueOf("routeListBus"),
            date: valueOf("routeListDate"),
            tripsCompleted: Number(valueOf("routeListTrips")),
            driver: valueOf("routeListDriver"),
            conductor: valueOf("routeListConductor")
        };
        if (editingContext.type === "routeList") {
            data.routeLists = data.routeLists.map(r => r.id === editingContext.id ? { ...r, ...payload, id: r.id } : r);
        } else {
            data.routeLists.push({
                id: nextId.routeLists++,
                ...payload
            });
        }
        routeListForm.reset();
        closeModal(routeListForm.closest(".modal"));
        editingContext = { type: null, id: null };
        loadRouteListsTable();
        updateMetrics();
        persist();
        toast(isEdit ? "Путевой лист обновлён" : "Путевой лист сформирован", "success");
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
            id: nextId.reviews++,
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
            <td>
                <button class="btn btn-ghost btn-sm" onclick="startEditRoute(${r.id})"><i class="fas fa-pen"></i></button>
                <button class="btn btn-ghost btn-sm" onclick="deleteRoute(${r.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadRouteListsTable() {
    const tbody = document.getElementById("routeListsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    data.routeLists.forEach(r => {
        const bus = data.buses.find(b => b.busNumber === r.busNumber);
        const brand = bus ? bus.brand : "";
        const gov = bus ? bus.govNumber : "";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.routeNum}</td>
            <td>${r.busNumber}</td>
            <td>${brand}</td>
            <td>${gov}</td>
            <td>${r.date}</td>
            <td>${r.tripsCompleted}</td>
            <td>${r.driver}</td>
            <td>${r.conductor}</td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="startEditRouteList(${r.id})"><i class="fas fa-pen"></i></button>
                <button class="btn btn-ghost btn-sm" onclick="deleteRouteList(${r.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadPersonnelTable() {
    const tbody = document.getElementById("personnelTableBody");
    if (!tbody) return;
    const filter = getPersonnelFilter();
    tbody.innerHTML = "";
    data.personnel
        .filter(p => !filter || p.category === filter)
        .forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.tabNum}</td>
                <td>${p.name}</td>
                <td>${p.category || ""}</td>
                <td>${p.position}</td>
                <td>${p.birthDate}</td>
                <td>${p.address || ""}</td>
                <td>${p.phoneHome || ""}</td>
                <td>${p.phoneWork || ""}</td>
                <td>${p.hireDate}</td>
                <td>${p.busNumber || "-"}</td>
                <td>
                    <button class="btn btn-ghost btn-sm" onclick="startEditPersonnel(${p.id})"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-ghost btn-sm" onclick="deletePersonnel(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
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

function deleteRoute(id) {
    data.routes = data.routes.filter(r => r.id !== id);
    loadRoutesTable();
    updateMetrics();
    persist();
    toast("Маршрут удалён", "info");
}

function deleteRouteList(id) {
    data.routeLists = data.routeLists.filter(r => r.id !== id);
    loadRouteListsTable();
    updateMetrics();
    persist();
    toast("Путевой лист удалён", "info");
}

function deletePersonnel(id) {
    data.personnel = data.personnel.filter(p => p.id !== id);
    loadPersonnelTable();
    updateMetrics();
    persist();
    toast("Сотрудник удалён", "info");
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

// Запросы/фильтры
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#personnelChips .chip")?.forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll("#personnelChips .chip").forEach(c => c.classList.remove("chip-active"));
            chip.classList.add("chip-active");
            loadPersonnelTable();
        });
    });
    document.getElementById("queryAdminStaff")?.addEventListener("click", () => {
        const adminChip = document.querySelector('#personnelChips .chip[data-category="администрация"]');
        if (adminChip) {
            document.querySelectorAll("#personnelChips .chip").forEach(c => c.classList.remove("chip-active"));
            adminChip.classList.add("chip-active");
        }
        loadPersonnelTable();
        toast("Показаны сотрудники администрации", "info");
    });
    document.getElementById("queryBusesPerRoute")?.addEventListener("click", () => {
        const date = valueOf("queryDate") || "";
        const out = document.getElementById("busesPerRouteResults");
        if (!out) return;
        const byRoute = {};
        data.routeLists.forEach(r => {
            if (!date || r.date === date) {
                byRoute[r.routeNum] = (byRoute[r.routeNum] || 0) + 1;
            }
        });
        out.innerHTML = Object.keys(byRoute).length
            ? Object.entries(byRoute).map(([num, count]) => `<div>Маршрут ${num}: ${count} автобуса(ов)</div>`).join("")
            : "<div class='muted'>Нет данных</div>";
    });
    document.getElementById("queryBusesOnRoute")?.addEventListener("click", () => {
        const route = valueOf("queryRoute");
        const date = valueOf("queryDate2");
        const out = document.getElementById("busesOnRouteResults");
        if (!out) return;
        const rows = data.routeLists
            .filter(r => (!route || r.routeNum === route) && (!date || r.date === date))
            .map(r => {
                const bus = data.buses.find(b => b.busNumber === r.busNumber);
                return `<div>Борт ${r.busNumber} — ${bus?.brand || ""} — ${bus?.govNumber || ""}</div>`;
            });
        out.innerHTML = rows.length ? rows.join("") : "<div class='muted'>Нет данных</div>";
    });
});

function getPersonnelFilter() {
    const chip = document.querySelector("#personnelChips .chip-active");
    return (chip?.dataset.category || "").toLowerCase();
}

function startEditRoute(id) {
    const route = data.routes.find(r => r.id === id);
    if (!route) return;
    editingContext = { type: "route", id };
    setValue("routeNum", route.number);
    setValue("routeDescription", route.description);
    setValue("routeLength", route.length);
    setValue("routeTime", route.avgTime);
    setValue("routeTrips", route.plannedTrips);
    setValue("routeBuses", route.busesCount);
    openModal("addRouteModal");
}

function startEditRouteList(id) {
    const rl = data.routeLists.find(r => r.id === id);
    if (!rl) return;
    editingContext = { type: "routeList", id };
    setValue("routeListRoute", rl.routeNum);
    setValue("routeListBus", rl.busNumber);
    setValue("routeListDate", rl.date);
    setValue("routeListTrips", rl.tripsCompleted);
    setValue("routeListDriver", rl.driver);
    setValue("routeListConductor", rl.conductor);
    openModal("addRouteListModal");
}

function startEditPersonnel(id) {
    const p = data.personnel.find(x => x.id === id);
    if (!p) return;
    editingContext = { type: "personnel", id };
    setValue("personnelTabNum", p.tabNum);
    setValue("personnelName", p.name);
    setValue("personnelCategory", p.category);
    setValue("personnelPosition", p.position);
    setValue("personnelBirthDate", p.birthDate);
    setValue("personnelHireDate", p.hireDate);
    setValue("personnelAddress", p.address);
    setValue("personnelPhoneHome", p.phoneHome);
    setValue("personnelPhoneWork", p.phoneWork);
    setValue("personnelBus", p.busNumber);
    openModal("addPersonnelModal");
}

function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
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
