const jwtToken = sessionStorage.getItem("jwtToken");

function getEntData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/profile/ent/data");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const enterprise = JSON.parse(xhr.responseText);
            displayEntData(enterprise);
        } else {
            console.log("Request failed. Returned status of " + xhr.status);
        }
    };

    xhr.send();
}

function displayEntData(enterprise) {
    document.getElementById("enterprise-id").value = enterprise.id;
    document.getElementById("enterprise-name").value = enterprise.name;
    document.getElementById("enterprise-num").value = enterprise.num;
    document.getElementById("enterprise-email").value = enterprise.email;
    document.getElementById("enterprise-phone").value = enterprise.phone;

    // 이미지 URL을 가져온다.
    var imageUrl = enterprise.image;

    if (imageUrl !== null && imageUrl.startsWith("https://")) {
        // 이미지 요소를 생성한다.
        var img = document.createElement("img");
        img.src = imageUrl;
        img.style.objectFit = "cover";
        img.style.width = "100%";
        img.style.height = "100%";

        // 이미지 요소를 포함할 div를 찾는다.
        var profileImg = document.getElementById("profileImg");

        // div에 이미지 요소를 추가한다.
        profileImg.appendChild(img);
    } else if(imageUrl !== null && !imageUrl.startsWith("https://")) {
        var replacedImageUrl = imageUrl.replace(/\\/g, "/").replace("src/main/resources/static", "");
        console.log(replacedImageUrl);
        // 이미지 요소를 생성한다.
        var img = document.createElement("img");
        img.src = replacedImageUrl;
        img.style.objectFit = "cover";
        img.style.width = "100%";
        img.style.height = "100%";

        // 이미지 요소를 포함할 div를 찾는다.
        var profileImg = document.getElementById("profileImg");

        // div에 이미지 요소를 추가한다.
        profileImg.appendChild(img);
    }else{
        // 이미지 요소를 생성한다.
        var img = document.createElement("img");
        img.src = "/img/default.jpg";
        img.style.objectFit = "cover";
        img.style.width = "100%";
        img.style.height = "100%";

        // 이미지 요소를 포함할 div를 찾는다.
        var profileImg = document.getElementById("profileImg");

        // div에 이미지 요소를 추가한다.
        profileImg.appendChild(img);
    }
}

// 페이지 로드 시 관리자 정보를 가져옵니다.
window.onload = function () {
    getEntData();
};