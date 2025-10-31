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

        //validation

        if(day.trim() == '') return alert('you must enter a day');
        if(costumer_name.trim() == '') return alert('you must enter your name');


        if(start_hour .trim() == '') return alert('you must select a starting date');
        if(end_hour .trim() == '') return alert('you must select a ending date');


        if(Number.isNaN(number_people) || number_people < 1) return alert('you must enter a number at least 1');



        function formateTime(HHMM){
            if(!HHMM) NaN;
            const [h, m] = HHMM.split(':').map(s=> parseInt(s,10));

            if(Number.isNaN(h) || Number.isNaN(m)) return NaN;

            return h * 60 + m
        }

        const startMin = formateTime(start_hour);
        const endMin = formateTime(end_hour);

        if(Number.isNaN(startHour) || Number.isNaN(end_hour)){
            return alert('the time formate is wrong')
        }

        if(endMin <= startMin){
            return alert('end time must be after the start time!');
        }


        const conflict = reservations.some(r => {
            if (r.reservation_day !== day) return false;

            if (editingId && r.id === editingId) return false;

            const rStart = formateTime(r.startHour);
            const rEnd = formateTime(r.endHour);
            if (Number.isNaN(rStart) || Number.isNaN(rEnd)) return false;



            return (startMin < rEnd) && (rStart < endMin);
        });
        if (conflict) {
            return alert('This time overlaps an existing reservation.');
        }



        const reservation = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            reservation_day : day,
            costumerName : costumer_name,
            startHour : start_hour,
            endHour : end_hour,
            numberPeopel : number_people,
            reservationType : reservation_type,
            el: null
        };

        reservations.push(reservation);

        renderTicketForReservation(reservation);

        closeModel();
        form.reset();
        //console.log(reservations)
    });


    function renderTicketForReservation(reservation){

        const day = reservation.reservation_day;
        const dayColumn = document.getElementById(`day-${day}`);
        if (!dayColumn) {
            console.warn('No column for day', day);
            return;
        }

        const startIndex = hourMap[reservation.startHour];
        const endIndex = hourMap[reservation.endHour] || (startIndex + 1);
        const heightPercent = ((endIndex - startIndex) / 8) * 100;
        console.log(heightPercent)
        const topPercent = (startIndex / 8) * 100;




        // create ticket
        const ticket = document.createElement('div');
        ticket.className = `absolute left-1 right-1 text-white rounded-lg px-2 py-1 text-xs flex justify-between items-center overflow-hidden`;
        ticket.style.top = `${topPercent}%`;
        ticket.style.height = `${heightPercent}%`;
        ticket.dataset.id = reservation.id;

        // color by reservation type (use reservation.reservationType)
        if (reservation.reservationType === "Standard") {
            ticket.classList.add("bg-emerald-500");
        } else if (reservation.reservationType === "VIP") {
            ticket.classList.add("bg-red-500");
        } else if (reservation.reservationType === "Group") {
            ticket.classList.add("bg-blue-500");
        } else {
            ticket.classList.add("bg-slate-500");
        }

        // main text (use reservation fields)
        const text = document.createElement('span');
        text.className = 'truncate';
        text.textContent = `${reservation.costumerName} (${reservation.numberPeopel})`;

        // buttons container
        const btns = document.createElement('div');
        btns.className = 'flex items-center gap-2';

        // update button
        const btnUpdate = document.createElement('button');
        btnUpdate.type = 'button';
        btnUpdate.className = "p-1 text-white hover:opacity-90";
        btnUpdate.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        btnUpdate.addEventListener('click', (e) => {
            e.stopPropagation();

            openModel();

            document.getElementById('reservation-day').value = reservation.reservation_day;
            document.getElementById('customerNmae').value = reservation.costumerName;
            document.getElementById('startHour').value = reservation.startHour;
            document.getElementById('endHour').value = reservation.endHour;
            document.getElementById('numberPeopel').value = reservation.numberPeopel;
            document.getElementById('reservationType').value = reservation.reservationType;

            const originalHandler = form.onsubmit;
            form.onsubmit  = function (ev) {
                ev.preventDefault();

                reservation.reservation_day = document.getElementById('reservation-day').value;
                reservation.costumerName = document.getElementById('customerNmae').value;
                reservation.startHour = document.getElementById('startHour').value;
                reservation.endHour = document.getElementById('endHour').value;
                reservation.numberPeopel = document.getElementById('numberPeopel').value;
                reservation.reservationType = document.getElementById('reservationType').value;

                // remove the old dom element
                if (reservation.el && reservation.el.remove) reservation.el.remove();

                // re-render ticket
                renderTicketForReservation(reservation);

                form.onsubmit = originalHandler;
                closeModel();
                form.reset();
            };
        });

        // delete button
        const btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.className = "p-1 text-white";
        btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btnDelete.addEventListener('click', (e) => {
            e.stopPropagation();

            const idx = reservations.findIndex(r => r.id === reservation.id);
            if (idx !== -1) reservations.splice(idx, 1);

            ticket.remove();
        });

        btns.appendChild(btnUpdate);
        btns.appendChild(btnDelete);

        ticket.appendChild(text);
        ticket.appendChild(btns);

        reservation.el = ticket;

        dayColumn.appendChild(ticket);


    }



