const home = [33.74999999999069, 26.24908309632396] //coordinates for the default "home" view

	mapboxgl.accessToken = 'pk.eyJ1IjoibmFzc2Vyc2hhd2tleSIsImEiOiJjbGVsemcya2QxMHJvM3ZtaTR5Z2xhdmtiIn0.OKwzr5B3gav9IPo0ujDK6A';
const map = new mapboxgl.Map({
container: 'map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/nassershawkey/clf0rhx3q002701qhulllo023/draft',
center: [33.74999999999069, 26.24908309632396],
zoom: 5.3,
minZoom: .8,
maxZoom: 18,
pitch: 0, // pitch in degrees
projection: 'mercator'
});

/* Given a query in the form "lng, lat" or "lat, lng"
* returns the matching geographic coordinate(s)
* as search results in carmen geojson format,
* https://github.com/mapbox/carmen/blob/master/carmen-geojson.md */
const coordinatesGeocoder = function (query) {
  // Match anything which looks like
  // decimal degrees coordinate pair.
  const matches = query.match(
  /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
  );
  if (!matches) {
  return null;
  }
   
  function coordinateFeature(lng, lat) {
  return {
  center: [lng, lat],
  geometry: {
  type: 'Point',
  coordinates: [lng, lat]
  },
  place_name: 'Lat: ' + lat + ' Lng: ' + lng,
  place_type: ['coordinate'],
  properties: {},
  type: 'Feature'
  };
  }
   
  const coord1 = Number(matches[1]);
  const coord2 = Number(matches[2]);
  const geocodes = [];
   
  if (coord1 < -90 || coord1 > 90) {
  // must be lng, lat
  geocodes.push(coordinateFeature(coord1, coord2));
  }
   
  if (coord2 < -90 || coord2 > 90) {
  // must be lat, lng
  geocodes.push(coordinateFeature(coord2, coord1));
  }
   
  if (geocodes.length === 0) {
  // else could be either lng, lat or lat, lng
  geocodes.push(coordinateFeature(coord1, coord2));
  geocodes.push(coordinateFeature(coord2, coord1));
  }
   
  return geocodes;
  };

// Add the geocoder control to the map.
map.addControl(
new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
localGeocoder: coordinatesGeocoder,
placeholder: 'Search or "Lat, Long"',
mapboxgl: mapboxgl,
collapsed: true,
reverseGeocode: true
})
);

// Add geolocate control to the map.
map.addControl(
new mapboxgl.GeolocateControl({
positionOptions: {
enableHighAccuracy: true
},
// When active the map will receive updates to the device's location as it changes.
trackUserLocation: true,
// Draw an arrow next to the location dot to indicate which direction the device is heading.
showUserHeading: true
})
);

// Add home button to fly to home
const homePosition = {
    center: home,
    zoom: 5.3,
    pitch: 0,
    bearing: 0
};

class HomeButton {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
      this.container.innerHTML = `<button class="icon" title="Home"><i class="fa-solid fa-house"></i></button>`;
      this.container.addEventListener("click",() => map.flyTo(homePosition));
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }
  
  const FlytoControl = new HomeButton();
  
  map.addControl(FlytoControl);


// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add font awesome symbols for accessibility and must-see
// const wheelchair = "<i class=\"fa-brands fa-accessible-icon\"></i>"
// const elderly = "<i class=\"fa-solid fa-person-cane\"></i>"
// const stroller = "<i class=\"fa-solid fa-baby-carriage\"></i>"
// const elev = "<i class=\"fa-solid fa-elevator\"></i>"
// const fire = "<i class=\"fa-solid fa-fire\"></i>"

// Add attractions layer as constant.
// Tried to use github link but it didn't work.
// const attractions = "https://github.com/pheebely/mappymunich/blob/main/data/Munich-Intro.geojson";
// Tried local source but didn't work.
  // const attractionPoints = "../data/Munich-Intro.geojson";

// var attractions = "https://github.com/pheebely/mappymunich/blob/main/data/Munich-Intro.geojson"

