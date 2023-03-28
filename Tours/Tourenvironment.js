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
  "name": "csvenvgeojson",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 32.6574784741629, "y": 25.720534132848499, "Number": 28, "Name": "المتحف المفتوح بالكرنك", "Latitude": 25.720534132848499, "Longitude": 32.6574784741629, "Type": null, "Address": "محافظة الأقصر", "Hours": "السياحة البيئية", "MustSee": "Karnak Open Museum", "MVV": null, "Access": "متاحف", "Description": "يقع داخل محيط معابد الكرنك، ويضم عدداً من المقاصير المهمة من عصر الدولة الوسطى مثل «المقصورة البيضاء» الخاصة بالملك سنوسرت الأول، بالإضافة إلى مقصورتين من عصر الدولة الحديثة وهما «المقصورة المرمرية» الخاصة بالملك أمنحوتب الأول، و«المقصورة الحمراء» الخاصة بالملكة حتشبسوت، ويضم المتحف أيضاً الكثير من القطع الأثرية مثل تماثيل قرود البابون، وعدداً من الأبواب الوهمية، وغيرها من الآثار الحجرية الضخمة", "image": "src='https://i0.wp.com/maeloma.com/wp-content/uploads/2021/07/FB_IMG_1626938333683.jpg?resize=720%2C588&ssl=1'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.6574784741629, 25.720534132848499, 25.720534132848499 ] } },
  { "type": "Feature", "properties": { "x": 32.517515659218297, "y": 25.498906543312302, "Number": 29, "Name": "محمية الدبابية ", "Latitude": 25.498906543312302, "Longitude": 32.517515659218297, "Type": null, "Address": "محافظة الأقصر", "Hours": "السياحة البيئية", "MustSee": "Dababiya Reserve", "MVV": null, "Access": "محمية طبيعية", "Description": "هي محمية جيولوجية تتبع مركز اسنا بمحافظة الأقصر ، وتمثل قطاعًا جيولوجيًا نموذجيًا على المستوى الدولى كما أنها تعتبر مقياسًا زمنيًا يمثل أكمل القطاعات الطبقية فى العالم التى شهدت البداية الفعلية للأحياء الحديثة فى الكرة الأرضية ، كما أن هذا القطاع النموذجى يؤدى إلى تحديد عمر الأرض بدقة من خلال تحديد أعمار التتابعات الرسوبية البحرية المتوافقة وكذلك تعيين المنطقة النموذجية لمثل هذه التتابعات وتحديد ظروف ترسيبها والأحياء المميزة لها وأعمارها لكى تكون بمثابة مقياس لكل عصر من العصور.", "image": "src='https://img.youm7.com/ArticleImgs/2022/1/9/70482-%D8%A7%D9%84%D8%A7%D8%B7%D9%81%D8%A7%D9%84-%D9%81%D9%89-%D8%B2%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA%D9%87%D9%85-%D9%84%D9%85%D8%AD%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%AF%D8%A8%D8%A7%D8%A8%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A%D8%A9.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.517515659218297, 25.498906543312302, 25.498906543312302 ] } },
  { "type": "Feature", "properties": { "x": 33.821766059746302, "y": 27.134999664258899, "Number": 1, "Name": "معرض الأحياء المائية", "Latitude": 27.134999664258899, "Longitude": 33.821766059746302, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Aquarium exhibition", "MVV": null, "Access": "متاحف", "Description": "يقع حوض السمك الكبير او جراند أكواريوم الغردقة في مدينة الغردقة وهو عالم كبير من الأحياء البحرية الرائعة، حيث يمكنك التعرّف على  أكثر من 1200 حيوان بحري من أكثر من 1000 نوع موزعة في 22 معرض مختلف، ومن هذه الحيوانات: السلاحف والأسماك بأنواعها وألوانها الرائعة والتماسيح وغيرها الكثير. كل هذه المعارض رائعة بحد ذاتها، حيث تشتمل على مشاريع العلوم والبحوث البحرية المتنوعة وبرامج التكاثر والحفاظ على الحيوانات البحرية والكائنات البحرية المهددة بالانقراض، والجهود المتواصلة لتوعية الزوار بأهمية المحيط.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipMCPKscuPjwbLPLC_OYAQnsIfe34RRuWZ8NM5Ag=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.821766059746302, 27.134999664258899, 27.134999664258899 ] } },
  { "type": "Feature", "properties": { "x": 33.841732629388403, "y": 27.221511051640299, "Number": 3, "Name": "محمية الجزر الشمالية", "Latitude": 27.221511051640299, "Longitude": 33.841732629388403, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Northern Islands Reserve", "MVV": null, "Access": null, "Description": "تقع محمية الجزر الشمالية شمال محافظة البحر الأحمر وتم إعلانها محمية طبيعة عام 2006.  - تضم قرابة 16 جزيرة متنوعة، تشكل تلك الجزر موقعا هاما لتكاثر العديد من الكائنات البحرية النادرة مثل السلاحف الخضراء.  - من المحميات الهامة والمعروفة على مستوى العالم، ومصدر جذب الآلاف منم السياح حول العالم لضمها عدة مواقع غوص مهمة ومميزة وفريدة.  - تبلغ مساحتها 2000 كيلو متر مربع، جميع الجزر الواقعة فى نطاقها تقع فى أماكن ضحلة وحتى عمق 100 متر، وأدى ذلك إلى أن جميع المياه المحيطة بها تحتوى على مساحات شاسعة من الشعاب المرجانية.  - تضم مناطق الشعاب الشهيرة التى أصبحت فيما بعد أهم مواقع الغوص وأكثرها شهرة حول العالم، منطقة شعاب مرجانية نادرة تسمى \"شعاب العرق والفانوس\".  - تقيم بها أسراب كبيرة من الدلافين إقامة دائمة، جعلها مقصدا هاما وموقعاً مميزاً للغطس لأغلب السياح من جنسيات العالم.  - تسمي شعاب العرق والفانوس \"جنة محمية الجزر الشمالية\" لما تحتويه من شعاب مرجانية نادرة قد يصل عمرها لملايين السنين.", "image": "src='https://mediaaws.almasryalyoum.com/news/verylarge/2016/08/28/510034_0.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.841732629388403, 27.221511051640299, 27.221511051640299 ] } },
  { "type": "Feature", "properties": { "x": 34.440571826402298, "y": 25.835370141770099, "Number": 4, "Name": "غابات المانجروف", "Latitude": 25.835370141770099, "Longitude": 34.440571826402298, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.440571826402298, 25.835370141770099, 25.835370141770099 ] } },
  { "type": "Feature", "properties": { "x": 34.414959241746899, "y": 25.8674309036431, "Number": 5, "Name": "غابات المانجروف", "Latitude": 25.8674309036431, "Longitude": 34.414959241746899, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.414959241746899, 25.8674309036431, 25.8674309036431 ] } },
  { "type": "Feature", "properties": { "x": 35.414998884042298, "y": 24.2229435768907, "Number": 6, "Name": "غابات المانجروف", "Latitude": 24.2229435768907, "Longitude": 35.414998884042298, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.414998884042298, 24.2229435768907, 24.2229435768907 ] } },
  { "type": "Feature", "properties": { "x": 35.341790855208203, "y": 24.323940984041698, "Number": 7, "Name": "غابات المانجروف", "Latitude": 24.323940984041698, "Longitude": 35.341790855208203, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.341790855208203, 24.323940984041698, 24.323940984041698 ] } },
  { "type": "Feature", "properties": { "x": 35.305330866848799, "y": 24.357923086390802, "Number": 8, "Name": "غابات المانجروف", "Latitude": 24.357923086390802, "Longitude": 35.305330866848799, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.305330866848799, 24.357923086390802, 24.357923086390802 ] } },
  { "type": "Feature", "properties": { "x": 34.414851111059001, "y": 25.8673186421757, "Number": 9, "Name": "غابات المانجروف", "Latitude": 25.8673186421757, "Longitude": 34.414851111059001, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.414851111059001, 25.8673186421757, 25.8673186421757 ] } },
  { "type": "Feature", "properties": { "x": 33.680569692360798, "y": 27.406067571764002, "Number": 10, "Name": "غابات المانجروف", "Latitude": 27.406067571764002, "Longitude": 33.680569692360798, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "mangrove forests", "MVV": null, "Access": null, "Description": "تعد غابات المانجروف من أكثر المناطق جذبا للسياحة وتمتلك مصر في المنطقة الواقعة شمال ساحل البحر الأحمر وفي منطقة مرسى علم الكثير من أشجار المانجروف من النوع الرمادي، حيث يبلغ ارتفاع الواحدة منها من 3 إلى 8م، كما أن لها الكثير من الجذور التي تنمو فوق الأرض، وأوراقاً خضراء داكنة وغالبًا ما تكون مغطاة بالأملاح. تحتوي غابات المانجروف على تنوع هائل من أشجار المانجروف والحياة البحرية المتنوعة ومنها الطيور، والشعاب المرجانية والحشائش البحرية والأسماك الملونة وأسماك القرش وعروس البحر والدرافيل وغيرها من الكائنات البحرية النادرة.", "image": "src='https://alwafd.news/images/thumbs/752/news/fc310495e97deee03f2162b2b7f0dcab.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.680569692360798, 27.406067571764002, 27.406067571764002 ] } },
  { "type": "Feature", "properties": { "x": 36.332990136904201, "y": 22.202184070020898, "Number": 11, "Name": "محمية علبه", "Latitude": 22.202184070020898, "Longitude": 36.332990136904201, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Packet protected", "MVV": null, "Access": "محمية طبيعية", "Description": "تقع منطقة محمية علبة الطبيعية في الجزء الجنوبي الشرقي من الصحراء الشرقية وتقع جبالها علي الحدود المشتركة بين مصر والسودان علي البحر الأحمر وتتكون هذه المجموعة من الجبال من صخور الجرانيت وصخور القاعدة.   التنوع البيئي :   تشتمل منطقة جبال علبة على النماذج البيئية المتميزة التالية :-   - غابات الشوارة والقنديل \"مانجروف \" في النطاقات الساحلية .   - مناطق محدودة من الكثبان الرملية الساحلية ينمو عليها حشائش مدارية ساحلية .   - نطاقات الأرض المحلة الساحلية \" السنجات الساحلية\" .   - السهل الساحلي الصحراوي .   - الجبال الساحلية والتلال المحيطة بها وتوجد في هذه المنطقة مئات الأنواع النباتية والحيوانية المحلية ومجموعة الأنواع التي يمتد توزيعها من الهضبة الأثيوبية .   * جزر البحر الأحمر وغابات المانجروف الساحلية :  وهي ذات أهمية لتكاثر السلاحف البحرية المهددة بالانقراض والطيور البحرية النادرة .   * منطقة الأبرق:  وتقع بين ساحل البحر الأحمر شرقا وحتى طول 30-33 غربا وخطوط عرض 15-24 شمال الي 23 جنوبا وتتميز باحتوائها علي العديد من الوديان والسهول والجبال والهضاب التي تعتبر بيئات ومواطن طبيعية للعديد من الحيوانات البرية وبها مناطق ذات أثار تاريخية هامة .   * منطقة الدئيب:  وتقع بين خطوط طول 36 درجة شرقا 37- 33 درجة غربا وخطوط عرض 33 درجة شمال الي 22 درجة جنوبا وهي تحتوي علي نباتات برية بوديانها وسهولها .   * جبل علبة :  ويشمل المنطقة الواقعة بين ساحل البحر الأحمر شرقا وحتى خط طول 36 غربا وخطوط العرض 30-23 درجة شمال حتي 22 درجة جنوبا وتتميز باحتوائها علي جبل علبة الذي يعتبر بيئة جبلية تحتوي علي غابات ونباتات برية نادرة وأنواع كثيرة من الحيونات والطيور والزواحف البرية.   مميزات الحياة البرية بمنطقة جبل علبة الطبيعية:   * تتميز بالتنوع الشديد من النباتات حيث يزيد عدد أنواع النباتات بها عن 350 نوعا والتي تجعل منها حدائق خضراء طبيعية متعددة الأشكال والألوان وأهم هذه الأنواع النباتية في منطقة جبل علبة حوالي 135 نوعا من النبتات الحولية، وحوالي 140 نوعا من النبتات الدائمة .   * يتميز جبل علبة بوجود نبات الأبنط الذي ينمو علي ارتفاعات عالية ولايوجد في مصر إلا في هذه المنطقة .   * تتميز محميات منطقة علبة باحتوائها علي عديد من الحيوانات البرية المصرية ومن أهم هذه الأنواع النادرة التي توجد بالمنطقة: الماعز الجبلي والحمار البري والغزال المصري والأرنب الجبلي والسوبر وثعلب المل والكبش الأوروبي الذي انقرض منذ عام 1972 وعروسة البحر والنعام والرحمة المصرية والعقاب النسارية والقط البري والقنفد .   * تتنشر العديد من الطيور الأخري الجارحة مثل: الصقور والنسور والغراب والنواحي والدقناش وكثير من الطيور الأخري مثل: القنابر والحمام الجبلي واليمام، ومن الطيور البحرية أبو بلحة والبلشونات والنورس، كما توجد السلاحف البحرية منها السلحفاه صقرية المنقار والسلحفاة الخضراء، والزواحف البرية مثل: الوراد الجبلي الذي يتغذى علي الفئران والسحالي والحشرات، ويوجد أيضاً الغيب المصري والحبة القرنة والعقاب والحرباء.", "image": "src='http://yallabook.com/guide/uploade/files/170409_6e1e3d20fa.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 36.332990136904201, 22.202184070020898, 22.202184070020898 ] } },
  { "type": "Feature", "properties": { "x": 35.098909061375998, "y": 24.475737222496299, "Number": 12, "Name": "محمية وادي الجمال", "Latitude": 24.475737222496299, "Longitude": 35.098909061375998, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Wadi El Gemal Reserve", "MVV": null, "Access": "محمية طبيعية", "Description": "تعتبر منطقة وادى الجمال \"حماطة\" محمية طبيعية بمساحة إجمالية 7450 كم2 ، وتقع المنطقة فى الجنوب وتضم قطاعاً من ساحل البحر الأحمر طوله حوالى 60 كم بعمق متوسط حوالى 50 كم فى الصحراء الشرقية بالإضافة إلى حوالى 10 كم داخل المسطح المائى للبحر الأحمر .   تتمتع المحمية بمقومات بيئية وجمالية وعلمية وثقافية فريدة ومتميزة للتراث الطبيعى بمصر وتتمثل العناصر الطبيعية فى المجتمعات النباتية الفريدة المنتشرة بها كما أن الوادى يضم العديد من الأنواع النادرة والمهددة بالانقراض من النباتات والحيوانات بالإضافة لتجمعات المانجروف الممتدة على طول سواحل المنطقة وأفضل الشعاب المرجانية والحشائش البحرية التى هى مأوى لبعض من الكائنات البحرية مثل عروس البحر والسلاحف البحرية وبيئة مناسبة لتكاثر الأسماك واللافقاريات وكل هذا يلعب دوراً كبيراً ومهماً للنظام البيئى بالمنطقة .  تتوافر بالمنطقة التكوينات الجيولوجية وتزخر بالخامات التعدينية ذات القيمة الاقتصادية الغنية مثل الزمرد وأحجار الزينة والفلسبار والكوارتز والرصاص والمنجنيز والذهب ويتمثل التراث الحضارى فى آثار ما قبل التاريخ من رسومات صخرية تسجل انشطة الإنسان فى تلك الحقبة التاريخية، كما أنها تضم تحت ثراها رفات العارف بالله أبى الحسن الشاذلى والذى أصبح مزاراً سياحياً للمصريين والعرب والأجانب، ويوجد بالمنطقة قبائل العبابدة والبشارية الذين ترجع أصولهم إلى أقدم الشعوب التى عاشت بين البحر الأحمر والنيل الذين تتركز أنشطتهم فى الرعى واستغلال الأنواع النباتية فى الغذاء والتجارة .", "image": "src='https://www.annahar.com/ContentFilesArchive/308185Image1-1180x677_d.jpg?version=1959492'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 35.098909061375998, 24.475737222496299, 24.475737222496299 ] } },
  { "type": "Feature", "properties": { "x": 33.995959956605098, "y": 26.811966567475199, "Number": 13, "Name": "جزيرة يوتوبيا", "Latitude": 26.811966567475199, "Longitude": 33.995959956605098, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Utopia Island", "MVV": null, "Access": null, "Description": "جزيرة يوتوبيا ‏ هي جزيرة مصرية تقع شمال مدينة سفاجا بالبحر الأحمر وتبلغ مساحتها 1.5 كم² تقريباً، تتميز الجزيرة بأنها من الجزر القليلة الرملية وليس بها صخور حول شواطئها.", "image": "src='https://nemotourssharm.com/ar/wp-content/uploads/2019/01/utopia-beach-club-2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.995959956605098, 26.811966567475199, 26.811966567475199 ] } },
  { "type": "Feature", "properties": { "x": 33.981669055692798, "y": 26.757890421229298, "Number": 14, "Name": "جزيرة سفاجا", "Latitude": 26.757890421229298, "Longitude": 33.981669055692798, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Safaga Island", "MVV": null, "Access": null, "Description": "جزيرة سفاجا هي احدى جزر البحر الأحمر . وتقع في مواجهة ميناء سفاجا و تبلغ مساحتها نحو 13 كم2 يبلغ طول سواحلها نحو 35 كم و معنى ذلك أن كل كيلو متر مربع من مساحتها يقابله 7و2 كم من الساحل .", "image": "src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Kalawy_Magic_Life_01_2008.JPG/280px-Kalawy_Magic_Life_01_2008.JPG'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.981669055692798, 26.757890421229298, 26.757890421229298 ] } },
  { "type": "Feature", "properties": { "x": 33.8731903608181, "y": 27.2163798523043, "Number": 15, "Name": "جزيرة أبو منقار", "Latitude": 27.2163798523043, "Longitude": 33.8731903608181, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Abu Minqar", "MVV": null, "Access": null, "Description": "جزر أبو منقار هي جزر في البحر الأحمر وتقع أمام ساحل الغردقة وتبلغ مساحتها أقل من 2 كم2 وهي جزيرة مستوية السطح ومنخفضة المنسوب 2 متر تغطى سطحها تكوينات مرجانية ورمال عضوية.", "image": "src='https://img.youm7.com/large/201706241231383138.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.8731903608181, 27.2163798523043, 27.2163798523043 ] } },
  { "type": "Feature", "properties": { "x": 34.9398419040131, "y": 25.002299998489899, "Number": 16, "Name": "بحيرة النيزك", "Latitude": 25.002299998489899, "Longitude": 34.9398419040131, "Type": null, "Address": "محافظة البحر الأحمر", "Hours": "السياحة البيئية", "MustSee": "Meteor Lake", "MVV": null, "Access": null, "Description": "بحيرة النيزك هي واحدة من البقع الساحرة في مصر، المرتبطة بالأساطير، وجمال الطبيعة، وسحر المياه الفيروزية على شاطئ البحر الأحمر، فهي من البحيرات ذات المياه الصافية، التي تقع بمنطقة مرسى علم، فهي عبارة عن حمام سباحة طبيعي، ولا يزيد عمق الماء فيها على 8 أمتار.ويتمتع الرواد هناك بالسباحة والغوص خاصة في الشتاء، فهي تعد مسبحا طبيعيا دافئا في حالات المد والجزر، وهذا بسبب مياهها التي تأتي في الأصل من تيارات مياه البحر مما يجعلها بقعة شديدة الأمان للغوص.", "image": "src='https://img.youm7.com/ArticleImgs/2018/8/16/72110-%D8%A8%D8%AD%D9%8A%D8%B1%D8%A9-%D8%A7%D9%84%D9%86%D9%8A%D8%B2%D9%83-%D8%A8%D9%85%D8%B1%D8%B3%D9%89-%D8%B9%D9%84%D9%85.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.9398419040131, 25.002299998489899, 25.002299998489899 ] } },
  { "type": "Feature", "properties": { "x": 32.877769930257202, "y": 24.0145709125058, "Number": 17, "Name": "جزيرة الفنتين", "Latitude": 24.0145709125058, "Longitude": 32.877769930257202, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Elephantine Island", "MVV": null, "Access": null, "Description": "جزيرة إلفنتين هي إحدى جزر أسوان النيلية، وهي جزيرة صغيرة لكنها من أهم وأروع مناطق الجذب السياحي في مصر، إذ يوحد فيها آثار نوبية وإسلامية وآثار من عصور ما قبل التاريخ، وتحتوي الجزيرة أيضاً على مساحات خضراء شاسعة مغطاة بشجر النخيل، ومتحف تاريخي رائع يروي تاريخ الجزيرة. ويمكن الوصول إلى الجزيرة بسهولة عن طريق أحد القوارب المصطفة على شواطئ مدينة أسوان.", "image": "src='https://upload.wikimedia.org/wikipedia/commons/e/e2/ElephantineMuseumEntrance.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.877769930257202, 24.0145709125058, 24.0145709125058 ] } },
  { "type": "Feature", "properties": { "x": 32.887180773993599, "y": 24.0942829641907, "Number": 20, "Name": "جزيرة النباتات", "Latitude": 24.0942829641907, "Longitude": 32.887180773993599, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "The plants island", "MVV": null, "Access": null, "Description": "جزيرة النباتات هي أحد أهم المزارات السياحية في مدينة أسوان وواحدة من أقدم الحدائق بالعالم، تقع حديقة النباتات بأسوان على جزيرة بأكملها. وتحتوى على العديد من الأشجار والنباتات النادرة، شهدت جزيرة النباتات زيارة العديد من الشخصيات التاريخية البارزة لعل أهمهم: نهرو رئيس وزراء الهند وجوزيف تيتو رئيس يوغسلافيا، بالإضافة إلى الملكة إليزابيث ملكة بريطانيا العظمى", "image": "src='https://images.akhbarelyom.com/images/images/large/20220906084002159.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.887180773993599, 24.0942829641907, 24.0942829641907 ] } },
  { "type": "Feature", "properties": { "x": 32.877608528004998, "y": 24.013323710706299, "Number": 21, "Name": "جزيرة فيلة", "Latitude": 24.013323710706299, "Longitude": 32.877608528004998, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Philae Island", "MVV": null, "Access": null, "Description": "جزيرة فيلة هي جزيرة معبد شهيرة تقع على نهر النيل الهادئ بين السد العالي بأسوان وسد أسوان القديم، وهي موقع أثري مهم للغاية يضم العديد من المعابد والأضرحة القديمة في مصر، ويعرفها الناس أيضًا بالاسم اليوناني \"إليفنتين\" لأنها كانت مركزاً تجارياً أساسياً للعاج، وقد شيد المصريون القدماء مجمع معبد جزيرة فيلة المشهور والمكرس للإله المصري إيزيس في هذه الأرض الصغيرة التي احتلت موقعًا مهمًا بين مواقع التراث التابعة لليونسكو، ويُعتقد أن المجمع بأكمله يعود إلى 600 قبل الميلاد أو حتى قبل ذلك.", "image": "src='https://i0.wp.com/www.terhalak.com/wp-content/uploads/2020/12/Philae-and-rescued-from-the-sunken-island.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.877608528004998, 24.013323710706299, 24.013323710706299 ] } },
  { "type": "Feature", "properties": { "x": 32.871887724542297, "y": 24.028319418537901, "Number": 22, "Name": "جزيرة هيسا", "Latitude": 24.028319418537901, "Longitude": 32.871887724542297, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Hisa Island", "MVV": null, "Access": null, "Description": "قرية جزيرة هيسا النوبية شرق مدينة أسوان في محافظة أسوان وهي من اقدم الجزر النوبية، ما بين السد العالي وخزان أسوان بجوار معبد فيلة وتم اختيار الجزيرة لإقامة مهرجان تنشيط سياحة وحفلات ومهرجان شخصيات مصرية.  من أقدم هذه جزر أسوان النوبية ، ويعود الاسم إلى الملك «هيس» أحد أهم ملوك الأسرة السابعة.  تقع جزيرة «هيسا» شرق مدينة أسوان وهى كانت الجزيرة بمثابة مدافن للكهنة والكاهنات الذين كانوا يعملون في جزيرة «هيسا» وجزيرة «فيلة» القريبة جدا منها، حيث كانتا منجما طبيعيا لاستخراج الحجارة والأخشاب، التي كانت تنقل فيما بعد عبر النهر لبناء هرم سقارة. بيوت جزيرة «هيسا» ذات ألوان ناصعة، وتتوزع على صخور الجبل الصغير في تناسق جميل، يحيطها جمال آسر ونقاء من الصعب أن تجده في مكان آخر، كما أن الجبال والنهر تحيطهما من جميع الجهات، مما جعل نسبة التلوث تقل ونقاء الهواء يزداد، وهو مناخ صحي خال من الأمراض خصوصا لمرضى الروماتيزم وأوجاع المفاصل، فالجزيرة دافئة شتاء حارة صيفا.", "image": "src='https://www.marefa.org/w/images/3/3e/%D8%AC%D8%B2%D9%8A%D8%B1%D8%A9_%D9%87%D9%8A%D8%B3%D8%A7_%D8%A7%D9%84%D9%86%D9%88%D8%A8%D8%A9.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.871887724542297, 24.028319418537901, 24.028319418537901 ] } },
  { "type": "Feature", "properties": { "x": 32.872612933599903, "y": 24.061971678173698, "Number": 23, "Name": "جزيرة سهيل", "Latitude": 24.061971678173698, "Longitude": 32.872612933599903, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Sohail Island", "MVV": null, "Access": null, "Description": "جزيرة سهيل إحدى جزر مصر النيلية، تقع جنوبي مدينة أسوان، وبها قرية نوبية نموذجية تعد مزارا للسائحين للتعرف على الثقافة النوبية بزيارة ديارهم. كانت في الاصل محجرا يستخرج منها قدماء المصريين الغرانيت الأسواني. يبلغ عدد السكان بالجزيرة 4180 نسمة، وتحتضن الجزيرة المئات من النقوش واللوحات التذكارية والخراطيش الملكية التي خلدها العديد من الحكام والملوك داخل حدود معبد الإلهة عنقت ابنة الإله خنوم والإلهة ساتِت ثالوث الفنتين حيث كان لها معبدًا في جزيرة سهيل، وأيضًا على الصخور الكبيرة المحيطة بالجزيرة. يرجع أقدم تلك النقوش إلى عصر الدولة الوسطى (حوالي 2034-1650 ق.م)، في حين بعضها يرجع للعصرين اليوناني والروماني وأبرزها \"نقش المجاعة\" الشهير، أهم النقوش المنحوتة على صخور جزيرة سهيل، بالإضافة إلى نقش من عهد الملكة حتشبسوت والملك تحتمس الثالث (حوالي 1479-1425 ق.م) الذي يروي قصة تمكن المشرف على أعمال البناء من استخراج ست مسلات من محاجر الجرانيت في أسوان.\n", "image": "src='https://www.saaih.com/files/styles/gallery/public/gallery/-%D8%A3%D8%B3%D9%88%D8%A7%D9%86/resized_aswan-13798-2560x1600.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.872612933599903, 24.061971678173698, 24.061971678173698 ] } },
  { "type": "Feature", "properties": { "x": 32.884405591137899, "y": 24.025627387172001, "Number": 24, "Name": "جزيرة أجيلكيا", "Latitude": 24.025627387172001, "Longitude": 32.884405591137899, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Agilkia Island", "MVV": null, "Access": null, "Description": "تضم مدينة أسوان عدداً من الجٌزر التي تحيط بها وتشكل لوحة صخرية طبيعية مميزة، ومن ضمن هذه الجٌزر، جزيرة أجيليكا، التي تقع في حوض سد أسوان القديم، وهي موقع عرض مجمع معابد فيلة المصرية القديمة، ولهذا تٌعتبر الجزيرة من أهم المواقع السياحية وأكثرها شعبية، والتي يقصدها السياح من كافة أنحاء العالم خصيصاً لمشاهدة عظمة التاريخ.", "image": "src='https://www.malaysia29.com/wp-content/uploads/%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA_%D8%B9%D9%86_%D9%85%D8%AF%D9%8A%D9%86%D8%A9_%D8%A3%D8%B3%D9%88%D8%A7%D9%86.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.884405591137899, 24.025627387172001, 24.025627387172001 ] } },
  { "type": "Feature", "properties": { "x": 32.884914169311998, "y": 24.021999163393499, "Number": 25, "Name": "جزيرة بيجة", "Latitude": 24.021999163393499, "Longitude": 32.884914169311998, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Beja Island", "MVV": null, "Access": null, "Description": "جزيرة بجح هي جزيرة وموقع أثري يقع على طول نهر النيل في النوبة التاريخية، وداخل محافظة أسوان جنوب مصر. تقع الجزيرة في خزان أسوان القديم، منذ اكتمال السد في عام 1902.", "image": "src='https://media.dotmsr.com/large/201812020946244624.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.884914169311998, 24.021999163393499, 24.021999163393499 ] } },
  { "type": "Feature", "properties": { "x": 32.874902802468497, "y": 24.070145793033799, "Number": 26, "Name": "محمية سالوجا وغزال", "Latitude": 24.070145793033799, "Longitude": 32.874902802468497, "Type": null, "Address": "محافظة أسوان", "Hours": "السياحة البيئية", "MustSee": "Saluja and Ghazal Reserve", "MVV": null, "Access": "محمية طبيعية", "Description": "محمية سالوجا وغزال هي إحدي المحميات الطبيعية في جنوب مصر وتعتبر اصغرها حيث لا تتعدى مساحتها نصف كيلو متر عبارة عن مجموعة جزر في نهر النيل. تقع المحمية في محافظة أسوان وبالتحديد عند الشلال الأول علي بعد حوالي 3 كم شمال خزان أسوان. وجنوبا منها توجد جزيرة سهيل، اما شمالا فتوجد جزر أسبونارتي وأمون والحديقة النباتية", "image": "src='https://images.akhbarelyom.com//images/images/medium/20200124165556781.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.874902802468497, 24.070145793033799, 24.070145793033799 ] } },
  { "type": "Feature", "properties": { "x": 32.867179274213797, "y": 24.055074190802198, "Number": 27, "Name": "الشلال الأول (الجندل الأول)", "Latitude": 24.055074190802198, "Longitude": 32.867179274213797, "Type": null, "Address": "محافظة سوهاج", "Hours": "السياحة البيئية", "MustSee": "The first waterfall (the first cataract)", "MVV": null, "Access": null, "Description": "الجندل الاول او ( الشلال الاول ) الجندل هو مجموعه من الصخور الجرانيتيه البركانيه التى تعترض مجرى النيل مما يضفى جمالا آخر بجانب جمال نهر النيل،، يقع فى جنوب مدينه اسوان وهو من بين 6 جنادل على نهر النيل فى مصر والسودان", "image": "src='data:image/jpeg;base64,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'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.867179274213797, 24.055074190802198, 24.055074190802198 ] } }
  ]
  }
  
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
      data:'/data/EVvironments.geojson'
  
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


      map.addSource('ArtMuseums', {
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
        

        map.addControl(
          new MapboxDirections({
          accessToken: mapboxgl.accessToken
          }),
          'top-left'
          );   

         