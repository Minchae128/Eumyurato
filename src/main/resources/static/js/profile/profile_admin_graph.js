$(document).ready(function() {
    getCommonMember();
});

$('#commonBtn').on('click', function() {
    $('#common').show();
    $('#artist').hide();

    $('#artistSpan').hide();

    getCommonMember();
});

$('#artistBtn').on('click', function() {
    $('#common').hide();
    $('#artist').show();

    $('#artistSpan').show();

    getArtistMember();
});

//일반회원 데이터 불러오기
function getCommonMember() {
    $.ajax({
        url: '/profile/admin/total/commonMember',
        type: 'GET',
        success: function(response) {
            drawGenderChart(response, 'commonGenderChart');
            drawRoadChart(response, 'commonRoadChart');
            drawGenreChart(response, 'commonGenreChart');
        },
        error: function(error) {
            console.log(error);
        },
    });
}

//아티스트회원 데이터 불러오기
function getArtistMember(){
    $.ajax({
        url: '/profile/admin/total/artistMember',
        type: 'GET',
        success: function(response) {
            drawGenderChart(response, 'aritstGenderChart');
            drawGenreChart(response, 'artistGenreChart');
            drawPointChart(response, 'artistPointChart');
            $('#avg').show();
            const pointAvg = response.pointAvg[0].avg_point;
            const avgEl = document.getElementById('avg');
            avgEl.innerHTML = `포인트 평균 : ${pointAvg}`;
            const ongoingBusk = response.buskingIng[0].busking_ing;
            const buskNowEl = document.getElementById('afterTodayBusking');
            buskNowEl.innerHTML = `현재 진행 중인 버스킹 : ${ongoingBusk}`;

            const buskAll = response.buskingAll[0].all_busking;
            const buskEl = document.getElementById('buskingCount');
            buskEl.innerHTML = `전체 버스킹 수 : ${buskAll}`;
        },
        error: function(error) {
            console.log(error);
        },
    });
}

// 성별 그래프 그리기
function drawGenderChart(genderData, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (Chart.getChart(chartId)) {
        Chart.getChart(chartId)?.destroy();
    }

    const genderCounts = genderData.genderCounts;
    const genderDataArray = [0, 0];

    for (let i = 0; i < genderCounts.length; i++) {
        if (genderCounts[i].sex === '남자') {
            genderDataArray[0] = genderCounts[i].count; // 인덱스 0이 남성
        } else if (genderCounts[i].sex === '여자') {
            genderDataArray[1] = genderCounts[i].count; // 인덱스 1이 여성
        }
    }

    const genderChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['여성', '남성'], // 라벨 순서를 변경
            datasets: [
                {
                    label: '성별',
                    data: genderDataArray,
                    backgroundColor: ['#FF6384', '#36A2EB'], // 그래프 색깔 순서를 변경
                    borderWidth: 1,
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            responsive: false
        }
    });
}

// 유입경로 그래프 그리기
function drawRoadChart(roadData, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (Chart.getChart(chartId)) {
        Chart.getChart(chartId)?.destroy();
    }

    const roadCounts = roadData.roadCounts;
    const roadLabels = [];
    const roadDataArray = [];

    for (let i = 0; i < roadCounts.length; i++) {
        const road = roadCounts[i].road;
        if (['검색', '광고', '지인 추천', '기타'].includes(road)) {
            roadLabels.push(road);
            roadDataArray.push(roadCounts[i].count);
        }
    }

    const sourceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: roadLabels,
            datasets: [
                {
                    label: '유입경로',
                    data: roadDataArray,
                    backgroundColor: ['#FFCE56', '#4BC0C0', '#FF6384', '#36A2EB'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            responsive: false
        }
    });
}

//장르 그래프 그리기
function drawGenreChart(genreData, chartId) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (Chart.getChart(chartId)) {
        Chart.getChart(chartId)?.destroy();
    }

    const genreCounts = genreData.genreCounts;
    const genreDataArray = [];

    for (let i = 0; i < genreCounts.length; i++) {
        if (['가요', '발라드', '힙합', '댄스', '기타'].includes(genreCounts[i].genre)) {
            genreDataArray.push(genreCounts[i].count);
        }
    }

    const genreChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['가요', '발라드', '힙합', '댄스', '기타'],
            datasets: [
                {
                    label: '장르',
                    data: genreDataArray,
                    backgroundColor: [
                        '#FF6384',
                        '#4BC0C0',
                        '#FFCE56',
                        '#E7E9ED',
                        '#36A2EB'
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            responsive: false
        }
    });
}

//포인트 막대그래프
function drawPointChart(pointData, chartId) {
    const points = pointData.points;

// points 배열을 point 내림차순으로 정렬
    points.sort(function(a, b) {
        return b.point - a.point;
    });

    const ctx = document.getElementById(chartId).getContext('2d');
    if (Chart.getChart(chartId)) {
        Chart.getChart(chartId)?.destroy();
    }
    const myChart = new Chart(ctx, {
        type: 'bar', // 막대 그래프 유형 설정
        data: {
            labels: points.map(item => `${item.nid}(${item.id})`),
            datasets: [
                {
                    label: '포인트',
                    data: points.map(item => item.point),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 0, 255, 0.2)',
                        'rgba(0, 255, 255, 0.2)',
                        'rgba(0, 255, 0, 0.2)',
                        'rgba(128, 0, 0, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(0, 255, 0, 1)',
                        'rgba(128, 0, 0, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                yAxis: [{
                    ticks: {
                        beginAtZero: true,
                        max: Math.ceil(points[0].point / 100) * 100 // 최대 포인트값의 올림 숫자로 y축 설정
                    }
                }]
            }
        }
    });
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

