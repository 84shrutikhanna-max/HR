const employees = [
  {
    id: 1,
    name: "Amina Haddad",
    role: "Talent Acquisition Lead",
    department: "People",
    manager: "Lina Omar",
    quality: 4.6,
    delivery: 4.4,
    collaboration: 4.8,
    growth: 4.5,
    trend: 0.4
  },
  {
    id: 2,
    name: "Omar Malik",
    role: "Payroll Specialist",
    department: "Finance",
    manager: "Ravi Menon",
    quality: 3.7,
    delivery: 3.9,
    collaboration: 3.5,
    growth: 3.6,
    trend: 0.1
  },
  {
    id: 3,
    name: "Sara Chen",
    role: "HR Business Partner",
    department: "People",
    manager: "Lina Omar",
    quality: 4.8,
    delivery: 4.7,
    collaboration: 4.6,
    growth: 4.9,
    trend: 0.3
  },
  {
    id: 4,
    name: "Daniel Reed",
    role: "Sales Manager",
    department: "Sales",
    manager: "Nadia Ali",
    quality: 4.1,
    delivery: 4.3,
    collaboration: 3.9,
    growth: 4.0,
    trend: -0.2
  },
  {
    id: 5,
    name: "Priya Nair",
    role: "Operations Analyst",
    department: "Operations",
    manager: "Hassan Noor",
    quality: 3.2,
    delivery: 3.4,
    collaboration: 3.0,
    growth: 3.1,
    trend: -0.5
  },
  {
    id: 6,
    name: "James Carter",
    role: "Customer Success Lead",
    department: "Customer",
    manager: "Maya Santos",
    quality: 4.4,
    delivery: 4.2,
    collaboration: 4.7,
    growth: 4.3,
    trend: 0.2
  },
  {
    id: 7,
    name: "Layla Faris",
    role: "Learning Designer",
    department: "People",
    manager: "Lina Omar",
    quality: 3.9,
    delivery: 4.0,
    collaboration: 4.2,
    growth: 4.4,
    trend: 0.6
  },
  {
    id: 8,
    name: "Victor Kim",
    role: "Account Executive",
    department: "Sales",
    manager: "Nadia Ali",
    quality: 2.9,
    delivery: 3.0,
    collaboration: 2.7,
    growth: 3.2,
    trend: -0.4
  },
  {
    id: 9,
    name: "Noor Ibrahim",
    role: "Workforce Planner",
    department: "Operations",
    manager: "Hassan Noor",
    quality: 4.2,
    delivery: 4.5,
    collaboration: 4.1,
    growth: 4.0,
    trend: 0.0
  },
  {
    id: 10,
    name: "Elena Petrova",
    role: "Support Specialist",
    department: "Customer",
    manager: "Maya Santos",
    quality: 3.5,
    delivery: 3.2,
    collaboration: 3.8,
    growth: 3.7,
    trend: -0.1
  }
];

const state = {
  selectedId: employees[0].id,
  sortBy: "score",
  department: "all",
  query: ""
};

const elements = {
  table: document.querySelector("#employeeTable"),
  departmentFilter: document.querySelector("#departmentFilter"),
  searchInput: document.querySelector("#searchInput"),
  avgScore: document.querySelector("#avgScore"),
  scoreDelta: document.querySelector("#scoreDelta"),
  topCount: document.querySelector("#topCount"),
  riskCount: document.querySelector("#riskCount"),
  trainingCount: document.querySelector("#trainingCount"),
  chart: document.querySelector("#performanceChart"),
  selectedName: document.querySelector("#selectedName"),
  selectedRole: document.querySelector("#selectedRole"),
  selectedDepartment: document.querySelector("#selectedDepartment"),
  selectedScore: document.querySelector("#selectedScore"),
  selectedBadge: document.querySelector("#selectedBadge"),
  reviewForm: document.querySelector("#reviewForm"),
  qualityInput: document.querySelector("#qualityInput"),
  deliveryInput: document.querySelector("#deliveryInput"),
  collaborationInput: document.querySelector("#collaborationInput"),
  growthInput: document.querySelector("#growthInput"),
  exportBtn: document.querySelector("#exportBtn"),
  toast: document.querySelector("#toast"),
  navButtons: document.querySelectorAll(".nav-item"),
  dashboardView: document.querySelector("#dashboardView"),
  employeesView: document.querySelector("#employeesView"),
  reviewsView: document.querySelector("#reviewsView")
};

