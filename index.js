const model = document.getElementById('reservation-modal');
const closeBtn = document.getElementById('closeBtn');
const opneBtn = document.getElementById('openBtn');


const form = document.getElementById('form')
const startHour = document.getElementById('startHour')
const endHour = document.getElementById('endHour')

console.log(form)
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



form.addEventListener('submit',(e) =>{
    e.preventDefault();

    reservation = {
        reservation_day : document.getElementById('reservation-day').value,
        costumerName : document.getElementById('customerNmae').value,
        startHour : document.getElementById('startHour').value,
        endHour : document.getElementById('endHour').value,
        numberPeopel : document.getElementById('numberPeopel').value,
        reservationType : document.getElementById('reservationType').value
    }

    reservations.push(reservation)
    console.log(reservations)


})


