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
  "name": "treatment",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 32.885254282187503, "y": 24.084777273049099, "Number": 1, "Name": "مركز علاجى بجزيرة الفنتين", "Latitude": 24.084777273049099, "Longitude": 32.885254282187503, "Type": null, "Address": null, "Hours": null, "MustSee": "A treatment center in Elephantine Island", "MVV": null, "Access": null, "Description": "هي زهرة الجنوب المصرى وأبدع مشتى عالمى، وبها العديد من مواقع السياحة العلاجية. نستعرض منها ما يلى:   جزيرة إلفنتين:   تستخدم فيها حمامات الطمر بالرمال للأغراض العلاجية من شهر مارس الى شهر أكتوبر من كل عام .  حيث تشتد أشعة الشمس . ويوجد مركز للعلاج الطبيعى بفندق أوبروى ، يعمل به خبراء فى الرياضة والعلاج الطبيعى , كما يحتوى المركز على حمامات الساونا وحمامات بخار تركية مع توفير القائمين على إعداد برنامج للتمرينات السويدية على أساس علمى .  منتجع جزيرة إيزيس:   بعد استقراء غير منهجى دام عدة سنوات لوحظ التحسن البالغ الذى يطرأ على مرضى الروماتويد المفصلى من بين السائحين بعد إقامتهم بضعة أسابيع فى جزيرة أسوان . وبناء على هذه الملاحظة أجرى المركز القومى المصرى للبحوث دراسات منهجية منظمة أثبتت هذه الظاهرة بما يقطع الشك باليقين .  وحدد المركز برنامجاً علاجياً خاصاً بالاستشفاء البيئى لمرضى الروماتويد بمنتجع جزيرة إيزيس ، يجمع بين العلاج بالطمر فى حمامات الرمال السمراء والتعرض للشمس وأشعتها فوق البنفسجية لمدة ثلاثة أسابيع متتالية . وكان لابد من هذا التنسيق الطبى على أسس مدروسة لضبط القدر المناسب من التعرض للأشعة فوق البنفسجية حتى يخرج المريض منها بأعظم فائدة، وكانت ثمرة هذا البرنامج المنظم فوق كل تصور ، فقد أدى الى تحسن ذى قيمة إحصائية عظيمة فى أعراض المرض ، والمؤشرات المعملية لكفاءة الجهاز المناعى , وسرعة ترسيب الدم ومؤشرات نشاط الروماتويد .  ويعزو الأطباء هذا النجاح المنقطع النظير للعلاج البيئى لمرض الروماتويد المشهور بشراسته المدمرة للمفاصل ، إلى كثافة الأشعة فوق البنفسجية المنعكسة من الجبال المحيطة بجزيرة إيزيس ومن صفحة النيل أثناء طمر الجسم بالرمال المشعة السمراء على سطح الجزيرة هذا بالإضافة الى نقاء جو أسوان وجفاف مناخها على مدار العام .  وتتميز المنطقة بارتفاع مقدار الأشعة فوق البنفسجية فى جوها وبانخفاض نسبة الرطوبة مما يجعلها مكاناً مثالياُ لعلاج الأمراض الروماتزمية وأمراض الجهاز التنفسى كالربو الشعبى وما إلى ذلك .  الاستشفاء:  تتحدى أسوان بجوها الجاف البديع أعظم المنتجعات الشتوية العلاجية فى العالم بأسره ، وهى تلائم على نحو خاص مرضى الكلى والجهاز التنفسى والروماتيزم ، ويوجد بها مركزان للعلاج بالرمال والمياه حيث يطمر جسم المريض بالروماتيزم فى الرمال الساخنة، وقد أثارت أسوان اهتمام عدة مؤسسات طبية عالمية اضطلعت بدراسة مناخها ومقومات السياحة الاستشفائية بها وتحققت من تفرد أسوان بدرجة عالية من الأشعة فوق البنفسجية من سمائها إضافة الى الانخفاض البالغ فى نسبة الرطوبة والعلاج بالأعشاب الطبية.  مازال أهل النوبة يؤمنون بطب الأعشاب الذى اهتمت به الدراسات الحديثة وأثبتت فاعليته فى الكثير من الأمراض ولم يزل الكثير من هذه النباتات الطبية التى وردت فى المراجع العربية القديمة كتذكرة داود الأنطاكى و\"المواد الطبية\" لأحمد بن رشيد و\"القانون\" فى الطب لأبن سينا ، يستخدم فى النوبة بنجاح للتداوى من عدة أمراض ومنها :  حلف البر :   وهو نبات يستخدم فى علاج نزلات البرد والمغص الكلوى بعد غليه وشربه كما يشرب الشاى .   الدمسيسة :   يستخدم أيضاً بنجاح فى أمراض الكلى .   قشر الرمان :   يستخدم لعلاج الدوسنتاريا المعوية بعد تحميصه ودقه وسحقه وإعداده بواسطة الغلى كمشروب الشاى .   الحرجل :   يستخدم لعلاج الإمساك وعسر الهضم .  العلاج البيئى النوبى:  يستخدم النوبيون أسلوب العلاج بالطمر فى الرمال الساخنة أثناء سطوع الشمس للعلاج من التهابات المفاصل وتنشيط الدورة الدموية ، حيث يشرف على العلاج شيوخ متخصصون فى هذا الضرب من العلاج الطبيعى .  ويتخذ العلاج مظهراً احتفالياً بهيجاً , إذ يتجمع أقارب المرضى وأهالى المنطقة الذين يتغنون الأغانى الفولكلورية النوبية المخصصة لهذه المناسبة حتى لا يتسرب الملل إلى نفس المريض فترفع روحه المعنوية .  وبعد أن ينتهى الزمن المحدد للطمر بالرمال يلف المريض فى أغطية ثقيلة لحمايته من التيارات الهوائية ، ثم ينقل سريعاً الى مكان مغلق حيث يقدم له شراب الدمسيسة أو حلف البر الساخن .  كذلك يستخدم هؤلاء الشيوخ النوبيون لبخة الطمى النيلى ( الدميرة ) لعلاج الصداع النصفى وآلام الأسنان والتمزق العضلى .  التفسير العلمى للعلاج البيئى بالنوبة:  يرجع التحسن الملموس فى الآلام الروماتزمية إلى سخونة الرمال التى تؤثر تأثيراً محموداً على النهايات العصبية المختصة بالألم وعلى الدورة الدموية ، وهو ذاته أسلوب العلاج الطبيعى المعاصر المعروف بالـ Biotherapy الذى يعتمد على استخدام الطمى الساخن أو الرمال الغنية بعناصر معدنية مثل اليود والكربونات ذات النشاط الإشعاعى فى الحدود المسموح بها ، والتى تمتص عن طريق الجلد .  ولبخة الطمى النيلى (الدميرة ) هى ذاتها أسلوب الـ Pleoma المستخدم فى المصحات العالمية التى تمزج الطمى بالمياه المعدنية لأغراض علاجية استناداً إلى خاصية السخونة الرطبة Humid Heat .  وقد أظهرت نتائج التحليل فى معامل هيئة الطاقة النووية المصرية احتواء الرمال السطحية فى منطقة أبو سمبل على عدة عناصر مثل السيلت والكربونات , كما أظهرت البحوث أن النشاط الإشعاعى بهذه الرمال فى الحدود الآمنة ذات الفائدة العلاجية .", "image": "src='https://darelhilal.com/Media/News/2021/10/15/2021-637699185428303011-830.jpeg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.885254282187503, 24.084777273049099, 32.885254282187503 ] } },
  { "type": "Feature", "properties": { "x": 33.933871455258199, "y": 26.790373179777699, "Number": 2, "Name": "مركز علاجى قرية مينا فيل بسفاجا", "Latitude": 26.790373179777699, "Longitude": 33.933871455258199, "Type": null, "Address": null, "Hours": null, "MustSee": "A treatment center in Minaville Village, Safaga", "MVV": null, "Access": null, "Description": "ويعد بحر مدينة سفاجا ورمالها السوداء والشمس هم كلمة السر في الاستشفاء، فمدينة سفاجا تقع على شاطئ على هيئة خليج، تتميز المياه بداخله على درجة ملوحة عالية زيادة 35% عن المعدل الطبيعي عن باقي البحار، وذلك بسبب انتشار وكثافة الشعاب المرجانية، التي ترفع كثافة المياه، وتجعل من يسبح في المياه يطفو في سهولة، ويؤدي ذلك إلى تحسن الدورة الدموية وتدفق الدم إلى الجلد وأطراف الجسم. بالاضافة الى ذلك و استغلالا للمقومات البيئية للمنطقة و التى كانت الباعث الاساسى لافتتاح قرية مينافيل فى هذه المنطقة ، فقد اشتهرت قرية مينافيل بأنها واحة الاستشفاء البيئى لمرضى الصدفية الجلدية و الروماتويد . و بحضوركم كضيوف اعزاء لقريتنا فانكم بالتأكيد سوف تستمتعون بخدماتنا الفندقية و الترفيهية و العلاجية و ذلك من خلال تواجدكم فى الجو الصحى المميز لمنطقة سفاجا. وشمس مدينة سفاجا تتميز أنها دافئة، وتسطع طوال شهور السنة، وهذا ما يميزها عن غيرها من الأماكن التى تغيب عنها الشمس خلال فصلي الخريف والشتاء ، والتي تدخل الشمس ضمن العنصر الثالث لاستشفاء وتحقق الاسترخاء خلال الرحلة العلاجية. و وجود واحد من اكبر المراكزالصحية و هو مركز مينافيل بداخل القرية يجعل منها قبلة الباحثين عن الجمال و الهدوء و الصحة المتجددة بما يحويه المركز من برامج علاجية كثيرة و متنوعة منها علاج السمنة و كثير من الالام . واخيرا الرمال السوداء  التى تسهم في الاستشفاء في سفاجا هي رمالها السوداء ذات الطبيعة الخاصة، والتي بها ثلاث مواد مشعة بنسب غير ضارة وهم “اليورانيوم – الثوريوم – البوتاسيوم” بنسبة 40 % ، إضافة الى احتوائها على أغلب العناصر الفلزية المعروفة مع ارتفاع فى كمية أملاح الذهب التى تستخدم فى علاج مرض الروماتويد، الالتهابات المفصلية المزمنة والحادة والتورم، الارتشاح المفصلي” مياه المفاصل”، عقد الجلد خاصة بالمرفقين، والالتهابات الجلدية المصاحبة للروماتويد.", "image": "src='https://www.menaville-resort.com/slideshow/3.png'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.933871455258199, 26.790373179777699, 33.933871455258199 ] } },
  { "type": "Feature", "properties": { "x": 33.811715011088303, "y": 27.2585911368881, "Number": 3, "Name": "مركز أنا أصلان", "Latitude": 27.2585911368881, "Longitude": 33.811715011088303, "Type": null, "Address": null, "Hours": null, "MustSee": "Ana Aslan Center", "MVV": null, "Access": null, "Description": "مركز انا اصلان : يعد مركز أنا أصلان للعلاج الطبيعى من أشهر الأماكن التى توفر علاجات طبيعية فى الغردقة وتعالج بالمركز حالات مرضية كثيرة منها : الاكتئاب والأرق- التهاب وتيبس المفاصل- الشلل الرعاش - انسداد وضيق الشرايين", "image": "src='https://i0.wp.com/www.terhalak.com/wp-content/uploads/2021/05/unnamed.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 33.811715011088303, 27.2585911368881, 33.811715011088303 ] } }
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
