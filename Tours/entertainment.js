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
  "name": "entertainment",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 33.832479200103101, "y": 27.1904611239597, "Number": 1, "Name": "نادي سندباد المائي", "Latitude": 27.1904611239597, "Longitude": 33.832479200103101, "Type": null, "Address": null, "Hours": null, "MustSee": "Sinbad Aqua Club", "MVV": null, "Access": null, "Description": "يوفّر لك هذا المنتزه المائي مزيجا رائعا من الأجواء الإستوائية والترفيهية الأحدث في مدينة الغردقة، ويقدّم الكثير من الأنشطة والبرامج الخاصة بالكبار وبالأطفال (برامج الرسوم المتحركة) وغيرها الكثير.", "image": "src='https://media.safarway.com/content/dd7cb8f7-e27e-4998-957b-fe8729098244_xs.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.832479200103101, 27.1904611239597, 33.832479200103101 ] } },
  { "type": "Feature", "properties": { "x": 33.822085568857602, "y": 27.188588497644002, "Number": 2, "Name": "معرض اخناتون مصر", "Latitude": 27.188588497644002, "Longitude": 33.822085568857602, "Type": null, "Address": null, "Hours": null, "MustSee": "Akhenaten Exhibition Egypt", "MVV": null, "Access": null, "Description": "معرض أخناتون مصر عبارة عن متحف ومعرض للهدايا التذكارية المصرية الرائعة من منحوتات وإكسسوارات الذهب والفضة والأعمال اليدوية والحقائب وغيرها،", "image": "src='https://media-cdn.tripadvisor.com/media/photo-s/10/f0/de/bf/akhenaten-egypt-gallery.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.822085568857602, 27.188588497644002, 33.822085568857602 ] } },
  { "type": "Feature", "properties": { "x": 32.8890531072607, "y": 24.0836195893934, "Number": 3, "Name": "حديقة الأميرة فريال", "Latitude": 24.0836195893934, "Longitude": 32.8890531072607, "Type": null, "Address": null, "Hours": null, "MustSee": "Princess Ferial Park", "MVV": null, "Access": null, "Description": "تم إنشاؤها في الأربعينيات برعاية من الأميرة فريال ابنة الملك فاروق، وأطلق اسمها علي الحديقة تقديرًا لدورها في إنشائها. تمتاز حديقة فريال بأنها من داخلها يتمكن أي شخص متابعة غروب الشمس حتي تغرق في نهر النيل والتي تعتبر متعة كل سائح يزور أسوان حيث تضم مدرجات جرانيتية تطل علي أجمل جزء من نهر النيل بزرقته المبهرة، وتصميم الحديقة ليس له نظير.", "image": "src='https://alwafd.news/images/images/VideoCapture_%D9%A2%D9%A0%D9%A2%D9%A1%D9%A0%D9%A7%D9%A2%D9%A3-%D9%A1%D9%A2%D9%A3%D9%A7%D9%A3%D9%A8(1).jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.8890531072607, 24.0836195893934, 32.8890531072607 ] } },
  { "type": "Feature", "properties": { "x": 32.631497642428997, "y": 25.6865099466849, "Number": 4, "Name": "الرحلات النيلية نايل كروز", "Latitude": 25.6865099466849, "Longitude": 32.631497642428997, "Type": null, "Address": null, "Hours": null, "MustSee": "Nile cruise Nile cruise", "MVV": null, "Access": null, "Description": "البواخر النيلية العائمة 2023 - رحلة نيلية في مركب علي النيل", "image": "src='https://lh3.googleusercontent.com/p/AF1QipO_i58xnGGn8Qz7OpdO6ERtFSBFcosBrZsaG3Rx=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.631497642428997, 25.6865099466849, 32.631497642428997 ] } },
  { "type": "Feature", "properties": { "x": 33.852382591768098, "y": 27.0410956780111, "Number": 5, "Name": "سهل حشيش", "Latitude": 27.0410956780111, "Longitude": 33.852382591768098, "Type": null, "Address": null, "Hours": null, "MustSee": "Sahl Hasheesh", "MVV": null, "Access": null, "Description": "سهل حشيش هي منطقة سياحية تقع على بعد 25 كيلو مترا جنوب مدينة الغردقة على الشريط الساحلي للبحر الأحمر. ويعد من أحدث المشاريع السياحية العملاقة على سواحل البحر الأحمر. وقد تم بناء مركز مدينة صغير له ويضم حتى الآن ستة منتجعات سياحية من الطراز الأول والمتوقع افتتاحهم رسميا في أواخر عام 2007.", "image": "src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Sahl_hasheesh4.jpg/220px-Sahl_hasheesh4.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.852382591768098, 27.0410956780111, 33.852382591768098 ] } },
  { "type": "Feature", "properties": { "x": 33.824591269315597, "y": 27.1771265294933, "Number": 6, "Name": "نادى الرياضات البحرية", "Latitude": 27.1771265294933, "Longitude": 33.824591269315597, "Type": null, "Address": null, "Hours": null, "MustSee": "Marine Sports Club", "MVV": null, "Access": null, "Description": "نادي الرياضات البحرية، نادي رياضي في الغردقة، هو نادي رياضي اجتماعي سمي نادي الرياضات البحرية لمحافظة البحر الأحمر وقد تم تأسيسه عام 1981، وهو يعتبر أيضا من أكبر نوادي الغردقة", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNhM1FvCdnUtF9jtxVRBwlesgc70FHKlccEw78v=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.824591269315597, 27.1771265294933, 33.824591269315597 ] } },
  { "type": "Feature", "properties": { "x": 33.676154650893203, "y": 27.3930505269016, "Number": 7, "Name": "مركز الترفيه تشيكي مونكيز بالجونة", "Latitude": 27.3930505269016, "Longitude": 33.676154650893203, "Type": null, "Address": null, "Hours": null, "MustSee": "Cheeky Monkeys Entertainment Center El Gouna", "MVV": null, "Access": null, "Description": "يقع ملعب ومركز الترفيه تشيكي مونكيز في مدينةِ الجونة، ويُعد المُتنفس الأول لأطفالها الباحثين عن الترفيه والمغامرة في بيئةٍ حديثةٍ آمنة. ويضم المركز ملعب داخلي مُجهز بالكامل مع منطقة مُخصصة لجلوس الأهالي، بالإضافةِ إلى ملعبٍ خارجي يضم الزحاليقَ وأبراج التسلق والأراجيح ومسارات المشي والركض والدراجات.", "image": "src='https://club-paradisio-el-gouna-hotel.albooked.com/data/Photos/Big/11810/1181045/1181045335/Labranda-Club-Paradisio-El-Gouna-Adults-Only-Hotel-Exterior.JPEG'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.676154650893203, 27.3930505269016, 33.676154650893203 ] } },
  { "type": "Feature", "properties": { "x": 33.660978387218599, "y": 27.377553774179901, "Number": 8, "Name": "مدينة الملاهى المائية", "Latitude": 27.377553774179901, "Longitude": 33.660978387218599, "Type": null, "Address": null, "Hours": null, "MustSee": "Water amusement park", "MVV": null, "Access": null, "Description": "المتنزهات المائية أو الحدائق المائية هي نوع من أنواع مدن الألعاب الترفيهية التي تتضمن وجود أماكن للعب في الماء. تتضمن المتنزهات المائية وجود العديد من الألعاب المائية مثل زلاقة مائية Water slide وغيرها، بالإضافة إلى وجود أماكن لنشاطات متعددة مثل الاستحمام الترفيهي والسباحة ونشاطات أخرى تمارس بالحفاء.", "image": "src='https://media.gemini.media/img/large/2019/7/27/2019_7_27_21_36_43_991.JPG'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.660978387218599, 27.377553774179901, 33.660978387218599 ] } },
  { "type": "Feature", "properties": { "x": 33.872760281827603, "y": 26.983350009591, "Number": 9, "Name": "منتزه مكادى المائى", "Latitude": 26.983350009591, "Longitude": 33.872760281827603, "Type": null, "Address": null, "Hours": null, "MustSee": "Makadi Water Park", "MVV": null, "Access": null, "Description": "مكادي ووتر وورلد هي أكبر مدن الملاهي والألعاب المائية في مصر بمساحتها التي تتسع لنحو 50 لعبة تشغل 40 ألف متر مربع من إجمالي مساحة خليج مكادي الذي يعد من أهم أماكن السياحة في مصر .", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNOcMmtmf9n8_oDLiKKPWuRt8MYt802jrwKmbf8=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.872760281827603, 26.983350009591, 33.872760281827603 ] } },
  { "type": "Feature", "properties": { "x": 34.788380891148897, "y": 25.256096025088699, "Number": 10, "Name": "حديقة أكواتيكو المائية", "Latitude": 25.256096025088699, "Longitude": 34.788380891148897, "Type": null, "Address": null, "Hours": null, "MustSee": "Aquatico Water Park", "MVV": null, "Access": null, "Description": "حديقة أكواتيكو المائية في قرية مرسى علم، تعتبر حديقة مائية متكاملة، حيث تقدم تجربة فريدة للعائلات والافراد، ضمن أجواء مليئة بالتشويق والمغامرة، اذ أن الحديقة تضم عدد من البرك المائية التي تختلف اعماقها، منها المناسب للأطفال ومنها المناسب للبالغين، مع عدد من الزحاليق التي تختلف ارتفاعاتها، واشكالها", "image": "src='https://www.downloadsimogames.info/wp-content/uploads/2022/02/%D8%B4%D8%A7%D8%AE%D8%B5-2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.788380891148897, 25.256096025088699, 34.788380891148897 ] } },
  { "type": "Feature", "properties": { "x": 34.324028385817698, "y": 26.025251252029602, "Number": 11, "Name": "شاطئ روهانو", "Latitude": 26.025251252029602, "Longitude": 34.324028385817698, "Type": null, "Address": null, "Hours": null, "MustSee": "Rohano Beach", "MVV": null, "Access": null, "Description": "له أحد الوجهات المفضلة عند الأشخاص الراغبين بالاسترخاء وقضاء وقت جميل برفقة اصدقائهم وعائلاتهم", "image": "src='https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/dc/66/b8/rohanou-beach-resort.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.324028385817698, 26.025251252029602, 34.324028385817698 ] } },
  { "type": "Feature", "properties": { "x": 33.834078030016499, "y": 27.188118652396401, "Number": 12, "Name": "غواصات السندباد‎‎", "Latitude": 27.188118652396401, "Longitude": 33.834078030016499, "Type": null, "Address": null, "Hours": null, "MustSee": "Sinbad submarines", "MVV": null, "Access": null, "Description": "تبدأ رحلة الغواصة السندباد الغردقة بالتحرك و الإبحار بالمركب السياحى الخاص بنا حتى نصل الى العائمة البحريه الخاصة بالغواصة السندباد على العائمة البحريه يوجد متحف اسماك بحريه محنطة للتمتع بمناظر الاسماك المحنطة نبدأ بعد ذلك بركوب الغواصة السندباد و الاتجاه نحو المنطقة التى نبدا بالغوص فى اعماق البحر الأحمر حوالى 15 الى 20 متر  تبدا الغواصة السندباد جولتها حوالى 45 دقيقة وسط الشعاب المرجانيه و اسماك البحر الأحمر النادره", "image": "src='https://lh3.googleusercontent.com/p/AF1QipMNfx1czqzQeCS34INYA1tEDK2EyXl16ylpXpGq=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.834078030016499, 27.188118652396401, 33.834078030016499 ] } },
  { "type": "Feature", "properties": { "x": 33.856316765034698, "y": 26.988015389626899, "Number": 13, "Name": "مينى ايجيبت بارك", "Latitude": 26.988015389626899, "Longitude": 33.856316765034698, "Type": null, "Address": null, "Hours": null, "MustSee": "Mini Egypt Park", "MVV": null, "Access": null, "Description": "ويقع متحف «ميني إيجيبت بارك» في خليج مكادي بمدينة الغردقة الساحلية، أشهر مدن البحر الأحمر التي حصلت أخيرًا على أفضل وجهة سياحية عربية، ويحتوي المتحف على مجسمات مصغرة للمعالم السياحية الأكثر شهرة بمصر.", "image": "src='https://nemotourssharm.com/ar/wp-content/uploads/2019/01/Mini-Egypt-Park-5-800x600-2.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.856316765034698, 26.988015389626899, 33.856316765034698 ] } },
  { "type": "Feature", "properties": { "x": 33.832492138689602, "y": 27.190223903547, "Number": 14, "Name": "الممشى السياحي", "Latitude": 27.190223903547, "Longitude": 33.832492138689602, "Type": null, "Address": null, "Hours": null, "MustSee": "Tourist walkway", "MVV": null, "Access": null, "Description": "يضم الممشى أماكن ترفيهية للعب الأطفال، وكذلك أماكن للجلوس، بها مظلات شمسية لجلوس الأسر، وتوافد العائلات عليه فى المساء والصباح.  كما يضم الممشى السياحى بمدينة الغردقة عددا كبيرا من البازارات السياحية، والعلامات التجارية العالمية المختلفة فى تلك المنطقة، والتى يتردد ويقوم بالشراء منها سياح من كل دول العالم.  وتضم مدينة الغردقة عددا كبيرا من مناطق الترفيه المختلفة منها الممشى السياحى القديم، وممشى الشيرتون، وممشى شيرى وكذلك حديقة وممشى النصر، وممشى طريق المطار، وكذلك كورنيش فلفلة الشهير وكورنيش شاطئ عام رقم 4", "image": "src='https://img.youm7.com/ArticleImgs/2019/9/21/45682-1-%D8%AA%D8%B7%D9%88%D9%8A%D8%B1-%D8%A7%D9%84%D9%85%D9%85%D8%B4%D9%8A-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D8%A8%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9%C2%A0.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.832492138689602, 27.190223903547, 33.832492138689602 ] } },
  { "type": "Feature", "properties": { "x": 33.823385885408598, "y": 27.196052781012199, "Number": 15, "Name": "متحف ورق البردي", "Latitude": 27.196052781012199, "Longitude": 33.823385885408598, "Type": null, "Address": null, "Hours": null, "MustSee": "Papyrus Museum", "MVV": null, "Access": null, "Description": "متحف ورق البردي هو عبارة عن متحف ومتجر تاريخي يضم ورق البردي القديم، وهو أكبر صالة بردية في مصر.", "image": "src='https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/d6/4f/1c/finished-product-all.jpg?w=1200&h=-1&s=1'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.823385885408598, 27.196052781012199, 33.823385885408598 ] } },
  { "type": "Feature", "properties": { "x": 33.823132305190903, "y": 27.099864711306999, "Number": 18, "Name": "متحف الرمال بالغردقة", "Latitude": 27.099864711306999, "Longitude": 33.823132305190903, "Type": null, "Address": null, "Hours": null, "MustSee": "Sand Museum in Hurghada", "MVV": null, "Access": null, "Description": "ويضم عددا كبيرا من التماثيل التاريخية والاسطورية المصنوعة من الرمال البيضاء بحرفية كبيرة .يقع متحف الرمال جنوب الغردقة، ويضم أكثر من 40 تمثال من المنحوتات بالرمال لشخصيات أسطورية من العصر الحديث والقديم، تمثل أغلب حضارات العالم منها الحضارة الفرعونية ومجسمات لعجائب الدنيا السبع الاهرامات وأبو الهول.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipMPUlr5UO-XQoGWYxT_qI7HzMqwmGAaU-lQABGV=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.823132305190903, 27.099864711306999, 33.823132305190903 ] } },
  { "type": "Feature", "properties": { "x": 33.780955330910203, "y": 27.134166814126601, "Number": 19, "Name": "فالكو سفاري", "Latitude": 27.134166814126601, "Longitude": 33.780955330910203, "Type": null, "Address": null, "Hours": null, "MustSee": "Falco Safari", "MVV": null, "Access": null, "Description": "مغامرات مشي وتسلق وركوب عربات دفع رباعي وتخييم وغيرها الكثير. كما ويمكن مع الشركة الحصول على جولات خاصة في الصحراء برفقة مرشد.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNKRj_zPhTooJAIV7MputaP6gzM6qeegjVTEMaO=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.780955330910203, 27.134166814126601, 33.780955330910203 ] } },
  { "type": "Feature", "properties": { "x": 33.840951712275199, "y": 27.224097304109701, "Number": 20, "Name": "قارب روبال سي سكوب ذا القاع الزجاجي", "Latitude": 27.224097304109701, "Longitude": 33.840951712275199, "Type": null, "Address": null, "Hours": null, "MustSee": "Rupal Glass Bottom Sea Scoop Boat", "MVV": null, "Access": null, "Description": "هذا القارب هو احد أجمل القوارب في الغردقة ويمتاز بقاعه الزجاجي الذي يسمح برؤية المياه والحياة البحرية والمرجان خلال تجوال السفينة في البحر الأحمر", "image": "src='https://www.guidehurghada.com/ar/uploads/PostsMainImages/Seawolf_Submarine_Hurghada_Trip_899077.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.840951712275199, 27.224097304109701, 33.840951712275199 ] } },
  { "type": "Feature", "properties": { "x": 33.841023279433998, "y": 27.224031373427199, "Number": 21, "Name": "قارب ابحار القراصنة", "Latitude": 27.224031373427199, "Longitude": 33.841023279433998, "Type": null, "Address": null, "Hours": null, "MustSee": "Pirate sailing boat", "MVV": null, "Access": null, "Description": " تم صنعة على الطرق القديمة، وعلى الرغم من ذلك فهو آمن إلى حد كبير ويمكن للزوار فيه قضاء وقت رائع برفقة اصدقائهم وعائلاتهم. ويأخذ القارب الزوار في رحلات رومانسية ساحرة عبر الخلجان على ساحل البحر الأحمر، وتستمر الرحلة لمدة تزيد عن ساعتين.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipPl0zsoAaFMC3ZAXv1nLLVwHGR6maV58OxSlZQo=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.841023279433998, 27.224031373427199, 33.841023279433998 ] } },
  { "type": "Feature", "properties": { "x": 33.8282480644991, "y": 27.260547615241698, "Number": 22, "Name": "قارب الملكة إيزيس تريماران", "Latitude": 27.260547615241698, "Longitude": 33.8282480644991, "Type": null, "Address": null, "Hours": null, "MustSee": "Queen Isis trimaran boat", "MVV": null, "Access": null, "Description": "قارب الملكة إيزيس تريماران هو وجهة ترفيهية مفضلة عند المحليين والسياح في المدينة، إذ أنه يأخذ الزوار في رحلة رائعة على ساحل البحر الأحمر. ويمكن للزوار الاستمتاع بالمظاهر الخلابة وبالإطلالات الساحرة وبالهدوء من مقاعدهم أعلى السفينة", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNFqU14EKMe5B0qJmYfg-qrAp9KtEgHLEYEJd8-=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.8282480644991, 27.260547615241698, 33.8282480644991 ] } },
  { "type": "Feature", "properties": { "x": 33.842719639525797, "y": 27.223813727937799, "Number": 23, "Name": "ميناء مارينا الغردقة", "Latitude": 27.223813727937799, "Longitude": 33.842719639525797, "Type": null, "Address": null, "Hours": null, "MustSee": "Hurghada Marina Port", "MVV": null, "Access": null, "Description": "قدم ميناء مارينا الغردقة مظهرًا جديدًا للمدينة، حيث يمكن للسياح القادمين من مختلق أنحاء العالم والمقيمين المحليين المشي فيه في فترة ما بعد الظهر واستنشاق هواء البحر المنعش في الليل بعيدًا عن الضوضاء ودون أي إزعاج.", "image": "src='data:image/jpeg;base64,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'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.842719639525797, 27.223813727937799, 33.842719639525797 ] } },
  { "type": "Feature", "properties": { "x": 34.636828538040497, "y": 25.5339592301724, "Number": 24, "Name": "قارب نفرتاري", "Latitude": 25.5339592301724, "Longitude": 34.636828538040497, "Type": null, "Address": null, "Hours": null, "MustSee": "Nefertari boat", "MVV": null, "Access": null, "Description": "ارب نفرتاري، هو قارب يقدم جولات سياحية على اعلى مستوى، ويشتهر القارب بسبب تصميمه المستوحى من العصور الذهبية الفرعونية، المنعكسة في كافة تفاصيلها", "image": "src='https://lh3.googleusercontent.com/p/AF1QipNAakvuwV7-bT8kDByCdfXbWuKeA5yP9BE23XWH=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.636828538040497, 25.5339592301724, 34.636828538040497 ] } },
  { "type": "Feature", "properties": { "x": 34.333253259467703, "y": 25.941435835503899, "Number": 25, "Name": "القرية البدوية", "Latitude": 25.941435835503899, "Longitude": 34.333253259467703, "Type": null, "Address": null, "Hours": null, "MustSee": "Bedouin village", "MVV": null, "Access": null, "Description": "قرية البدوية هي معلم يقع في قلب صحراء مدينة القصير، وسيتمكن زوار هذه القرية من التعرف على السكان البدو للصحراء كما وتناول أطباقهم الشهية كالزرب وركوب الجمال وركوب عربات الدفع الرباعي الصغيرة كما والتخييم في قلب الصحراء.", "image": "src='https://scontent.fcai20-4.fna.fbcdn.net/v/t39.30808-6/230209109_4442388569155236_2537845362778240649_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=e3f864&_nc_ohc=HTNgfp3RL94AX_tkaKD&_nc_ht=scontent.fcai20-4.fna&oh=00_AfDjSwEMdo6eEEY-nYhPLw5GrRt5wXw9fh-Z-FGWkvopUA&oe=64121886'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 34.333253259467703, 25.941435835503899, 34.333253259467703 ] } },
  { "type": "Feature", "properties": { "x": 32.631364922137202, "y": 25.707758668482398, "Number": 26, "Name": "اسطبلات الأقصر", "Latitude": 25.707758668482398, "Longitude": 32.631364922137202, "Type": null, "Address": null, "Hours": null, "MustSee": "Luxor Stables", "MVV": null, "Access": null, "Description": "تعود ملكية الأقصر للفروسية إلى إيما وهي سيدة بريطانية. تقدم هذه نفس معايير الجودة والسلامة المعروفة، وتتخصص في رحلات ركوب الخيل الفريدة من نوعها لجميع المستويات والفئات. قم بزيارة القرى البدوية المحلية المحيطة، وشاهد المزارعين الذين يعملون في حقولهم ورعي الجواميس في مياه النيل الضحلة، ومزارع من قصب السكر والمراعي الخصبة والآثار المصرية القديمة على الضفة الغربية لنهر النيل الشهير أثناء امتطاء أحد الخيول العربية الجميلة", "image": "src='https://lh3.googleusercontent.com/p/AF1QipN9v1O-FqhWqz7kLf4KsVdp6fr5MS6ODeDkARHo=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.631364922137202, 25.707758668482398, 32.631364922137202 ] } },
  { "type": "Feature", "properties": { "x": 32.640722594457998, "y": 25.690898417265601, "Number": 27, "Name": "البالون الطائر في الاقصر", "Latitude": 25.690898417265601, "Longitude": 32.640722594457998, "Type": null, "Address": null, "Hours": null, "MustSee": "The flying balloon in Luxor", "MVV": null, "Access": null, "Description": "توفر الشركة للمشاركين رحلات مناطيد عبر المساحات الخضراء الشاسعة والصحراء، وسيتمكن الزوار أيضاً من التمتع بإطلالات مهيبة على نهر النيل. وهي رحلات آمنة جداً ويشرف عليها مدربون محترفون لديهم خبرة سنوات طويلة في المجال.", "image": "src='https://img.soutalomma.com/ArticleImgs/2018/3/26/131318-%D8%A7%D9%84%D8%A8%D8%A7%D9%84%D9%88%D9%86-%D8%A7%D9%84%D8%B7%D8%A7%D8%A6%D8%B1-%D9%8A%D8%B9%D9%88%D8%AF-%D9%84%D8%B3%D9%85%D8%A7%D8%A1-%D8%A7%D9%84%D8%A7%D9%82%D8%B5%D8%B1-%D8%A8%D8%B9%D8%AF-%D8%AA%D8%AD%D8%B3%D9%86-%D8%A7%D9%84%D8%B7%D9%82%D8%B3-(9).jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.640722594457998, 25.690898417265601, 32.640722594457998 ] } },
  { "type": "Feature", "properties": { "x": 32.862346591386803, "y": 24.0493791394724, "Number": 28, "Name": "منتجع فينتي كامب أسوان", "Latitude": 24.0493791394724, "Longitude": 32.862346591386803, "Type": null, "Address": null, "Hours": null, "MustSee": "Fenty Camp Resort Aswan", "MVV": null, "Access": null, "Description": "فينتي كامب أسوان، هو منتجع سياحي متكامل في مدينة أسوان في جمهورية مصر، يوفر تجربة مثالية تغمس الأفراد بالثقافة المصرية الاصيلة، من خلال المرافق والانشطة والخدمات التي يوفرها المكان لهم، منها المطاعم التي تقدم الوجبات المحلية الشهية، والجلسات الفريدة الواقعة بالقرب من الشاطئ، بالاضافة الى جولات القوارب وجولات ركوب الجمال، وغيرها.", "image": "src='https://media.safarway.com/content/e9ec41ec-272d-48e1-a979-7197e6cd7398_sm.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.862346591386803, 24.0493791394724, 32.862346591386803 ] } },
  { "type": "Feature", "properties": { "x": 33.821766059746302, "y": 27.134999664258899, "Number": 29, "Name": "معرض الأحياء المائية", "Latitude": 27.134999664258899, "Longitude": 33.821766059746302, "Type": null, "Address": null, "Hours": null, "MustSee": "Aquarium exhibition", "MVV": null, "Access": null, "Description": "يقع حوض السمك الكبير او جراند أكواريوم الغردقة في مدينة الغردقة وهو عالم كبير من الأحياء البحرية الرائعة، حيث يمكنك التعرّف على  أكثر من 1200 حيوان بحري من أكثر من 1000 نوع موزعة في 22 معرض مختلف، ومن هذه الحيوانات: السلاحف والأسماك بأنواعها وألوانها الرائعة والتماسيح وغيرها الكثير. كل هذه المعارض رائعة بحد ذاتها، حيث تشتمل على مشاريع العلوم والبحوث البحرية المتنوعة وبرامج التكاثر والحفاظ على الحيوانات البحرية والكائنات البحرية المهددة بالانقراض، والجهود المتواصلة لتوعية الزوار بأهمية المحيط.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipOIwMMdw1LBpHGZ67PPbJ-5JvA-i-AS0gIGfygw=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.821766059746302, 27.134999664258899, 33.821766059746302 ] } },
  { "type": "Feature", "properties": { "x": 33.819204586595198, "y": 27.2610642822217, "Number": 30, "Name": "متحف اسماك البحر الأحمر", "Latitude": 27.2610642822217, "Longitude": 33.819204586595198, "Type": null, "Address": null, "Hours": null, "MustSee": "Red Sea Fish Museum", "MVV": null, "Access": null, "Description": "ضأ كواريوم البحر الأحمر الكثير من أنواع الأسماك من مختلف بقاع الأرض، لكن الأسماك الأكثر شهرة في المكان هي الأسماك التي تم جمعها من الشرق الأوسط، ويفضل المحليون هذا الشق من حوض المياه لأنه يعرفهم على طبيعية بلادهم وبيئتها والكائنات الحية الموجودة فيها. ويوجد في الأحواض المائية أيضا الكثير من أنواع المرجان المذهلة، وحوض تملؤه قناديل البحر، وحوض صغير فيه قطيع جمبري يرقص رقصات متناغمة في ظاهرة طبيعية فريدة، وغيرها.", "image": "src='https://lh3.googleusercontent.com/p/AF1QipPrOGkztTixCvpadODjsafqsoVKUOFPFB5CG7Er=s680-w680-h510'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.819204586595198, 27.2610642822217, 33.819204586595198 ] } },
  { "type": "Feature", "properties": { "x": 31.704075332536799, "y": 26.564935554124201, "Number": 31, "Name": "جزيرة الزهور", "Latitude": 26.564935554124201, "Longitude": 31.704075332536799, "Type": null, "Address": null, "Hours": null, "MustSee": "Flower Island", "MVV": null, "Access": null, "Description": "جزيرة الزهور هي جزيرة صغيرة تقع في نهر النيل أمام مدينة سوهاج وهي معلم سياحي وترفيهي من معالم محافظة سوهاج. يقابل الجزيرة من الجهة الشرقية متحف سوهاج الاثري وتضم جزيرة الزهور نحو 23 شاليه وحمام سباحة وملاعب أطفال ومطعم وصالة للأفراح وهي تعتبر من الأماكن الجميلة المحببة في الإقامة.", "image": "src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUIsiiNeI0qEX4ou0IL24tW1LB4kJFlgmfbu9zZMRVIYmXBvBqQ5AsRwHoyiY5usyEO6A&usqp=CAU'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.704075332536799, 26.564935554124201, 31.704075332536799 ] } },
  { "type": "Feature", "properties": { "x": 31.779829646916198, "y": 26.617682751794401, "Number": 32, "Name": "المخيم السياحى بحى الكوثر", "Latitude": 26.617682751794401, "Longitude": 31.779829646916198, "Type": null, "Address": null, "Hours": null, "MustSee": "The tourist camp in Al-Kawthar district", "MVV": null, "Access": null, "Description": "قع علي مساحه 30 الف متر مربع بحي الكوثر وهو عباره عن مبني من دورين والمخيم يشمل لوبي وصاله للافراح وحدائق وملاعب للاطفال وحديقه حيوان وبوفيه ومطعم ومخصص به ركن للعائلات وركن للشباب وبه اصطبل للخيل ومساحات للتخييم", "image": "src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiyaeHBazIfxqHlWXndfB_fYPCgTT5z2bYA6BjToQjBQ&s'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.779829646916198, 26.617682751794401, 31.779829646916198 ] } },
  { "type": "Feature", "properties": { "x": 31.7011195169597, "y": 26.5773102254058, "Number": 33, "Name": "جزيرة قرمان", "Latitude": 26.5773102254058, "Longitude": 31.7011195169597, "Type": null, "Address": null, "Hours": null, "MustSee": "Karaman Island", "MVV": null, "Access": null, "Description": "تُعد جزيرة قرمان إحدى الجزر النيلية التابعة لمحافظة سوهاج في صعيد مصر والتي يبلغ عددها 20 جزيرةً، منهم 5 جُزر فقط سكنية، أما قرمان فهي جزيرة غير مأهولة بالسكان ولكنها كذلك ليست خاوية، فالحركة دائمة عليها سواءً من موظفي المكاتب والمصالح الحكومية، أو من العمال والزوار لخدمات الجزيرة، حيث تُعتبر قرمان ملاهي وجزيرة ترفيهية تُعرف غالبًا باسم جزيرة الزهور نسبة إلى أقرب جزر سوهاج إليها، وتمتد على مساحة 500 فدانٍ تقريبًا بوسط نيل سوهاج، كما يوجد لها امتداد من الجهة الجنوبية نحو مدينة سوهاج يقدر بحوالي 160 فداناً، مما يجعلها واحدة من أكبر جزر سوهاج المنتشرة داخل حدودها على نهر النيل، ومن أشهر الجزر المصرية بصعيد مصر.", "image": "src='https://gate.ahram.org.eg/daily/Media/News/2022/1/1/2022-637766672408118092-811.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.7011195169597, 26.5773102254058, 31.7011195169597 ] } },
  { "type": "Feature", "properties": { "x": 32.643297274078598, "y": 25.704991247636499, "Number": 34, "Name": "الممشى السياحى", "Latitude": 25.704991247636499, "Longitude": 32.643297274078598, "Type": null, "Address": null, "Hours": null, "MustSee": "Tourist walkway", "MVV": null, "Access": null, "Description": "شهدت محافظة الأقصر، خلال الفترة الماضية، العمل بأهم مشروع لخدمة السياح والأهالى وهو تطوير كورنيش النيل بالأقصر، وذلك تنفيذاً لتوجيهات القيادة السياسية بالاهتمام البالغ بالمناطق السياحية والأثرية بمحافظة الأقصر، ومن منطلق إظهار مدينة الأقصر ذات الطابع الأثرى العريق، لتجميله أمام الضيوف من حول العالم.  إنه تم تطوير وتجميل كورنيش الأقصر بطول (1700م2) (علوي ", "image": "src='https://img.youm7.com/ArticleImgs/2019/5/23/37876-%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A9-%D8%A7%D9%84%D8%A3%D9%82%D8%B5%D8%B1-%D8%AA%D8%AE%D8%B7%D8%B7-%D9%84%D8%A5%D8%B3%D8%AA%D8%BA%D9%84%D8%A7%D9%84-3-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D9%8887-%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1-%D8%A8%D8%A7%D9%84%D9%85%D9%85%D8%B4%D9%8A-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A-%D8%A8%D9%83%D9%88%D8%B1%D9%86%D9%8A%D8%B4-%D8%A7%D9%84%D9%86%D9%8A%D9%84-(3).jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.643297274078598, 25.704991247636499, 32.643297274078598 ] } },
  { "type": "Feature", "properties": { "x": 32.622922602706801, "y": 25.6837945904512, "Number": 35, "Name": "جزيرة الموز", "Latitude": 25.6837945904512, "Longitude": 32.622922602706801, "Type": null, "Address": null, "Hours": null, "MustSee": "Banana Island", "MVV": null, "Access": null, "Description": "تعتبر \"جزيرة الموز\" بالبر الغربى بمحافظة الأقصر قبلة السائحين الأجانب والمصريين وأبناء الأقصر أيضاً فى الزيارات بقصد الاستمتاع بالجو الريفى الطبيعى الساحر داخلها لوقوعها على شاطئ نهر النيل، تبلغ حوالى خمسة أفدنة وتعج داخلها أشجار الموز الرائعة بجانب النخيل الذى يميز طبيعة محافظة الأقصر الزراعية والتى يتم الانتقال إليها عبر المراكب النيلية التى تصحبهم فى رحلة السحر والجمال لزيارة الجزيرة والتواجد داخلها لساعات معدودة يلتقط فيها السائحون الصور التذكارية، ويقوم المرشدون السياحيون بدعوة كافة الأفواج السياحية التى يرافقونها للاستمتاع داخل \"جزيرة الموز\" لكسر الزيارة الأثرية للمعابد والمتاحف والاستجمام قليلاً داخلها.", "image": "src='https://gate.ahram.org.eg/daily/Media/News/2021/4/27/2021-637551492959988496-998.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.622922602706801, 25.6837945904512, 32.622922602706801 ] } },
  { "type": "Feature", "properties": { "x": 32.552017754916399, "y": 25.324036688168, "Number": 36, "Name": "الحديقة الدولية باسنا", "Latitude": 25.324036688168, "Longitude": 32.552017754916399, "Type": null, "Address": null, "Hours": null, "MustSee": "Esna International Park", "MVV": null, "Access": null, "Description": "اتخذت الشركة الإيطالية – التي أنشأت تلك الحديقة – موقعًا فريدًا على ضفاف النيل بالأقصر، حيث يطل جزء كبير من الحديقة الدولية على القناطر، ويوجد جزء كبير منها ملتحمًا بالمرسى السياحي الذي يعد نقطة جذب كبرى للسياح. وتتكون الحديقة الدولية من جزء كبير دائري مفعم بالأشجار المورقة، ثم قسم آخر يطل على نهر النيل والقناطر الخيرية، إذ يستطيع الزوار مشاهدتها بوضوح من الحديقة؛ كما يلتحق بذلك المنتزه متحف زراعي، ومكتبة تاريخية قديمة يمكن الدخول إلى كلاهما من خلال الحديقة الدولية. وتحتوي تلك الحديقة على:  مرسى سياحي منطقة مطاعم فلوكة نهرية مباني تراثية قوارب ومركبات مائية مواقع للتصوير الفوتوغرافي.", "image": "src='https://img.youm7.com/large/42016301516116931.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.552017754916399, 25.324036688168, 32.552017754916399 ] } }
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
    map.addControl(new mapboxgl.ScaleControl({position: 'bottom-right'}));
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