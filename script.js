const menuButton = document.getElementById("menuButton");
const primaryNav = document.getElementById("primaryNav");
const navDropdownToggles = primaryNav.querySelectorAll(".nav-dropdown-toggle");
const flightTab = document.getElementById("flightTab");
const reservationTab = document.getElementById("reservationTab");
const statusTab = document.getElementById("statusTab");
const bookingShell = document.querySelector(".booking-shell");
const flightPanel = document.getElementById("flightPanel");
const reservationPanel = document.getElementById("reservationPanel");
const statusPanel = document.getElementById("statusPanel");
const flightResults = document.getElementById("flightResults");
const flightResultsSummary = document.getElementById("flightResultsSummary");
const flightResultsList = document.getElementById("flightResultsList");
const changeSearchButton = document.getElementById("changeSearchButton");
const tripType = document.getElementById("tripType");
const fromField = document.getElementById("flightFrom");
const toField = document.getElementById("flightTo");
const swapButton = document.getElementById("swapRoute");
const departDate = document.getElementById("departDate");
const returnDate = document.getElementById("returnDate");
const returnField = document.getElementById("returnField");
const passengerField = document.querySelector('[name="passengers"]');
const fareEstimate = document.getElementById("fareEstimate");
const flightEnquiry = document.getElementById("flightEnquiry");
const flightEnquiryTitle = document.getElementById("flightEnquiryTitle");
const flightEnquirySummary = document.getElementById("flightEnquirySummary");
const flightEnquiryFare = document.getElementById("flightEnquiryFare");
const flightEnquiryForm = document.getElementById("flightEnquiryForm");
const changeFlightButton = document.getElementById("changeFlightButton");
const seatSelection = document.getElementById("seatSelection");
const seatSelectionTitle = document.getElementById("seatSelectionTitle");
const seatSelectionSummary = document.getElementById("seatSelectionSummary");
const seatMaps = document.getElementById("seatMaps");
const seatSelectionStatus = document.getElementById("seatSelectionStatus");
const confirmBookingButton = document.getElementById("confirmBookingButton");
const backToDetailsButton = document.getElementById("backToDetailsButton");
const bookingDialog = document.getElementById("bookingDialog");
const closeBookingDialogButton = document.getElementById("closeBookingDialog");
const couponToggle = document.getElementById("couponToggle");
const couponCode = document.getElementById("couponCode");
const couponCheck = document.getElementById("couponCheck");
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
let selectedFlight = null;
const selectedSeats = new Map();

function showBookingStage(stage, headingId) {
  [flightResults, flightEnquiry, seatSelection].forEach((section) => {
    section.hidden = section !== stage;
  });
  bookingDialog.setAttribute("aria-labelledby", headingId);
  if (!bookingDialog.open) bookingDialog.showModal();
}

function resetBookingFlow() {
  bookingShell.hidden = false;
  [flightResults, flightEnquiry, seatSelection].forEach((section) => {
    section.hidden = true;
  });
  selectedFlight = null;
  selectedSeats.clear();
  fromField.focus();
}

closeBookingDialogButton.addEventListener("click", () => bookingDialog.close());
bookingDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  bookingDialog.close();
});
bookingDialog.addEventListener("close", resetBookingFlow);

const oneWayFareByCity = {
  eldoret: 5500,
  kisumu: 6500,
  mombasa: 6500,
  homabay: 7800,
  wajir: 9000,
  "maasai mara": 10500,
  "ukunda (diani)": 8000,
  malindi: 8000,
  kitale: 6000,
  lodwar: 10000,
  lamu: 10000,
  migori: 7000,
  garissa: 8000,
};
const routes = { nairobi: Object.keys(oneWayFareByCity) };
Object.keys(oneWayFareByCity).forEach((city) => {
  routes[city] = ["nairobi"];
});
const allCities = Array.from(fromField.options, (option) => option.value.toLowerCase()).filter(Boolean);
const airportCodes = {
  nairobi: "NBO",
  eldoret: "EDL",
  kisumu: "KIS",
  mombasa: "MBA",
  wajir: "WJR",
};
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
  const showReservation = selectedTab === reservationTab;
  bookingShell.classList.toggle("reservation-active", showReservation);
  bookingShell.classList.toggle("status-active", selectedTab === statusTab);
  flightTab.classList.toggle("active", showFlights);
  reservationTab.classList.toggle("active", showReservation);
  statusTab.classList.toggle("active", selectedTab === statusTab);
  flightTab.setAttribute("aria-selected", String(showFlights));
  reservationTab.setAttribute("aria-selected", String(showReservation));
  statusTab.setAttribute("aria-selected", String(selectedTab === statusTab));
  flightPanel.hidden = !showFlights;
  reservationPanel.hidden = !showReservation;
  statusPanel.hidden = selectedTab !== statusTab;
}

