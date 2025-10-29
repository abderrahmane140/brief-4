const days = document.querySelectorAll('#day');
const model = document.getElementById('model');
const closeBtn = document.getElementById('closeBtn');
const reservation_day = document.getElementById('reservation-day');




days.forEach((e) => {
    console.log(e)
    e.addEventListener('click',()=>{
        const span = e.querySelector('span')
        openModel(span.id, e);
    })
})

function openModel(id){
    model.classList.remove("hidden");
    model.classList.add("flex");

    reservation_day.value = id;
}

function closeModel(){
    model.classList.remove("flex");
    model.classList.add("hidden");
}

closeBtn.addEventListener('click', closeModel);


