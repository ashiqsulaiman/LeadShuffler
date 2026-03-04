const STORAGE_KEY = "leadShufflerHomeVisitedAt";

localStorage.setItem(STORAGE_KEY, new Date().toISOString());

const appShell = document.querySelector(".app-shell");
const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
const sidebarNav = document.querySelector(".sidebar-nav");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");
const leadDistributionChart = document.getElementById("lead-distribution-chart");
const addCloserModal = document.getElementById("add-closer-modal");
const addCloserForm = document.getElementById("add-closer-form");
const fullNameInput = document.getElementById("closer-full-name");
const rankInput = document.getElementById("closer-rank");
const nameError = document.getElementById("name-error");
const rankError = document.getElementById("rank-error");

const CHART_MAX = 8;
const DEFAULT_SECTION = "dashboard";
const closerLeadData = [
  { name: "Alex", leadsAssigned: 6, color: "#2563eb" },
  { name: "Brooke", leadsAssigned: 8, color: "#14b8a6" },
  { name: "Chris", leadsAssigned: 5, color: "#f97316" },
  { name: "Devon", leadsAssigned: 7, color: "#8b5cf6" },
  { name: "Emery", leadsAssigned: 4, color: "#22c55e" },
  { name: "Frankie", leadsAssigned: 6, color: "#eab308" },
  { name: "Gray", leadsAssigned: 7, color: "#ef4444" },
  { name: "Harper", leadsAssigned: 5, color: "#06b6d4" },
  { name: "Indy", leadsAssigned: 4, color: "#ec4899" },
  { name: "Jordan", leadsAssigned: 3, color: "#84cc16" },
  { name: "Kai", leadsAssigned: 2, color: "#6366f1" }
];

function renderLeadDistributionChart(data) {
  if (!leadDistributionChart) return;

  leadDistributionChart.innerHTML = data
    .map((item) => {
      const safeValue = Math.max(0, Math.min(CHART_MAX, item.leadsAssigned));
      const heightPercent = Math.round((safeValue / CHART_MAX) * 100);

      return `
        <article class="chart-bar-group" aria-label="${item.name} has ${safeValue} leads assigned">
          <div class="chart-bar-area">
            <div class="chart-bar" style="height:${heightPercent}%; background:${item.color};"></div>
          </div>
          <span class="chart-label">${item.name}</span>
          <span class="chart-value">${safeValue}</span>
        </article>
      `;
    })
    .join("");
}

function setActiveSection(sectionName) {
  const validSection = document.getElementById(`${sectionName}-panel`) ? sectionName : DEFAULT_SECTION;

  navItems.forEach((item) => {
    const isActive = item.dataset.section === validSection;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-current", isActive ? "page" : "false");
  });

  panels.forEach((panel) => {
    const isVisible = panel.id === `${validSection}-panel`;
    panel.classList.toggle("is-visible", isVisible);
    panel.hidden = !isVisible;
  });

  window.history.replaceState(null, "", `#${validSection}`);
}

function getSectionFromHash() {
  const hashSection = window.location.hash.replace("#", "").trim();
  return hashSection || DEFAULT_SECTION;
}

toggleSidebarBtn?.addEventListener("click", () => {
  appShell?.classList.toggle("is-collapsed");
});

sidebarNav?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const navButton = target.closest(".nav-item");
  if (!(navButton instanceof HTMLButtonElement)) return;

  const sectionName = navButton.dataset.section || DEFAULT_SECTION;
  setActiveSection(sectionName);
});

window.addEventListener("hashchange", () => {
  setActiveSection(getSectionFromHash());
});

document.getElementById("shuffle-calls-btn")?.addEventListener("click", () => {
  alert("Call shuffle started.");
});

function openAddCloserModal() {
  if (!addCloserModal) return;
  addCloserModal.hidden = false;
}

function closeAddCloserModal() {
  if (!addCloserModal) return;
  addCloserModal.hidden = true;
  addCloserForm?.reset();
  nameError?.setAttribute("hidden", "");
  rankError?.setAttribute("hidden", "");
}

function validateName(value) {
  return /^[A-Za-z ]+$/.test(value.trim());
}

function validateRank(value) {
  return /^\d+$/.test(value.trim());
}

document.getElementById("add-closer-btn")?.addEventListener("click", openAddCloserModal);
document.getElementById("close-add-closer-modal")?.addEventListener("click", closeAddCloserModal);

document.querySelector('[data-close-modal="true"]')?.addEventListener("click", closeAddCloserModal);

addCloserForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const isNameValid = validateName(fullNameInput?.value || "");
  const isRankValid = validateRank(rankInput?.value || "");

  if (!isNameValid) {
    nameError?.removeAttribute("hidden");
  } else {
    nameError?.setAttribute("hidden", "");
  }

  if (!isRankValid) {
    rankError?.removeAttribute("hidden");
  } else {
    rankError?.setAttribute("hidden", "");
  }

  if (!isNameValid || !isRankValid) return;

  alert("Closer saved locally.");
  closeAddCloserModal();
});

document.getElementById("closers-panel")?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const actionButton = target.closest(".icon-action");
  if (!(actionButton instanceof HTMLButtonElement)) return;

  const row = actionButton.closest("tr");
  const closerName = row?.children[1]?.textContent?.trim() || "closer";

  if (actionButton.classList.contains("edit-action")) {
    alert(`Edit ${closerName} flow coming next.`);
    return;
  }

  if (actionButton.classList.contains("delete-action")) {
    alert(`Delete ${closerName} flow coming next.`);
  }
});

renderLeadDistributionChart(closerLeadData);
setActiveSection(getSectionFromHash());
