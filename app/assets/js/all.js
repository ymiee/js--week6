//  表格驗證 (第七周助教直播)
const constraints = {
  '套票名稱': {
    presence: {
      message: '是必填欄位'
    },
  },
  '圖片網址':{
    presence: {
      message: '是必填欄位'
    },
    url: {
      schemes: ['http', 'https'],
      //  或使用 allowDataUrl: true,
      message: '必須是正確的網址'
    }
  },
  '景點地區':{
    presence: {
      message: '是必填欄位'
    },
  },
  '套票金額':{
    presence: {
      message: '是必填欄位'
    },
    numericality: {
      greaterThan: 0,
      message: '必須大於 0'
    }
  },
  '套票組數':{
    presence: {
      message: '是必填欄位'
    },
    numericality: {
      greaterThan: 0,
      message: '必須大於 0'
    }
  },
  '套票星級':{
    presence: {
      message: '是必填欄位'
    },
    numericality: {
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 10,
      message: '必須符合 1-10 的區間'
    }
  },
  '套票描述':{
    presence: {
      message: '是必填欄位'
    },
  },
};


//  data
let data = [];

//  DOM
//    選取 id 用 getElementById   //  選取 class 用 querySelector
//    querySelectorAll 把同樣的元素選起來外，會以陣列的方式被傳回
//      新增表單
const ticketForm = document.querySelector('.ticketForm');
//      驗證
const ticketInputs = document.querySelectorAll('input[type=text], input[type=number], .ticketForm select, textarea');
//      新增表單-input
const ticketName = document.getElementById('ticketName');
const ticketImgUrl = document.getElementById('ticketImgUrl');
const ticketRegion = document.getElementById('ticketRegion');
const ticketPrice = document.getElementById('ticketPrice');
const ticketNum = document.getElementById('ticketNum');
const ticketRate = document.getElementById('ticketRate');
const ticketDescription = document.getElementById('ticketDescription');
//      新增表單按鈕
const addTicketBtn = document.querySelector('.addTicketBtn');
//      搜尋欄
const searchSelect = document.querySelector('.searchSelect');
//      搜尋筆數
const searchText = document.querySelector('.searchText');
//      套票卡片區
const cardList = document.querySelector('.cardList');


//  監聽
//      監聽點擊新增表單按鈕
addTicketBtn.addEventListener('click', addTicket);
//      監聽改選搜尋欄內容
searchSelect.addEventListener('change', filterArea);


//  取得遠端資料
function getData() {
  // LV2 資料
  axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
    .then((res) => {        //  res -- response
      data = res.data.data;
      //  渲染選單
      renderSelect(data);
      //  渲染卡片
      renderCard(data);
    })
    .catch(() => {
      alert('錯誤');
    })
}


//  渲染卡片
function renderCard(renderData) {
  //  預設資料
  let cardStr = '';

  //  把資料迴圈產生卡片內容
  renderData.forEach( (item) => {
    cardStr += `
      <li class="col">
        <a class="card h-100 shadow" href="#">
          <div class="cardImg position-relative" style="background-image: url(${item.imgUrl})">                 
            <div class="position-absolute top-0 start-0 translate-middle-y bg-primary-light px-9 py-3 text-white fs-7">${item.area}</div>
            <div class="position-absolute top-100 start-0 translate-middle-y bg-primary px-3 py-2 text-center text-white">${item.rate}</div>          
          </div>
          <div class="card-body">
            <h3 class="card-title border-bottom border-primary border-2 fs-5 fw-bolder">
              ${item.name}
            </h3>
            <p class="cardDescription mb-15 text-secondary-light lh-lg">
              ${item.description}
            </p>
            <div class="d-flex justify-content-between align-items-center text-primary fw-bolder">
              <p >
                <i class="bi bi-exclamation-circle-fill"></i>
                剩下最後 ${item.group} 組
              </p>
              <p class="d-flex justify-content-between align-items-center">
                <span class="me-3 fw-bold">TWD</span>
                <span class="fs-3">$${item.price}</span>
              </p>
            </div>
          </div>
        </a>
      </li>
    `;
  });

  // 渲染到卡片列表
  cardList.innerHTML = cardStr;
};


//  篩選地區
function filterArea(e) {
  //  取消事件的預設行為
  e.preventDefault();
  //  取得篩選地區
  const value = e.target.value;
  //  預設資料
  let newData = [];
  
  //  判斷篩選區域
  if (value == '') {
    newData = data;
  } else {
    newData = data.filter( (item) => {
      return item.area == value;
    });
    //  newData = data.filter(item => item.area == value); => 簡寫
  }

  //  顯示本次搜尋筆數
  searchText.innerHTML = `本次搜尋共 ${newData.length} 筆資料`;
  
  // 渲染卡片
  renderCard(newData);
};


//  新增卡片
function addTicket(e) {
  //  取消事件的預設行為
  e.preventDefault();

  // 清空表格錯誤訊息
  ticketInputs.forEach( (item) => {  
    // item 為表格，item.nextElementSibling 是表格下方的 <small>
    item.nextElementSibling.textContent = '';
  })

  // 驗證表單
  const errors = validate(ticketForm, constraints);

  // 如果驗證錯誤
  if (errors) {
    // 渲染錯誤訊息
    // Object.keys() => 取得物件所有屬性，並組成陣列
    Object.keys(errors).forEach( (errItem) => {
      document.querySelector(`.${errItem}`).textContent = errors[errItem];
    })
  } else {
    // 取得新卡片資料
    const ticket = {
      id: Date.now(),   //取得目前時間(毫秒) 時間戳 timestamp
      name: ticketName.value,
      imgUrl: ticketImgUrl.value,
      area: ticketRegion.value,
      description: ticketDescription.value,
      group: Number(ticketNum.value),
      price: Number(ticketPrice.value),
      rate: Number(ticketRate.value),
    };

    // 把新資料加入 data 中
    data.push(ticket);

    // 渲染卡片
    renderCard(data);

    //  渲染下拉地區選單
    renderSelect(data);

    const searchSelect = document.querySelector('.searchSelect');
    searchSelect.value = '';
    searchText.textContent = '';

    // 清空表格
    ticketForm.reset();
  }
};

   
//  //  額外東西
// 渲染下拉地區選單
function renderSelect(renderArea) {
  // 預設資料
  let selectStr = '<option value="" disabled selected hidden>地區搜尋</option><option value="">全部地區</option>';
  const areaArray = [];

  // 取得不重複地區
  renderArea.forEach( (item) => {
    if (areaArray.indexOf(item.area) == -1) {
      areaArray.push(item.area);
    }
  })

  // 把資料迴圈產生選單內容
  areaArray.forEach( (item) => {
    selectStr += `
      <option value="${item}">${item}</option>
    `;
  })

  // 渲染到下拉選單
  searchSelect.innerHTML = selectStr;
};


// 初始化
function init() {
  // 取得遠端資料
  getData();
}

init();