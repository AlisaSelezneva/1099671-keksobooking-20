'use strict';

var TITLES = ['Заголовок1', 'Заголовок2', 'Заголовок3', 'Заголовок4', 'Заголовок5', 'Заголовок6', 'Заголовок7', 'Заголовок8'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var DESCRIPTIONS = ['Описание1', 'Описание2', 'Описание3', 'Описание4', 'Описание5', 'Описание6', 'Описание7', 'Описание8'];
var OFFER_COUNT = 8;
var MIN_X_LOCATION = 0;
var MIN_Y_LOCATION = 130;
var MAX_Y_LOCATION = 630;
var RADIX = 10;
var MAINPIN_HEIGHT = 22;
var ENTER = 'Enter';
var MIN_LENGTH_TITLE = 30;
var MAX_LENGTH_TITLE = 100;
var MAX_LIST = 100;
var GAP_LIST = 2;

var typesMap = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var map = document.querySelector('.map'); // находит в доме карту (переменная)
var similarPinsElement = map.querySelector('.map__pins'); // находит в доме метки (переменная)
var similarTemplateCard = document.querySelector('#card').content.querySelector('.map__card');
var filtersContainer = document.querySelector('.map__filters-container');

var getTypes = function (type) {
  switch (type) {
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    case 'bungalo':
      return 'Бунгало';
    default:
      return type;
  }
};

// функция подбора случайного числа
var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNumber;
};

// функция создания массива строк случайной длины
var getRandomArray = function (array, newArray) {
  newArray = array.slice(0, getRandomNumber(0, array.length + 1));
  return newArray;
};

var offsetWidth = document.querySelector('.map').offsetWidth;

// функция создания массива из 8 сгенерированных JS объектов. объект массива ‐ описание похожего объявления неподалёку.(карточка объявления)
var createSimilarPinsArray = function (count) {
  var advertisements = [];
  var TypeKeys = Object.keys(typesMap);
  for (var i = 0; i < count; i++) {
    advertisements.push(
        {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png' // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём. Например, 01, 02 и т. д. Адреса изображений не повторяются
          },
          offer: {
            title: TITLES[i], // строка, заголовок предложения
            address: getRandomNumber(MIN_X_LOCATION, offsetWidth) + ', ' + getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION), // строка, адрес предложения.
            price: getRandomNumber(0, 1000000), // число, стоимость
            type: TypeKeys[getRandomNumber(0, TypeKeys.length - 1)], // строка с одним из четырёх фиксированных значений
            rooms: getRandomNumber(1, 5), // число, количество комнат
            guests: getRandomNumber(1, 8), // число, количество гостей, которое можно разместить
            checkin: TIMES[i], // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
            checkout: TIMES[i], // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
            features: getRandomArray(FEATURES), // массив строк случайной длины из ниже предложенных
            description: DESCRIPTIONS[i], // строка с описанием
            photos: getRandomArray(PHOTOS) // массив строк случайной длины, содержащий адреса фотографий
          },
          location: {
            x: getRandomNumber(MIN_X_LOCATION, offsetWidth),
            y: getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION)
          }
        }
    );
  }
  return advertisements;
};

var offers = createSimilarPinsArray(OFFER_COUNT);
var similarTemplatePin = document.querySelector('#pin').content.querySelector('.map__pin');

// функция создания сгенерированного пина
var renderSimilarPin = function (similarpin) {
  var pinElement = similarTemplatePin.cloneNode(true);
  pinElement.style = 'left: ' + similarpin.location.x + 'px; top: ' + similarpin.location.y + 'px;';
  pinElement.querySelector('img').src = similarpin.author.avatar;
  pinElement.querySelector('img').alt = similarpin.offer.title;

  return pinElement;
};

var removeClassActive = function () {
  var activePin = map.querySelector('.map__pin--active');

  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

// функция отрисовки созданного пина выше
var renderPins = function (array) {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragmentPin.appendChild(renderSimilarPin(array[i]));
  }
  similarPinsElement.appendChild(fragmentPin);
};

// var cardTemplate = similarTemplateCard.cloneNode(true);
// filtersContainer.before(cardTemplate);

var renderFeatures = function (element, features) {
  element.querySelector('.popup__features').innerHTML = '';
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    var newFeature = document.createElement('li');
    newFeature.className = 'popup__feature popup__feature--' + features[i];
    featuresFragment.appendChild(newFeature);

  }
  element.querySelector('.popup__features').appendChild(featuresFragment);
  if (features.length === 0) {
    element.querySelector('.popup__features').remove();
  }
};

