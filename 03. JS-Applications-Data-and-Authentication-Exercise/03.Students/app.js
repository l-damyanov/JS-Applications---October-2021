const studentsTable = document.querySelector('tbody');
const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);

loadStudents();

function loadStudents() {
    const url = 'http://localhost:3030/jsonstore/collections/students';
    const httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener('readystatechange', () => {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            studentsTable.replaceChildren(...Object.values(JSON.parse(httpRequest.responseText)).map(createStudentRow));
        }
    });
    httpRequest.open('GET', url);
    httpRequest.send();
}

function createStudentRow(student) {
    let trEl = document.createElement('tr');
    trEl.innerHTML = `
    <th>${student.firstName}</th>
    <th>${student.lastName}</th>
    <th>${student.facultyNumber}</th>
    <th>${student.grade}</th>
    `;

    return trEl;
}

async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let facultyNumber = formData.get('facultyNumber');
    let grade = formData.get('grade');

    if (firstName == '' || lastName == '' || facultyNumber == '' || grade == '') {
        throw new Error('All fields must be filled!');
    }

    let result = { firstName, lastName, facultyNumber, grade };
    addStudent(result);
    window.location.reload();
}

async function addStudent(student) {
    const result = await fetch('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });

    return result;
}