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
map.addControl(new mapboxgl.ScaleControl({position: 'bottom-right'}));
// Add attractions layer as constant.
// Tried to use github link but it didn't work.
// const attractions = "https://github.com/pheebely/mappymunich/blob/main/data/Munich-Intro.geojson";
// Tried local source but didn't work.
  // const attractionPoints = "../data/Munich-Intro.geojson";

// var attractions = "https://github.com/pheebely/mappymunich/blob/main/data/Munich-Intro.geojson"

const attractions =
{
  "type": "FeatureCollection",
  "name": "religon",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 32.695549880774699, "y": 25.882832549029999, "Number": 13, "Name": "دير رئيس الملائكة ميخائيل", "Latitude": 25.882832549029999, "Longitude": 32.695549880774699, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Monastery of the Archangel Michael", "MVV": null, "Access": null, "Description": null, "image": "src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1ISp_Bf_v7X5tDnVzPYOy_rdbwawVynFDzB-P9UJm7x5oJoDJ8asusW_hCKm7-zd7uSI&usqp=CAU'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.695549880774699, 25.882832549029999, 32.695549880774699 ] } },
  { "type": "Feature", "properties": { "x": 32.703646426281203, "y": 25.848437402150701, "Number": 14, "Name": "دير الصليب ولأنبا شنودة", "Latitude": 25.848437402150701, "Longitude": 32.703646426281203, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Monastery of the Cross and Anba Shenouda", "MVV": null, "Access": null, "Description": null, "image": "src='https://www.coptichistory.org/image/mnonestery/762s.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.703646426281203, 25.848437402150701, 32.703646426281203 ] } },
  { "type": "Feature", "properties": { "x": 32.704241422539297, "y": 25.8496521241258, "Number": 15, "Name": "دير الأنبا أدراوس", "Latitude": 25.8496521241258, "Longitude": 32.704241422539297, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Monastery of Anba Adraos", "MVV": null, "Access": null, "Description": null, "image": "src='https://www.coptichistory.org/image/mnonestery/771s.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.704241422539297, 25.8496521241258, 32.704241422539297 ] } },
  { "type": "Feature", "properties": { "x": 32.701798911347502, "y": 25.831706040578901, "Number": 16, "Name": "دير القديس بستناؤس", "Latitude": 25.831706040578901, "Longitude": 32.701798911347502, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Monastery of St. Bustanas", "MVV": null, "Access": null, "Description": null, "image": "src='https://upload.wikimedia.org/wikipedia/commons/5/52/%D8%AF%D9%8A%D8%B1_%D8%A7%D9%84%D9%82%D8%AF%D9%8A%D8%B3_%D8%A7%D9%84%D8%A3%D9%86%D8%A8%D8%A7_%D8%A8%D8%B3%D9%86%D8%AA%D8%A7%D8%A4%D9%88%D8%B3_%D8%A8%D9%86%D9%82%D8%A7%D8%AF%D8%A9.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.701798911347502, 25.831706040578901, 32.701798911347502 ] } },
  { "type": "Feature", "properties": { "x": 32.705555699503797, "y": 25.8152954474042, "Number": 17, "Name": "دير ماربقطر", "Latitude": 25.8152954474042, "Longitude": 32.705555699503797, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Maribqatar Monastery", "MVV": null, "Access": null, "Description": null, "image": "src='https://www.coptichistory.org/image/mnonestery/766s..jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.705555699503797, 25.8152954474042, 32.705555699503797 ] } },
  { "type": "Feature", "properties": { "x": 32.726407263492902, "y": 26.165140140848401, "Number": 18, "Name": "مسجد عبدالرحيم القنائى", "Latitude": 26.165140140848401, "Longitude": 32.726407263492902, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Abdul Rahim Al-Qanai Mosque", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh5.googleusercontent.com/p/AF1QipN7nuxPkZOjXLIEl-9N-Ir3ql2iLB_LBz8lTQzw=w408-h543-k-no'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.726407263492902, 26.165140140848401, 32.726407263492902 ] } },
  { "type": "Feature", "properties": { "x": 32.307930707388401, "y": 26.064225792188601, "Number": 19, "Name": "دير الأنبا بلامون", "Latitude": 26.064225792188601, "Longitude": 32.307930707388401, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Monastery of Anba Plamon", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipMmXuvckXMdtLe2amVD3uiQtLiu92KDxrmvnusG=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.307930707388401, 26.064225792188601, 32.307930707388401 ] } },
  { "type": "Feature", "properties": { "x": 32.274049046314303, "y": 26.004506736756898, "Number": 20, "Name": "دير مارمينا العجايبى بهو", "Latitude": 26.004506736756898, "Longitude": 32.274049046314303, "Type": "محافظة قنا", "Address": null, "Hours": null, "MustSee": "Monastery of St. Mina, the wondrous lobby", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipM8IjGigSOyoozyJVaeNT6fJfRqQ9EpsiEgUP1Z=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.274049046314303, 26.004506736756898, 32.274049046314303 ] } },
  { "type": "Feature", "properties": { "x": 31.619151338627301, "y": 26.5558347573063, "Number": 1, "Name": "دير الأنبا بيجول - الدير الأحمر", "Latitude": 26.5558347573063, "Longitude": 31.619151338627301, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Monastery of Anba Begol - The Red Monastery", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipPkNoIDbCk7lJzDWrramyZEbSswFV777Meorqyb=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.619151338627301, 26.5558347573063, 31.619151338627301 ] } },
  { "type": "Feature", "properties": { "x": 31.7923976539705, "y": 26.590667923881099, "Number": 2, "Name": "دير القديسة العذراء مريم بأخميم", "Latitude": 26.590667923881099, "Longitude": 31.7923976539705, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Monastery of the Virgin Mary in Akhmim", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipMLKl7d3xBsDI_yBLm0qe_PSXzgYSRq_vRSw2M=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.7923976539705, 26.590667923881099, 31.7923976539705 ] } },
  { "type": "Feature", "properties": { "x": 31.7895859466392, "y": 26.606540386064701, "Number": 3, "Name": "دير الملاك ميخائيل بأخميم", "Latitude": 26.606540386064701, "Longitude": 31.7895859466392, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Archangel Michael Monastery in Akhmim", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipMJp2nnvZ9wANuPXpfMN_g0htIU7xE7LldhHNoU=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.7895859466392, 26.606540386064701, 31.7895859466392 ] } },
  { "type": "Feature", "properties": { "x": 31.7914061610049, "y": 26.598397675369402, "Number": 4, "Name": "دير الشهداء بأخميم إيبارشيه", "Latitude": 26.598397675369402, "Longitude": 31.7914061610049, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Monastery of the Martyrs Akhmim Diocese", "MVV": null, "Access": null, "Description": "تعتبر كنيسة السيدة مريم العذراء في القصير أحد أهم المعالم في المدينة ومركز روحي مهم. وقد بنيت الكنيسة في العام 1920، وتفتن الكنيسة منذ ذلك الحين زوارها بجمال عمارتها بمجرد دخولها، إذ يتوزع في ارجائها المذابح والأقواس المذهبة، وسيجد الزوار على جدرانها وسقفها رسومات رائعة لمريم العذراء والشهيدة القديسة باربرا، كما وسيجدون زجاج ملون رائع، وأبواب مزخرفة، وغيرها الكثير.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipMTASWFGE3l_neHNbf-HHlKdSMPsnn1Wri-swXR=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.7914061610049, 26.598397675369402, 31.7914061610049 ] } },
  { "type": "Feature", "properties": { "x": 31.7494987693136, "y": 26.564966111213099, "Number": 5, "Name": "مسجد الأمير حسن", "Latitude": 26.564966111213099, "Longitude": 31.7494987693136, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Prince Hassan Mosque", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipNzrR4DT8blWpfRACBv6pyVM166eZ1VRZkNZYxa=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.7494987693136, 26.564966111213099, 31.7494987693136 ] } },
  { "type": "Feature", "properties": { "x": 31.741284034192201, "y": 26.5646417193297, "Number": 6, "Name": "المسجد العمرى بإخميم", "Latitude": 26.5646417193297, "Longitude": 31.741284034192201, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Omari Mosque in Akhmim", "MVV": null, "Access": null, "Description": null, "image": "src='https://gate.ahram.org.eg/Media/News/2019/1/15/2019-636831715317033002-703.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.741284034192201, 26.5646417193297, 31.741284034192201 ] } },
  { "type": "Feature", "properties": { "x": 31.6886390902276, "y": 26.569586961678201, "Number": 7, "Name": "مسجد الشاذلى بإخميم", "Latitude": 26.569586961678201, "Longitude": 31.6886390902276, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Al-Shazly Mosque in Akhmim", "MVV": null, "Access": null, "Description": null, "image": "src='https://img.youm7.com/xlarge/201805090336433643.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.6886390902276, 26.569586961678201, 31.6886390902276 ] } },
  { "type": "Feature", "properties": { "x": 31.742182465089201, "y": 26.5611808685581, "Number": 8, "Name": "مسجد أبو بكر العجمى", "Latitude": 26.5611808685581, "Longitude": 31.742182465089201, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Abu Bakr Al-Ajami Mosque", "MVV": null, "Access": null, "Description": "مسجد عبد الرحيم القناوي ، هو أحد المساجد التي أنشئت في عصر الدولة الأيوبية في مصرويأتي المواطنون من كل محافظات مصر ودول العالم لزيارة ضريح أحد الأولياء الصالحين، مبني على الطراز الأندلسي، هو أكبر مسجد بمحافظة قنا، حيث تبلغ مساحته من الداخل 1250 مترا مربعا، ومع التوسعات التى دخلت عليه ضم مصلى خارجى، وبلغت المساحة التى يتم الصلاة بها 2058 مترا مربعا، شاملة المسجد والصحن الخارجى، فيما تبلغ المساحة الكلية للمسجد ما يعادل 3 أفدنة تقريبا.", "image": "src=''", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.742182465089201, 26.5611808685581, 31.742182465089201 ] } },
  { "type": "Feature", "properties": { "x": 31.895633794923, "y": 26.335412310204699, "Number": 9, "Name": "مسجد عثمان بك الجرجاوى", "Latitude": 26.335412310204699, "Longitude": 31.895633794923, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Othman Bey El Gergawi Mosque", "MVV": null, "Access": null, "Description": "مسجد أبي الحجاج الأقصري أو جامع أبو الحجاج كما يسميه العامة، هو مسجد بمدينة الأقصر المصرية، يرجع إلى الصوفي «يوسف بن عبد الرحيم بن يوسف بن عيسى الزاهد» المعروف بأبي الحجاج الأقصري والذي دفن بداخله.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipPEDESyMUdUIcQYTXMGAbiWLNCs_JaahwHboBY6=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.895633794923, 26.335412310204699, 31.895633794923 ] } },
  { "type": "Feature", "properties": { "x": 31.701211701378099, "y": 26.548671446383, "Number": 10, "Name": "مسجد العارف بالله", "Latitude": 26.548671446383, "Longitude": 31.701211701378099, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Al-Arif Billah Mosque", "MVV": null, "Access": null, "Description": null, "image": "src='https://img.youm7.com/ArticleImgs/2017/6/2/40760-%D9%85%D8%B3%D8%AC%D8%AF-%D8%B9%D8%AB%D9%85%D8%A7%D9%86-%D8%A8%D9%83.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.701211701378099, 26.548671446383, 31.701211701378099 ] } },
  { "type": "Feature", "properties": { "x": 31.895917661376, "y": 26.336138621574701, "Number": 11, "Name": "مسجد على بك الكبير ", "Latitude": 26.336138621574701, "Longitude": 31.895917661376, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Ali Bey Grand Mosque", "MVV": null, "Access": null, "Description": "من أهم المساجد الأثرية بمدينة أخميم ويقع علي الجانب الشمالي لشارع الأمير حسن ويطل بواجهته الشمالية علي شارع المدرسة وقد أنشأه الأمير حسن بن الأمير محمد سنة 1117 هجرياً وأنتهي من إنشاءه سنة 1121 هجرياً، كما أنشأ له ضريحا ملاصقا له في الجهة الشرقية. ويمتاز هذا المسجد باستخدام أعمدة خشبية تحمل سقفه، وهو أمر لم يري له مثيلا في مساجد الصعيد، وندر في مساجد مصر بصفه عامة ، كما أن هذا المسجد يشتمل علي الكثير من العناصر المعمارية والزخرفية والهندسية والكتابية ،  والأعمال الخشبية مما يكسبه أهمية أثرية خاصة ، ويعد نموذجا جيدا للتراث المحلي في العمارة الدينية العثمانية. وقد توفي الأمير حسن سنة 1132هجريا، ودفن بالضريح بالجهة الشرقية من المسجد.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipO-Y7r1HOf1Qw1wlyURZIMdTSYhdihuI1nNYECR=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.895917661376, 26.336138621574701, 31.895917661376 ] } },
  { "type": "Feature", "properties": { "x": 31.8960686552489, "y": 26.335474458731898, "Number": 12, "Name": "مسجد الشيخ جلال الدين ابوالقاسم", "Latitude": 26.335474458731898, "Longitude": 31.8960686552489, "Type": "محافظة سوهاج", "Address": null, "Hours": null, "MustSee": "Sheikh Jalal Al-Din Abu Al-Qasim Mosque", "MVV": null, "Access": null, "Description": null, "image": "src='https://gate.ahram.org.eg/daily/Media/News/2019/5/31/2019-636949398512332391-233.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.8960686552489, 26.335474458731898, 31.8960686552489 ] } },
  { "type": "Feature", "properties": { "x": 32.899757771671297, "y": 24.089029287897102, "Number": 24, "Name": "مسجد الطابية", "Latitude": 24.089029287897102, "Longitude": 32.899757771671297, "Type": "محافظة أسوان", "Address": null, "Hours": null, "MustSee": "Al-Tabia Mosque", "MVV": null, "Access": null, "Description": null, "image": "src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Egypt.Aswan.Mosque.02.jpg/216px-Egypt.Aswan.Mosque.02.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.899757771671297, 24.089029287897102, 32.899757771671297 ] } },
  { "type": "Feature", "properties": { "x": 32.891656719016403, "y": 24.077879087997601, "Number": 25, "Name": "المقابر الفاطمية", "Latitude": 24.077879087997601, "Longitude": 32.891656719016403, "Type": "محافظة أسوان", "Address": null, "Hours": null, "MustSee": "Fatimid tombs", "MVV": null, "Access": null, "Description": null, "image": "src='data:image/jpeg;base64,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'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.891656719016403, 24.077879087997601, 32.891656719016403 ] } },
  { "type": "Feature", "properties": { "x": 32.886798300882802, "y": 24.006425480295601, "Number": 26, "Name": "مأذنة بلال", "Latitude": 24.006425480295601, "Longitude": 32.886798300882802, "Type": "محافظة أسوان", "Address": null, "Hours": null, "MustSee": "Bilal minaret", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh5.googleusercontent.com/p/AF1QipOGXhEznfsDAR2pJaXnNvMHzRMlLOZZyecJG8PO=w408-h610-k-no'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.886798300882802, 24.006425480295601, 32.886798300882802 ] } },
  { "type": "Feature", "properties": { "x": 32.351156641885602, "y": 28.9252296702244, "Number": 27, "Name": "دير الأنبا أنطونيس", "Latitude": 28.9252296702244, "Longitude": 32.351156641885602, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Monastery of Anba Anthony", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipPfJUuH7DsphUYZKt0DsMcpcvBnzgFP4nUf2XGC=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.351156641885602, 28.9252296702244, 32.351156641885602 ] } },
  { "type": "Feature", "properties": { "x": 33.8159628, "y": 27.255204520349199, "Number": 28, "Name": "كنيسة الأنبا شنودة رئيس المتوحدين بالغردقة", "Latitude": 27.255204520349199, "Longitude": 33.8159628, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Church of Anba Shenouda, the head of the monotheists in Hurghada", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipNum00wbeQMJ7WncDC4e7MKmu3GnGAgvfzOSIZ0=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.8159628, 27.255204520349199, 33.8159628 ] } },
  { "type": "Feature", "properties": { "x": 34.283487633142897, "y": 26.111995907156299, "Number": 29, "Name": "كنيسة السيدة العذراء مريم والشهيدة بربارة بالقصير ايبارشية البحر الأحمر", "Latitude": 26.111995907156299, "Longitude": 34.283487633142897, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Church of the Blessed Virgin Mary and Martyr Barbara in Qusayr, Red Sea Diocese", "MVV": null, "Access": null, "Description": "يعد من أكبر وأعرق مساجد المدينة، ويمثل طرازاً معمارياً متميزاً يرجع أصل التسمية إلى المنطقة التي أقيم فيها المسجد  أن تاريخ الطابية يرجع إلى بداية القرن 19 حيث كان مٌقام عليها طابية حربية لتكون مقرًا لأول كلية حربية فى مصر وهي واحدة من طابيتين حربيتين في أسوان تم إنشاؤهما في عهد محمد علي باشا، وقد تهدم معظمهم بفعل الزمن. المسجد تم البدء في بناءه في عهد الرئيس جمال عبد الناصر وقد تم افتتاحه في عهد الرئيس أنور السادات.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipMoovL-tuELkW6IrN9cvYHhfawOI3aQ9MiZm-zr=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.283487633142897, 26.111995907156299, 34.283487633142897 ] } },
  { "type": "Feature", "properties": { "x": 33.775375209275303, "y": 27.275927727790901, "Number": 30, "Name": "كنيسة مارمرقس القبطية الأرثوذكسية", "Latitude": 27.275927727790901, "Longitude": 33.775375209275303, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Mark Coptic Orthodox Church", "MVV": null, "Access": null, "Description": "المقابر الفاطمية في اسوان ‏ تنقسم الجبانات الفاطمية في جنوب مصر إلى قسمين وهم الجبانة القبلية والجبانة البحرية، حيث تقع الجبانة القبلية في اسوان على طريق خزان اسوان بجوار متحف النوبة اما الجبانة البحرية فتقع في منطقة العناني، ويتميز شكل القباب الموجودة في المقابر الفاطمية بوجود اوجه اضلاع ثمانية متقابلة للقبة والذى بلغ عددها \"80\" مقبرة متناثرة فى الجبانتين الرئيسيتين تعد الجبانة الفاطمية بأسوان أحد الشواهد على حقبة تاريخية مهمة للتاريخ الإسلامى تبوح بها مشاهد مقابر الجبانة على أرض البقيع الأسوانى الذى يعتبر البقيع الثانى بعد بقيع المدينة المنورة لما تحويه الجبانة من رفات أجساد الصحابة والتابعين والأولياء والتى يؤكدها اكتشاف أقدم شاهد قبر بالجبانة فى عام 31 هجرياً، وتمثل قباب مقابر الجبانة طرازاً معمارياً فريداً يجسد عظمة العمارة الإسلامية، ولا يتوقف الأمر عند ذلك، حيث تحتوى الجبانة الفاطمية أيضاً على مقامات رمزية لآل البيت وأولياء الله الصالحين. وأطلق على الجبانة الإسلامية الفاطمية (القباب الفاطمية) لكثرة القباب التى بنيت بها والتى تعود إلى العصر الفاطمى فى فتراته المختلفة", "image": "src='https://upload.wikimedia.org/wikipedia/commons/5/55/St._Mark_Coptic_Orthodox_Church_%28Los_Angeles%29.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.775375209275303, 27.275927727790901, 33.775375209275303 ] } },
  { "type": "Feature", "properties": { "x": 33.074110146600901, "y": 28.367169268914601, "Number": 31, "Name": "كنيسة الشهيد العظيم مارجرجس برأس غارب ايبارشية البحر الأحمر", "Latitude": 28.367169268914601, "Longitude": 33.074110146600901, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Church of the Great Martyr George in Ras Ghareb, Red Sea Diocese", "MVV": null, "Access": null, "Description": "\"مأذنة بلال\" أثر إسلامى يرجع تاريخه إلى العصر الفاطمي، تقع على الشاطئ الشرقي لبحيرة خزان أسوان وجنوب قرية الشلال، ومن خلال السعي لمعرفة مدى أهميتها في العصور القديمة والهدف من إنشاءها، يتضح لنا براعة الجيش الإسلامى في التصدي للأعداء وحماية الدولة، وعلى الرغم من قيمتها التاريخية إلا أنها لم يتم وضعها حتى الوقت الحالي على الخريطة السياحية، وليس هذا فقط بل أنها مغمورة والعديد من أهالي المحافظة وزائروها لا يعرفون عنها شيئًا.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNujwAJitTGysOmLGoChqXyg0QGHtX6mMAfhzpg=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.074110146600901, 28.367169268914601, 33.074110146600901 ] } },
  { "type": "Feature", "properties": { "x": 34.636184037303202, "y": 24.200556954768501, "Number": 32, "Name": "مسجد أبو الحسن الشاذلى", "Latitude": 24.200556954768501, "Longitude": 34.636184037303202, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Abu Al-Hassan Al-Shazly Mosque", "MVV": null, "Access": null, "Description": " يقع هذا المسجد بمدينة طهطا وقد شيده الشيخ جلال الدين أبو القاسم بن عبد العزيز بن يوسف التلمساني الذي ينسب إلى سيدنا الحسين، ويرجح أن تاريخ هذا المسجد يرجع إلي القرن السابع الهجري وأعيد تجديده سنة 1273 هـ، ويعد هذا المسجد تحفة معمارية وفنية كبيرة.", "image": "src='https://mediaaws.almasryalyoum.com/news/verylarge/2016/03/24/437141_0.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.636184037303202, 24.200556954768501, 34.636184037303202 ] } },
  { "type": "Feature", "properties": { "x": 32.3499667, "y": 28.920694561010102, "Number": 33, "Name": "دير سانت انتونى", "Latitude": 28.920694561010102, "Longitude": 32.3499667, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Monastery of Saint Anthony", "MVV": null, "Access": null, "Description": "يقع دير سانت انتوني في قلب الصحراء وأسفل أحد الكهوف القديمة، ويُعتقد أنه أقدم دير في العالم، ويُعتبر من الوجهات المميّزة التي تجذب الكثير من السياح على مدار العام، حيث يحتضن مجموعة من اللوحات التي تُمثّل الفن القبطي القديم من القرن السادس عشر الميلادي، كما يضم مكتبة فيها أقدم نموذج من اللغة القبطية", "image": "src='https://media.safarway.com/content/b070d01f-25a1-4d7b-a646-8e7204fa457e_lg.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.3499667, 28.920694561010102, 32.3499667 ] } },
  { "type": "Feature", "properties": { "x": 32.548992664965603, "y": 28.858853493851601, "Number": 34, "Name": "دير القديس بولا", "Latitude": 28.858853493851601, "Longitude": 32.548992664965603, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Monastery of Saint Paul", "MVV": null, "Access": null, "Description": "تأسس دير القديس بول أو دير انبا بولا في القرن الرابع الميلادي، وهو من المزارات الأثرية التي تجذب أعداداً كبيرةً من السياح كل عام، ويضم 3 كنائس أثرية مُشيّدة فوق المغارة التي عاش فيها القديس بولا، كما يحتضن عين ماء وصوامع للسكن والعبادة ومجموعة من الأدوات التي يستخدمها الرهبان الذين يعيشون فيه إلى يومنا هذا.", "image": "src='https://lh5.googleusercontent.com/p/AF1QipOhqkPFvN9qeko6zJy31lleey4SeDpXJGnNAA6e=w408-h272-k-no'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.548992664965603, 28.858853493851601, 32.548992664965603 ] } },
  { "type": "Feature", "properties": { "x": 34.285884793171903, "y": 26.103960184458501, "Number": 35, "Name": "مسجد الفران", "Latitude": 26.103960184458501, "Longitude": 34.285884793171903, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Al-Fran Mosque", "MVV": null, "Access": null, "Description": "مسجد شيخ الفران هو أقدم مسجد في القصير، ويقع هذا المسجد في الجزء القديم من المدينة، وتحيط به المباني التاريخية من جميع الاتجاهات. ويتميز هذا المسجد بأنه ساحر وسينقلك عند خولك إلى حقبة تاريخية ماضية، وذلك لأن أعمال الترميم في المسجد تمت بإتقان مع الحرص على عدم إزالة البعد التاريخي للمكان.", "image": "src='https://gate.ahram.org.eg/Media/Massai/News///19-2022-637861891467768837-776.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.285884793171903, 26.103960184458501, 34.285884793171903 ] } },
  { "type": "Feature", "properties": { "x": 33.842960696148801, "y": 27.229536788574801, "Number": 36, "Name": "مسجد المينا", "Latitude": 27.229536788574801, "Longitude": 33.842960696148801, "Type": "محافظة البحر الأحمر", "Address": null, "Hours": null, "MustSee": "Elmina Mosque", "MVV": null, "Access": null, "Description": "مسجد الميناء أو ما يسمى بالمسج السماوي هو أحد أشهر مساجد مدينة الغردقة وأجملها من ناحية معمارية، تم بناؤه على يد شاه جهان بين عامي 1631م و1640م وتم افتتاحه عام 2012م وأقيم على مساحة 8 آلاف متر بتكلفة 20 مليون جنيه مصري. يقع هذا المسجد على البحر مباشرة ويتسع لحوالي 10 آلاف مصلي في آن واحد، وهو مبنيّ من الرخام الأبيض بشكل كامل وفيه الكثير من الزخارف والكتابات الدينية في الداخل ويضم مئذنتين شاهقتين و25 قبة وقاعة خاصة بالمناسبات الدينية وأخرى للمحاضرات والاجتماعات، وهناك ساحة كبيرة أمامه", "image": "src='http://photos.wikimapia.org/p/00/02/76/82/12_big.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.842960696148801, 27.229536788574801, 33.842960696148801 ] } },
  { "type": "Feature", "properties": { "x": 32.480642956997798, "y": 25.3704157629066, "Number": 21, "Name": "دير الفاخـورى/ ديـر الشــهداء ", "Latitude": 25.3704157629066, "Longitude": 32.480642956997798, "Type": "محافظة الأقصر", "Address": null, "Hours": null, "MustSee": "Monastery of Al-Fakhouri/ Monastery of the Martyrs", "MVV": null, "Access": null, "Description": null, "image": "src='https://img.youm7.com/ArticleImgs/2021/10/26/109854-%D8%AA%D8%B1%D9%85%D9%8A%D9%85%D8%A7%D8%AA-%D8%A3%D8%B3%D9%88%D8%A7%D8%B1-%D8%AF%D9%8A%D8%B1-%D8%A7%D9%84%D8%A3%D9%86%D8%A8%D8%A7-%D9%85%D8%AA%D8%A7%D8%A4%D8%B3-%D8%A7%D9%84%D9%81%D8%A7%D8%AE%D9%88%D8%B1%D9%8A-%D8%A8%D8%A5%D8%B3%D9%86%D8%A7.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.480642956997798, 25.3704157629066, 32.480642956997798 ] } },
  { "type": "Feature", "properties": { "x": 32.639776005555497, "y": 25.699897070990399, "Number": 22, "Name": "مسجد سيدي أبو الحجاج", "Latitude": 25.699897070990399, "Longitude": 32.639776005555497, "Type": "محافظة الأقصر", "Address": null, "Hours": null, "MustSee": "Sidi Abul Hajjaj Mosque", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipM5pHrTVlGvrN7p3MlU0zmSUFNI5YH4nXpd4NMN=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.639776005555497, 25.699897070990399, 32.639776005555497 ] } },
  { "type": "Feature", "properties": { "x": 32.576900726708701, "y": 25.398659963339501, "Number": 23, "Name": "المسجد العتيق باسنا", "Latitude": 25.398659963339501, "Longitude": 32.576900726708701, "Type": "محافظة الأقصر", "Address": null, "Hours": null, "MustSee": "The ancient mosque Basna", "MVV": null, "Access": null, "Description": null, "image": "src='https://lh3.googleusercontent.com/p/AF1QipMTV5rjyFhSzd7XibR9mHyriCEOuiBguYfEUDMq=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.576900726708701, 25.398659963339501, 32.576900726708701 ] } }
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