// Функция скрывающая определённый блок
var isNotEmpty = function (data) {
  return typeof data !== 'undefined' && data.length > 0;
};

var hideElement = function (element) {
  element.style.display = 'none';
};

var createCard = function (array) {
  var cardElement = similarTemplateCard.cloneNode(true);
  var popupTitle = cardElement.querySelector('.popup__title');
  if (isNotEmpty(array.offer.title)) {
    popupTitle.textContent = array.offer.title;
  } else {
    hideElement(popupTitle);
  }

  var popupAdress = cardElement.querySelector('.popup__text--address');
  if (isNotEmpty(array.offer.adress)) {
    popupAdress.textContent = array.offer.adress;
  } else {
    hideElement(popupAdress);
  }

  var popupPrice = cardElement.querySelector('.popup__text--price');
  if (isNotEmpty(array.offer.price)) {
    popupPrice.textContent = array.offer.price + '₽/ночь';
  } else {
    hideElement(popupPrice);
  }

  var popupType = cardElement.querySelector('.popup__type');
  if (isNotEmpty(array.offer.type)) {
    popupType.textContent = getTypes[array.offer.type];
  } else {
    hideElement(popupType);
  }

  var guestsCount = array.offer.guests === 1 ? ' гостя' : ' гостей';
  var popupCapacity = cardElement.querySelector('.popup__text--capacity');
  if (isNotEmpty(array.offer.rooms)) {
    popupCapacity.textContent = array.offer.rooms + ' комнаты для ' + array.offer.guests + guestsCount;
  } else {
    hideElement(popupCapacity);
  }

  var popupTime = cardElement.querySelector('.popup__text--time');
  if (isNotEmpty(array.offer.checkin) || isNotEmpty(array.offer.checkout)) {
    popupTime.textContent = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
  } else {
    hideElement(popupTime);
  }

  renderFeatures(cardElement, array.offer.features);

  var popupDescription = cardElement.querySelector('.popup__description');
  if (isNotEmpty(array.offer.description)) {
    popupDescription.textContent = array.offer.description;
  } else {
    hideElement(popupDescription);
  }

  var photoElements = array.offer.photos;
  var popupPhoto = cardElement.querySelector('.popup__photo');
  if (isNotEmpty(photoElements)) {
    var templateСontainer = cardElement.querySelector('.popup__photos');
    cardElement.querySelector('.popup__photo').src = photoElements[0];
    for (var i = 1; i < photoElements.length; i++) {
      var clonedPhoto = popupPhoto.cloneNode();
      clonedPhoto.src = photoElements[i];
      templateСontainer.appendChild(clonedPhoto);
    }
  } else {
    hideElement(popupPhoto);
  }

  var popupAvatar = cardElement.querySelector('.popup__avatar ');
  if (isNotEmpty(array.author.avatar)) {
    popupAvatar.src = array.author.avatar;
  } else {
    hideElement(popupAvatar);
  }
  return cardElement;
};

// Module 4-2

var fieldsetHeaders = document.querySelector('.ad-form-header');
var fieldsetInputs = document.querySelectorAll('.ad-form__element');
var adForm = document.querySelector('.ad-form');
var fieldsetAddress = adForm.querySelector('#address');
var mapFilters = document.querySelector('.map__filters').children;
var mapPinMain = document.querySelector('.map__pin--main');
var fieldsetCapacity = document.querySelector('#capacity');
var roomNumber = document.querySelector('#room_number');
var notice = document.querySelector('.notice');

var getCoordinates = function (point, size) {
  return parseInt(point, RADIX) + Math.round(size * 0.5);
};

var mainPinX = getCoordinates(mapPinMain.style.left, mapPinMain.offsetWidth);
var mainPinY = getCoordinates(mapPinMain.style.top, mapPinMain.offsetHeight);
var mainPinActiveY = mainPinY + MAINPIN_HEIGHT;
var mainPinCoordinate = mainPinX + ', ' + mainPinY;
var mainPinCoordinateActive = mainPinX + ', ' + mainPinActiveY;

var toggleElementAvailability = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = status;
  }
};

var deactivateMap = function () {

  fieldsetHeaders.disabled = true;
  fieldsetAddress.value = mainPinCoordinate;
  fieldsetAddress.readOnly = true;
  map.classList.add('map--faded');
  toggleElementAvailability(fieldsetInputs, true);
};

var activatePage = function () {
  renderPins(offers);
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  fieldsetHeaders.disabled = false;
  fieldsetAddress.value = mainPinCoordinateActive;
  setPinClickHandlers();
  pinEnterPressHandler();
  toggleElementAvailability(mapFilters, true);
  toggleElementAvailability(fieldsetInputs, false);

  mapPinMain.removeEventListener('mousedown', activatePageMousedownHandler);
  mapPinMain.removeEventListener('keydown', activatePageKeydownHandler);

};

