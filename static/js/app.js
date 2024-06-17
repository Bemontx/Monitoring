document.addEventListener('DOMContentLoaded', async function() {
    const carForm = document.getElementById('carForm');
    const carTableBody = document.getElementById('carTableBody');

    // Función para cargar los carros desde la API
    async function loadCars() {
        try {
            const response = await fetch('/api/carros/');
            const data = await response.json();
            carTableBody.innerHTML = '';
            data.forEach(car => {
                const row = document.createElement('tr');
                row.dataset.id = car.id; 
                row.innerHTML = `
                    <td>${car.marca}</td>
                    <td>${car.sucursal}</td>
                    <td>${car.modelo}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">Delete
                        <img src="{% static 'icon/Icon_eliminar1.svg' %}">
                        </button>
                        <button class="btn btn-primary btn-sm ms-1" onclick="editCar(${car.id})">Edit</button>
                        <img src="{% static 'icon/Icon_editar1.svg' %}">                        
                    </td>
                `;
                carTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading cars:', error);
        }
    }

    // Función para obtener el valor de cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Función para manejar el envío del formulario de agregar carro
    carForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const marca = document.getElementById('marca').value;
        const sucursal = document.getElementById('sucursal').value;
        const modelo = document.getElementById('modelo').value;

        try {
            const response = await fetch('/api/carros/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    marca: marca,
                    sucursal: sucursal,
                    modelo: modelo,
                }),
            });
            const data = await response.json();
            console.log('Success:', data);
            loadCars();
            carForm.reset();
        } catch (error) {
            console.error('Error adding car:', error);
        }
    });

    // Función para manejar la eliminación de un carro
    window.deleteCar = function(id) {
        fetch(`/api/carros/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(() => {
            loadCars();
        })
        .catch((error) => {
            console.error('Error deleting car:', error);
        });
    };

    // Función para editar un carro
    window.editCar = function(id) {
        const row = carTableBody.querySelector(`tr[data-id="${id}"]`);
        
        if (!row) {
            console.error(`Row with data-id="${id}" not found.`);
            return;
        }

        const cells = row.querySelectorAll('td');

        cells.forEach((cell, index) => {
            if (index < cells.length - 1) { 
                const value = cell.textContent.trim();
                cell.innerHTML = `<input type="text" class="form-control" value="${value}">`;
            }
        });

        const actionsCell = cells[cells.length - 1];
        actionsCell.innerHTML = `
            <button class="btn btn-success btn-sm save-btn" onclick="saveCar(${id})">Save</button>
            <button class="btn btn-secondary btn-sm cancel-btn" onclick="cancelEdit(${id})">Cancel</button>
        `;
    };

    // Función para guardar los cambios al editar un carro
    window.saveCar = function(id) {
        const row = carTableBody.querySelector(`tr[data-id="${id}"]`);
        
        if (!row) {
            console.error(`Row with data-id="${id}" not found.`);
            return;
        }

        const cells = row.querySelectorAll('td');

        const updatedCar = {
            marca: cells[0].querySelector('input').value,
            sucursal: cells[1].querySelector('input').value,
            modelo: cells[2].querySelector('input').value,
        };

        fetch(`/api/carros/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(updatedCar),
        })
        .then(response => response.json())
        .then(() => {
            loadCars();
        })
        .catch((error) => {
            console.error('Error saving car:', error);
        });
    };

    // Función para cancelar la edición de un carro
    window.cancelEdit = function(id) {
        loadCars(); 
    };

    // Cargar los carros al cargar la página
    loadCars();
});