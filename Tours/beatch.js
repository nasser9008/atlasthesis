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
  "name": "beatch",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 34.738039843937699, "y": 25.337885402844002, "Number": 1, "Name": "شاطئ ابو دباب", "Latitude": 25.337885402844002, "Longitude": 34.738039843937699, "Type": null, "Address": null, "Hours": null, "MustSee": "Abu Dabab Beach", "MVV": null, "Access": null, "Description": "من أشهر معالم مرسى علم بل من اجمل الاماكن في مرسى علم التي يفد إليها السياح من كل مكان للاستمتاع برحلة غوص مُثيرة بين أسراب الأسماك والحشائش والمخلوقات البحرية والشعاب المُرجانية الخلابة والنادرة مثل عروس البحر والسلاحف البحرية.", "image": "src='https://al-rahhala.com/wp-content/uploads/2019/06/%D9%85%D8%B1%D8%B3%D9%89-%D8%B9%D9%84%D9%85-2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.738039843937699, 25.337885402844002, 34.738039843937699 ] } },
  { "type": "Feature", "properties": { "x": 35.098823230687898, "y": 24.475424751442802, "Number": 2, "Name": "محمية وادي الجمال", "Latitude": 24.475424751442802, "Longitude": 35.098823230687898, "Type": null, "Address": null, "Hours": null, "MustSee": "Wadi El Gemal Reserve", "MVV": null, "Access": null, "Description": "تتمتع المحمية بمقومات بيئية وجمالية وعلمية وثقافية فريدة ومتميزة للتراث الطبيعى بمصر وتتمثل العناصر الطبيعية فى المجتمعات النباتية الفريدة المنتشرة بها كما أن الوادى يضم العديد من الأنواع النادرة والمهددة بالانقراض من النباتات والحيوانات بالإضافة لتجمعات المانجروف الممتدة على طول سواحل المنطقة وأفضل الشعاب المرجانية والحشائش البحرية التى هى مأوى لبعض من الكائنات البحرية مثل عروس البحر والسلاحف البحرية وبيئة مناسبة لتكاثر الأسماك واللافقاريات وكل هذا يلعب دوراً كبيراً ومهماً للنظام البيئى بالمنطقة .", "image": "src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nature_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%87.jpg/1920px-Nature_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%87.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.098823230687898, 24.475424751442802, 35.098823230687898 ] } },
  { "type": "Feature", "properties": { "x": 35.116574776719901, "y": 24.612648217954298, "Number": 3, "Name": "شاطئ شرم اللولي", "Latitude": 24.612648217954298, "Longitude": 35.116574776719901, "Type": null, "Address": null, "Hours": null, "MustSee": "Sharm El Luli Beach", "MVV": null, "Access": null, "Description": "يقع شاطئ شرم اللولى \"حنكوراب\" داخل نطاق محمية وادى الجمال الشهيرة يتميز بنقاء وصفاء المياه فيه والرمال البيضاء، وكذلك بعدم وجود صخور، وفى تناسب المياه بالنسبة للعمق تدريجيًا .", "image": "src='https://www.urtrips.com/wp-content/uploads/2018/10/Sharm-ElLuli-0.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.116574776719901, 24.612648217954298, 35.116574776719901 ] } },
  { "type": "Feature", "properties": { "x": 34.9398419040131, "y": 25.002299998489899, "Number": 4, "Name": "شاطئ بحيرة النيزك", "Latitude": 25.002299998489899, "Longitude": 34.9398419040131, "Type": null, "Address": null, "Hours": null, "MustSee": "Meteor Lake shore", "MVV": null, "Access": null, "Description": "بحيرة النيزك هي واحدة من البقع الساحرة في مصر، المرتبطة بالأساطير، وجمال الطبيعة، وسحر المياه الفيروزية على شاطئ البحر الأحمر، فهي من البحيرات ذات المياه الصافية، التي تقع بمنطقة مرسى علم، فهي عبارة عن حمام سباحة طبيعي، ولا يزيد عمق الماء فيها على 8 أمتار.", "image": "src='https://blog.travil.io/webroot/uploads/wwwwwwwww.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.9398419040131, 25.002299998489899, 34.9398419040131 ] } },
  { "type": "Feature", "properties": { "x": 34.926147368377599, "y": 25.012845499011501, "Number": 5, "Name": "بيت الدولفين (محمية صامداي)", "Latitude": 25.012845499011501, "Longitude": 34.926147368377599, "Type": null, "Address": null, "Hours": null, "MustSee": "Dolphin House (Samaday Sanctuary)", "MVV": null, "Access": null, "Description": "بيت الدولفين أو  Sha’ab Samadai Reef هو أشهر مكان للغطس في مرسي علم،  ميزته الكبيرة هو قربة الشديد من المنطقة وسهولة الوصول له،  بالإضافة للشعاب المرجانية اللي تعتبر بيت الدلافين ", "image": "src='https://blog.travil.io/webroot/uploads/maxresdefault_(6).jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.926147368377599, 25.012845499011501, 34.926147368377599 ] } },
  { "type": "Feature", "properties": { "x": 35.489104980787602, "y": 23.968202583794401, "Number": 6, "Name": "قرية برنيس", "Latitude": 23.968202583794401, "Longitude": 35.489104980787602, "Type": null, "Address": null, "Hours": null, "MustSee": "Bernice Village", "MVV": null, "Access": null, "Description": "تتميز القرية بجمالها وشواطئها الساحرة وينابيعها الساخنة والتي يلجأ إليها العديد للعلاج بالرمال وبمياه ينابيعها الساخنة.", "image": "src='https://lh5.googleusercontent.com/p/AF1QipPkF0smuKjg1ToZD-7IODvU3HfEb32ILtA6Wtf_=w408-h725-k-no'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.489104980787602, 23.968202583794401, 35.489104980787602 ] } },
  { "type": "Feature", "properties": { "x": 35.205824904606203, "y": 24.454129929016801, "Number": 7, "Name": "حطام أبو غصون", "Latitude": 24.454129929016801, "Longitude": 35.205824904606203, "Type": null, "Address": null, "Hours": null, "MustSee": "The wreckage of Abu Ghusun", "MVV": null, "Access": null, "Description": "سميت المنطقة بحطام أبو غصون نسبة إلى موقع حطام سفينة أبو غصون التي تسبب بغرقها عاصفة قوية مما جعلها تصطدم بحاجز حجري مما أدى إلى انقسامها إلى شقين.تحول حطام هذه السفينة إلى موطن للعديد من الأسماك المتنوعة والمخلوقات البحرية الرائعة الموجودة في المنطقة.\n", "image": "src='https://my.divessi.com/img.php?s=ds&t=img&q=big&id=15415&site=15755'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.205824904606203, 24.454129929016801, 35.205824904606203 ] } },
  { "type": "Feature", "properties": { "x": 34.8593479900115, "y": 25.314582388912999, "Number": 8, "Name": "شعاب الفينستون", "Latitude": 25.314582388912999, "Longitude": 34.8593479900115, "Type": null, "Address": null, "Hours": null, "MustSee": "Elfinston Reef", "MVV": null, "Access": null, "Description": "منطقة شعاب الفنستون هي أحد أفضل أماكن الغوص في العالم، وهي عبارة عن شعاب مرجانية بحرية تقدم غوصًا رائعًا على الجدران مع شعاب مرجانية رائعة وحياة بحرية مذهلة، يشتهر هذا المكان بالمواجهات المنتظمة مع أسماك القرش المطرقة والقرش المحيطي الخطير لذلك هذا الموقع مخصص للغواصين ذوي الخبرة فقط.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipM0Xd_Vw1Xu3nHx-DWqyBXrshYyqMNI9P2jdBEr=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.8593479900115, 25.314582388912999, 34.8593479900115 ] } },
  { "type": "Feature", "properties": { "x": 34.635710374314399, "y": 25.532579625979299, "Number": 9, "Name": "بورت غالب", "Latitude": 25.532579625979299, "Longitude": 34.635710374314399, "Type": null, "Address": null, "Hours": null, "MustSee": "Port Ghalib", "MVV": null, "Access": null, "Description": "من أكثر معالم مرسى علم مصر جذبًا لأنظار السياح حيث الاستمتاع بأفضل أجواء الترفيه والمرح في واحد من أشهر وأكبر مُنتجعات مصر على مساحة 8 مليون متر مربع، حيث يتميّز المنتجع بضمّه لمجموعة من أفضل مواقع الغوص بين الأسماك النادرة والشعاب المرجانية الخلابة مع سباقات الزوارق التي تُقام فيه من وقت لآخر.", "image": "src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/PortGhalibMarina.jpg/280px-PortGhalibMarina.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.635710374314399, 25.532579625979299, 34.635710374314399 ] } },
  { "type": "Feature", "properties": { "x": 33.926736993551003, "y": 27.210756168357801, "Number": 10, "Name": "شاطئ اورانج باي", "Latitude": 27.210756168357801, "Longitude": 33.926736993551003, "Type": null, "Address": null, "Hours": null, "MustSee": "Orange Bay Beach", "MVV": null, "Access": null, "Description": "شاطئ رملي طويل على جزيرة يتميّز بمياه صافية ويشتهر بأنشطة الغوص السطحي والسباحة ومطاعم في الهواء الطلق ويقع شاطئ جزيرة أورانج باي في جزيرة الجفتون، وهي محمية طبيعية في البحر الأحمر بمصر. مساحة الشاطئ حولي ١٥٠٠ كيلو متر", "image": "src='https://media.safarway.com/content/8929ace2-e4e6-4eff-b1a9-464f62cd972f_lg.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.926736993551003, 27.210756168357801, 33.926736993551003 ] } },
  { "type": "Feature", "properties": { "x": 33.850676152819197, "y": 27.202223030316201, "Number": 11, "Name": "شاطئ محمية", "Latitude": 27.202223030316201, "Longitude": 33.850676152819197, "Type": null, "Address": null, "Hours": null, "MustSee": "A protected beach", "MVV": null, "Access": null, "Description": null, "image": "src='https://www.urtrips.com/wp-content/uploads/2022/09/orange-bay-beach-hurghada-3-1024x609.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.850676152819197, 27.202223030316201, 33.850676152819197 ] } },
  { "type": "Feature", "properties": { "x": 33.904257954830001, "y": 27.239286289461301, "Number": 12, "Name": "شاطئ جزيرة محمية", "Latitude": 27.239286289461301, "Longitude": 33.904257954830001, "Type": null, "Address": null, "Hours": null, "MustSee": "Protected island beach", "MVV": null, "Access": null, "Description": null, "image": "src='https://www.urtrips.com/wp-content/uploads/2022/09/mahmya-island-beach-hurghada-1-768x576.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.904257954830001, 27.239286289461301, 33.904257954830001 ] } },
  { "type": "Feature", "properties": { "x": 33.842339027064199, "y": 27.213276323182299, "Number": 13, "Name": "شاطئ أورانج", "Latitude": 27.213276323182299, "Longitude": 33.842339027064199, "Type": null, "Address": null, "Hours": null, "MustSee": "Orange Beach", "MVV": null, "Access": null, "Description": null, "image": "src='https://media.safarway.com/content/b53c2e67-bae1-4318-a22c-2337b07c99fc_lg.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.842339027064199, 27.213276323182299, 33.842339027064199 ] } },
  { "type": "Feature", "properties": { "x": 33.842634605157997, "y": 27.221275690417102, "Number": 14, "Name": "شاطئ السواقي", "Latitude": 27.221275690417102, "Longitude": 33.842634605157997, "Type": null, "Address": null, "Hours": null, "MustSee": "Al-Sawaqi Beach", "MVV": null, "Access": null, "Description": "أحد أجمل شواطئ الغردقة، يتواجد في حي الدهار ويمتاز بمياه الصافية ورماله الذهبية، ويمكن للسُيّاح الاستمتاع بالقيام بالعديد من الأنشطة الشاطئية كالسباحة والغطس أو الاسترخاء تحت المظلات الشاطئية وقضاء بعض الوقت المُمتع.", "image": "src='https://www.urtrips.com/wp-content/uploads/2022/09/el-sawaky-beach-hurghada-1-edited.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.842634605157997, 27.221275690417102, 33.842634605157997 ] } },
  { "type": "Feature", "properties": { "x": 33.979424148416697, "y": 26.855430887314999, "Number": 15, "Name": "شاطئ وايت", "Latitude": 26.855430887314999, "Longitude": 33.979424148416697, "Type": null, "Address": null, "Hours": null, "MustSee": "White Beach", "MVV": null, "Access": null, "Description": null, "image": "src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Whitsunday_Island_-_Whitehaven_Beach_02.jpg/220px-Whitsunday_Island_-_Whitehaven_Beach_02.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.979424148416697, 26.855430887314999, 33.979424148416697 ] } },
  { "type": "Feature", "properties": { "x": 33.839548259795698, "y": 27.194757164376401, "Number": 16, "Name": "شاطئ أولد فيك", "Latitude": 27.194757164376401, "Longitude": 33.839548259795698, "Type": null, "Address": null, "Hours": null, "MustSee": "Old Vic Beach", "MVV": null, "Access": null, "Description": null, "image": "src='https://khoroga.com/uploads/458e9f6c6060.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.839548259795698, 27.194757164376401, 33.839548259795698 ] } },
  { "type": "Feature", "properties": { "x": 33.846292123266601, "y": 27.197808228639499, "Number": 17, "Name": "شاطئ الشيراتون", "Latitude": 27.197808228639499, "Longitude": 33.846292123266601, "Type": null, "Address": null, "Hours": null, "MustSee": "Sheraton Beach", "MVV": null, "Access": null, "Description": "من اكثر الشواطئ تميزا فى رماله ونظافة مياه البحر به ..يوجد به اكوا سنتر للالعاب المائية", "image": "src='https://www.sffar.com/wp-content/uploads/2018/10/%D9%81%D9%86%D8%AF%D9%82-%D8%B4%D9%8A%D8%B1%D8%A7%D8%AA%D9%88%D9%86-%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9-2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.846292123266601, 27.197808228639499, 33.846292123266601 ] } },
  { "type": "Feature", "properties": { "x": 33.872203269754898, "y": 27.2177921833458, "Number": 18, "Name": "جزيرة أبو منقار", "Latitude": 27.2177921833458, "Longitude": 33.872203269754898, "Type": null, "Address": null, "Hours": null, "MustSee": "Abu Beaker Island", "MVV": null, "Access": null, "Description": " تعد  أجمل جزيرة بحرية على ساحل البحر الأحمر، حيث تمتلك شواطئ رملية مميزة تفوق شواطئ الجزر الأخرى، وتقع تلك الجزيرة ضمن الجزر الواقعة داخل نطاق محمية الجزر الشمالية، وممنوع إقامة أى أنشطة على ظهرها، والمسموح به قيام أنشطة بمحيط شواطئها وليس على اليابسة منها.", "image": "src='https://www.wijhatok.com/wp-content/uploads/2022/03/kevin-et-laurianne-langlais-lPUdX9V6Pt0-unsplash-1024x683.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.872203269754898, 27.2177921833458, 33.872203269754898 ] } },
  { "type": "Feature", "properties": { "x": 35.307963302934098, "y": 24.358907706291699, "Number": 19, "Name": "شاطى قلعان المانجروف", "Latitude": 24.358907706291699, "Longitude": 35.307963302934098, "Type": null, "Address": null, "Hours": null, "MustSee": "Mangrove castles beach", "MVV": null, "Access": null, "Description": "يتميز  بمقومات بيئية وجمالية وعلمية وثقافية فريدة تقطن بالقرب من شواطئها تجمعات بدوية تنتمى لقبيلة العبابدة، كما تعتبر شواطئها من أكثر الشواطئ التى تتكاثر بها الأسماك والحيوانات البحرية النادرة من بينها حيوان عروس البحر الثدى النادر.", "image": "src='https://www.elbalad.news/UploadCache/libfiles/786/0/600x338o/459.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.307963302934098, 24.358907706291699, 35.307963302934098 ] } },
  { "type": "Feature", "properties": { "x": 33.962263048443297, "y": 26.898794982649001, "Number": 20, "Name": "شاطئ شرم الناقة", "Latitude": 26.898794982649001, "Longitude": 33.962263048443297, "Type": null, "Address": null, "Hours": null, "MustSee": "Sharm El Naga Beach", "MVV": null, "Access": null, "Description": "تعد محمية شرم الناقة من اجمل المناطق السياحية للاستجمام و الاستمتاع بالانشطة البحرية المميزة فى هذة المنطقة الغنية جدا بالحياة البحرية الخلابة. حيث ستجد مجموعة خلابة من الشعاب المرجانية التى تعتبر موطن للعديد من الكائنات البحرية حيث يعد المكان من افضل الوجهات لمحبى السنوركلينج و الغوص", "image": "src='https://i0.wp.com/landioustravel.com/wp-content/uploads/2019/06/%D8%B1%D8%AD%D9%84%D8%A9-%D8%B4%D8%B1%D9%85-%D8%A7%D9%84%D9%86%D8%A7%D9%82%D8%A9-%D8%A7%D9%84%D9%81%D8%B1%D8%AF%D9%8A%D8%A9-%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9-e1618722908365.jpeg?fit=1207%2C675&ssl=1'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.962263048443297, 26.898794982649001, 33.962263048443297 ] } },
  { "type": "Feature", "properties": { "x": 33.962209404352699, "y": 26.8988099415498, "Number": 21, "Name": "شاطئ شرم النجا", "Latitude": 26.8988099415498, "Longitude": 33.962209404352699, "Type": null, "Address": null, "Hours": null, "MustSee": "Sharm el-Naga beach", "MVV": null, "Access": null, "Description": "يقع على بعد عدة كيلومترات من شمال سفاجا ويتميز بالشعاب المرجانية والمناظر الساحرة ", "image": "src='https://lh5.googleusercontent.com/p/AF1QipN3BxM8TUpMDPVSbOyYt7LqOdyHW0zU3yoh6F4w=w425-h240-k-no'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.962209404352699, 26.8988099415498, 33.962209404352699 ] } }
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
