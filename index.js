const days = document.querySelectorAll('#day');

days.forEach((e) => {
    console.log(e)
    e.addEventListener('click',()=>{
        const span = e.querySelector('span')
        console.log(span.id)
    })
})