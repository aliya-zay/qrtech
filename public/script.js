let currentBackgroundColor = "#FFFFFF"; // Глобальный фон под маркеры
const qrCodeContainer = document.getElementById("qr-code-container");

const linkButton = document.getElementById("link-button");
const wifiButton = document.getElementById("wifi-button");
const textButton = document.getElementById("text-button");
const phoneButton = document.getElementById("phone-button");
const mapButton = document.getElementById("map-button");
const vcardButton = document.getElementById("vcard-button");

const linkFields = document.getElementById("link-fields");
const wifiFields = document.getElementById("wifi-fields");
const textFields = document.getElementById("text-fields");
const phoneFields = document.getElementById("phone-fields");
const mapFields = document.getElementById("map-fields");
const vcardFields = document.getElementById("vcard-fields");

const generateLinkQrButton = linkFields.querySelector(".generate-qr-button");
const generateWifiQrButton = wifiFields.querySelector(".generate-qr-button");
const generateTextQrButton = textFields.querySelector(".generate-qr-button");
const generatePhoneQrButton = phoneFields.querySelector(".generate-qr-button");
const generateMapQrButton = mapFields.querySelector(".generate-qr-button");
const generateVcardQrButton = vcardFields.querySelector(".generate-qr-button");

const designTypeButton = document.getElementById("design-type-button");
const designTypeSettings = document.getElementById("design-type-settings");
const designTypeSelect = document.getElementById("design-type");
const backgroundColorPalette = document.getElementById("background-color-palette");
const gradientColor1Palette = document.getElementById("gradient-color1-palette");
const gradientColor2Palette = document.getElementById("gradient-color2-palette");
const readyButton = document.getElementById("ready");
const templatePopup = document.getElementById("template-popup");

const closeButton = document.querySelector(".close-button");
const colorDropDown = document.getElementById("color-dropdown");
const simpleDesignButton = document.getElementById("simple-design");
const gradientDesignButton = document.getElementById("gradient-design");
const colorButton = document.getElementById("color-button");
const colorSettings = document.getElementById("color-settings");
const logoButton = document.getElementById("logo-button");
const logoSettings = document.getElementById("logo-settings");

const formButton = document.getElementById("form");
const formPanel = document.getElementById("form-panel");


document.querySelectorAll(".shape-button").forEach(btn => {
    const shape = btn.dataset.shape;
    btn.addEventListener("click", () => {
        switch (shape) {
            case "square":
                currentMarkerShape = MARKER_SHAPE_SQUARE;
                break;
            case "circle":
                currentMarkerShape = MARKER_SHAPE_CIRCLE;
                break;
            case "cross":
                currentMarkerShape = MARKER_SHAPE_CROSS;
                break;
            case "rounded-square":
                currentMarkerShape = MARKER_SHAPE_ROUNDED_SQUARE;
                break;
            case "hexagon":
                currentMarkerShape = MARKER_SHAPE_HEXAGON;
                break;
        }
    });
});



const MARKER_SHAPE_SQUARE = "square";
const MARKER_SHAPE_CIRCLE = "circle";
const MARKER_SHAPE_CROSS = "cross";
const MARKER_SHAPE_ROUNDED_SQUARE = "rounded-square";
const MARKER_SHAPE_HEXAGON = "hexagon";
let currentMarkerShape = MARKER_SHAPE_SQUARE;

// Добавляем обработчики событий для кнопок "Настройки цвета" и "Добавить логотип"
// Добавляем обработчики событий для кнопок "Настройки цвета" и "Добавить логотип"
// Добавляем обработчики событий для кнопок "Настройки цвета" и "Добавить логотип"
if (colorButton){
    colorButton.addEventListener("click", function() {
        colorDropDown.classList.toggle("show");
    });
}

function showSimpleDesign() {
        // Hide all settings
        document.querySelectorAll('.design > div[id$="-settings"]').forEach(setting => {
            setting.classList.remove('show');
        });
        colorDropDown.classList.remove("show");
        backgroundColorPalette.classList.remove("hidden");
        gradientColor1Palette.classList.add("hidden");
        gradientColor2Palette.classList.add("hidden");
    colorSettings.classList.add("show");
}
   
if(simpleDesignButton){
        simpleDesignButton.addEventListener("click", function(event) {
        showSimpleDesign();
  });
    }
        function showGradientDesign() {
        // Hide all settings
        document.querySelectorAll('.design > div[id$="-settings"]').forEach(setting => {
            setting.classList.remove('show');
        });
                colorDropDown.classList.remove("show");
        backgroundColorPalette.classList.add("hidden");
        gradientColor1Palette.classList.remove("hidden");
        gradientColor2Palette.classList.remove("hidden");
    colorSettings.classList.add("show");
}

