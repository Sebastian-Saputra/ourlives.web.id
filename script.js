/* =========================================================
   OUR LIVES — data-driven gallery
   Tambah/ubah momen melalui data.json, bukan melalui file ini.
   ========================================================= */
const DATA_URL = "./data.json";

const gallery = document.getElementById("gallery");
const timelineList = document.getElementById("timelineList");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterList = document.getElementById("filterList");
const randomButton = document.getElementById("randomButton");

let memories = [];
let activeCategory = "Semua";
let currentMemory = null;
let currentPhotoIndex = 0;
let lastFocusedElement = null;

const categoryLabels = {
  Praktek: "Praktek & Belajar",
  Sekolah: "Acara Sekolah",
  Hangout: "Hangout / Main Bareng",
  Random: "Momen Acak"
};

function safeText(value = "") {
  return String(value);
}

function formatDate(dateString) {
  // Tanggal data.json disimpan dalam format YYYY-MM-DD.
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString || "Tanggal tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  }).format(date);
}

function getDateValue(memory) {
  const parsed = new Date(`${memory.tanggal}T00:00:00`).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getPhotos(memory) {
  // Mendukung format baru (array objek) dan format lama (array string).
  return (memory.foto || []).map((photo) =>
    typeof photo === "string" ? { src: photo, alt: memory.judul_kegiatan } : photo
  );
}

function makeCard(memory) {
  const photos = getPhotos(memory);
  if (!photos.length) return null;

  const card = document.createElement("article");
  card.className = "memory-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Buka ${memory.judul_kegiatan}`);

  const imageWrap = document.createElement("div");
  imageWrap.className = "memory-image";

  const image = document.createElement("img");
  image.src = photos[0].src;
  image.alt = photos[0].alt || memory.judul_kegiatan || "Foto kenangan";
  image.loading = "lazy";
  image.decoding = "async";
  image.onerror = () => {
    imageWrap.classList.add("image-error");
    image.alt = "Foto tidak dapat dimuat";
  };

  const overlay = document.createElement("div");
  overlay.className = "memory-overlay";
  const viewLabel = document.createElement("span");
  viewLabel.className = "view-label";
  viewLabel.textContent = "VIEW MEMORY ↗";
  overlay.append(viewLabel);
  imageWrap.append(image, overlay);

  const caption = document.createElement("div");
  caption.className = "memory-caption";
  const captionText = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = memory.judul_kegiatan || "Tanpa judul";
  const meta = document.createElement("p");
  meta.textContent = `${formatDate(memory.tanggal)} · ${categoryLabels[memory.kategori] || memory.kategori || "Lainnya"}`;
  captionText.append(title, meta);

  const count = document.createElement("span");
  count.className = "memory-count";
  count.textContent = photos.length > 1 ? `${String(photos.length).padStart(2, "0")} photos` : "01 photo";
  caption.append(captionText, count);
  card.append(imageWrap, caption);

  const open = () => openLightbox(memory, 0);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
  return card;
}

function renderGallery() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("id");
  const filtered = memories.filter((memory) => {
    const categoryMatch = activeCategory === "Semua" || memory.kategori === activeCategory;
    const searchable = [
      memory.judul_kegiatan, memory.deskripsi, memory.kategori, memory.tanggal
    ].join(" ").toLocaleLowerCase("id");
    return categoryMatch && searchable.includes(keyword);
  });

  gallery.replaceChildren();
  filtered.forEach((memory) => {
    const card = makeCard(memory);
    if (card) gallery.append(card);
  });

  const totalPhotos = filtered.reduce((sum, item) => sum + getPhotos(item).length, 0);
  resultsCount.textContent = `${filtered.length} kegiatan · ${totalPhotos} foto`;
  emptyState.hidden = filtered.length !== 0;
}

function renderTimeline() {
  const sorted = [...memories].sort((a, b) => getDateValue(b) - getDateValue(a));
  timelineList.replaceChildren();

  if (!sorted.length) {
    const note = document.createElement("p");
    note.className = "loading-note";
    note.textContent = "Belum ada kenangan untuk ditampilkan.";
    timelineList.append(note);
    return;
  }

  sorted.forEach((memory) => {
    const item = document.createElement("article");
    item.className = "timeline-item";

    const date = document.createElement("time");
    date.className = "timeline-date";
    date.textContent = formatDate(memory.tanggal);
    date.dateTime = memory.tanggal || "";

    const event = document.createElement("div");
    event.className = "timeline-event";
    const title = document.createElement("h3");
    title.textContent = memory.judul_kegiatan || "Tanpa judul";
    const description = document.createElement("p");
    description.textContent = memory.deskripsi || "";
    const category = document.createElement("span");
    category.className = "timeline-category";
    category.textContent = categoryLabels[memory.kategori] || memory.kategori || "Lainnya";
    event.append(title, description, category);
    item.append(date, event);
    timelineList.append(item);
  });
}

