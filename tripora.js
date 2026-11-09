const searchFields = document.getElementById("searchFields");
const tabs = document.querySelectorAll(".tab");
const searchBtn = document.getElementById("searchBtn");
const tripOptions = document.getElementById("tripOptions");
const formMessage = document.getElementById("formMessage");
const resultsModal = document.getElementById("resultsModal");
const resultsList = document.getElementById("resultsList");
const resultsTitle = document.getElementById("resultsTitle");

const configs = {
  flights: {
    button: "Search Flights",
    fields: `
      <div class="field"><label>FROM</label><input id="from" placeholder="Kochi (COK)"></div>
      <button class="swap" id="swapBtn" title="Swap">⇄</button>
      <div class="field"><label>TO</label><input id="to" placeholder="Dubai (DXB)"></div>
      <div class="field"><label>DEPARTURE</label><input type="date" id="departure"></div>
      <div class="field"><label>TRAVELLERS & CLASS</label><select id="travellers"><option>1 Traveller, Economy</option><option>2 Travellers, Economy</option><option>1 Traveller, Business</option><option>2 Travellers, Business</option></select></div>`
  },
  hotels: {
    button: "Search Hotels",
    fields: `
      <div class="field"><label>LOCATION</label><input id="location" placeholder="City, hotel or landmark"></div>
      <div class="field"><label>CHECK-IN</label><input type="date" id="checkin"></div>
      <div class="field"><label>CHECK-OUT</label><input type="date" id="checkout"></div>
      <div class="field"><label>GUESTS & ROOMS</label><select><option>2 Adults, 1 Room</option><option>1 Adult, 1 Room</option><option>4 Adults, 2 Rooms</option></select></div>`
  },
  trains: {
    button: "Search Trains",
    fields: `
      <div class="field"><label>FROM</label><input id="from" placeholder="Kochi"></div>
      <div class="field"><label>TO</label><input id="to" placeholder="Bengaluru"></div>
      <div class="field"><label>JOURNEY DATE</label><input type="date" id="journey"></div>
      <div class="field"><label>CLASS</label><select><option>AC 2 Tier</option><option>AC 3 Tier</option><option>Sleeper</option><option>General</option></select></div>`
  },
  buses: {
    button: "Search Buses",
    fields: `
      <div class="field"><label>FROM</label><input id="from" placeholder="Kochi"></div>
      <div class="field"><label>TO</label><input id="to" placeholder="Bengaluru"></div>
      <div class="field"><label>TRAVEL DATE</label><input type="date" id="busdate"></div>
      <div class="field"><label>TRAVELLERS</label><select><option>1 Traveller</option><option>2 Travellers</option><option>3 Travellers</option></select></div>`
  },
  holidays: {
    button: "Explore Packages",
    fields: `
      <div class="field"><label>DESTINATION</label><input id="destination" placeholder="Where do you want to go?"></div>
      <div class="field"><label>START DATE</label><input type="date"></div>
      <div class="field"><label>DURATION</label><select><option>3–5 Days</option><option>6–8 Days</option><option>9+ Days</option></select></div>
      <div class="field"><label>TRAVELLERS</label><select><option>2 Adults</option><option>Family</option><option>Group</option></select></div>`
  }
};

let currentType = "flights";

function renderFields(type) {
  const config = configs[type];
  searchFields.innerHTML = config.fields;
  searchBtn.innerHTML = `${config.button} <span>→</span>`;
  tripOptions.style.display = type === "flights" ? "flex" : "none";

  const swap = document.getElementById("swapBtn");
  if (swap) {
    swap.addEventListener("click", () => {
      const from = document.getElementById("from");
      const to = document.getElementById("to");
      [from.value, to.value] = [to.value, from.value];
    });
  }
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
    renderFields(currentType);
    formMessage.textContent = "";
  });
});

function sampleResults(type) {
  const data = {
    flights: [
      ["Air India", "COK 09:15 → DXB 12:10", "3h 25m • Non-stop", "₹18,490"],
      ["IndiGo", "COK 14:30 → DXB 17:25", "3h 25m • Non-stop", "₹19,250"],
      ["Emirates", "COK 22:10 → DXB 01:00", "3h 20m • Non-stop", "₹27,800"]
    ],
    hotels: [
      ["The Grand Palace", "Kochi • ★ 4.8", "Pool • Breakfast • Wi-Fi", "₹4,999/night"],
      ["Azure Downtown", "Dubai • ★ 4.7", "Pool • Gym • Shuttle", "₹8,499/night"],
      ["Ubud Garden Resort", "Bali • ★ 4.9", "Spa • Breakfast", "₹5,799/night"]
    ],
    trains: [
      ["InterCity Express", "Kochi → Bengaluru", "06:10 • AC 2 Tier", "₹1,840"],
      ["Superfast Express", "Kochi → Bengaluru", "15:30 • AC 3 Tier", "₹1,220"],
      ["Night Express", "Kochi → Bengaluru", "21:45 • Sleeper", "₹680"]
    ],
    buses: [
      ["GreenLine Travels", "Kochi → Bengaluru", "22:00 • AC Sleeper", "₹1,199"],
      ["KSRTC Premium", "Kochi → Bengaluru", "20:30 • AC Seater", "₹899"],
      ["CityLink", "Kochi → Bengaluru", "21:15 • Volvo", "₹1,049"]
    ],
    holidays: [
      ["Kerala Escape", "5 Days / 4 Nights", "Hotels • Transfers • Activities", "₹18,999"],
      ["Dubai Adventure", "6 Days / 5 Nights", "Hotel • Safari • City Tour", "₹39,999"],
      ["Bali Paradise", "7 Days / 6 Nights", "Hotel • Tours • Transfers", "₹44,999"]
    ]
  };
  return data[type];
}

