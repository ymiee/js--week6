"use strict";

//  表格驗證 (第七周助教直播)
var constraints = {
  '套票名稱': {
    presence: {
      message: '是必填欄位'
    }
  },
  '圖片網址': {
    presence: {
      message: '是必填欄位'
    },
    url: {
      schemes: ['http', 'https'],
      //  或使用 allowDataUrl: true,
      message: '必須是正確的網址'
    }
  },
  '景點地區': {
    presence: {
      message: '是必填欄位'
    }
  },
  '套票金額': {
    presence: {
      message: '是必填欄位'
    },
    numericality: {
      greaterThan: 0,
      message: '必須大於 0'
    }
  },
  '套票組數': {
    presence: {
      message: '是必填欄位'
    },
    numericality: {
      greaterThan: 0,
      message: '必須大於 0'
    }
  },
  '套票星級': {
    presence: {
      message: '是必填欄位'
    },
    numericality: {
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 10,
      message: '必須符合 1-10 的區間'
    }
  },
  '套票描述': {
    presence: {
      message: '是必填欄位'
    }
  }
}; //  data

var data = []; //  DOM
//    選取 id 用 getElementById   //  選取 class 用 querySelector
//    querySelectorAll 把同樣的元素選起來外，會以陣列的方式被傳回
//      新增表單

var ticketForm = document.querySelector('.ticketForm'); //      驗證

var ticketInputs = document.querySelectorAll('input[type=text], input[type=number], .ticketForm select, textarea'); //      新增表單-input

var ticketName = document.getElementById('ticketName');
var ticketImgUrl = document.getElementById('ticketImgUrl');
var ticketRegion = document.getElementById('ticketRegion');
var ticketPrice = document.getElementById('ticketPrice');
var ticketNum = document.getElementById('ticketNum');
var ticketRate = document.getElementById('ticketRate');
var ticketDescription = document.getElementById('ticketDescription'); //      新增表單按鈕

var addTicketBtn = document.querySelector('.addTicketBtn'); //      搜尋欄

var searchSelect = document.querySelector('.searchSelect'); //      搜尋筆數

var searchText = document.querySelector('.searchText'); //      套票卡片區

var cardList = document.querySelector('.cardList'); //  監聽
//      監聽點擊新增表單按鈕

addTicketBtn.addEventListener('click', addTicket); //      監聽改選搜尋欄內容

searchSelect.addEventListener('change', filterArea); //  取得遠端資料

function getData() {
  // LV2 資料
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json').then(function (res) {
    //  res -- response
    data = res.data.data; //  渲染選單

    renderSelect(data); //  渲染卡片

    renderCard(data);
  })["catch"](function () {
    alert('錯誤');
  });
} //  渲染卡片


function renderCard(renderData) {
  //  預設資料
  var cardStr = ''; //  把資料迴圈產生卡片內容

  renderData.forEach(function (item) {
    cardStr += "\n      <li class=\"col\">\n        <a class=\"card h-100 shadow\" href=\"#\">\n          <div class=\"cardImg position-relative\" style=\"background-image: url(".concat(item.imgUrl, ")\">                 \n            <div class=\"position-absolute top-0 start-0 translate-middle-y bg-primary-light px-9 py-3 text-white fs-7\">").concat(item.area, "</div>\n            <div class=\"position-absolute top-100 start-0 translate-middle-y bg-primary px-3 py-2 text-center text-white\">").concat(item.rate, "</div>          \n          </div>\n          <div class=\"card-body\">\n            <h3 class=\"card-title border-bottom border-primary border-2 fs-5 fw-bolder\">\n              ").concat(item.name, "\n            </h3>\n            <p class=\"cardDescription mb-15 text-secondary-light lh-lg\">\n              ").concat(item.description, "\n            </p>\n            <div class=\"d-flex justify-content-between align-items-center text-primary fw-bolder\">\n              <p >\n                <i class=\"bi bi-exclamation-circle-fill\"></i>\n                \u5269\u4E0B\u6700\u5F8C ").concat(item.group, " \u7D44\n              </p>\n              <p class=\"d-flex justify-content-between align-items-center\">\n                <span class=\"me-3 fw-bold\">TWD</span>\n                <span class=\"fs-3\">$").concat(item.price, "</span>\n              </p>\n            </div>\n          </div>\n        </a>\n      </li>\n    ");
  }); // 渲染到卡片列表

  cardList.innerHTML = cardStr;
}

; //  篩選地區

function filterArea(e) {
  //  取消事件的預設行為
  e.preventDefault(); //  取得篩選地區

  var value = e.target.value; //  預設資料

  var newData = []; //  判斷篩選區域

  if (value == '') {
    newData = data;
  } else {
    newData = data.filter(function (item) {
      return item.area == value;
    }); //  newData = data.filter(item => item.area == value); => 簡寫
  } //  顯示本次搜尋筆數


  searchText.innerHTML = "\u672C\u6B21\u641C\u5C0B\u5171 ".concat(newData.length, " \u7B46\u8CC7\u6599"); // 渲染卡片

  renderCard(newData);
}

; //  新增卡片

function addTicket(e) {
  //  取消事件的預設行為
  e.preventDefault(); // 清空表格錯誤訊息

  ticketInputs.forEach(function (item) {
    // item 為表格，item.nextElementSibling 是表格下方的 <small>
    item.nextElementSibling.textContent = '';
  }); // 驗證表單

  var errors = validate(ticketForm, constraints); // 如果驗證錯誤

  if (errors) {
    // 渲染錯誤訊息
    // Object.keys() => 取得物件所有屬性，並組成陣列
    Object.keys(errors).forEach(function (errItem) {
      document.querySelector(".".concat(errItem)).textContent = errors[errItem];
    });
  } else {
    // 取得新卡片資料
    var ticket = {
      id: Date.now(),
      //取得目前時間(毫秒) 時間戳 timestamp
      name: ticketName.value,
      imgUrl: ticketImgUrl.value,
      area: ticketRegion.value,
      description: ticketDescription.value,
      group: Number(ticketNum.value),
      price: Number(ticketPrice.value),
      rate: Number(ticketRate.value)
    }; // 把新資料加入 data 中

    data.push(ticket); // 渲染卡片

    renderCard(data); //  渲染下拉地區選單

    renderSelect(data);

    var _searchSelect = document.querySelector('.searchSelect');

    _searchSelect.value = '';
    searchText.textContent = ''; // 清空表格

    ticketForm.reset();
  }
}

; //  //  額外東西
// 渲染下拉地區選單

function renderSelect(renderArea) {
  // 預設資料
  var selectStr = '<option value="" disabled selected hidden>地區搜尋</option><option value="">全部地區</option>';
  var areaArray = []; // 取得不重複地區

  renderArea.forEach(function (item) {
    if (areaArray.indexOf(item.area) == -1) {
      areaArray.push(item.area);
    }
  }); // 把資料迴圈產生選單內容

  areaArray.forEach(function (item) {
    selectStr += "\n      <option value=\"".concat(item, "\">").concat(item, "</option>\n    ");
  }); // 渲染到下拉選單

  searchSelect.innerHTML = selectStr;
}

; // 初始化

function init() {
  // 取得遠端資料
  getData();
}

init();
//# sourceMappingURL=all.js.map
