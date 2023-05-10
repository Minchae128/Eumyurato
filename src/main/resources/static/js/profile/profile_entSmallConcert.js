document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('jwtToken');
    getSmallConcertList(token);
});

document.getElementById('searchBtn').addEventListener('click', (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('jwtToken');
    const searchColumn = document.getElementById('searchColumn').value;
    const searchKeyword = document.getElementById('searchKeyword').value;
    getSmallConcertList(token, searchColumn, searchKeyword);
});

function getSmallConcertList(token, searchColumn = null, searchKeyword = null, page = 1) {
    let url = '/profile/ent/management';
    if (searchColumn && searchKeyword) {
        url += `?column=${searchColumn}&keyword=${searchKeyword}`;
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('응답에 문제가 있습니다.');
        })
        .then((smallConcertList) => {
            displaySmallConcertList(smallConcertList, page);
        })
        .catch((error) => {
            console.error('fetch 작동에 문제가 있습니다.', error);
        });
}

function displaySmallConcertList(smallConcertList, currentPage) {
    const perPage = 5;
    const smallConcertTbody = document.getElementById('smallConcertTbody');
    smallConcertTbody.innerHTML = '';

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    smallConcertList.slice(start, end).forEach((smallConcert) => {
        const smallConcertRow = smallConcertTbody.insertRow();

        smallConcertRow.insertCell().textContent = smallConcert.enterId;
        smallConcertRow.insertCell().textContent = smallConcert.name;
        smallConcertRow.insertCell().textContent = smallConcert.location;
        smallConcertRow.insertCell().textContent = smallConcert.regDate;
        smallConcertRow.insertCell().textContent = smallConcert.pname;
        smallConcertRow.insertCell().textContent = smallConcert.price;
        smallConcertRow.insertCell().textContent = smallConcert.startDate;
        smallConcertRow.insertCell().textContent = smallConcert.lastDate;
    });

    createPagination(smallConcertList.length, perPage, currentPage);
}

function createPagination(totalItems, perPage, currentPage) {
    const totalPages = Math.ceil(totalItems / perPage);
    const paginationEl = document.querySelector('.pagination');

    paginationEl.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = i;
        if (i === currentPage) {
            li.classList.add('active');
        }
        a.addEventListener('click', (event) => {
            event.preventDefault();
            const token = sessionStorage.getItem('jwtToken');
            const searchColumn = document.getElementById('searchColumn').value;
            const searchKeyword = document.getElementById('searchKeyword').value;
            getSmallConcertList(token, searchColumn, searchKeyword, i); // i를 페이지 인수로 전달합니다.
        });
        li.appendChild(a);
        paginationEl.appendChild(li);
    }
}

// 로그아웃
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.setAttribute("href", "/logout");
logoutBtn.onclick = function () {
    fetch('/logout', { method: 'POST', credentials: 'include' })
        .then(response => {
            if (response.ok) {
                // 세션 스토리지에서 토큰 제거
                window.sessionStorage.removeItem("jwtToken");
                console.log("로그아웃")
                // 홈페이지로 이동
                window.location.href = "/home";
            } else {
                throw new Error("로그아웃 처리에 실패하였습니다.");
            }
        })
        .catch(error => {
            console.error(error);
            alert(error.message);
        });
};