searchBtn.addEventListener("click", () => {
  formMessage.textContent = "";
  const required = [...searchFields.querySelectorAll("input")].filter(i => i.type !== "date");
  if (required.some(i => !i.value.trim())) {
    formMessage.textContent = "Please fill in the main search fields.";
    return;
  }

  const names = {flights:"Flight", hotels:"Hotel", trains:"Train", buses:"Bus", holidays:"Holiday package"};
  resultsTitle.textContent = `${names[currentType]} options`;
  resultsList.innerHTML = sampleResults(currentType).map(item => `
    <div class="result">
      <div><h3>${item[0]}</h3><p>${item[1]}</p><p>${item[2]}</p></div>
      <div><strong>${item[3]}</strong><br><button class="select-btn" onclick="alert('Demo selection — connect this button to your backend later.')">Select</button></div>
    </div>
  `).join("");
  resultsModal.classList.add("show");
});

document.getElementById("closeModal").addEventListener("click", () => resultsModal.classList.remove("show"));
resultsModal.addEventListener("click", e => { if (e.target === resultsModal) resultsModal.classList.remove("show"); });

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
menuToggle.addEventListener("click", () => navMenu.classList.toggle("open"));
navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMenu.classList.remove("open")));

window.addEventListener("scroll", () => {
  document.getElementById("navbar").style.boxShadow = window.scrollY > 10 ? "0 5px 25px rgba(20,39,70,.08)" : "none";
});

renderFields("flights");

/* ===== TRIPORA LOGIN POPUP ===== */

(() => {
    const loginButton = document.getElementById("loginBtn");
    const overlay = document.getElementById("loginOverlay");

    if (!loginButton || !overlay) {
        console.warn("Tripora login popup: check the Login button ID and popup HTML.");
        return;
    }

    const modal = overlay.querySelector(".login-modal");
    const closeButton = document.getElementById("closeLogin");
    const form = document.getElementById("triporaLoginForm");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const togglePassword = document.getElementById("togglePassword");
    const message = document.getElementById("loginMessage");
    const title = document.getElementById("loginTitle");
    const subtitle = document.getElementById("loginSubtitle");
    const submitButton = document.getElementById("loginSubmit");
    const switchButton = document.getElementById("switchLoginMode");
    const switchText = document.getElementById("switchText");

    let isSignUp = false;
    let previousFocus = null;

    function openPopup(event) {
        if (event) event.preventDefault();

        previousFocus = document.activeElement;
        overlay.classList.add("login-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        message.textContent = "";
        emailInput.focus();
    }

    function closePopup() {
        overlay.classList.remove("login-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
    }

    function updateMode() {
        message.textContent = "";
        form.reset();

        title.textContent = isSignUp ? "Create your account" : "Welcome back!";
        subtitle.textContent = isSignUp
            ? "Join Tripora and start exploring."
            : "Sign in to continue your journey.";

        submitButton.textContent = isSignUp ? "Create Account" : "Login";
        switchText.textContent = isSignUp
            ? "Already have an account?"
            : "Don't have an account?";

        switchButton.textContent = isSignUp ? "Login" : "Sign up";
    }

    loginButton.addEventListener("click", openPopup);
    closeButton.addEventListener("click", closePopup);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closePopup();
        }
    });

    modal.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closePopup();
        }

        if (event.key === "Tab") {
            const focusable = modal.querySelectorAll(
                'button:not([disabled]), input:not([disabled])'
            );

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    togglePassword.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";
        togglePassword.textContent = isHidden ? "Hide" : "Show";
    });

    switchButton.addEventListener("click", () => {
        isSignUp = !isSignUp;
        updateMode();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        message.textContent = "";

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        message.textContent = isSignUp
            ? "Demo only: account creation is not connected yet."
            : "Demo only: login authentication is not connected yet.";
    });
})();
