
// =====================================
// 1. BUKA UNDANGAN
// =====================================

const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const openButton = document.getElementById("openInvitation");

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

openButton.addEventListener("click", () => {
  cover.classList.add("hidden");
  mainContent.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  music.play().catch(() => {
    console.log("Musik menunggu interaksi pengguna.");
  });
});

// =====================================
// 2. MUSIK
// =====================================

musicButton.addEventListener("click", () => {
  if (music.paused) {
    music.play().catch(() => {});
    musicButton.textContent = "♫";
  } else {
    music.pause();
    musicButton.textContent = "♪";
  }
});

// =====================================
// 3. COUNTDOWN
// =====================================

const weddingDate = new Date(
  "2027-02-20T08:00:00+07:00"
).getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML =
      "<p>Hari bahagia telah tiba! ♡</p>";
    return;
  }

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (distance / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (distance / 1000) % 60
  );

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =====================================
// 4. PENYIMPANAN UCAPAN RSVP
// =====================================

const STORAGE_KEY = "rakaSintaWishes";

const rsvpForm = document.getElementById("rsvpForm");
const wishesList = document.getElementById("wishesList");
const wishCount = document.getElementById("wishCount");

function getWishes() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveWishes(wishes) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(wishes)
  );
}

// =====================================
// 5. TAMPILKAN UCAPAN
// =====================================

function renderWishes() {
  const wishes = getWishes();

  wishesList.replaceChildren();

  wishCount.textContent = wishes.length + " ucapan";

  if (wishes.length === 0) {
    const empty = document.createElement("p");

    empty.textContent =
      "Belum ada ucapan. Jadilah yang pertama memberikan doa!";

    empty.className = "section-intro";

    wishesList.appendChild(empty);
    return;
  }

  wishes.slice().reverse().forEach((wish) => {
    const card = document.createElement("article");
    card.className = "wish-card";

    const name = document.createElement("h4");
    name.textContent = wish.name;

    const status = document.createElement("small");
    status.textContent =
      wish.attendance + " • " + wish.count + " orang";

    const message = document.createElement("p");
    message.textContent = wish.message;

    const date = document.createElement("small");
    date.textContent = wish.date;

    card.append(
      name,
      status,
      message,
      date
    );

    wishesList.appendChild(card);
  });
}

// =====================================
// 6. KIRIM RSVP
// =====================================

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document
    .getElementById("guestName")
    .value.trim();

  const attendance = document
    .getElementById("attendance")
    .value;

  const count = document
    .getElementById("guestCount")
    .value;

  const message = document
    .getElementById("guestMessage")
    .value.trim();

  if (!name || !attendance || !message) {
    alert("Mohon lengkapi formulir terlebih dahulu.");
    return;
  }

  const wishes = getWishes();

  wishes.push({
    name: name,
    attendance: attendance,
    count: count,
    message: message,
    date: new Date().toLocaleString("id-ID")
  });

  saveWishes(wishes);
  renderWishes();

  rsvpForm.reset();

  alert("Terima kasih atas ucapan dan doanya! ♡");
});

// =====================================
// 7. HAPUS UCAPAN
// =====================================

document
  .getElementById("clearWishes")
  .addEventListener("click", () => {
    const confirmDelete = confirm(
      "Apakah kamu yakin ingin menghapus semua ucapan di browser ini?"
    );

    if (confirmDelete) {
      localStorage.removeItem(STORAGE_KEY);
      renderWishes();
    }
  });

// =====================================
// 8. SALIN NOMOR REKENING
// =====================================

document
  .querySelectorAll(".copy-button")
  .forEach((button) => {
    button.addEventListener("click", async () => {
      const number = button.dataset.copy;

      try {
        await navigator.clipboard.writeText(number);
        button.textContent = "Berhasil Disalin ✓";
      } catch (error) {
        alert("Nomor rekening: " + number);
      }

      setTimeout(() => {
        button.textContent = "Salin Nomor Rekening";
      }, 2000);
    });
  });

// =====================================
// 9. MUAT UCAPAN SAAT WEBSITE DIBUKA
// =====================================

renderWishes();
