async function getInfo() {
    const stopName = document.getElementById('stopName');
    const timeTable = document.getElementById('buses');
    const stopId = document.getElementById('stopId').value;

    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    try {
        stopName.textContent = 'Loading...'
        timeTable.replaceChildren();
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error('Stop ID Not Found');
        }
        const data = await res.json();

        stopName.textContent = data.name;

        Object.entries(data.buses).forEach(b => {
            const liEl = document.createElement('li');
            liEl.textContent = `Bus ${b[0]} arrives in ${b[1]} minutes`;
            timeTable.appendChild(liEl);
        })
    } catch(error) {
        stopName.textContent = "Error";
    }
}