if(gradientDesignButton){
        gradientDesignButton.addEventListener("click", function(event) {
        showGradientDesign();
  });
    }



function showLogoSettings() {
    // Hide all settings
    colorSettings.classList.remove("show");
    colorDropDown.classList.remove("show");
    //Отображаем элементы с логотипом
    logoSettings.classList.add("show");
}
if (logoButton) {
        logoButton.addEventListener("click", showLogoSettings);
}

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}

//проверка на адекватность цветов
function isColorLight(hexColor) {
    // Берем цвета в формате #RRGGBB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    // Вычисляем яркость по формуле
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 200; // чем больше, тем светлее
}

async function saveQrCodeToServer(canvas, title) {
    try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        const formData = new FormData();
        formData.append('qrCodeImage', blob, 'qrcode.png');
        formData.append('title', title);

        const response = await fetch('/qrcodes/create', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('QR-код успешно сохранен на сервере!');
        } else {
            console.error('Ошибка при сохранении QR-кода на сервере:', response.statusText);
        }
    } catch (error) {
        console.error('Ошибка сети при отправке QR-кода на сервер:', error);
    }
}



function generateQrCode(qrCodeText, title) {

    const saveQrButton = document.getElementById("save-qr-button");
    saveQrButton.classList.add("hidden");

    qrCodeContainer.innerHTML = "";

    const qrCodeTextValue = qrCodeText || document.getElementById("qrCodeText")?.value || "";
    const titleValue = title || document.getElementById("title")?.value || "";

    const designType = document.getElementById("design-type").value;
    const foregroundColorValue = document.getElementById("foreground-color").value || "#000000";

    let backgroundColorValue;
    let gradientColor1, gradientColor2;    


    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.width = "200px";
    canvas.style.height = "200px";
    qrCodeContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    if (designType === "simple") {
        backgroundColorValue = document.getElementById("background-color").value || "#FFFFFF";
        ctx.fillStyle = backgroundColorValue;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Сохраняем цвет фона
        currentBackgroundColor = backgroundColorValue;
    } else {
        gradientColor1 = document.getElementById("gradient-color1").value;
        gradientColor2 = document.getElementById("gradient-color2").value;
    
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradientColor1);
        gradient.addColorStop(1, gradientColor2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Для маркеров используем первый цвет градиента как фон
        currentBackgroundColor = gradientColor1;
    }
    

    const qr = qrcode(0, 'H');
    qr.addData(qrCodeTextValue);
    qr.make();

    const qrCodeSize = qr.getModuleCount();
    const cellSize = canvas.width / qrCodeSize;

    function drawMarker(x, y) {
        const size = cellSize * 7;
        const padding = cellSize;
        const innerSize = size - 2 * padding;
        const cx = x + size / 2;
        const cy = y + size / 2;
    
        // ⚡ Фон маркера (заливаем правильным цветом)
        ctx.fillStyle = currentBackgroundColor;
        ctx.fillRect(x, y, size, size);
    
        ctx.fillStyle = foregroundColorValue;
    
        switch (currentMarkerShape) {
            case MARKER_SHAPE_CIRCLE:
                // Внешняя окружность
                ctx.beginPath();
                ctx.arc(cx, cy, size / 2, 0, 2 * Math.PI);
                ctx.fill();
    
                // Белая внутренняя окружность
                ctx.fillStyle = currentBackgroundColor;
                ctx.beginPath();
                ctx.arc(cx, cy, (size - 2 * padding) / 2, 0, 2 * Math.PI);
                ctx.fill();
    
                // Маленький центр
                ctx.fillStyle = foregroundColorValue;
                ctx.beginPath();
                ctx.arc(cx, cy, (cellSize * 3) / 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
    
            case MARKER_SHAPE_ROUNDED_SQUARE:
                const radius = cellSize * 2;
                // Внешний скругленный квадрат
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + size - radius, y);
                ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
                ctx.lineTo(x + size, y + size - radius);
                ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
                ctx.lineTo(x + radius, y + size);
                ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();
    
                // Белая внутренняя область
                ctx.fillStyle = currentBackgroundColor;
                ctx.fillRect(x + padding, y + padding, innerSize, innerSize);
    
                // Маленький центр
                ctx.fillStyle = foregroundColorValue;
                ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, cellSize * 3, cellSize * 3);
                break;
    
            case MARKER_SHAPE_HEXAGON:
                const r = size / 2;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = Math.PI / 3 * i;
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
    
                // Белая внутренняя область (обычный прямоугольник по центру)
                ctx.fillStyle = currentBackgroundColor;
                ctx.fillRect(x + padding, y + padding, innerSize, innerSize);
    
                // Маленький центр
                ctx.fillStyle = foregroundColorValue;
                ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, cellSize * 3, cellSize * 3);
                break;
    
            case MARKER_SHAPE_CROSS:
                // Сначала белая подложка под крест (фон маркера)
                ctx.fillStyle = currentBackgroundColor;
                ctx.fillRect(x, y, size, size);
                
                // Теперь рисуем сам крест
                ctx.fillStyle = foregroundColorValue;
                const barWidth = cellSize * 1.5; // Толщина перекладины креста
                
                // Вертикальная полоса
                ctx.fillRect(x + (size - barWidth) / 2, y, barWidth, size);
                
                // Горизонтальная полоса
                ctx.fillRect(x, y + (size - barWidth) / 2, size, barWidth);
                
                // Потом белую внутреннюю область
                ctx.fillStyle = currentBackgroundColor;
                ctx.fillRect(x + padding, y + padding, innerSize, innerSize);
                
                // И маленький центр
                ctx.fillStyle = foregroundColorValue;
                ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, cellSize * 3, cellSize * 3);
                break;
                
    
            default: // квадрат (по умолчанию)
                // Внешний квадрат
                ctx.fillRect(x, y, size, size);
    
                // Белая внутренняя область
                ctx.fillStyle = currentBackgroundColor;
                ctx.fillRect(x + padding, y + padding, innerSize, innerSize);
    
                // Маленький центр
                ctx.fillStyle = foregroundColorValue;
                ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, cellSize * 3, cellSize * 3);
                break;
        }
    }
    
    
    
    
    

    // Отрисовка 3 угловых маркеров
    drawMarker(0 * cellSize, 0 * cellSize); // top-left
    drawMarker((qrCodeSize - 7) * cellSize, 0 * cellSize); // top-right
    drawMarker(0 * cellSize, (qrCodeSize - 7) * cellSize); // bottom-left

    // Основной QR-код
    ctx.fillStyle = foregroundColorValue;
    for (let row = 0; row < qrCodeSize; row++) {
        for (let col = 0; col < qrCodeSize; col++) {
            // Пропускаем зону маркеров (7x7)
            const inTopLeft = row < 7 && col < 7;
            const inTopRight = row < 7 && col >= qrCodeSize - 7;
            const inBottomLeft = row >= qrCodeSize - 7 && col < 7;
            if (inTopLeft || inTopRight || inBottomLeft) continue;

            if (qr.isDark(row, col)) {
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    // Логотип
    if (logoImage) {
        const logoWidth = canvas.width * 0.2;
        const logoHeight = canvas.height * 0.2;
        const logoX = (canvas.width - logoWidth) / 2;
        const logoY = (canvas.height - logoHeight) / 2;
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
    }

    saveQrCodeToServer(canvas, titleValue);

    // ✅ Показываем кнопку "Сохранить QR"
    saveQrButton.classList.remove("hidden");

    // ✅ Добавляем обработчик события для скачивания
    saveQrButton.addEventListener("click", function() {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = titleValue ? `${titleValue}.png` : 'qrcode.png'; // Используем название, если есть
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

}




function getColorValues() {
    const foregroundColor = document.getElementById("foreground-color").value;
    const backgroundColor = document.getElementById("background-color").value;

    return { foregroundColor, backgroundColor };
}

function showOnly(element) {
    document.querySelector(".input-area").classList.remove("hidden");
    linkFields.classList.add("hidden");
    wifiFields.classList.add("hidden");
    textFields.classList.add("hidden");
    phoneFields.classList.add("hidden");
    mapFields.classList.add("hidden");
    vcardFields.classList.add("hidden");
    element.classList.remove("hidden");
}

// Обработчики для отображения полей
linkButton.addEventListener("click", () => showOnly(linkFields));
wifiButton.addEventListener("click", () => showOnly(wifiFields));
textButton.addEventListener("click", () => showOnly(textFields));
phoneButton.addEventListener("click", () => showOnly(phoneFields));
mapButton.addEventListener("click", () => showOnly(mapFields));
vcardButton.addEventListener("click", () => showOnly(vcardFields));

// Обработчики для генерации QR-кодов и сохранения
generateLinkQrButton.addEventListener("click", () => {
    const title = document.getElementById("link-title").value;
    const linkUrl = document.getElementById("link-url").value;
    if (!isValidURL(linkUrl)) {
        alert("Пожалуйста, введите корректный URL.");
        return;
    }
    const qrCodeText = linkUrl;
    const { foregroundColor, backgroundColor } = getColorValues();
    const type = "URL";

    generateQrCode(qrCodeText, title, foregroundColor, backgroundColor, type);

    document.getElementById("link-title").value = "";
    document.getElementById("link-url").value = "";
});

generateWifiQrButton.addEventListener("click", () => {
    const title = document.getElementById("wifi-title").value;
    const ssid = document.getElementById("wifi-ssid").value;
    const password = document.getElementById("wifi-password").value;
    const encryption = document.getElementById("wifi-encryption").value;

    if (!ssid) {
        alert("Пожалуйста, введите имя сети Wi-Fi (SSID).");
        return;
    }

    const qrCodeText = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
    const { foregroundColor, backgroundColor } = getColorValues();
    const type = "Wi-Fi";

    generateQrCode(qrCodeText, title, foregroundColor, backgroundColor, type);

    document.getElementById("wifi-title").value = "";
    document.getElementById("wifi-ssid").value = "";
    document.getElementById("wifi-password").value = "";
});

generateTextQrButton.addEventListener("click", () => {
    const title = document.getElementById("text-title").value;
    const text = document.getElementById("text-text").value;
    const qrCodeText = text;
    const { foregroundColor, backgroundColor } = getColorValues();
    const type = "Text";

    generateQrCode(qrCodeText, title, foregroundColor, backgroundColor, type);

    document.getElementById("text-title").value = "";
    document.getElementById("text-text").value = "";
});

generatePhoneQrButton.addEventListener("click", () => {
    const title = document.getElementById("phone-title").value;
    const phoneNumber = document.getElementById("phone-number").value;

    if (!phoneNumber) {
        alert("Пожалуйста, введите номер телефона.");
        return;
    }

    const qrCodeText = `TEL:${phoneNumber}`;
    const { foregroundColor, backgroundColor } = getColorValues();
    const type = "Phone";

    generateQrCode(qrCodeText, title, foregroundColor, backgroundColor, type);

    document.getElementById("phone-title").value = "";
    document.getElementById("phone-number").value = "";
});

generateMapQrButton.addEventListener("click", () => {
    const title = document.getElementById("map-title").value;
    const latitude = document.getElementById("map-latitude").value;
    const longitude = document.getElementById("map-longitude").value;

    if (!latitude || !longitude) {
        alert("Пожалуйста, введите широту и долготу.");
        return;
    }

    const qrCodeText = `geo:${latitude},${longitude}`;
    const { foregroundColor, backgroundColor } = getColorValues();
    const type = "Map";

    generateQrCode(qrCodeText, title, foregroundColor, backgroundColor, type);

    document.getElementById("map-title").value = "";
    document.getElementById("map-latitude").value = "";
    document.getElementById("map-longitude").value = "";
});

generateVcardQrButton.addEventListener("click", () => {
    const title = document.getElementById("vcard-title").value;
    const firstName = document.getElementById("vcard-firstName").value;
    const lastName = document.getElementById("vcard-lastName").value;
    const phone = document.getElementById("vcard-phone").value;
    const email = document.getElementById("vcard-email").value;
    const company = document.getElementById("vcard-company").value;
    const jobTitle = document.getElementById("vcard-jobTitle").value;
    const street = document.getElementById("vcard-street").value;
    const city = document.getElementById("vcard-city").value;
    const country = document.getElementById("vcard-country").value;
    const postalCode = document.getElementById("vcard-postalCode").value;

    if (!firstName || !lastName) {
        alert("Пожалуйста, введите имя и фамилию.");
        return;
    }

    let qrCodeText = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName};;;\nFN:${firstName} ${lastName}\n`;

    if (phone) qrCodeText += `TEL:${phone}\n`;
    if (email) qrCodeText += `EMAIL:${email}\n`;
    if (company) qrCodeText += `ORG:${company}\n`;
    if (jobTitle) qrCodeText += `TITLE:${jobTitle}\n`;
    if (street || city || country || postalCode) {
        qrCodeText += `ADR;TYPE=WORK:${street};${city};;${postalCode};${country}\n`;
    }

    qrCodeText += "END:VCARD";

    const { foregroundColor, backgroundColor } = getColorValues();
    const type = "vCard";

    generateQrCode(qrCodeText, title, foregroundColor, backgroundColor, type);

    document.getElementById("vcard-title").value = "";
    document.getElementById("vcard-firstName").value = "";
    document.getElementById("vcard-lastName").value = "";
    document.getElementById("vcard-phone").value = "";
    document.getElementById("vcard-email").value = "";
    document.getElementById("vcard-company").value = "";
    document.getElementById("vcard-jobTitle").value = "";
    document.getElementById("vcard-street").value = "";
    document.getElementById("vcard-city").value = "";
    document.getElementById("vcard-country").value = "";
    document.getElementById("vcard-postalCode").value = "";
});

document.querySelector(".input-area").classList.add("hidden");

//переход в личный кабинет
window.addEventListener('load', () => {
    const myQrCodesButton = document.getElementById("my-qrcodes-button");
    const simpleDesignButton = document.getElementById("simple-design");
    const gradientDesignButton = document.getElementById("gradient-design");
    const designTypeSelect = document.getElementById("design-type");

    if (myQrCodesButton) {
        myQrCodesButton.addEventListener("click", () => {
            window.location.href = "/my-qrcodes.html";
        });
    } else {
        console.error("Кнопка 'Мои QR коды' не найдена в HTML.");
    }

    formButton.addEventListener("click", function() {
        formPanel.classList.toggle("hidden"); //  Переключаем класс "hidden"
    });

    simpleDesignButton.addEventListener("click", function() {
        designTypeSelect.value = "simple"; // Устанавливаем значение "simple" в <select>
        showSimpleDesign(); // Показываем настройки простого дизайна
      });
      
    gradientDesignButton.addEventListener("click", function() {
        designTypeSelect.value = "gradient"; // Устанавливаем значение "gradient" в <select>
        showGradientDesign(); // Показываем настройки градиентного дизайна
      });

    
});

//логотип
//логотип
let logoImage = null; // Переменная для хранения загруженного логотипа

const logoUpload = document.getElementById("logo-upload");
const removeLogoButton = document.getElementById("remove-logo");

logoUpload.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoImage = new Image();
            logoImage.src = e.target.result;
            // ❗ НИКАКОГО generateQrCode здесь не вызываем
            // Просто загружаем логотип в память
        };
        reader.readAsDataURL(file);
    }
});


removeLogoButton.addEventListener("click", function() {
    logoImage = null;
    logoUpload.value = ""; // Очищаем поле загрузки
    
    });

// Переключение видимости окна
readyButton.addEventListener("click", function() {
    templatePopup.classList.toggle("show");
});

// Закрытие окна при клике на крестик
closeButton.addEventListener("click", function() {
    templatePopup.classList.remove("show");
});

//реализация шаблонов


const templates = [
    {
        id: 1,
        designType: "simple",
        foregroundColor: "#2AABEE",
        backgroundColor: "#FFFFFF",
        logo: "images/free-icon-telegram-5968804.png"
    },
    {
        id: 2,
        designType: "simple",
        foregroundColor: "#2787f5", // Синий
        backgroundColor: "#FFFFFF", // Желтый
        logo: "images/free-icon-vk-5968835.png" // Логотип для второго шаблона
    },
    {
        id: 3,
        designType: "gradient",
        foregroundColor: "#FFFFFF",
        gradientColor1: "#C13584", 
        gradientColor2: "#FFDC80", 
        logo: "images/free-icon-instagram-3955024 (1).png"
    },
    {
        id: 4,
        designType: "simple",
        foregroundColor: "#FF0000",
        backgroundColor: "#FFFFFF",
        logo: "images/free-icon-youtube-1384060.png"
    },
    {
        id: 5,
        designType: "simple",
        foregroundColor: "#100943",
        backgroundColor: "#FFFFFF",
        logo: "images/Icon_RUTUBE_dark_color_circle.png"
    },
    {
        id: 6,
        designType: "gradient",
        foregroundColor: "#FFFFFF",
        gradientColor1: "#25F4EE", 
        gradientColor2: "#FE2C55", 
        logo: "images/tik-tok.png"
    },
    {
        id: 7,
        designType: "simple",
        foregroundColor: "#FFFFFF",
        backgroundColor: "#28D146",
        logo: "images/logo.png"
    },
    {
        id: 8,
        designType: "simple",
        foregroundColor: "#FFFFFF",
        backgroundColor: "#0165E1",
        logo: "images/facebook.png"
    },
    {
        id: 9,
        designType: "simple",
        foregroundColor: "#FFFFFF",
        backgroundColor: "#5865F2",
        logo: "images/discord (1).png"
    },
    {
        id: 10,
        designType: "gradient",
        foregroundColor: "#FFFFFF",
        gradientColor1: "#FF8A9B", 
        gradientColor2: "#E60023", 
        logo: "images/pinterest.png"
    },
    {
        id: 11,
        designType: "simple",
        foregroundColor: "#FFFFFF",
        backgroundColor: "#2EAFFF",
        logo: "images/free-icon-communication-15047587.png"
    },
    //  Добавьте данные для остальных шаблонов
];


function applyTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
        console.error("Шаблон не найден!");
        return;
    }

    // Устанавливаем тип дизайна
    const designType = template.designType;
    document.getElementById("design-type").value = designType;

    // Устанавливаем значения цвета в зависимости от типа дизайна
    if (designType === "simple") {
        document.getElementById("foreground-color").value = template.foregroundColor;
        document.getElementById("background-color").value = template.backgroundColor;
        showSimpleDesign(); //  Вызываем функцию для отображения полей простого дизайна
    } else if (designType === "gradient") {
        document.getElementById("foreground-color").value = template.foregroundColor;
        document.getElementById("gradient-color1").value = template.gradientColor1;
        document.getElementById("gradient-color2").value = template.gradientColor2;
        showGradientDesign(); //  Вызываем функцию для отображения полей градиентного дизайна
    }

    // Загружаем изображение логотипа (если есть)
    logoImage = new Image();
    logoImage.src = template.logo;
    logoImage.onload = () => {
        //  Если нужно что-то сделать после загрузки логотипа
        console.log("Логотип загружен:", template.logo);
    };

    //  Дополнительно закрываем всплывающее окно
    document.getElementById("template-popup").classList.remove("show");
}

document.querySelectorAll(".template-item").forEach(item => {
    item.addEventListener("click", function() {
        const templateId = parseInt(this.dataset.template);
        applyTemplate(templateId);
    });
});

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

// === Переключение между панелями: только один активен ===
function hideAllPanels() {
    colorSettings.classList.remove("show");
    colorDropDown.classList.remove("show");
    logoSettings.classList.remove("show");
    formPanel.classList.remove("show");
    templatePopup.classList.remove("show");
}

// Настройки цвета
colorButton?.addEventListener("click", () => {
    hideAllPanels();
    colorDropDown.classList.toggle("show");
});

// Простой дизайн
simpleDesignButton?.addEventListener("click", () => {
    hideAllPanels();
    showSimpleDesign();
});

// Градиент
gradientDesignButton?.addEventListener("click", () => {
    hideAllPanels();
    showGradientDesign();
});

// Логотип
logoButton?.addEventListener("click", () => {
    hideAllPanels();
    logoSettings.classList.toggle("show");
});

// Настройки формы
formButton?.addEventListener("click", () => {
    hideAllPanels();
    formPanel.classList.toggle("show");
});



// Готовые шаблоны
readyButton?.addEventListener("click", () => {
    hideAllPanels();
    templatePopup.classList.toggle("show");
});

// Закрытие шаблонов крестиком
closeButton?.addEventListener("click", () => {
    templatePopup.classList.remove("show");
});


// iro.js color pickers
const fgPicker = new iro.ColorPicker("#foreground-picker", {
    width: 180,
    color: "#000000"
  });
  const bgPicker = new iro.ColorPicker("#background-picker", {
    width: 180,
    color: "#ffffff"
  });
  const grad1Picker = new iro.ColorPicker("#gradient1-picker", {
    width: 180,
    color: "#800080"
  });
  const grad2Picker = new iro.ColorPicker("#gradient2-picker", {
    width: 180,
    color: "#FFA500"
  });
  
  // Обновляем скрытые инпуты
  fgPicker.on("color:change", color => {
    document.getElementById("foreground-color").value = color.hexString;
  });
  bgPicker.on("color:change", color => {
    document.getElementById("background-color").value = color.hexString;
  });
  grad1Picker.on("color:change", color => {
    document.getElementById("gradient-color1").value = color.hexString;
  });
  grad2Picker.on("color:change", color => {
    document.getElementById("gradient-color2").value = color.hexString;
  });
  
  //FAQ
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        answer.classList.toggle("hidden");
    });
});
