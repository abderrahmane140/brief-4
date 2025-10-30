const model = document.getElementById('reservation-modal');
const closeBtn = document.getElementById('closeBtn');
const opneBtn = document.getElementById('openBtn');


const form = document.getElementById('form')
const startHour = document.getElementById('startHour')
const endHour = document.getElementById('endHour')


const reservations = [];

const hourMap = {
  "09:00": 0,
  "10:00": 1,
  "11:00": 2,
  "12:00": 3,
  "13:00": 4,
  "14:00": 5,
  "15:00": 6,
  "16:00": 7,
  "17:00": 8 
}


function openModel(day,start,end){
    model.classList.remove("hidden");
    model.classList.add("flex");
}

function closeModel(){
    model.classList.remove("flex");
    model.classList.add("hidden");
}

opneBtn.addEventListener('click', openModel);

closeBtn.addEventListener('click', closeModel);



form.addEventListener('submit',(e) =>{
    e.preventDefault();

    const day = document.getElementById('reservation-day').value;
    const costumer_name = document.getElementById('customerNmae').value;
    const start_hour = document.getElementById('startHour').value;
    const end_hour = document.getElementById('endHour').value;
    const number_people = document.getElementById('numberPeopel').value;
    const reservation_type = document.getElementById('reservationType').value;


    reservation = {
        reservation_day : day,
        costumerName : costumer_name,
        startHour : startHour,
        endHour : end_hour,
        numberPeopel : number_people,
        reservationType : reservation_type
    }

    reservations.push(reservation)
    console.log(reservations)

    const dayColumn = document.getElementById(`day-${day}`);
    const ticket = document.createElement('div');

    const startIndex = hourMap[start_hour];
    const endIndex = hourMap[end_hour] || (startIndex + 1);
    const heightPercent =  ((endIndex - startIndex) / 8)  * 100
    const topPercent = (startIndex / 8) * 100;


    ticket.className = `absolute left-1  right-1 text-white rounded-lg px-2 py-1 text-xs flex justify-between items-center ` ;
        if (reservation_type === "Standard") {
            ticket.classList.add("bg-emerald-500");
        } else if (reservation_type === "VIP") {
            ticket.classList.add("bg-red-500");
        } else if (reservation_type === "Group") {
            ticket.classList.add("bg-blue-500");
        }

    ticket.style.top = `${topPercent}%`;
    ticket.style.height = `${heightPercent}%`;
    ticket.innerHTML = `${costumer_name} (${number_people})`;

    dayColumn.appendChild(ticket);

    //${reservation_type === "Standard"} ? 'bg-emerald-500' ${reservation_type === "VIP"} ? 'bg-red-500' ${reservation_type === "Group"} ? 'bg-blue-500'
    closeModel();
    form.reset();

})


