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
  "name": "festival",
  "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  "features": [
  { "type": "Feature", "properties": { "x": 32.6577248039032, "y": 25.717530717741599, "Number": 1, "Name": "تعامد الشمس على معبد الكرنك", "Latitude": 25.717530717741599, "Longitude": 32.6577248039032, "Type": null, "Address": null, "Hours": null, "MustSee": null, "MVV": null, "Access": null, "Description": "تعتبر ظاهرة تعامد الشمس على معبد الكرنك من أكثر ما يتميز به المعبد، و هي ظاهرة فلكية تتكرر مع بداية فصل الشتاء و فصل الصيف، تحدث هذه الظاهرة سنويا كاعلان عن بداية فصل الشتاء رسميا في 21 من ديسمبر، حيث كما تعتبر هذه الظاهرة أحد أهم عوامل جذب السياح للمعبد في هذا التوقيت من كل عام، حيث يمكن رؤية قرص الشمس متوسط البوابة الشرقية، و بعدها تكون الشمس عمودية على الأماكن المقدسة، و هي قدس أقداس الاله امون، بالاضافة إلى الفناء المفتوح و صالة الأعمدة، و عند منتتصف النهار تنتشر أشعة الشمس بداخلها في مشهد جمالي و ساحر يسلب العقول، و يعبر عن مدى قوة القدماء المصريين في علوم الفلك  و الهندسة، لذلك فإن معبد الكرنك يعتبر معلم ديني، يوضح مدى علاقة المصريين القدماء بالالهه، كما أنه مرتبط بالظواهر الفلكية و الطبيعية و تغيرات الفصول، حيث كان المزارعين يستدلوا بالمعبد لتحديد أنواع المحاصيل. يتعامد قرص الشمس  تحديدا على قدس أقداس الاله امون، تم اكتشاف هذه الظاهر لأول مرة في سنة 2005.", "image": "src='https://www.cairo24.com/UploadCache/libfiles/57/0/600x338o/783.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.6577248039032, 25.717530717741599, 32.6577248039032 ] } },
  { "type": "Feature", "properties": { "x": 31.625584423279999, "y": 22.338125036944199, "Number": 2, "Name": "تعاد الشمس على وجه رمسيس الثانى", "Latitude": 22.338125036944199, "Longitude": 31.625584423279999, "Type": null, "Address": null, "Hours": null, "MustSee": null, "MVV": null, "Access": null, "Description": "وهي ظاهرة فريدة، ينفرد بها معبد “أبو سمبل” ذو التصميم الفريد، الذي تم نحته في الصخر في عهد الأسرة التاسعة عشرة، بأمر من الملك رمسيس الثاني، الذي أمر ببناء معبدين، معبد كبير له، ومعبد صغير بجواره لزوجته الملكة نفرتاري. وقد اكتشف المعبد الرحالة السويسري (يوهان لودفيج بوركهارت) عام 1817، وأطلق عليه اسم “أبو سمبل” على اسم الصبي الذي قاده إلى هذا المكان. يُعَد المعبد أحد مواقع التراث العالمي لليونسكو، التي أسهمت بالتعاون مع الحكومة المصرية، وبمساعدة العديد من الدول والمنظمات وأبرزها منظمة اليونسكو، في إنقاذ المعبدين من الزيادة في ارتفاع منسوب المياه في بحيرة ناصر، بسبب بناء السد العالي. حيث تم نقل المعبدين، عن طريق تفكيك أجزائهما وقطعها بعناية إلى مكعبات حجرية ضخمة يصل وزن الواحد منها إلى 30 طنا، ثم ترقيمها وإعادة بنائها في نقطة أعلى من مستوى مياه نهر النيل. ومن الجدير بالذكر أن تعامد الشمس على وجه الملك رمسيس الثاني كان يحدث في 21 فبراير و21 أكتوبر قبل نقل المعابد، وبعد نقلها يحدث يوم 22. ويعود ذلك إلى تغيير خطوط الطول والعرض بسبب نقل المعبد من مكانه الأصلي 120 مترا غربا و60 مترا ارتفاعا. وكان أول من رصد ظاهرة تعامد الشمس على تمثال رمسيس الثاني، هي الكاتبة البريطانية إميليا إدوارد والفريق المرافق لها.", "image": "src='https://cnn-arabic-images.cnn.io/cloudinary/image/upload/w_1920,c_scale,q_auto/cnnarabic/2020/02/22/images/147662.jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 31.625584423279999, 22.338125036944199, 31.625584423279999 ] } },
  { "type": "Feature", "properties": { "x": 32.646408557617399, "y": 25.709022255295402, "Number": 3, "Name": "مهرجان كتشاف مقبرة الملك توت عنخ آمون", "Latitude": 25.709022255295402, "Longitude": 32.646408557617399, "Type": null, "Address": null, "Hours": null, "MustSee": null, "MVV": null, "Access": null, "Description": "تعد مقبرة الملك توت عنخ آمون (حوالي1336-1327 ق.م) من الأسرة الثامنة عشر ذات  شهرة عالمية لأنها المقبرة الملكية الوحيدة بوادي الملوك التي تم اكتشاف محتوياتها سليمة وكاملة نسبيًا. وكان اكتشاف المقبرة الذي تم في عام 1922 من قبل هوارد كارتر قد احتل العناوين الرئيسية في صحف جميع أنحاء العالم، حيث صاحب ذلك ظهور التحف الذهبية وغيرها من القطع الفاخرة التي اكتشفت بالمقبرة. تعتبر مقبرة توت عنخ آمون وكنوزها أيقونة لمصر ولا يزال اكتشافها أحد أهم الاكتشافات الآثرية حتى الآن.", "image": "src='https://vid.alarabiya.net/images/2018/02/02/0cfdbece-664d-4940-9567-2a67991c1626/0cfdbece-664d-4940-9567-2a67991c1626_16x9_1200x676.JPG?width=372&format=jpg'", "image2": null, "imgsource": null, "Website": null, "Phone": null, "wheelchair": null, "wc": null, "parking": null, "parking_text": null, "elevator": null, "elderly": null, "stroller": null, "guidedTour": null, "guideDog": null, "audioGuide": null }, "geometry": { "type": "Point", "coordinates": [ 32.646408557617399, 25.709022255295402, 32.646408557617399 ] } }
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
