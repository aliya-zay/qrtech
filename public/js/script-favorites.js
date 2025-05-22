const qrCodesContainer = document.getElementById('my-favorite-qr-codes-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
let qrCodes = [];  // Объявляем qrCodes как глобальную переменную

async function loadMyFavoriteQrCodes() {
    try {
        const response = await fetch('/qrcodes/myfavorites');

        if (!response.ok) {
            throw new Error(`Ошибка при загрузке избранных QR-кодов: ${response.status}`);
        }

        qrCodes = await response.json(); // Сохраняем полученные QR-коды в глобальную переменную
        displayQrCodes(qrCodes); // Отображаем QR-коды после загрузки

    } catch (error) {
        console.error('Ошибка при загрузке и отображении избранных QR-кодов:', error);
        document.getElementById('my-favorite-qr-codes-container').innerHTML = '<p>Ошибка при загрузке избранных QR-кодов. Пожалуйста, попробуйте позже.</p>';
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

        qrCodeDiv.appendChild(qrCodeImage);
        qrCodeDiv.appendChild(qrCodeTitle);
        qrCodeDiv.appendChild(qrCodeDate);
        qrCodesContainer.appendChild(qrCodeDiv);
    });
}


// Вызываем функцию для загрузки избранных QR-кодов при загрузке страницы
window.addEventListener('load', () => {
    loadMyFavoriteQrCodes();
    if (searchButton) {
        searchButton.addEventListener('click', filterQrCodes);
    }
});

//назад
function goBack() {
    window.history.back();
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
