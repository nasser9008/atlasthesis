'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/nassershawkey/clem0hg33008001ms09kvji0o/draft',
  accessToken:
    'pk.eyJ1IjoibmFzc2Vyc2hhd2tleSIsImEiOiJjbGVsemcya2QxMHJvM3ZtaTR5Z2xhdmtiIn0.OKwzr5B3gav9IPo0ujDK6A',
  CSV: './points.csv',
  center: [33.74999999999069, 26.24908309632396],
  zoom: 5.3,
  title: '️️أطلس اقليم جنوب الصعيد السياحى️',
  description:
    '️تصفح قاعدة البيانات السياحية من خلال استخدم خيار (أداة التصفية) أدناه وفقاً للموضوعات المفهرسة وبمجرد تحديد اختيارك من نافذة التصفية اخرج لعرض الخريطة **قد يستغرق بضع ثوان️ى**',
  sideBarInfo: ['name', 'wheelchair', 'website','cuisine','atm'],
  popupInfo: ['name'],
  popupInfo2: ['website'],
  popupInfo3: ['opening_hours'],
  popupInfo4: ['What'],

  filters: [
    {
      type: 'dropdown',
      title: ':اختر المحافظة',
      columnHeader: 'amenity', // Case sensitive - must match spreadsheet entry
      listItems: ['أسوان','البحر الأحمر','قنا','سوهاج','الأقصر'], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },

    {
      type: 'checkbox',
      title: ':الفترة التاريخية',
      columnHeader: 'wheelchair:description',
      listItems: [
        'مواقع ما قبل الأسرات',
        'عصر الدولة القديمة',
      'العصر اليونانى والرومانى والبيزنطى',
        'العصر الاسلامى',
        'العصر الحديث'
      ],
    },

    {
      type: 'checkbox',
      title: ':الأنماط والعروض السياحية ',
      columnHeader: 'tourism',
      listItems: [
        'السياحة الأثرية والتاريخية',
        'السياحة الدينية',
        'السياحة الترفيهية',
        'السياحة الترفيهية',
        'السياحة الشاطئية',
        'السياحة الثقافية',
        'السياحة البيئية',
        'سياحة المغامرات',
        'سياحة المهرجانات'
      ],
    },
      
    
    {
      type: 'checkbox',
      title: ':مشاهد المعالم السياحية',
      columnHeader: 'toilets:wheelchair',
      listItems: [
        'أطلال أثرية',
        'مواقع تاريخية',
        'مقابر أثرية',
        'تماثيل',
      ],
    },
    
  ],
};

