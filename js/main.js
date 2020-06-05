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

// временное решение, этот класс переключает карту из неактивного состояния в активное.
document.querySelector('.map').classList.remove('map--faded');

var map = document.querySelector('.map'); // находит в доме карту (переменная)
var similarPinsElement = map.querySelector('.map__pins'); // находит в доме метки (переменная)

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

var mixArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var template = array[i];
    array[i] = array[j];
    array[j] = template;
  }
  return array;
};

var similarPins = [];
var imageNumber = 1;

mixArray(TIME);
mixArray(TITLES);
mixArray(TYPES);
mixArray(FEATURES);
mixArray(PHOTOS);

// функция создания массива из 8 сгенерированных JS объектов. объект массива ‐ описание похожего объявления неподалёку.(карточка объявления)
var createSimilarPinsArray = function () {
  for (var i = 0; i < 8; i++) {
    var locationX = getRandomNumber(0, 1140);
    var locationY = getRandomNumber(130, 630);
    similarPins.push(
        {
          author: {
            avatar: 'img/avatars/user0' + imageNumber + '.png' // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём. Например, 01, 02 и т. д. Адреса изображений не повторяются
          },
          offer: {
            title: TITLES[i], // строка, заголовок предложения
            address: locationX + ', ' + locationY, // строка, адрес предложения.
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
            x: locationX,
            y: locationY
          }
        }
    );
    imageNumber += 1;
  }
};

createSimilarPinsArray(); // вызываем массив из сгенерированных объектов

// функция создания сгенерированного пина
var createSimilarPin = function (similarpin) {
  var similarTemplatePin = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = similarTemplatePin.cloneNode(true);
  pinElement.style = 'left: ' + similarpin.location.x + 'px; top: ' + similarpin.location.y + 'px;';
  pinElement.querySelector('img').src = similarpin.author.avatar;
  pinElement.alt = similarpin.offer.title;

  return pinElement;
};

// функция отрисовки созданного пина выше
var renderPins = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createSimilarPin(array[i]));
  }
  return fragment;
};

similarPinsElement.appendChild(renderPins(similarPins));
