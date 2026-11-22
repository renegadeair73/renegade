const menuButton = document.getElementById("menuButton");
const primaryNav = document.getElementById("primaryNav");
const navDropdownToggles = primaryNav.querySelectorAll(".nav-dropdown-toggle");
const flightTab = document.getElementById("flightTab");
const reservationTab = document.getElementById("reservationTab");
const bookingShell = document.querySelector(".booking-shell");
const flightPanel = document.getElementById("flightPanel");
const reservationPanel = document.getElementById("reservationPanel");
const tripType = document.getElementById("tripType");
const fromField = document.getElementById("flightFrom");
const toField = document.getElementById("flightTo");
const swapButton = document.getElementById("swapRoute");
const departDate = document.getElementById("departDate");
const returnDate = document.getElementById("returnDate");
const returnField = document.getElementById("returnField");
const passengerField = document.querySelector('[name="passengers"]');
const fareEstimate = document.getElementById("fareEstimate");
const couponToggle = document.getElementById("couponToggle");
const couponCode = document.getElementById("couponCode");
const couponCheck = document.getElementById("couponCheck");
const flightMessage = document.getElementById("flightMessage");
const flightMessageText = document.getElementById("flightMessageText");
const couponMessage = document.getElementById("couponMessage");
const couponMessageText = document.getElementById("couponMessageText");
const reservationMessage = document.getElementById("reservationMessage");
const reservationMessageText = document.getElementById("reservationMessageText");
const reservationForm = document.getElementById("reservationForm");
const supportPopover = document.getElementById("supportPopover");
const supportLauncher = document.getElementById("supportLauncher");
const loginDialog = document.getElementById("loginDialog");
const loginDialogTitle = document.getElementById("loginDialogTitle");
const loginDialogCopy = document.getElementById("loginDialogCopy");
const loginDialogLink = document.getElementById("loginDialogLink");
const loginModes = {
  customer: {
    title: "Customer Login",
    copy: "Customer sign-in is unavailable in this local copy. Contact Renegade Air on WhatsApp for account help.",
    request: "Hello Renegade Air, I need help with customer account access.",
  },
  agent: {
    title: "Agent Login",
    copy: "Agent sign-in is unavailable in this local copy. Contact Renegade Air on WhatsApp for account help.",
    request: "Hello Renegade Air, I need help with agent account access.",
  },
  crs: {
    title: "Agent CRS Login",
    copy: "Agent CRS sign-in is unavailable in this local copy. Contact Renegade Air on WhatsApp for account help.",
    request: "Hello Renegade Air, I need help with Agent CRS access.",
  },
};
const currencyToggle = document.getElementById("currencyToggle");
const currencyMenu = document.getElementById("currencyMenu");
const languageToggle = document.getElementById("languageToggle");
const languageMenu = document.getElementById("languageMenu");
const languageLabel = languageToggle.querySelector(".language-label");
const utilityStatus = document.getElementById("utilityStatus");
let lastLoginTrigger = null;

const oneWayFareByCity = {
  eldoret: 5500,
  kisumu: 6500,
  mombasa: 6500,
  homabay: 7800,
  wajir: 9000,
  "maasai mara": 10500,
};
const routes = { nairobi: Object.keys(oneWayFareByCity) };
Object.keys(oneWayFareByCity).forEach((city) => {
  routes[city] = ["nairobi"];
});
const allCities = Array.from(fromField.options, (option) => option.value.toLowerCase()).filter(Boolean);
const whatsappNumber = "254762108773";

function closeMobileNav() {
  primaryNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open header menu");
  closeDropdowns();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  primaryNav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close header menu" : "Open header menu");
  if (!open) closeDropdowns();
});

function closeDropdowns() {
  navDropdownToggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
    document.getElementById(toggle.getAttribute("aria-controls")).hidden = true;
  });
}

navDropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const opening = toggle.getAttribute("aria-expanded") !== "true";
    closeDropdowns();
    if (!opening) return;
    toggle.setAttribute("aria-expanded", "true");
    document.getElementById(toggle.getAttribute("aria-controls")).hidden = false;
  });
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 1024px)").matches) closeMobileNav();
  });
});

document.addEventListener("click", (event) => {
  if (event.target === menuButton || primaryNav.contains(event.target)) return;
  closeDropdowns();
  if (menuButton.getAttribute("aria-expanded") === "true") closeMobileNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (loginDialog.open) loginDialog.close();
  closeLocaleMenus();
  closeDropdowns();
  if (menuButton.getAttribute("aria-expanded") === "true") closeMobileNav();
});

function closeLocaleMenus() {
  currencyMenu.hidden = true;
  currencyToggle.setAttribute("aria-expanded", "false");
  languageMenu.hidden = true;
  languageToggle.setAttribute("aria-expanded", "false");
}

function toggleLocaleMenu(toggle, menu) {
  const opening = toggle.getAttribute("aria-expanded") !== "true";
  closeLocaleMenus();
  if (!opening) return;
  menu.hidden = false;
  toggle.setAttribute("aria-expanded", "true");
}