flightTab.addEventListener("click", () => selectTab(flightTab));
reservationTab.addEventListener("click", () => selectTab(reservationTab));
statusTab.addEventListener("click", () => selectTab(statusTab));
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

function formatAirportLabel(city) {
  const normalizedCity = city.trim().toLowerCase();
  const label = normalizedCity === "homabay"
    ? "Homa Bay"
    : city.trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
  const code = airportCodes[normalizedCity];
  return code ? `${label} (${code})` : label;
}

function updateFlightEnquirySummary(fareQuote) {
  const passengerCount = fareQuote.passengerCount;
  const returnSummary = tripType.value === "roundtrip"
    ? ` and returning ${returnDate.value}`
    : "";
  flightEnquirySummary.textContent =
    `${tripType.selectedOptions[0].textContent}: ${formatAirportLabel(fromField.value)} to ${formatAirportLabel(toField.value)} for ${passengerCount} passenger${passengerCount === 1 ? "" : "s"}, departing ${departDate.value}${returnSummary}.`;
  flightEnquiryFare.textContent =
    `From KSh ${formatFare(fareQuote.oneWayFare)} per passenger, one-way. Estimated total for this trip: KSh ${formatFare(fareQuote.total)}.`;
}

const flightOptions = [
  { departure: "07:30", arrival: "09:00", returnDeparture: "15:30", returnArrival: "17:00" },
  { departure: "12:30", arrival: "14:00", returnDeparture: "17:30", returnArrival: "19:00" },
];
const reservedSeats = new Set(["4B", "5C", "6B", "7A", "8D"]);
const seatColumns = ["A", "B", "C", "D"];

function getSeatLegs() {
  const outboundSchedule = selectedFlight
    ? ` · ${selectedFlight.departure} - ${selectedFlight.arrival}`
    : "";
  const legs = [{
    id: "outbound",
    label: `Outbound · ${departDate.value}${outboundSchedule} · ${formatAirportLabel(fromField.value)} to ${formatAirportLabel(toField.value)}`,
  }];
  if (tripType.value === "roundtrip") {
    legs.push({
      id: "return",
      label: `Return · ${returnDate.value}${selectedFlight ? ` · ${selectedFlight.returnDeparture} - ${selectedFlight.returnArrival}` : ""} · ${formatAirportLabel(toField.value)} to ${formatAirportLabel(fromField.value)}`,
    });
  }
  return legs;
}

function getSeatSelectionId() {
  return tripType.value === "roundtrip" ? "both" : "outbound";
}

