const model = document.getElementById('reservation-modal');
const closeBtn = document.getElementById('closeBtn');
const opneBtn = document.getElementById('openBtn');

const reservation_day = document.getElementById('reservation-day');
const form = document.getElementById('form')
const startHour = document.getElementById('startHour')
const endHour = document.getElementById('endHour')

console.log(model)

const reservations = [];



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



form.addEventListendaydayer('submit',(e) =>{
    e.preventDefault();

    reservation = {
        reservation_day : reservation_day.value,
        costumerName : document.getElementById('customerNmae').value,
        startHour : startHour.value,
        endHour : endHour.value,
        numberPeopel : document.getElementById('numberPeopel').value,
        reservationType : document.getElementById('reservationType').value
    }

    reservations.push(reservation)
    console.log(reservations)

    const cart = document.createElement('div');
    cart.classList = "bg-red-400"
    document.body.appendChild(cart);
})


