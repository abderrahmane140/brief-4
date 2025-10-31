// --- reservation script (stretches tickets based on selected hours) ---
const model = document.getElementById('reservation-modal');
const closeBtn = document.getElementById('closeBtn');
const openBtn = document.getElementById('openBtn');
const formtitle = document.getElementById('title-form');

const form = document.getElementById('form');
const startHour = document.getElementById('startHour');
const endHour = document.getElementById('endHour');

const reservations = [];
let editingId = null;

const hourMap = {
  "09:00": 0, "10:00": 1, "11:00": 2, "12:00": 3,
  "13:00": 4, "14:00": 5, "15:00": 6, "16:00": 7
};
const SCHEDULE_START = 9 * 60;
const SCHEDULE_END   = 17 * 60;
const TOTAL_SCHEDULE_MINUTES = SCHEDULE_END - SCHEDULE_START;

// --- LocalStorage ---
function saveReservations() {
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

function loadReservations() {
  const stored = localStorage.getItem('reservations');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      parsed.forEach(r => {
        const res = { ...r, el: null };
        reservations.push(res);
        renderTicketForReservation(res);
      });
    } catch (e) {
      console.error('Failed to load reservations:', e);
    }
  }
}

function formatTimeToMinutes(HHMM) {
  if (!HHMM) return NaN;
  const parts = HHMM.split(':');
  if (parts.length !== 2) return NaN;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return h * 60 + m;
}

// --- Modal open/close ---
function openModel(day = '', reservation = null) {
  model.classList.remove("hidden");
  model.classList.add("flex");
  if (reservation) {
    formtitle.textContent = 'Update Reservation';
    editingId = reservation.id;
  } else {
    formtitle.textContent = 'Create Reservation';
    editingId = null;
  }
  if (day) document.getElementById('reservation-day').value = day;
}

function closeModel() {
  model.classList.remove("flex");
  model.classList.add("hidden");
  editingId = null;
  form.reset();
}

openBtn.addEventListener('click', () => openModel());
closeBtn.addEventListener('click', closeModel);

// --- Form submit ---
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const day = document.getElementById('reservation-day').value.trim();
  const customer_name = document.getElementById('customerName').value.trim();
  const start_hour = startHour.value.trim();
  const end_hour = endHour.value.trim();
  const number_people_raw = document.getElementById('numberPeople').value.trim();
  const reservation_type = document.getElementById('reservationType').value;

  if (!day) return ErrorAlert('You must enter a day');
  if (!customer_name) return ErrorAlert('You must enter a name');
  if (!start_hour || !end_hour) return ErrorAlert('You must select start and end times');

  const number_people = parseInt(number_people_raw, 10);
  if (Number.isNaN(number_people) || number_people < 1) return ErrorAlert('You must enter at least 1 person');

  const startMin = formatTimeToMinutes(start_hour);
  const endMin = formatTimeToMinutes(end_hour);
  if (Number.isNaN(startMin) || Number.isNaN(endMin)) return ErrorAlert('Time format is wrong');
  if (endMin <= startMin) return ErrorAlert('End time must be after start time');

  // Overlap check
  const conflict = reservations.some(r => {
    if (r.reservation_day !== day) return false;
    if (editingId && r.id === editingId) return false;
    const rStart = formatTimeToMinutes(r.startHour);
    const rEnd = formatTimeToMinutes(r.endHour);
    return (startMin < rEnd) && (rStart < endMin);
  });
  if (conflict) return ErrorAlert('This time overlaps an existing reservation.');

  if (editingId) {
    // update
    const idx = reservations.findIndex(r => r.id === editingId);
    if (idx === -1) return ErrorAlert('Reservation not found');

    const existing = reservations[idx];
    if (existing.el) existing.el.remove();

    existing.reservation_day = day;
    existing.customerName = customer_name;
    existing.startHour = start_hour;
    existing.endHour = end_hour;
    existing.numberPeople = number_people;
    existing.reservationType = reservation_type;

    renderTicketForReservation(existing);
    saveReservations();
    successAlert('Reservation updated successfully');
    closeModel();
    return;
  }

  // create new
  const reservation = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    reservation_day: day,
    customerName: customer_name,
    startHour: start_hour,
    endHour: end_hour,
    numberPeople: number_people,
    reservationType: reservation_type,
    el: null
  };
  reservations.push(reservation);
  renderTicketForReservation(reservation);
  saveReservations();
  successAlert('Reservation created successfully');
  closeModel();
});