function updateBookingRequestLink() {
  const passengerCount = Number(passengerField.value);
  const fareQuote = calculateFareQuote();
  const seatChoices = selectedSeats.get(getSeatSelectionId());
  const hasAllSeats = seatChoices?.size === passengerCount;
  confirmBookingButton.setAttribute("aria-disabled", String(!hasAllSeats));
  confirmBookingButton.tabIndex = hasAllSeats ? 0 : -1;
  if (!hasAllSeats || !selectedFlight || !fareQuote) {
    confirmBookingButton.href = "#";
    return;
  }

  const enquiry = new FormData(flightEnquiryForm);
  const selectedSeatLabels = Array.from(seatChoices).join(", ");
  const seats = tripType.value === "roundtrip"
    ? `${selectedSeatLabels} (same seat selection for outbound and return)`
    : selectedSeatLabels;
  const request = [
    "Hello Renegade Air,",
    "",
    "I would like to request my booking:",
    `Route: ${fromField.value} → ${toField.value}`,
    `Depart: ${departDate.value} at ${selectedFlight.departure}`,
    ...(tripType.value === "roundtrip"
      ? [`Return: ${returnDate.value} at ${selectedFlight.returnDeparture}`]
      : []),
    `Fare per passenger per journey (estimate): KSh ${formatFare(fareQuote.oneWayFare)}`,
    `Journeys: ${fareQuote.legs}`,
    `Passengers: ${passengerCount} Passenger${passengerCount === 1 ? "" : "s"}`,
    `Total (estimate): KSh ${formatFare(fareQuote.total)}`,
    `Seats: ${seats}`,
    `Flight: Renegade Air (${selectedFlight.departure} - ${selectedFlight.arrival})`,
    ...(tripType.value === "roundtrip"
      ? [`Return flight: Renegade Air (${selectedFlight.returnDeparture} - ${selectedFlight.returnArrival})`]
      : []),
    "",
    "Passenger details (lead passenger):",
    `Name: ${enquiry.get("fullName").toString().trim()}`,
    "ID/Passport: Please provide directly to Renegade Air through a verified, secure channel.",
    `Passenger type: ${enquiry.get("passengerType")}`,
    `Phone: ${enquiry.get("phone").toString().trim()}`,
    `Email: ${enquiry.get("email").toString().trim()}`,
    `Special requests: ${enquiry.get("specialRequest").toString().trim() || "None"}`,
    "",
    "Please confirm availability and the final fare.",
  ].join("\n");
  confirmBookingButton.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(request)}`;
}

function renderSeatMaps() {
  seatMaps.replaceChildren();
  selectedSeats.clear();
  const passengerCount = Number(passengerField.value);
  const legs = getSeatLegs();
  seatSelectionSummary.textContent =
    `${formatAirportLabel(fromField.value)} to ${formatAirportLabel(toField.value)} · ${passengerCount} passenger${passengerCount === 1 ? "" : "s"}`;

  const selectionId = getSeatSelectionId();
  const selectionLabel = tripType.value === "roundtrip"
    ? `Select once for both trips · Outbound ${departDate.value} · ${selectedFlight.departure} - ${selectedFlight.arrival} · Return ${returnDate.value} · ${selectedFlight.returnDeparture} - ${selectedFlight.returnArrival}`
    : legs[0].label;
  selectedSeats.set(selectionId, new Set());

  const leg = {
    id: selectionId,
    label: selectionLabel,
  };
  const section = document.createElement("section");
  section.className = "seat-map-section";
  section.dataset.leg = leg.id;

  const heading = document.createElement("h2");
  heading.textContent = leg.label;
  section.append(heading);

  const count = document.createElement("p");
  count.className = "seat-map-count";
  count.dataset.seatCount = "";
  count.textContent =
    `Choose ${passengerCount} seat${passengerCount === 1 ? "" : "s"}${tripType.value === "roundtrip" ? " once for both trips" : ""}.`;
  section.append(count);

  const grid = document.createElement("div");
  grid.className = "seat-map-grid";
  grid.setAttribute("role", "group");
  grid.setAttribute("aria-label", `${leg.label} seat choices`);

  for (let row = 1; row <= 8; row += 1) {
    seatColumns.forEach((column, index) => {
      if (index === 2) {
        const aisle = document.createElement("span");
        aisle.className = "seat-aisle";
        aisle.setAttribute("aria-hidden", "true");
        grid.append(aisle);
      }

      const seat = `${row}${column}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "seat-button";
      button.dataset.seat = seat;
      button.dataset.leg = leg.id;
      button.textContent = seat;
      button.disabled = reservedSeats.has(seat);
      button.setAttribute("aria-label", `${seat}, ${button.disabled ? "reserved" : "available"}`);
      button.setAttribute("aria-pressed", "false");
      grid.append(button);
    });
  }

  section.append(grid);
  seatMaps.append(section);

  confirmBookingButton.setAttribute("aria-disabled", "true");
  confirmBookingButton.tabIndex = -1;
  confirmBookingButton.href = "#";
  updateSeatSelectionStatus();
}

