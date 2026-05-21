// --- ĐIỀU PHỐI ĐĂNG NHẬP ---
const loginScreen = document.getElementById('login-screen');
const mainLayout = document.getElementById('main-layout');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const contentArea = document.getElementById('content-area');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === 'admin' && pass === '123') {
            loginScreen.style.display = 'none';
            mainLayout.style.display = 'flex';
            // Khi đăng nhập thành công, tự động tải trang dashboard làm mặc định
            switchPage('dashboard', 'dashboard.html');
        } else {
            alert('Sai tài khoản hoặc mật khẩu rồi chị ơi!');
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        stopCamera(); // Tắt camera nếu đang bật trước khi thoát
        mainLayout.style.display = 'none';
        loginScreen.style.display = 'flex';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
}

// --- LOGIC TỰ ĐỘNG TẢI FILE HTML TỪ THƯ MỤC PAGES/ ---
async function switchPage(pageId, fileName) {
    // 1. Tắt camera nếu người dùng rời khỏi trang phân tích dáng ném
    if (pageId !== 'analysis') {
        stopCamera();
    }

    // 2. Làm nổi bật nút menu được chọn
    const buttons = document.querySelectorAll('.menu-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    // 3. Dùng lệnh fetch() để đọc file html nhỏ và chèn vào vùng chứa chính
    try {
        const response = await fetch(`pages/${fileName}`);
        if (!response.ok) throw new Error('Không thể tải trang con');
        const html = await response.text();
        contentArea.innerHTML = html;

        // 4. Nếu người dùng chuyển vào trang phân tích, kích hoạt lại sự kiện cho nút Camera
        if (pageId === 'analysis') {
            initCameraEvents();
        }
    } catch (error) {
        contentArea.innerHTML = `<p style="color:red;">Lỗi: Không thể tải nội dung mục này. Chị nhớ chạy web bằng nút Go Live nhé!</p>`;
    }
}
window.switchPage = switchPage;


// --- QUẢN LÝ CAMERA (CHẠY ĐỘNG KHI LOAD TRANG ANALYSIS) ---
let cameraStream = null;

function initCameraEvents() {
    const startBtn = document.getElementById('start-btn');
    const videoElement = document.getElementById('webcam');
    const placeholder = document.getElementById('camera-placeholder');

    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            if (startBtn.innerText === "Bật Camera") {
                try {
                    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
                    if (videoElement) {
                        videoElement.srcObject = cameraStream;
                        videoElement.style.display = 'block';
                    }
                    if (placeholder) placeholder.style.display = 'none';
                    startBtn.innerText = "Tắt Camera";
                    startBtn.style.backgroundColor = "#c0392b";
                } catch (e) {
                    alert("Không mở được camera, chị kiểm tra quyền trình duyệt nhé!");
                }
            } else {
                stopCamera();
            }
        });
    }
}

function stopCamera() {
    const startBtn = document.getElementById('start-btn');
    const videoElement = document.getElementById('webcam');
    const placeholder = document.getElementById('camera-placeholder');

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    if (videoElement) {
        videoElement.srcObject = null;
        videoElement.style.display = 'none';
    }
    if (placeholder) placeholder.style.display = 'block';
    if (startBtn) {
        startBtn.innerText = "Bật Camera";
        startBtn.style.backgroundColor = "#e67e22";
    }
}