const attractions =
{
  "type": "FeatureCollection",
  "name": "adventure",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 32.6368165470275, "y": 25.689592289757002, "Number": 1, "Name": " البالون بالاقصر", "Latitude": 25.689592289757002, "Longitude": 32.6368165470275, "Type": null, "Address": null, "Hours": null, "MustSee": "The balloon departed in Luxor", "MVV": null, "Access": null, "Description": "استكشف مدينة الأقصر التاريخية من الأعلى من خلال منطاد الاقصر", "image": "src='https://i0.wp.com/hodhodsolimanballoons.com/wp-content/uploads/2020/06/53728881_397190821076453_1915492810096808282_n.jpg?fit=1080%2C1080&ssl=1'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.6368165470275, 25.689592289757002, 32.6368165470275 ] } },
  { "type": "Feature", "properties": { "x": 32.635422001612802, "y": 25.6960603705481, "Number": 2, "Name": "نادى التجديف", "Latitude": 25.6960603705481, "Longitude": 32.635422001612802, "Type": null, "Address": null, "Hours": null, "MustSee": "Rowing club", "MVV": null, "Access": null, "Description": "نادي للأشخاص المهتمين برياضة التجديف", "image": "src='https://alwafd.news/images/images/3fac4f60-2b87-4a01-b288-95380991cf1d.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.635422001612802, 25.6960603705481, 32.635422001612802 ] } },
  { "type": "Feature", "properties": { "x": 31.225979933116498, "y": 30.006649870828301, "Number": 3, "Name": "الإبحار النيلى", "Latitude": 30.006649870828301, "Longitude": 31.225979933116498, "Type": null, "Address": null, "Hours": null, "MustSee": "Nile sailing", "MVV": null, "Access": null, "Description": "تغادر قوارب الرحلات البحرية من الأقصر وأسوان تجوب نهر النيل هو أيضا أكثر الطرق الأسترخاء لرؤية المعابد التي تجمعت ضفاف النهر على الطريق بين الأقصر وأسوان", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNuRR-bf4NNMT_Qs_N0T6ECM7OAqIgoZZlmad1e=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.225979933116498, 30.006649870828301, 31.225979933116498 ] } },
  { "type": "Feature", "properties": { "x": 34.899878539878799, "y": 25.068076953916599, "Number": 4, "Name": "مركز غوص مرسى علم", "Latitude": 25.068076953916599, "Longitude": 34.899878539878799, "Type": null, "Address": null, "Hours": null, "MustSee": "Marsa Alam diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر مرسى علم أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/d6/b1/57/info-marsadivingcom.jpg?w=1000&h=-1&s=1'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.899878539878799, 25.068076953916599, 34.899878539878799 ] } },
  { "type": "Feature", "properties": { "x": 34.2865154840798, "y": 26.104902363821498, "Number": 5, "Name": "مركز غوص سفاجا", "Latitude": 26.104902363821498, "Longitude": 34.2865154840798, "Type": null, "Address": null, "Hours": null, "MustSee": "Safaga Diving Center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر سفاجا أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='http://www.marsaalamtours.com/data1/images/Diving-Tours-From-Marsa-Alam/1.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.2865154840798, 26.104902363821498, 34.2865154840798 ] } },
  { "type": "Feature", "properties": { "x": 33.982054755266702, "y": 27.189054438418399, "Number": 6, "Name": "مركز غوص بالغردقة", "Latitude": 27.189054438418399, "Longitude": 33.982054755266702, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر الغردقة أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='https://media.tacdn.com/media/attractions-splice-spp-360x240/0e/a3/83/c1.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.982054755266702, 27.189054438418399, 33.982054755266702 ] } },
  { "type": "Feature", "properties": { "x": 33.9551975687585, "y": 27.1807405565587, "Number": 7, "Name": "مركز غوص بالغردقة", "Latitude": 27.1807405565587, "Longitude": 33.9551975687585, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر الغردقة أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='http://www.marsaalamtours.com/data1/images/Diving-Tours-From-Marsa-Alam/1.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.9551975687585, 27.1807405565587, 33.9551975687585 ] } },
  { "type": "Feature", "properties": { "x": 33.952073402700897, "y": 27.218080199108901, "Number": 8, "Name": "مركز غوص بالغردقة", "Latitude": 27.218080199108901, "Longitude": 33.952073402700897, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر الغردقة أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKNu6ac4zOIv7Gr1dYBCHFXO5yt7YzYc8XLi77uUBw6xX--uJR8njWz1vsrkuDC0Clqxw&usqp=CAU'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.952073402700897, 27.218080199108901, 33.952073402700897 ] } },
  { "type": "Feature", "properties": { "x": 33.8806719282844, "y": 27.267269730849499, "Number": 9, "Name": "مركز غوص بالغردقة", "Latitude": 27.267269730849499, "Longitude": 33.8806719282844, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر الغردقة أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='https://media.tacdn.com/media/attractions-splice-spp-674x446/0c/11/1a/a2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.8806719282844, 27.267269730849499, 33.8806719282844 ] } },
  { "type": "Feature", "properties": { "x": 33.7932835669097, "y": 27.3290073890775, "Number": 10, "Name": "مركز غوص بالغردقة", "Latitude": 27.3290073890775, "Longitude": 33.7932835669097, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر الغردقة أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='https://media.istockphoto.com/id/498283106/photo/underwater-scuba-diver-explore-and-enjoy-coral-reef-sea-life.jpg?s=612x612&w=0&k=20&c=xOj00xaZTpy5-AtKvMvIHHfexz9miSSct_CXb6F9KVA='", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.7932835669097, 27.3290073890775, 33.7932835669097 ] } },
  { "type": "Feature", "properties": { "x": 33.795063897602503, "y": 27.543543773035999, "Number": 11, "Name": "مركز غوص بالغردقة", "Latitude": 27.543543773035999, "Longitude": 33.795063897602503, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada diving center", "MVV": null, "Access": null, "Description": "تحتوى محافظة البحر الأحمر على قرابة 60 موقع غوص مختلف على طول ساحل البحر الأحمر، وتنظم لها رحلات غوص بشكل منتظم للاستمتاع بجمال الطبيعية بها، ويأتي لها الآلاف من السياح للغوص فى أعماقها ومشاهدة الشعاب المرجانية الخلابة والكائنات البحرية المختلفة. وتعتبر الغردقة أفضل مكان لاستكشاف جنوب البحر الأحمر.", "image": "src='https://media.worldnomads.com/travel-safety/worldwide/diving-coral-reef-gettyimages-stuart-westmorland-166264781.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.795063897602503, 27.543543773035999, 33.795063897602503 ] } },
  { "type": "Feature", "properties": { "x": 33.486303326506999, "y": 26.987024977689, "Number": 12, "Name": "جبل شايب البنات", "Latitude": 26.987024977689, "Longitude": 33.486303326506999, "Type": null, "Address": null, "Hours": null, "MustSee": "Shayeb Girls Mountain", "MVV": null, "Access": null, "Description": "جبل شايب البنات هو أحد جبال البحر الأحمر في الصحراء الشرقية في مصر، ويقع الجبل غرب مدينة الغردقة، ويعد أعلى قمة جبلية في الصحراء الشرقية بارتفاع يصل إلى 2185 متراً. ويتشكل الجبل من كتل بارزة من الصخور النارية تنحدر من جوانبها مجموعة من الوديان شديدة الانحدار. ويأتي إلى هذا الجبل الزوار لممارسة مختلف أنواع الأنشطة كالذهاب في مسارات مشي وتسلق وللتخييم وغيرها الكثير.", "image": "src='https://img.youm7.com/ArticleImgs/2023/2/22/142287-%D8%B4%D8%A7%D9%8A%D8%A8-%D8%A7%D9%84%D8%A8%D9%86%D8%A7%D8%AA.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.486303326506999, 26.987024977689, 33.486303326506999 ] } },
  { "type": "Feature", "properties": { "x": 36.333161638631204, "y": 22.201171799705602, "Number": 13, "Name": "جبل علبة", "Latitude": 22.201171799705602, "Longitude": 36.333161638631204, "Type": null, "Address": null, "Hours": null, "MustSee": "canister mount", "MVV": null, "Access": null, "Description": "جبل علبة :  ويشمل المنطقة الواقعة بين ساحل البحر الأحمر شرقا وحتى خط طول 36 غربا وخطوط العرض 30-23 درجة شمال حتي 22 درجة جنوبا وتتميز باحتوائها علي جبل علبة الذي يعتبر بيئة جبلية تحتوي علي غابات ونباتات برية نادرة وأنواع كثيرة من الحيونات والطيور والزواحف البرية.   مميزات الحياة البرية بمنطقة جبل علبة الطبيعية:   * تتميز بالتنوع الشديد من النباتات حيث يزيد عدد أنواع النباتات بها عن 350 نوعا والتي تجعل منها حدائق خضراء طبيعية متعددة الأشكال والألوان وأهم هذه الأنواع النباتية في منطقة جبل علبة حوالي 135 نوعا من النبتات الحولية، وحوالي 140 نوعا من النبتات الدائمة .   * يتميز جبل علبة بوجود نبات الأبنط الذي ينمو علي ارتفاعات عالية ولايوجد في مصر إلا في هذه المنطقة .   * تتميز محميات منطقة علبة باحتوائها علي عديد من الحيوانات البرية المصرية ومن أهم هذه الأنواع النادرة التي توجد بالمنطقة: الماعز الجبلي والحمار البري والغزال المصري والأرنب الجبلي والسوبر وثعلب المل والكبش الأوروبي الذي انقرض منذ عام 1972 وعروسة البحر والنعام والرحمة المصرية والعقاب النسارية والقط البري والقنفد .   * تتنشر العديد من الطيور الأخري الجارحة مثل: الصقور والنسور والغراب والنواحي والدقناش وكثير من الطيور الأخري مثل: القنابر والحمام الجبلي واليمام، ومن الطيور البحرية أبو بلحة والبلشونات والنورس، كما توجد السلاحف البحرية منها السلحفاه صقرية المنقار والسلحفاة الخضراء، والزواحف البرية مثل: الوراد الجبلي الذي يتغذى علي الفئران والسحالي والحشرات، ويوجد أيضاً الغيب المصري والحبة القرنة والعقاب والحرباء.", "image": "src='https://content.almalnews.com/wp-content/uploads/2020/07/%D9%85%D8%AD%D9%85%D9%8A%D8%A9-%D8%AC%D8%A8%D9%84-%D8%B9%D9%84%D8%A8%D8%A9-2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 36.333161638631204, 22.201171799705602, 36.333161638631204 ] } },
  { "type": "Feature", "properties": { "x": 33.776256100940898, "y": 27.1319325525849, "Number": 14, "Name": "أورينتال سفاري الغردقة", "Latitude": 27.1319325525849, "Longitude": 33.776256100940898, "Type": null, "Address": null, "Hours": null, "MustSee": "Oriental Safari Hurghada", "MVV": null, "Access": null, "Description": "أورينتال سفاري الغردقة هي شركة محلية شهيرة يشارك في رحلاتها المحليون والسياح على حد سواء، وسيستطيع المشاركون في رحلاتها من ركوب عربات الدفع الرباعي في الصحراء، كما وسيتمكنون من ركوب الجمال، والتخييم في عرض الصحراء، وزيارة البدو وتجربة أطباقهم والتعرف على عاداتهم وتقاليدهم، وغيرها الكثير", "image": "src='https://media.safarway.com/content/f3cf1ddc-3f0e-4c97-9948-b0fdaf589429_sm.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.776256100940898, 27.1319325525849, 33.776256100940898 ] } },
  { "type": "Feature", "properties": { "x": 34.653664799212599, "y": 25.513490703385798, "Number": 15, "Name": "منطقة أم الروس", "Latitude": 25.513490703385798, "Longitude": 34.653664799212599, "Type": null, "Address": null, "Hours": null, "MustSee": "Om Al-Rus area", "MVV": null, "Access": null, "Description": "منطقة غوص رائعة في البحر الأحمر، ويأتي إلى هذه المنطقة عشاق رياضة الغوص من جميع أرجاء العالم، وذلك لأن المنطقة تعج بالحيوانات البحرية كالسلاحف وأبقار البحر النادرة، كما وينتشر فيها المرجان الجميل بالعديد من الألوان والأشكال.", "image": "src='https://media.safarway.com/content/fdd8eef1-9499-492b-ac15-ebe844e1be01_lg.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.653664799212599, 25.513490703385798, 34.653664799212599 ] } }
  ]
  }
  
  
  
;  

  console.log(attractions)

/**USE properties.Number instead of assigning a new unique id!!!
 * Assign a unique id to each attraction. You'll use this `id`
 * later to associate each point on the map with a listing
 * in the sidebar.
 */
// attractions.features.forEach((attraction, i) => {
//   attractions.properties.id = i;
// });
map.addControl(new mapboxgl.ScaleControl({position: 'bottom-right'}));
// CHANGE BASEMAP STYLE
// Create constants for layerlist and inputs for different basemap styles in the html file, look at CityTours.html line 63
 const layerList = document.getElementById('menu'); //'menu' is the div element id
 const inputs = layerList.getElementsByTagName('input'); //'input', <input> tag specifies an input field where the user can enter data

// All sources and layers are removed when new style is loaded!!
// So we need to add sources and layers each time new style is loaded.
// We will create the functions addSource() and addLayer() to do this each time we load a new style.

function addSource() { 
  // For each new source, we need to create map.addSource()

  map.addSource('Art-Museum-Route',{
      type: 'geojson',
      data:'/data/Art-Museums-Route.geojson'
  
      });


  //Add source before this//          
  }

function addLayer() {
// For each source we added, we need to use map.addLayer() to add it to the map.
// map.setLayerZoomRange is used to set the layer zoom range

    
    map.addLayer({
        id: 'Art-Museum-Route',
        type: 'line',
        source: 'Art-Museum-Route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
        'line-color': '#48a2b8', // ['get','color']
        'line-width': 6,
        'line-opacity': 0.8,
        'line-blur': 1.5
        }
        });
    map.setLayerZoomRange('Art-Museum-Route', 12, 22);



 //Add layer before this// 
}

// Here when map loads a style, we run the functions addSource() and addLayer() we created above 
//which adds all the geojson sources and adds to the maps as layers.
map.on('style.load', function(){
  const layers = map.getStyle().layers;


      map.addSource('entertainment', {
        'type': 'geojson',
        'data': attractions
      });
    
        /**
       * Add all the things to the page:
       * - The location listings on the side of the page
       * - The markers onto the map
       */
        buildLocationList(attractions);
        addMarkers();
        addSource();
        // addLayer();


    //whatever layers you want to toggle go in to this function
    // toggleLayer(['munich-intro-tour-points'], 'Points');
    // toggleLayer(['walking-routes','old-town-route'], 'Routes');

    // function toggleLayer(ids, name) {
    //     var link = document.createElement('a');
    //     link.href = '#';
    //     link.className = 'active';
    //     link.textContent = name;

    //     link.onclick = function (e) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         for (layers in ids){
    //             var visibility = map.getLayoutProperty(ids[layers], 'visibility');
    //             if (visibility === 'visible') {
    //                 map.setLayoutProperty(ids[layers], 'visibility', 'none');
    //                 this.className = '';
    //             } else {
    //                 this.className = 'active';
    //                 map.setLayoutProperty(ids[layers], 'visibility', 'visible');
    //             }
    //         }

    //     };

    //     var layers = document.getElementById('layernav');
    //     layers.appendChild(link);

    //   }

});

//Change Basemap Style
//<<< Messes up click/hover functions on list locations !!!>>>

for (const input of inputs) {
input.onclick = (layer) => {
const layerId = layer.target.id;
map.setStyle('mapbox://styles/' + layerId);
};
}


      /**
       * Add a marker to the map for every attraction listing.
       **/
      function addMarkers() {
        /* For each feature in the GeoJSON object above: */
        for (const marker of attractions.features) {
          /* Create a div element for the marker. */
          const el = document.createElement('div');
          /* Assign a unique `id` to the marker. */
          el.id = `marker-${marker.properties.Number}`;
          /* Assign the `marker` class to each marker for styling. */
          el.className = 'marker';
          el.textContent = marker.properties.Number;

          /**
           * Create a marker using the div element
           * defined above and add it to the map.
           **/
          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
          

          /**
           * Listen to the element and when it is clicked, do three things:
           * 1. Fly to the point
           * 2. Close all other popups and display popup for clicked attraction
           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
           **/
          el.addEventListener('click', (e) => {
            /* Fly to the point */
            flyToattraction(marker);
            /* Close all other popups and display popup for clicked attraction */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('activeList');
              activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
              `listing-${marker.properties.Number}`
            );
            listing.classList.add('active');

            //Highlight marker on click
            const activeMarker = document.getElementsByClassName('activeClick');
            e.stopPropagation();
            if (activeMarker[0]) {
              activeMarker[0].classList.remove('activeClick');
            }
            const markerOn = document.getElementById(
              `marker-${marker.properties.Number}`
            );
            markerOn.classList.add('activeClick');

          });

          //Highlight listing in sidebar when hover on marker
        el.addEventListener('mouseenter', (e) => {
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('activeList');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('activeList');
            }
            const listing = document.getElementById(
              `listing-${marker.properties.Number}`
            );
            listing.classList.add('activeList');

        });

        //Stop highlighting sidebar on mouse leave marker
        el.addEventListener('mouseleave', (e) => {
          const activeItem = document.getElementsByClassName('activeList');
          e.stopPropagation();
          if (activeItem[0]) {
            activeItem[0].classList.remove('activeList');
          }

      });

          // Create function for when pop.remove() then all active markers will be removed.
          // const popup = new mapboxgl.Popup({ closeOnClick: true });

        el.addEventListener('popup.close', function() {
          const activeItem = document.getElementsByClassName('active');
          e.stopPropagation();
          if (activeItem[0]) {
            activeItem[0].classList.remove('activeList');
            activeItem[0].classList.remove('active');
            activeItem[0].classList.remove('activeClick');
          }

    });


        }
      }

      /**
       * Add a listing for each attraction to the sidebar.
       **/
      function buildLocationList(attractions) {
        for (const attraction of attractions.features) {
          /* Add a new listing section to the sidebar. */
          const listings = document.getElementById('listings');
          const listing = listings.appendChild(document.createElement('div'));
          /* Assign a unique `id` to the listing. */
          listing.id = `listing-${attraction.properties.Number}`;
          /* Assign the `item` class to each listing for styling. */
          listing.className = 'item';

          /* Add the link to the individual listing created above. */
          const link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.id = `link-${attraction.properties.Number}`;
          link.innerHTML = `<span class="pin"><img src="../images/location-pin-solid-list.svg" width="20"><span class="pinTitle">${attraction.properties.Number}&nbsp;&nbsp;&nbsp;</span></span> ${attraction.properties.Name}&nbsp;&nbsp;`;

          if (attraction.properties.MustSee){
            link.innerHTML += `${attraction.properties.MustSee}`
          };

          /* Add details to the individual listing. */
       
          // if (attraction.properties.Phone) {
          //   details.innerHTML += `${attraction.properties.Phone}`;
          // };
          

          /**
           * Listen to the element and when it is clicked, do four things:
           * 1. Update the `currentFeature` to the attraction associated with the clicked link
           * 2. Fly to the point
           * 3. Close all other popups and display popup for clicked attraction
           * 4. Highlight listing in sidebar (and remove highlight for all other listings)
           * 5. Highlight listing in map (and remove highlight for all other listings)
           **/
          link.addEventListener('click', function () {
            for (const feature of attractions.features) {

              if (this.id === `link-${feature.properties.Number}`) {
                flyToattraction(feature);
                createPopUp(feature); //closePopup(feature)

            //Remove highlight for all other markers
            const activeMarker = document.getElementsByClassName('activeClick');
            if (activeMarker[0]) {
              activeMarker[0].classList.remove('activeClick');
              // activeMarker[0].classList.remove('activeHover');

            }
            // If marker ID matches the listing, then add activeClick class to highlight the marker.
            const markerOn = document.getElementById(
              `marker-${feature.properties.Number}`
            );
            markerOn.classList.add('activeClick');
            //Remove activeHover class when marker highlighted with click
            markerOn.classList.remove('activeHover');

            } // end of IF statement

            // Highlight listing in sidebar:
            // If activeItem doesn't match listing that is clicked on, then remove 'active' class.
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            //For the element associated with the click listing, add 'active' class.
            this.parentNode.classList.add('active');

            } 

          });


          //Listen to the element and when it is hovered on, do this:
          //1. Update the `currentFeature` to the attraction associated with the clicked link
          //2. Highlight listing in map
          //3. Stop highlighting listing when mouse leaves
          //   - BUG: Listing is still highlighted on hover even after it is highlighted on click.

          link.addEventListener('mouseenter', function() {

            for (const feature of attractions.features) {
              if (this.id === `link-${feature.properties.Number}`) {

              //Highlight marker on hover on listing in the sidebar and remove highlight for other markers
              const activeMarker = document.getElementsByClassName('activeHover');
              if (activeMarker[0]) {
                activeMarker[0].classList.remove('activeHover');
              }

              const markerOn = document.getElementById(
                `marker-${feature.properties.Number}`
              );
              markerOn.classList.add('activeHover');

            // If listing is already active from mouseclick on marker or listing, remove activeHover:
              const activeListing = document.getElementsByClassName('activeList');
              if (activeListing === true) {
                activeListing.classList.remove('activeHover');
              };

              const activeListingmarker = document.getElementsByClassName('activeClick');
              if (activeListingmarker === true) {
                activeListingmarker.classList.remove('activeHover');
              };

              }//end of IF statement


            }

          });

          // On 'mouseleave' listings, no markers are highlighted.
          link.addEventListener('mouseleave', function() {
            for (const feature of attractions.features) {
              if (this.id === `link-${feature.properties.Number}`) {
                const markerOff = document.getElementById(
                  `marker-${feature.properties.Number}`
                );
                markerOff.classList.remove('activeHover');
              }
            }

          });
        }
      }

      /**
       * Use Mapbox GL JS's `flyTo` to move the camera smoothly
       * a given center point.
       **/
      function flyToattraction(currentFeature) {
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          offset: [-150, -150],
          zoom: 16.5
        });
      }

      /**
       * Create a Mapbox GL JS `Popup`.
       **/
      function createPopUp(currentFeature) {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        const popup = new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML(
            `<h3>${currentFeature.properties.Name}</h3>
            <img id="img" ${currentFeature.properties.image} style="width:100%;max-width:350px">
            <p>${currentFeature.properties.Description}<br><br> 
            <img id="img2" ${currentFeature.properties.image2} style="width:100%;max-width:350px">
            <p>
            <center><b>انقر على الخريطة أو انتقل مرة أخرى لأعلى للإغلاق  !</center></b></i></font size>
            </p>`
          )
          .addTo(map);
        // Set an event listener that will fire
        // any time the popup is closed
        popup.on('close', () => {
          console.log('popup was closed');
          });
      }

       /**
       * Close all other popups and display marker for clicked attraction in the sidebar.
       **/
      function closePopUp(currentFeature) {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        const popup = new mapboxgl.Popup({ closeOnClick: true })
        .setLngLat(currentFeature.geometry.coordinates)

      }


      map.on('mousemove', (e) => {
        document.getElementById('info').innerHTML =
        // `e.point` is the x, y coordinates of the `mousemove` event
        // relative to the top-left corner of the map.
        //JSON.stringify(e.point) +
        //'<br />' +
        // `e.lngLat` is the longitude, latitude geographical position of the event.
        JSON.stringify(e.lngLat.wrap());
        });