function updateSeatSelectionStatus(message) {
  const passengerCount = Number(passengerField.value);
  const seatCount = selectedSeats.get(getSeatSelectionId())?.size || 0;
  const complete = seatCount === passengerCount;
  seatSelectionStatus.textContent = message ||
    `${seatCount} of ${passengerCount} seat${passengerCount === 1 ? "" : "s"} selected${tripType.value === "roundtrip" ? " · same seats apply to both trips" : ""}`;
  confirmBookingButton.setAttribute("aria-disabled", String(!complete));
  confirmBookingButton.tabIndex = complete ? 0 : -1;
  updateBookingRequestLink();
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
  flightResultsSummary.textContent =
    `${tripType.selectedOptions[0].textContent} · ${formatAirportLabel(fromField.value)} to ${formatAirportLabel(toField.value)} · ${passengerField.value} passenger${Number(passengerField.value) === 1 ? "" : "s"}`;
  flightResultsList.replaceChildren();
  flightOptions.forEach((option, index) => {
    const card = document.createElement("article");
    card.className = "flight-result-card";
    card.innerHTML = `
      <div class="flight-option-name">
        <strong>Flight option ${index + 1}</strong>
        <span>Sample schedule</span>
      </div>
      <div class="flight-result-time departure-time">
        <strong>${option.departure}</strong>
        <span>${formatAirportLabel(fromField.value)}</span>
      </div>
      <div class="flight-result-route" aria-label="Sample schedule">
        <span>${tripType.value === "roundtrip"
          ? `Return ${option.returnDeparture} - ${option.returnArrival}`
          : "One-way"}</span>
        <i></i>
      </div>
      <div class="flight-result-time arrival-time">
        <strong>${option.arrival}</strong>
        <span>${formatAirportLabel(toField.value)}</span>
      </div>
      <div class="flight-result-price">
        <strong>KSh ${formatFare(fareQuote.total)}</strong>
        <span>Estimated total for ${fareQuote.passengerCount} passenger${fareQuote.passengerCount === 1 ? "" : "s"}</span>
      </div>
      <button type="button" data-flight-index="${index}">Book Now</button>`;
    flightResultsList.append(card);
  });
  bookingShell.hidden = true;
  showBookingStage(flightResults, "flightResultsTitle");
  document.getElementById("flightResultsTitle").focus();
});

changeSearchButton.addEventListener("click", () => {
  bookingDialog.close();
});

flightResultsList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-flight-index]");
  if (!button) return;
  const flight = flightOptions[Number(button.dataset.flightIndex)];
  const fareQuote = calculateFareQuote();
  if (!flight || !fareQuote) return;

  selectedFlight = flight;
  selectedFlight.total = fareQuote.total;
  selectedSeats.clear();
  updateFlightEnquirySummary(fareQuote);
  flightEnquiryFare.textContent =
    `Selected schedule: ${flight.departure} - ${flight.arrival}. Estimated total: KSh ${formatFare(fareQuote.total)}.`;
  renderSeatMaps();
  showBookingStage(flightEnquiry, "flightEnquiryTitle");
  flightEnquiryTitle.focus();
});

changeFlightButton.addEventListener("click", () => {
  selectedFlight = null;
  selectedSeats.clear();
  showBookingStage(flightResults, "flightResultsTitle");
  document.getElementById("flightResultsTitle").focus();
});

flightEnquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedFlight) return;
  showBookingStage(seatSelection, "seatSelectionTitle");
  seatSelectionTitle.focus();
});

backToDetailsButton.addEventListener("click", () => {
  showBookingStage(flightEnquiry, "flightEnquiryTitle");
  flightEnquiryTitle.focus();
});

seatMaps.addEventListener("click", (event) => {
  const button = event.target.closest(".seat-button");
  if (!button || button.disabled) return;

  const seats = selectedSeats.get(button.dataset.leg);
  if (!seats) return;
  const passengerCount = Number(passengerField.value);
  if (seats.has(button.dataset.seat)) {
    seats.delete(button.dataset.seat);
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("selected");
    updateSeatSelectionStatus();
    return;
  }
  if (seats.size >= passengerCount) {
    updateSeatSelectionStatus(`Choose no more than ${passengerCount} seat${passengerCount === 1 ? "" : "s"} for this booking.`);
    return;
  }
  seats.add(button.dataset.seat);
  button.setAttribute("aria-pressed", "true");
  button.classList.add("selected");
  updateSeatSelectionStatus();
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

document.getElementById("statusForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const statusForm = event.currentTarget;
  const flightNumber = statusForm.elements.flightNumber.value.trim();
  const flightDate = statusForm.elements.flightDate.value;
  const request = [
    "Hello Renegade Air, please check the status of this flight.",
    `Flight number: ${flightNumber}`,
    `Flight date: ${flightDate}`,
  ].join("\n");
  document.getElementById("statusMessage").hidden = false;
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