currencyToggle.addEventListener("click", () => toggleLocaleMenu(currencyToggle, currencyMenu));
languageToggle.addEventListener("click", () => toggleLocaleMenu(languageToggle, languageMenu));

currencyMenu.querySelectorAll("[data-currency]").forEach((option) => {
  option.addEventListener("click", () => {
    const currency = option.dataset.currency;
    document.querySelector(".currency-symbol").textContent = option.dataset.symbol;
    document.querySelector(".currency-code").textContent = currency;
    currencyMenu.querySelectorAll("[data-currency]").forEach((item) => {
      item.hidden = item.dataset.currency === currency;
    });
    utilityStatus.textContent = `${currency} selected. Fare conversion is not available in this local copy.`;
    utilityStatus.hidden = false;
    closeLocaleMenus();
  });
});

languageMenu.querySelectorAll("[data-language]").forEach((option) => {
  option.addEventListener("click", () => {
    const language = option.dataset.language;
    languageLabel.textContent = option.textContent.trim();
    languageMenu.querySelectorAll("[data-language]").forEach((item) => {
      item.hidden = item.dataset.language === language;
    });
    utilityStatus.textContent = `${languageLabel.textContent} selected. Page content remains in English in this local copy.`;
    utilityStatus.hidden = false;
    closeLocaleMenus();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".locale-control")) closeLocaleMenus();
});

function selectLoginMode(mode) {
  const login = loginModes[mode] || loginModes.customer;
  loginDialogTitle.textContent = login.title;
  loginDialogCopy.textContent = login.copy;
  loginDialog.querySelectorAll('[role="tab"]').forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.loginMode === mode));
  });
  loginDialogLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(login.request)}`;
  loginDialogLink.textContent = "Ask Renegade Air on WhatsApp";
}

document.querySelectorAll("[data-login-mode]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const mode = trigger.dataset.loginMode;
    if (trigger.closest(".login-dialog-tabs")) {
      selectLoginMode(mode);
      return;
    }
    lastLoginTrigger = trigger;
    selectLoginMode(mode);
    if (!loginDialog.open) loginDialog.showModal();
    loginDialog.querySelector("[data-login-close]").focus();
  });
});

loginDialog.querySelector("[data-login-close]").addEventListener("click", () => loginDialog.close());
loginDialog.addEventListener("click", (event) => {
  if (event.target === loginDialog) loginDialog.close();
});
loginDialog.addEventListener("close", () => {
  if (lastLoginTrigger) lastLoginTrigger.focus();
});

function selectTab(selectedTab) {
  const showFlights = selectedTab === flightTab;
  bookingShell.classList.toggle("reservation-active", !showFlights);
  flightTab.classList.toggle("active", showFlights);
  reservationTab.classList.toggle("active", !showFlights);
  flightTab.setAttribute("aria-selected", String(showFlights));
  reservationTab.setAttribute("aria-selected", String(!showFlights));
  flightPanel.hidden = !showFlights;
  reservationPanel.hidden = showFlights;
}

flightTab.addEventListener("click", () => selectTab(flightTab));
reservationTab.addEventListener("click", () => selectTab(reservationTab));
document.querySelectorAll(".fare-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectTab(flightTab);
    fromField.value = "Nairobi";
    tripType.value = "oneway";
    updateTripType();
    updateDestinationAvailability();
    toField.value = option.dataset.destination;
    updateDestinationAvailability();
    bookingShell.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

function updateDestinationAvailability() {
  fromField.setCustomValidity("");
  toField.setCustomValidity("");
  const origin = fromField.value.trim().toLowerCase();
  const destinations = origin ? routes[origin] || [] : allCities;
  const destination = toField.value.trim().toLowerCase();
  toField.replaceChildren(new Option("Select city", ""));
  destinations.forEach((city) => {
    const label = city.replace(/\b\w/g, (letter) => letter.toUpperCase());
    toField.add(new Option(label, label));
  });
  toField.disabled = destinations.length === 0;

  toField.value = destinations.includes(destination)
    ? destination.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";
  swapButton.disabled = !destinations.includes(destination);
  updateFareEstimate();
}

function calculateFareQuote() {
  const origin = fromField.value.trim().toLowerCase();
  const destination = toField.value.trim().toLowerCase();
  const fareCity = origin === "nairobi" ? destination : destination === "nairobi" ? origin : "";
  if (!Object.prototype.hasOwnProperty.call(oneWayFareByCity, fareCity)) return null;

  const oneWayFare = oneWayFareByCity[fareCity];
  const passengerCount = Number(passengerField.value);
  const legs = tripType.value === "roundtrip" ? 2 : 1;
  return { oneWayFare, passengerCount, legs, total: oneWayFare * passengerCount * legs };
}

function formatFare(amount) {
  return new Intl.NumberFormat("en-KE").format(amount);
}

function updateFareEstimate() {
  const quote = calculateFareQuote();
  fareEstimate.textContent = quote
    ? `Estimated total: KSh ${formatFare(quote.total)}`
    : "Select a supported route to see an estimated fare.";
}

fromField.addEventListener("change", updateDestinationAvailability);
toField.addEventListener("change", updateDestinationAvailability);
updateDestinationAvailability();

swapButton.addEventListener("click", () => {
  if (swapButton.disabled) return;
  const origin = fromField.value;
  fromField.value = toField.value;
  updateDestinationAvailability();
  toField.value = origin;
  updateDestinationAvailability();
});

function updateTripType() {
  const isRoundtrip = tripType.value === "roundtrip";
  returnField.hidden = !isRoundtrip;
  returnDate.disabled = !isRoundtrip;
  returnDate.required = isRoundtrip;
  updateFareEstimate();
}

function updateDateLabels(input) {
  input.closest(".date-field").classList.toggle("has-value", Boolean(input.value));
}

function updateDateLimits() {
  returnDate.min = departDate.value || departDate.min;
  if (returnDate.value && departDate.value && returnDate.value < departDate.value) {
    returnDate.value = "";
    updateDateLabels(returnDate);
  }
}

tripType.addEventListener("change", updateTripType);
passengerField.addEventListener("change", updateFareEstimate);
departDate.addEventListener("change", updateDateLimits);
[departDate, returnDate].forEach((input) => {
  input.addEventListener("input", () => updateDateLabels(input));
  input.addEventListener("change", () => updateDateLabels(input));
});

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
departDate.min = localToday;
returnDate.min = localToday;
updateTripType();

couponToggle.addEventListener("click", () => {
  couponCode.hidden = !couponCode.hidden;
  couponCheck.hidden = couponCode.hidden;
  couponMessage.hidden = true;
  couponToggle.setAttribute("aria-expanded", String(!couponCode.hidden));
  if (!couponCode.hidden) couponCode.focus();
});

couponCheck.addEventListener("click", () => {
  if (!couponCode.value.trim()) {
    couponMessageText.textContent = "Enter a coupon code before checking.";
    couponMessage.hidden = false;
    couponCode.focus();
    return;
  }
  const request = `Hello Renegade Air, please check this coupon code: ${couponCode.value.trim()}.`;
  couponMessageText.textContent = "Opening WhatsApp with your coupon code. Review and send it to request validation.";
  couponMessage.hidden = false;
  window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(request)}`);
});