function openLightbox(memory, photoIndex = 0) {
  const photos = getPhotos(memory);
  if (!photos.length) return;
  currentMemory = memory;
  currentPhotoIndex = photoIndex;
  lastFocusedElement = document.activeElement;
  document.getElementById("lightbox").classList.add("is-open");
  document.getElementById("lightbox").setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  updateLightbox();
  document.getElementById("lightboxClose").focus();
}

function updateLightbox() {
  if (!currentMemory) return;
  const photos = getPhotos(currentMemory);
  const photo = photos[currentPhotoIndex];
  document.getElementById("lightboxImage").src = photo.src;
  document.getElementById("lightboxImage").alt = photo.alt || currentMemory.judul_kegiatan;
  document.getElementById("lightboxTitle").textContent = currentMemory.judul_kegiatan || "";
  document.getElementById("lightboxCategory").textContent = categoryLabels[currentMemory.kategori] || currentMemory.kategori || "MEMORY";
  document.getElementById("lightboxDate").textContent = formatDate(currentMemory.tanggal);
  document.getElementById("lightboxDescription").textContent = currentMemory.deskripsi || "";
  document.getElementById("lightboxCounter").textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
  const multiple = photos.length > 1;
  document.getElementById("lightboxPrev").hidden = !multiple;
  document.getElementById("lightboxNext").hidden = !multiple;
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  currentMemory = null;
  if (lastFocusedElement) lastFocusedElement.focus();
}

function movePhoto(direction) {
  if (!currentMemory) return;
  const length = getPhotos(currentMemory).length;
  currentPhotoIndex = (currentPhotoIndex + direction + length) % length;
  updateLightbox();
}

function showRandomMemory() {
  if (!memories.length) return;
  const randomIndex = Math.floor(Math.random() * memories.length);
  const memory = memories[randomIndex];
  openLightbox(memory, Math.floor(Math.random() * getPhotos(memory).length));
}

function setTheme(theme) {
  if (theme === "adaptive") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("ourlives-theme");
  } else {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ourlives-theme", theme);
  }
}

function initTheme() {
  const saved = localStorage.getItem("ourlives-theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
  }
  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    if (!current) setTheme(matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark");
    else if (current === "dark") setTheme("light");
    else setTheme("adaptive");
  });
}

async function loadMemories() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Format data.json harus berupa array.");
    memories = data;
    renderGallery();
    renderTimeline();
  } catch (error) {
    console.error("Gagal memuat data.json:", error);
    gallery.innerHTML = "";
    resultsCount.textContent = "Kenangan belum dapat dimuat.";
    emptyState.hidden = false;
    emptyState.textContent = "Data belum dapat dimuat. Pastikan data.json tersedia dan website dibuka melalui local server.";
    timelineList.innerHTML = '<p class="loading-note">Timeline belum dapat dimuat.</p>';
  }
}

// Filter kategori
filterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  filterList.querySelectorAll(".filter-button").forEach((item) => {
    item.classList.toggle("is-active", item === button);
  });
  renderGallery();
});

searchInput.addEventListener("input", renderGallery);
randomButton.addEventListener("click", showRandomMemory);

// Tombol navigasi lightbox
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => movePhoto(-1));
document.getElementById("lightboxNext").addEventListener("click", () => movePhoto(1));
document.getElementById("lightbox").addEventListener("click", (event) => {
  if (event.target.id === "lightbox") closeLightbox();
});

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  const lightboxOpen = document.getElementById("lightbox").classList.contains("is-open");
  if (lightboxOpen) {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") movePhoto(-1);
    if (event.key === "ArrowRight") movePhoto(1);
    return;
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});

// Swipe gesture untuk berpindah foto di HP.
let touchStartX = 0;
const lightboxImageArea = document.querySelector(".lightbox-image-area");
lightboxImageArea.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
lightboxImageArea.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 45) movePhoto(delta < 0 ? 1 : -1);
}, { passive: true });

document.getElementById("currentYear").textContent = new Date().getFullYear();
initTheme();
loadMemories();
