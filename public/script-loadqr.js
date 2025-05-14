const qrCodesContainer = document.getElementById('my-qr-codes-container');
const searchInput = document.getElementById('search-input'); // Получаем ссылку на поле поиска
const searchButton = document.getElementById('search-button'); // Получаем ссылку на кнопку "Найти"
let qrCodes = [];  // Объявляем qrCodes как глобальную переменную


// Функция sortQrCodes должна быть определена ДО обработчиков событий
function sortQrCodes(sortBy) {
    console.log("Функция sortQrCodes вызвана с sortBy:", sortBy);
    loadMyQrCodes(sortBy);
}

async function loadMyQrCodes(sortBy = null) {
    try {
        let url = '/qrcodes/myqrcodes';
        if (sortBy) {
            url += `?sortBy=${sortBy}`;
        }
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка при загрузке QR-кодов: ${response.status}`);
        }

        qrCodes = await response.json(); // Сохраняем полученные QR-коды в глобальную переменную
        displayQrCodes(qrCodes); // Отображаем QR-коды после загрузки
    } catch (error) {
        console.error('Ошибка при загрузке и отображении QR-кодов:', error);
        document.getElementById('my-qr-codes-container').innerHTML = '<p>Ошибка при загрузке QR-кодов. Пожалуйста, попробуйте позже.</p>';
    }
}

//звездочка
async function toggleFavorite(qrId, button) {
    try {
        const response = await fetch('/qrcodes/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ qrId: qrId })
        });

        if (!response.ok) {
            throw new Error(`Ошибка при обновлении избранного: ${response.status}`);
        }

        const data = await response.json();
        const isFavorite = data.is_favorite;

        // Обновляем значок звездочки
        button.innerHTML = isFavorite ? '★' : '☆';

        // 💡 Обновляем глобальные данные
        const index = qrCodes.findIndex(qr => qr.id === qrId);
        if (index !== -1) {
            qrCodes[index].is_favorite = isFavorite;
        }

        // 💡 Сохраняем состояние в localStorage
        localStorage.setItem(`favorite_${qrId}`, isFavorite);

        // 💡 Перерисовываем QR-коды
        displayQrCodes(qrCodes);
    } catch (error) {
        console.error('Ошибка при обновлении избранного:', error);
        alert('Ошибка при обновлении избранного. Пожалуйста, попробуйте позже.');
    }
}


function displayQrCodes(qrCodesToDisplay) {
    qrCodesContainer.innerHTML = '';

    if (!qrCodesToDisplay || qrCodesToDisplay.length === 0) {
        qrCodesContainer.innerHTML = '<p>QR-коды не найдены.</p>';
        return;
    }

    qrCodesToDisplay.forEach(qrCode => {
        const qrCodeDiv = document.createElement('div');
        qrCodeDiv.classList.add('qr-code-item');

        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = `data:image/png;base64,${qrCode.qr}`;
        qrCodeImage.alt = qrCode.title || 'QR-код';        

        const qrCodeTitle = document.createElement('h3');
        qrCodeTitle.textContent = qrCode.title || 'Без названия';

        const qrCodeDate = document.createElement('p');
        qrCodeDate.textContent = `Дата создания: ${new Date(qrCode.created_at).toLocaleDateString()}`;

        // Кнопка-звездочка
        const favoriteButton = document.createElement('button');
        favoriteButton.classList.add('favorite-button');
        favoriteButton.dataset.qrId = qrCode.id; // Сохраняем ID QR-кода в data-атрибуте

        // 💡 Проверяем состояние в localStorage
        const isFavorite = localStorage.getItem(`favorite_${qrCode.id}`) === 'true';
        qrCode.is_favorite = isFavorite;  //Обновляем состояние qrCode.is_favorite
        favoriteButton.innerHTML = isFavorite ? '★' : '☆';

        // Добавляем обработчик события к кнопке-звездочке
        favoriteButton.addEventListener('click', async () => {
            await toggleFavorite(qrCode.id, favoriteButton); // вызываем функцию, чтобы обновить состояние избранного
        });

        // Меню с тремя точками и действиями
        const optionsMenu = document.createElement('div');
        optionsMenu.classList.add('options-menu');

        const optionsButton = document.createElement('button');
        optionsButton.classList.add('options-button');
        optionsButton.innerHTML = '&#8942;';

        const optionsDropdown = document.createElement('div');
        optionsDropdown.classList.add('options-dropdown');

        // Кнопка "Скачать"
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Скачать';
        downloadBtn.classList.add('download-button');
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadQrCode(qrCode);
        });

        // Кнопка "Переименовать"
        const renameBtn = document.createElement('button');
        renameBtn.textContent = 'Переименовать';
        renameBtn.classList.add('rename-button');
        renameBtn.addEventListener('click', () => {
            renameQrCode(qrCode.id);
        });

        // Кнопка "Удалить"
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', () => {
            deleteQrCode(qrCode.id);
        });

        // Добавляем кнопки в dropdown
        optionsDropdown.appendChild(downloadBtn);
        optionsDropdown.appendChild(renameBtn);
        optionsDropdown.appendChild(deleteBtn);

        // Собираем меню
        optionsMenu.appendChild(optionsButton);
        optionsMenu.appendChild(optionsDropdown);

        qrCodeDiv.appendChild(qrCodeImage);
        qrCodeDiv.appendChild(qrCodeTitle);
        qrCodeDiv.appendChild(qrCodeDate);
        qrCodeDiv.appendChild(favoriteButton); // Добавляем кнопку-звездочку к qrCodeDiv
        qrCodeDiv.appendChild(optionsMenu); // Добавляем меню к qrCodeDiv
        qrCodesContainer.appendChild(qrCodeDiv);

        // Добавляем обработчики событий к кнопкам "Удалить" и "Переименовать"
        const deleteButton = qrCodeDiv.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            const qrId = deleteButton.dataset.qrId;
            deleteQrCode(qrId); // Вызываем функцию удаления
        });
        
    });
}

function toggleSortDropdown() {
    document.getElementById("sortDropdown").classList.toggle("show");
}

window.addEventListener('load', () => {
    const sortByDateButton = document.getElementById('sortByDateButton');
    const sortByTitleButton = document.getElementById('sortByTitleButton');
    loadMyQrCodes();

    if (sortByDateButton) {
        sortByDateButton.addEventListener('click', () => {
            console.log("Кнопка 'По дате создания' нажата");
            sortQrCodes('date'); // Вызываем функцию sortQrCodes
        });
    }

    if (sortByTitleButton) {
        sortByTitleButton.addEventListener('click', () => {
            console.log("Кнопка 'По названию' нажата");
            sortQrCodes('title'); // Вызываем функцию sortQrCodes
        });
    }
});

//избранное
const favoritesButton = document.getElementById('favorites-button');

if (favoritesButton) {
    favoritesButton.addEventListener('click', () => {
        // Логика перехода на страницу "Избранное" или фильтрации
        window.location.href = '/favorites.html'; // Или другая логика
    });
}

//назад
function goBack() {
    window.history.back();
}


// Добавляем обработчик события click на кнопку "Найти"
if (searchButton) {
    searchButton.addEventListener('click', filterQrCodes);
}

// Функция фильтрации QR-кодов по названию
function filterQrCodes() {
    const searchTerm = searchInput.value.toLowerCase();  // Получаем поисковый запрос
    const filteredQrCodes = qrCodes.filter(qrCode => { // Фильтруем список qrCodes
        const title = qrCode.title ? qrCode.title.toLowerCase() : '';
        return title.includes(searchTerm); // Проверяем, содержит ли название QR-кода поисковый запрос
    });
    displayQrCodes(filteredQrCodes); // Отображаем отфильтрованные QR-коды
}


//удалить и переименовать
// Функция для удаления QR-кода
async function deleteQrCode(qrId) {
    try {
        const response = await fetch('/qrcodes/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ qrId: qrId })
        });

        if (!response.ok) {
            throw new Error(`Ошибка при удалении QR-кода: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.message); // Выводим сообщение об успехе

        // Перезагружаем список QR-кодов после удаления
        loadMyQrCodes();
    } catch (error) {
        console.error('Ошибка при удалении QR-кода:', error);
        alert('Ошибка при удалении QR-кода. Пожалуйста, попробуйте позже.');
    }
}

// Функция для переименования QR-кода
async function renameQrCode(qrId) {
    const newTitle = prompt('Введите новое название для QR-кода:');

    if (newTitle) {
        try {
            const response = await fetch('/qrcodes/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ qrId: qrId, title: newTitle })
            });

            if (!response.ok) {
                throw new Error(`Ошибка при переименовании QR-кода: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message); // Выводим сообщение об успехе

            // Перезагружаем список QR-кодов после переименования
            loadMyQrCodes();
        } catch (error) {
            console.error('Ошибка при переименовании QR-кода:', error);
            alert('Ошибка при переименовании QR-кода. Пожалуйста, попробуйте позже.');
        }
    }
}

// === 🔒 Выход из аккаунта ===
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", async function (e) {
        e.preventDefault();
        try {
            const response = await fetch("/logout", {
                method: "POST",
            });
            if (response.ok) {
                window.location.href = "/";
            } else {
                alert("Ошибка при выходе");
            }
        } catch (err) {
            console.error("Logout error", err);
            alert("Ошибка при выходе");
        }
    });
}


function downloadQrCode(qrCode) {
    const base64Data = qrCode.qr;
    const imageDataUrl = `data:image/png;base64,${base64Data}`;

    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = `${qrCode.title || 'qr-code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