var activatePageKeydownHandler = function (evt) {
  if (evt.key === ENTER) {
    activatePage();
  }
};

var activatePageMousedownHandler = function (evt) {
  if (evt.button === 0) {
    activatePage();
  }
};

mapPinMain.addEventListener('mousedown', activatePageMousedownHandler);
mapPinMain.addEventListener('keydown', activatePageKeydownHandler);

var findDisabledElement = function () {

  var index = roomNumber.options.selectedIndex;
  var selectedValue = roomNumber.options[index].value;
  var fieldsetCapacityLength = fieldsetCapacity.options.length;
  if (selectedValue < MAX_LIST) {
    fieldsetCapacity.options[fieldsetCapacityLength - (index + GAP_LIST)].selected = true;
    for (var j = 0; j < fieldsetCapacityLength; j++) {
      fieldsetCapacity.options[j].disabled = (selectedValue < fieldsetCapacity.options[j].value) || (fieldsetCapacity.options[j].value === '0');
    }
  } else {
    fieldsetCapacity.options[fieldsetCapacityLength - 1].selected = true;
    fieldsetCapacity.options[fieldsetCapacityLength - 1].disabled = false;
    for (var k = 0; k < fieldsetCapacityLength - 1; k++) {
      fieldsetCapacity.options[k].disabled = true;
    }
  }
};

roomNumber.addEventListener('change', function () {
  findDisabledElement();
});

deactivateMap();

var titleInput = notice.querySelector('#title');
titleInput.required = true;

var titleInputLength = {
  min: MIN_LENGTH_TITLE,
  max: MAX_LENGTH_TITLE
};

titleInput.addEventListener('change', function () {
  if (titleInput.value.length < titleInputLength.min || titleInput.value.length > titleInputLength.max) {
    titleInput.setCustomValidity('Необходимо от 30 до 100 символов');
  } else {
    titleInput.setCustomValidity('');
  }
});

var priceInput = notice.querySelector('#price');

priceInput.required = true;
priceInput.type = 'number';
priceInput.max = 1000000;

var price = notice.querySelector('#price');

var type = notice.querySelector('#type');

var MinPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var setMinPriceOfType = function (evt) {
  price.placeholder = MinPrice[evt.target.value];
  price.min = MinPrice[evt.target.value];
};

type.addEventListener('change', function (evt) {
  setMinPriceOfType(evt);
});

var timeIn = notice.querySelector('#timein');
var timeOut = notice.querySelector('#timeout');
var setTime = function (evt, time) {
  time.value = evt.target.value;
};

timeIn.addEventListener('change', function (evt) {
  setTime(evt, timeOut);
});

timeOut.addEventListener('change', function (evt) {
  setTime(evt, timeIn);
});

var imageInput = notice.querySelector('#images');
imageInput.accept = 'image/*';

var avatar = notice.querySelector('#avatar');
avatar.accept = 'image/*';

// Обработчик открытия карточки по клику по метке
var setPinClickHandlers = function () {
  var userPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  userPins.forEach(function (element, i) {
    element.addEventListener('click', function () {
      pinHandler(i);
    });
  });
};

var pinHandler = function (i) {
  removeClassActive();
  var popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
  var fragment = document.createElement('div'); // createDocumentFragment();
  var cardElement = similarTemplateCard.cloneNode(true);
  fragment.appendChild(createCard(offers[i], cardElement));
  map.insertBefore(fragment, filtersContainer);
  setPopupCloseHandlers();
};

// Обработчик открытия карточки по нажатию на Enter
var pinEnterPressHandler = function () {
  var userPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  userPins.forEach(function (element, i) {
    element.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        pinHandler(i);
      }
    });
  });
};

var closeHandler = function (popup) {
  popup.remove();
  removeClassActive();
  document.removeEventListener('keydown', escHandler);
};

var escHandler = function (evt) {
  if (evt.key === 'Escape') {
    var popup = document.querySelector('.popup');
    closeHandler(popup);
  }
};

// Обработчик закрытия карточки по клику или нажатию на ESC
var setPopupCloseHandlers = function () {

  var popup = document.querySelector('.popup');
  var popupClose = popup.querySelector('.popup__close');

  popupClose.addEventListener('click', function () {
    closeHandler(popup);
  });
  popupClose.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      closeHandler(popup);
    }
  });
  document.addEventListener('keydown', escHandler);
};
