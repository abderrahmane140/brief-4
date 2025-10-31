const model = document.getElementById('reservation-modal');
const closeBtn = document.getElementById('closeBtn');
const opneBtn = document.getElementById('openBtn');


const form = document.getElementById('form')
const startHour = document.getElementById('startHour')
const endHour = document.getElementById('endHour')


const reservations = [];
let editingId = null;

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
        id: Date.now() + Math.floor(Math.random() * 1000),
        reservation_day : day,
        costumerName : costumer_name,
        startHour : start_hour,
        endHour : end_hour,
        numberPeopel : number_people,
        reservationType : reservation_type,
        el: null
    }

    reservations.push(reservation)
    console.log(reservations)

    const dayColumn = document.getElementById(`day-${day}`);
    const ticket = document.createElement('div');

    const startIndex = hourMap[start_hour];
    const endIndex = hourMap[end_hour] || (startIndex + 1);
    const heightPercent =  ((endIndex - startIndex) / 8)  * 100
    const topPercent = (startIndex / 8) * 100;

    ticket.style.top = `${topPercent}%`;
    ticket.style.height = `${heightPercent}%`;
    ticket.className = `absolute left-1 right-1 text-white rounded-lg px-2 py-1 text-xs flex justify-between items-center`;

        if (reservation_type === "Standard") {
            ticket.classList.add("bg-emerald-500");
        } else if (reservation_type === "VIP") {
            ticket.classList.add("bg-red-500");
        } else if (reservation_type === "Group") {
            ticket.classList.add("bg-blue-500");
        }

    
    ticket.innerHTML = `<span class="truncate">${costumer_name} (${number_people})</span>`;

    // add delete button 
    const btnDelete = document.createElement('div')   
    btnDelete.innerHTML =  '<i class="fa-solid fa fa-trash"></i>';
    btnDelete.className = "ml-2 cursor-pointer text-white";

    ticket.dataset.index = reservations.length - 1;

    btnDelete.addEventListener('click', () => {
        const index = ticket.dataset.index;
        reservations.splice(index, 1);
        ticket.remove();
    })

    ticket.appendChild(btnDelete);

    // add update button 
    const btnUpdate = document.createElement('div')   
    btnUpdate.innerHTML =  '<i class="fa-solid fa-pen-to-square"></i>';
    btnUpdate.className = "ml-2 cursor-pointer text-white";


    btnUpdate.addEventListener('click' , () => {
        openModel();

        document.getElementById('reservation-day').value = day;
        document.getElementById('customerNmae').value = costumer_name;
        document.getElementById('startHour').value = start_hour;
        document.getElementById('endHour').value = end_hour;
        document.getElementById('numberPeopel').value = number_people;
        document.getElementById('reservationType').value = reservation_type;


        form.onsubmit  = (e) => {
            e.preventDefault();

            reservations.costumerName = document.getElementById('customerNmae').value;
            reservations.startHour = document.getElementById('startHour').value;
            reservations.endHour = document.getElementById('endHour').value;
            reservations.numberPeopel = document.getElementById('numberPeopel').value;
            reservations.reservationType = document.getElementById('reservationType').value;


            ticket.innerHTML =`<span class="truncate">${reservation.costumerName} (${reservation.numberPeopel})</span>`


            closeModel();


        }


    })

    ticket.appendChild(btnUpdate)


    dayColumn.appendChild(ticket);

    closeModel();
    form.reset();

})