function getScore(employee) {
  return average([
    employee.quality,
    employee.delivery,
    employee.collaboration,
    employee.growth
  ]);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatScore(score) {
  return score.toFixed(1);
}

function getRecommendation(employee) {
  const score = getScore(employee);
  if (score >= 4.5) return "Retention priority";
  if (score >= 4.0) return "Growth assignment";
  if (score >= 3.4) return "Focused coaching";
  return "Improvement plan";
}

function getStatus(score) {
  if (score >= 4.2) return { label: "High", className: "high" };
  if (score >= 3.4) return { label: "Stable", className: "medium" };
  return { label: "At Risk", className: "low" };
}

function getInitials(name) {
  return name
    .split(" ")
    .map(part => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getFilteredEmployees() {
  const query = state.query.trim().toLowerCase();

  return employees
    .filter(employee => state.department === "all" || employee.department === state.department)
    .filter(employee => {
      if (!query) return true;
      return [employee.name, employee.role, employee.department, employee.manager]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => {
      if (state.sortBy === "score") return getScore(b) - getScore(a);
      return String(a[state.sortBy]).localeCompare(String(b[state.sortBy]));
    });
}

function populateDepartmentFilter() {
  const departments = [...new Set(employees.map(employee => employee.department))].sort();

  departments.forEach(department => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    elements.departmentFilter.append(option);
  });
}

function renderMetrics(data) {
  const scores = data.map(getScore);
  const avgScore = average(scores);
  const avgTrend = average(data.map(employee => employee.trend));

  elements.avgScore.textContent = formatScore(avgScore);
  elements.scoreDelta.textContent = `${avgTrend >= 0 ? "+" : ""}${avgTrend.toFixed(1)} trend average`;
  elements.topCount.textContent = data.filter(employee => getScore(employee) >= 4.5).length;
  elements.riskCount.textContent = data.filter(employee => getScore(employee) < 3.4).length;
  elements.trainingCount.textContent = data.filter(employee => getScore(employee) < 4.0).length;
}

function renderTable(data) {
  elements.table.innerHTML = "";

  if (!data.length) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="6">No employee records match the current filters.</td>`;
    elements.table.append(emptyRow);
    return;
  }

  data.forEach(employee => {
    const score = getScore(employee);
    const trendClass = employee.trend > 0 ? "trend-up" : employee.trend < 0 ? "trend-down" : "trend-flat";
    const trendText = employee.trend > 0 ? `+${employee.trend.toFixed(1)}` : employee.trend.toFixed(1);
    const row = document.createElement("tr");

    if (employee.id === state.selectedId) row.classList.add("selected");
    row.tabIndex = 0;
    row.dataset.id = employee.id;
    row.innerHTML = `
      <td>
        <div class="employee-cell">
          <div class="avatar">${getInitials(employee.name)}</div>
          <div>
            <strong>${employee.name}</strong>
            <span>${employee.manager}</span>
          </div>
        </div>
      </td>
      <td>${employee.department}</td>
      <td>${employee.role}</td>
      <td>${formatScore(score)}</td>
      <td class="${trendClass}">${trendText}</td>
      <td>${getRecommendation(employee)}</td>
    `;

    row.addEventListener("click", () => selectEmployee(employee.id));
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectEmployee(employee.id);
      }
    });

    elements.table.append(row);
  });
}

function selectEmployee(id) {
  state.selectedId = id;
  renderSelectedEmployee();
  renderTable(getFilteredEmployees());
}

function renderSelectedEmployee() {
  const employee = employees.find(item => item.id === state.selectedId);
  if (!employee) return;

  const score = getScore(employee);
  const status = getStatus(score);

  elements.selectedName.textContent = employee.name;
  elements.selectedRole.textContent = employee.role;
  elements.selectedDepartment.textContent = employee.department;
  elements.selectedScore.textContent = formatScore(score);
  elements.selectedBadge.textContent = status.label;
  elements.selectedBadge.className = `status-badge ${status.className}`;

  elements.qualityInput.value = employee.quality;
  elements.deliveryInput.value = employee.delivery;
  elements.collaborationInput.value = employee.collaboration;
  elements.growthInput.value = employee.growth;
}

function getDepartmentData(data) {
  const groups = data.reduce((result, employee) => {
    if (!result[employee.department]) result[employee.department] = [];
    result[employee.department].push(getScore(employee));
    return result;
  }, {});

  return Object.entries(groups)
    .map(([department, scores]) => ({
      department,
      score: average(scores)
    }))
    .sort((a, b) => a.department.localeCompare(b.department));
}

function renderChart(data) {
  const canvas = elements.chart;
  const ctx = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(bounds.width));
  const height = Math.max(220, Math.floor(bounds.height));

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const chartData = getDepartmentData(data);
  const padding = { top: 22, right: 18, bottom: 52, left: 46 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.strokeStyle = "#d9e2ec";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.stroke();

  for (let tick = 1; tick <= 5; tick += 1) {
    const y = padding.top + chartHeight - (tick / 5) * chartHeight;
    ctx.fillStyle = "#617083";
    ctx.font = "12px Arial";
    ctx.fillText(String(tick), 14, y + 4);
    ctx.strokeStyle = tick === 5 ? "#cbd6e2" : "#edf2f6";
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
  }

  if (!chartData.length) {
    ctx.fillStyle = "#617083";
    ctx.font = "14px Arial";
    ctx.fillText("No data available", padding.left + 20, padding.top + 40);
    return;
  }

  const gap = 18;
  const barWidth = Math.max(34, (chartWidth - gap * (chartData.length + 1)) / chartData.length);

  chartData.forEach((item, index) => {
    const x = padding.left + gap + index * (barWidth + gap);
    const barHeight = (item.score / 5) * chartHeight;
    const y = padding.top + chartHeight - barHeight;

    ctx.fillStyle = item.score >= 4.2 ? "#237a54" : item.score >= 3.4 ? "#b77810" : "#b23b3b";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#17202a";
    ctx.font = "700 13px Arial";
    ctx.fillText(formatScore(item.score), x + 4, y - 8);

    ctx.save();
    ctx.translate(x + barWidth / 2, padding.top + chartHeight + 16);
    ctx.rotate(-0.35);
    ctx.fillStyle = "#617083";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(item.department, 0, 0);
    ctx.restore();
  });
}

function updateReview(event) {
  event.preventDefault();
  const employee = employees.find(item => item.id === state.selectedId);
  if (!employee) return;

  employee.quality = Number(elements.qualityInput.value);
  employee.delivery = Number(elements.deliveryInput.value);
  employee.collaboration = Number(elements.collaborationInput.value);
  employee.growth = Number(elements.growthInput.value);
  employee.trend = Number((getScore(employee) - 3.8).toFixed(1));

  showToast(`${employee.name}'s review score is now ${formatScore(getScore(employee))}.`);
  renderAll();
}

function exportReport() {
  const data = getFilteredEmployees();
  const rows = [
    ["Employee", "Department", "Role", "Score", "Trend", "Recommendation"],
    ...data.map(employee => [
      employee.name,
      employee.department,
      employee.role,
      formatScore(getScore(employee)),
      employee.trend.toFixed(1),
      getRecommendation(employee)
    ])
  ];

  const csv = rows
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "hr-performance-report.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Performance report exported.");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 2600);
}

function setActiveNav(view) {
  elements.navButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function scrollToView(view) {
  const targets = {
    dashboard: elements.dashboardView,
    employees: elements.employeesView,
    reviews: elements.reviewsView,
    compensation: elements.dashboardView
  };

  setActiveNav(view);
  targets[view].scrollIntoView({ behavior: "smooth", block: "start" });

  if (view === "compensation") {
    showToast("Compensation analysis will be added in the next module.");
  }
}

function renderAll() {
  const data = getFilteredEmployees();
  renderMetrics(data);
  renderTable(data);
  renderSelectedEmployee();
  renderChart(data);
}

function bindEvents() {
  elements.navButtons.forEach(button => {
    button.addEventListener("click", () => scrollToView(button.dataset.view));
  });

  elements.departmentFilter.addEventListener("change", event => {
    state.department = event.target.value;
    renderAll();
  });

  elements.searchInput.addEventListener("input", event => {
    state.query = event.target.value;
    renderAll();
  });

  document.querySelectorAll("[data-sort]").forEach(button => {
    button.addEventListener("click", () => {
      state.sortBy = button.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderAll();
    });
  });

  elements.reviewForm.addEventListener("submit", updateReview);
  elements.exportBtn.addEventListener("click", exportReport);
  window.addEventListener("resize", () => renderChart(getFilteredEmployees()));
}

populateDepartmentFilter();
bindEvents();
renderAll();