// --- Render ticket (desktop + mobile) ---
function renderTicketForReservation(reservation) {
  const day = reservation.reservation_day;
  const desktopColumn = document.getElementById(`day-${day}`);
  const mobileColumn = document.getElementById(`day-${day}-tickets`);

  if (!desktopColumn && !mobileColumn) return console.warn('No columns for day', day);

        const startMin = formatTimeToMinutes(reservation.startHour);
        const endMin = formatTimeToMinutes(reservation.endHour);

        const clampedStart = Math.max(startMin, SCHEDULE_START);
        const clampedEnd   = Math.min(endMin, SCHEDULE_END);

        const topPercent = ((clampedStart - SCHEDULE_START) / TOTAL_SCHEDULE_MINUTES) * 100;
        const heightPercent = ((clampedEnd - clampedStart) / TOTAL_SCHEDULE_MINUTES) * 100;


  // helper to create ticket element
  function createTicketElement() {
    const ticket = document.createElement('div');
    ticket.className = `absolute left-1 right-1 text-white rounded-lg px-2 py-1 text-xs flex justify-between items-center overflow-hidden`;
    ticket.style.top = `${topPercent}%`;
    ticket.style.height = `${heightPercent}%`;
    ticket.dataset.id = reservation.id;

    if (reservation.reservationType === "Standard") ticket.classList.add("bg-emerald-500");
    else if (reservation.reservationType === "VIP") ticket.classList.add("bg-red-500");
    else if (reservation.reservationType === "Group") ticket.classList.add("bg-blue-500");
    else ticket.classList.add("bg-slate-500");

    const text = document.createElement('span');
    text.className = 'truncate';
    text.textContent = `${reservation.customerName} (${reservation.numberPeople})`;

    const btns = document.createElement('div');
    btns.className = 'flex items-center gap-2';

    const btnUpdate = document.createElement('button');
    btnUpdate.type = 'button';
    btnUpdate.className = "p-1 text-white hover:opacity-90";
    btnUpdate.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    btnUpdate.addEventListener('click', (e) => {
      e.stopPropagation();
      openModel(reservation.reservation_day, reservation);
      document.getElementById('reservation-day').value = reservation.reservation_day;
      document.getElementById('customerName').value = reservation.customerName;
      document.getElementById('startHour').value = reservation.startHour;
      document.getElementById('endHour').value = reservation.endHour;
      document.getElementById('numberPeople').value = reservation.numberPeople;
      document.getElementById('reservationType').value = reservation.reservationType;
    });

    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.className = "p-1 text-white";
    btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
    btnDelete.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = reservations.findIndex(r => r.id === reservation.id);
      if (idx !== -1) reservations.splice(idx, 1);
      if (ticket && ticket.remove) ticket.remove();
      saveReservations();
      successAlert('Reservation deleted successfully');
    });

    btns.appendChild(btnUpdate);
    btns.appendChild(btnDelete);
    ticket.appendChild(text);
    ticket.appendChild(btns);
    return ticket;
  }

  // remove old ticket if exists
  if (reservation.el && reservation.el.remove) reservation.el.remove();

  // create tickets for desktop and mobile
  if (desktopColumn) desktopColumn.appendChild(createTicketElement());
  if (mobileColumn) mobileColumn.appendChild(createTicketElement());

  // store the reference to last created ticket (optional, can store desktop)
  reservation.el = desktopColumn ? desktopColumn.lastChild : mobileColumn.lastChild;
}

// --- Alerts ---
function successAlert(message) {
  const div = document.createElement('div');
  div.className = 'p-4 mb-4 flex items-center mt-4 text-sm bg-green-700 text-green-100 w-[400px] block m-auto z-30 font-bold rounded-sm';
  div.innerHTML = '<i class="fa-solid fa-check text-green-300"></i>';
  const text = document.createElement('p');
  text.textContent = message;
  text.className = 'ml-auto mr-auto';
  div.id = 'successAlert';
  div.appendChild(text);
  document.body.prepend(div);
  setTimeout(() => { const el = document.getElementById('successAlert'); if (el) el.remove(); }, 5000);
}

function ErrorAlert(message) {
  const div = document.createElement('div');
  div.className = 'p-4 mb-4 flex items-center mt-4 text-sm bg-red-700 text-red-300 w-[400px] block m-auto z-[9999] font-bold rounded-sm fixed top-4 left-1/2 -translate-x-1/2 shadow-lg';
  div.innerHTML = '<i class="fa-solid fa-circle-exclamation mt-1 justify-self-start text-red-300 "></i>';
  const text = document.createElement('p');
  text.textContent = message;
  text.classList = 'ml-auto mr-auto';
  div.id = 'errorAlert';
  div.appendChild(text);
  document.body.prepend(div);
  setTimeout(() => { const el = document.getElementById('errorAlert'); if (el) el.remove(); }, 3000);
}

// --- Load saved reservations ---
document.addEventListener('DOMContentLoaded', loadReservations);
