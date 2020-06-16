'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TITLES = ['Заголовок1', 'Заголовок2', 'Заголовок3', 'Заголовок4', 'Заголовок5', 'Заголовок6', 'Заголовок7', 'Заголовок8'];
var TIME = ['12:00', '13:00', '14:00'];
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
var OFFERS_COUNT = 8;
var MIN_X_LOCATION = 0;
var MAX_X_LOCATION = 1140;
var MIN_Y_LOCATION = 130;
var MAX_Y_LOCATION = 630;

// временное решение, этот класс переключает карту из неактивного состояния в активное.
document.querySelector('.map').classList.remove('map--faded');

var map = document.querySelector('.map'); // находит в доме карту (переменная)
var similarPinsElement = map.querySelector('.map__pins'); // находит в доме метки (переменная)
var cardElement = document.querySelector('#card').content.querySelector('.map__card');
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


// mixArray(TIME);
// mixArray(TITLES);
// mixArray(TYPES);
// mixArray(FEATURES);
// mixArray(PHOTOS);

// функция создания массива из 8 сгенерированных JS объектов. объект массива ‐ описание похожего объявления неподалёку.(карточка объявления)
var createSimilarPinsArray = function () {
  var offers = [];
  for (var i = 0; i < OFFERS_COUNT; i++) {
    offers.push(
        {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png' // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём. Например, 01, 02 и т. д. Адреса изображений не повторяются
          },
          offer: {
            title: TITLES[i], // строка, заголовок предложения
            address: getRandomNumber(MIN_X_LOCATION, MAX_X_LOCATION) + ', ' + getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION), // строка, адрес предложения.
            price: getRandomNumber(0, 1000000), // число, стоимость
            type: TYPES[i], // строка с одним из четырёх фиксированных значений
            rooms: getRandomNumber(1, 5), // число, количество комнат
            guests: getRandomNumber(1, 8), // число, количество гостей, которое можно разместить
            checkin: TIME[i], // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
            checkout: TIME[i], // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
            features: getRandomArray(FEATURES), // массив строк случайной длины из ниже предложенных
            description: DESCRIPTIONS[i], // строка с описанием
            photos: getRandomArray(PHOTOS) // массив строк случайной длины, содержащий адреса фотографий
          },
          location: {
            x: getRandomNumber(MIN_X_LOCATION, MAX_X_LOCATION),
            y: getRandomNumber(MIN_Y_LOCATION, MAX_Y_LOCATION)
          }
        }
    );
  }
  return offers;
};

createSimilarPinsArray(); // вызываем массив из сгенерированных объектов

// функция создания сгенерированного пина
var createSimilarPin = function (similarpin) {
  var similarTemplatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = similarTemplatePin.cloneNode(true);
  pinElement.style = 'left: ' + similarpin.location.x + 'px; top: ' + similarpin.location.y + 'px;';
  pinElement.querySelector('img').src = similarpin.author.avatar;
  pinElement.querySelector('img').alt = similarpin.offer.title;

  return pinElement;
};

// функция отрисовки созданного пина выше
var renderPins = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createSimilarPin(array[i]));
  }
  similarPinsElement.appendChild(fragment);
};

renderPins(createSimilarPinsArray(OFFERS_COUNT));

var cardTemplate = cardElement.cloneNode(true);
filtersContainer.before(cardTemplate);

// Функция скрывающая определённый блок
var isNotEmpty = function (data) {
  return typeof data !== 'undefined' && data.length > 0;
};

var hideElement = function (element) {
  element.style.display = 'none';
};

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

var createCard = function (array) {

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

  renderFeatures(cardElement, array.offer.features);
};
createCard(createSimilarPinsArray(OFFERS_COUNT)[0]);