couponCode.addEventListener("input", () => {
  couponMessage.hidden = true;
  couponMessageText.textContent = "Enter a coupon code before checking.";
});

document.getElementById("flightForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const origin = fromField.value.trim().toLowerCase();
  const destination = toField.value.trim().toLowerCase();
  const availableDestinations = routes[origin];
  if (!availableDestinations) {
    fromField.setCustomValidity("Choose a supported departure city from the list.");
    fromField.reportValidity();
    return;
  }
  fromField.setCustomValidity("");
  if (!availableDestinations.includes(destination)) {
    toField.disabled = false;
    toField.setCustomValidity("Choose an available destination from the list.");
    toField.reportValidity();
    return;
  }
  toField.setCustomValidity("");
  const fareQuote = calculateFareQuote();
  if (!fareQuote) {
    toField.setCustomValidity("An estimated fare is not available for this route. Contact Renegade Air for assistance.");
    toField.reportValidity();
    return;
  }
  couponMessage.hidden = true;
  const passengers = passengerField.selectedOptions[0].textContent.trim();
  const request = [
    "Hello Renegade Air, I would like to book a flight.",
    `Trip: ${tripType.selectedOptions[0].textContent}`,
    `From: ${fromField.value.trim()}`,
    `To: ${toField.value.trim()}`,
    `Departure: ${departDate.value}`,
    ...(tripType.value === "roundtrip" ? [`Return: ${returnDate.value}`] : []),
    `Passengers: ${passengers}`,
    `Estimated total fare: KSh ${formatFare(fareQuote.total)}`,
    `Calculation: ${fareQuote.passengerCount} passenger(s) x KSh ${formatFare(fareQuote.oneWayFare)} per passenger per leg x ${fareQuote.legs} leg(s)`,
  ].join("\n");
  flightMessageText.textContent = "Opening WhatsApp with your flight request. Review it and send to complete your inquiry.";
  flightMessage.hidden = false;
  window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(request)}`);
});

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const bookingReference = reservationForm.elements.bookingReference.value.trim();
  const lastName = reservationForm.elements.lastName.value.trim();
  const request = [
    "Hello Renegade Air, please help me check my reservation.",
    `Booking reference: ${bookingReference}`,
    `Last name: ${lastName}`,
  ].join("\n");
  reservationMessage.hidden = false;
  window.location.assign(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(request)}`);
});

document.getElementById("supportClose").addEventListener("click", () => {
  supportPopover.hidden = true;
  supportLauncher.setAttribute("aria-expanded", "false");
});

supportLauncher.addEventListener("click", () => {
  supportPopover.hidden = !supportPopover.hidden;
  supportLauncher.setAttribute("aria-expanded", String(!supportPopover.hidden));
});
