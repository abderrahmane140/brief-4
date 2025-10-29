const days = document.querySelectorAll('#day');
const model = document.getElementById('model');
const closeBtn = document.getElementById('closeBtn');




days.forEach((e) => {
    console.log(e)
    e.addEventListener('click',()=>{
        const span = e.querySelector('span')
        openModel(span.id);
    })
})

function openModel(id){
    model.classList.remove("hidden");
    model.classList.add("flex");
}

function closeModel(){
    model.classList.remove("flex");
    model.classList.add("hidden");
}

closeBtn.addEventListener('click', closeModel);


