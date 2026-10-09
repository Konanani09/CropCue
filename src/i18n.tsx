import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type Lang = 'en' | 'nso' | 'ts' | 've' | 'zu' | 'af';

export interface LangMeta {
  code: Lang;
  label: string;
  flag?: string;
}

export const LANGUAGES: LangMeta[] = [
  { code: 'en',  label: 'English'     },
  { code: 'nso', label: 'Sepedi'      },
  { code: 'ts',  label: 'Xitsonga'    },
  { code: 've',  label: 'Tshivenda'   },
  { code: 'zu',  label: 'isiZulu'     },
  { code: 'af',  label: 'Afrikaans'   }
];

type Dict = Record<string, string>;

const TRANSLATIONS: Record<Lang, Dict> = {
  en: {
    brand_name: 'CropCue',
    tagline: 'Smarter decisions start beneath the soil.',

    nav_home: 'Home',
    nav_soil: 'Soil Health',
    nav_crops: 'Crop Advice',
    nav_plan: 'Planting Plan',
    nav_records: 'Farm Records',

    plan_pill: 'FREE PLAN',
    plan_body: 'Basic farming guidance, 10 AI answers per day.',
    plan_title: 'Your Plan',

    header_home_greeting: 'Good morning, Karabo',
    header_home_crumb: 'Dashboard · Field A · Limpopo',
    header_soil_title: 'Your soil at a glance',
    header_soil_crumb: 'Soil insights · Field A',
    header_crops_title: 'Crops that love your field right now',
    header_crops_crumb: 'Recommendations · Field A',
    header_plan_title: 'Your planting schedule',
    header_plan_crumb: 'Weekly plan · Field A',
    header_records_title: 'Farm records & memory',
    header_records_crumb: 'Past seasons · Field A',

    location_pill: 'Limpopo · Field A',

    hero_title: 'Everything you need to grow well',
    hero_lead: 'Start with your soil to see what your field needs, then get crop advice, plan your weeks, and learn from past harvests.',
    hero_step_next: 'A good place to begin:',

    card1_tag: 'SOIL',
    card1_title: 'Check your soil health',
    card1_body: 'Your soil sensor shows moisture, warmth, and nutrients — everything seeds need to thrive.',
    card1_action: 'Open soil insights',

    card2_tag: 'CROPS',
    card2_title: 'Get crop advice',
    card2_body: 'See which crops will grow well in your soil and weather, and why they are a great match.',
    card2_action: 'See recommendations',

    card3_tag: 'PLAN',
    card3_title: 'Know when to plant',
    card3_body: 'Follow a simple weekly schedule so you plant, water, and check at the right moments.',
    card3_action: 'Open planting plan',

    card4_tag: 'HISTORY',
    card4_title: 'Learn from past seasons',
    card4_body: 'CropCue remembers your old harvests so next season\'s advice gets even better.',
    card4_action: 'See farm records',

    sensor_connected: 'Sensor is working',
    sensor_low_bat: 'Replace battery soon',
    sensor_offline: 'Sensor is offline',
    sensor_sync: 'Tap to update now',

    soil_moisture: 'Water in soil',
    soil_temp: 'Soil warmth',
    soil_ph: 'Soil balance (pH)',
    soil_n: 'Nitrogen (food)',
    soil_p: 'Phosphorus',
    soil_k: 'Potassium',
    soil_ec: 'Salt level',
    soil_tension: 'Dryness',

    weather_today: 'Today',
    weather_rain: 'Rain',
    weather_hot: 'Hot',
    weather_cold: 'Cool',
    weather_5day: 'Next 5 days',

    weather_insight_title: 'From the sky to your soil',
    weather_rain_title: 'Rain is on the way',
    weather_rain_body: 'Heavy rain expected {days}. Do not plant 1 day before — seeds wash out. Plant 2 days after the last shower.',
    weather_good_title: 'Great planting window',
    weather_good_body: 'The next 5 days look warm and mostly dry — a good window to plant. Water lightly if soil moisture drops below 35%.',
    weather_hot_title: 'Hot days ahead',
    weather_hot_body: 'Hot, dry days are coming. Water early in the morning; mulch after planting to keep moisture in.',

    crop_high: 'Grows very well',
    crop_medium: 'Grows with care',
    crop_low: 'Not a good time',
    crop_plant: 'Plant between',
    crop_why: 'Why this works',
    crop_friends: 'Good neighbours',
    crop_not: 'Do not plant next',
    crop_caveat: 'Keep in mind',
    crop_add: 'Add to my plan',
    crops_intro_body: 'Based on your soil + the week-ahead weather.',

    plan_week: 'Week',
    plan_do: 'What to do',
    plan_note: 'Tip',
    plan_tag_prep: 'Prepare soil',
    plan_tag_plant: 'Plant',
    plan_tag_check: 'Check',
    plan_follow_weeks: 'Work through one week at a time.',
    plan_progress: '{done} of {total} actions done',
    plan_weather_note: 'This plan lines up with the rain window we recommended.',

    records_season: 'Season',
    records_crop: 'Crop',
    records_planted: 'Planted',
    records_harvest: 'Harvested',
    records_yield: 'Bags / kg',
    records_yield_total: 'Total harvest',
    records_notes: 'What happened',
    records_add: 'Add new record',
    records_rotation: 'Advice for next planting',

    footer_note: 'Only real sensor readings are used. No guesses.',

    ui_sensors: 'sensors online',
    ui_battery: 'Battery',
    ui_signal: 'Signal',
    ui_zone: 'Zone',
    ui_updated: 'Updated',
    ui_reads: 'Readings',
    ui_interpretation: 'What your soil is saying',
    ui_legend: 'Green = looking great · Orange = a little attention needed',
    ui_empty: 'Waiting for readings…',
    ui_refresh: 'Refresh all',

    lang_select: 'Language',
    lang_current: 'Current',

    ok: 'OK',
    cancel: 'Cancel'
  },

  nso: {
    brand_name: 'CropCue',
    tagline: 'Dikgetho tse di bogale di simolola tlase ka mobu.',

    nav_home: 'Gae',
    nav_soil: 'Tlamo ya Mobu',
    nav_crops: 'Tlhahlo ya Dijalwa',
    nav_plan: 'Lenaneo la Go Jala',
    nav_records: 'Dipeletsa tsa Temo',

    plan_pill: 'TERATA YA MAHALA',
    plan_body: 'Tlhahlo ya temo ya bose, karabo ya AI 10 ka laotsi.',
    plan_title: 'Terata ya gago',

    header_home_greeting: 'Thobela, Karabo',
    header_home_crumb: 'Seplateng · Temogo A · Limpopo',
    header_soil_title: 'Temo ya gago ka bonala',
    header_soil_crumb: 'Temo ya mobu · Temogo A',
    header_crops_title: 'Dilo tseo di ratang temogo ya gago',
    header_crops_crumb: 'Dikhantlho · Temogo A',
    header_plan_title: 'Lenaneo la gago la go jala',
    header_plan_crumb: 'Lenaneo la beke · Temogo A',
    header_records_title: 'Dipeletsa le memogolo ya temo',
    header_records_crumb: 'Dinyaga tse fetilego · Temogo A',

    location_pill: 'Limpopo · Temogo A',

    hero_title: 'Sena moka o swanetego go hola gabotse',
    hero_lead: 'Simolola ka mobu wa gago go bona seo temogo ya gago e sedirago, gape o fumane tlhahlo ya dijalwa, raleng diketso tsa beke, gape o ithute go diwedi tsa bogologolo.',
    hero_step_next: 'Selo se se thomogang go simolola:',

    card1_tag: 'MOBU',
    card1_title: 'Lekola tlamo ya mobu',
    card1_body: 'Senoteri ya mobu ya gago e bontsha metsi, mocheso le dijo — moka le moka seo dipeo di se dirago.',
    card1_action: 'Bula temo ya mobu',

    card2_tag: 'DIJALWA',
    card2_title: 'Fumane tlhahlo ya dijalwa',
    card2_body: 'Bona dilo tseo di ka hola gabotse mo mobung wa gago le mo tikologong, le ke ka moka di thomoganngwe.',
    card2_action: 'Bona dikhantlho',

    card3_tag: 'LENANEO',
    card3_title: 'Tsebe nako ya go jala',
    card3_body: 'Latela lenaneo le bonolo la beke-beke o jale, o ape le o lekole ka nako e e nepageng.',
    card3_action: 'Bula lenaneo la go jala',

    card4_tag: 'MEMOGOLO',
    card4_title: 'Ithute dinyaga tse fetilego',
    card4_body: 'CropCue e gopola diwedi tsa gago tsa bogologolo go dira gore tlhahlo ya naga e tlang e e thome.',
    card4_action: 'Bona dipeletsa tsa temo',

    sensor_connected: 'Senoteri e go dira mosebetsi',
    sensor_low_bat: 'Simolosa batri gaufi',
    sensor_offline: 'Senoteri ga se e kgone go nna',
    sensor_sync: 'Kgwetla go nchafatsa',

    soil_moisture: 'Metsi mo mobung',
    soil_temp: 'Mocheso wa mobu',
    soil_ph: 'Ditekanelo (pH)',
    soil_n: 'Naitrojene (dijo)',
    soil_p: 'Phosporase',
    soil_k: 'Potasiamo',
    soil_ec: 'Letekaneng la madi',
    soil_tension: 'Kakanyo ya koma',

    weather_today: 'Matsatsi a',
    weather_rain: 'Pula',
    weather_hot: 'Mocha',
    weather_cold: 'Moiti',
    weather_5day: 'Ditsatsi tse 5 tse di tlang',

    weather_insight_title: 'Go tloga legodimo go ya mobung',
    weather_rain_title: 'Pula e tla ka tsela',
    weather_rain_body: 'Pula e e telele e lebelletsweng {days}. Se ke ke o jala ka letsatsi le le fetang go la — dipeo di tshisiwa ke metsi. Jala matsatsi a 2 ka morwa pula e e fetilego.',
    weather_good_title: 'Lenaneo le le thomogang la go jala',
    weather_good_body: 'Ditsatsi tse 5 tse di tlang di bonala di chesa gape gase na metsi — ke nako e e thomogang go jala. Ape metsi ka bonolo ge mobu o ka tlaase ga 35%.',
    weather_hot_title: 'Matsatsi a chesa a tla',
    weather_hot_body: 'Matsatsi a chesa, a koma a tla. Ape metsi hoseng; tshela morago ga go jala go boloka metsi.',

    crop_high: 'E hola gabotse',
    crop_medium: 'E hola ka tlhokomelo',
    crop_low: 'Ga se nako e e thomoganeng',
    crop_plant: 'Jala pakeng tsa',
    crop_why: 'Ke ka moka e dira sentle',
    crop_friends: 'Bagaedi',
    crop_not: 'Se ka se latelang',
    crop_caveat: 'Tlhokomeliso',
    crop_add: 'Kenyelela lenaneong la gago',
    crops_intro_body: 'Go theilwe ke mobu wa gago + nako ya beke e tlang.',

    plan_week: 'Beke',
    plan_do: 'Seo o swanetego go dira',
    plan_note: 'Tlhahlo',
    plan_tag_prep: 'Alafetsa mobu',
    plan_tag_plant: 'Jala',
    plan_tag_check: 'Lekola',
    plan_follow_weeks: 'Dirisa beke le nngwe ka bonolo.',
    plan_progress: '{done} ga di {total} di dirilwe',
    plan_weather_note: 'Lenaneo le la leka le nako ya pula.',

    records_season: 'Naga',
    records_crop: 'Sejalwa',
    records_planted: 'Go jalwa',
    records_harvest: 'Go kotula',
    records_yield: 'Dikgomo / kg',
    records_yield_total: 'Diwedi ka moka',
    records_notes: 'Se se dirilego',
    records_add: 'Kenya tlaleho e mpsha',
    records_rotation: 'Tlhahlo ya go jala gape',

    footer_note: 'Re dirisa fela tekanyo e e filwego ke senoteri. Gase dikakanyo.',

    ui_sensors: 'di senoteri di diragaleng',
    ui_battery: 'Batteri',
    ui_signal: 'Letshwao',
    ui_zone: 'Temogo',
    ui_updated: 'Di nchafeditse',
    ui_reads: 'Ditekanyo',
    ui_interpretation: 'Seo mobu o se bolelang',
    ui_legend: 'Tala = go tla gabotse · Boriti = tlhokomelo e e nnye',
    ui_empty: 'Re emetse ditekanyo…',
    ui_refresh: 'Nchafatsa moka',

    lang_select: 'Puo',
    lang_current: 'Ya gago',

    ok: 'Tumama',
    cancel: 'Hlokomela'
  },

  ts: {
    brand_name: 'CropCue',
    tagline: 'Vona va xiyimo i xiyimo yi sungula hansi ka muvili.',

    nav_home: 'Khaya',
    nav_soil: 'Tlhekelela Muvili',
    nav_crops: 'Tinyiko ya Swilo a Tshalwa',
    nav_plan: 'Lowana wa ku Tshala',
    nav_records: 'Tindhawu za Timo',

    plan_pill: 'LOWANA WA MAHALA',
    plan_body: 'Maleyi wa xiyimo, mibiki ya AI 10 masiku ni masiku.',
    plan_title: 'Lowana wa wena',

    header_home_greeting: 'Avuxeni, Karabo',
    header_home_crumb: 'Dashboard · Ndhuwa A · Limpopo',
    header_soil_title: 'Muvili wa wena hi vona hi lexi',
    header_soil_crumb: 'Tlhekelela muvili · Ndhuwa A',
    header_crops_title: 'Swilo a nga hula kahle ndhuwini ya wena',
    header_crops_crumb: 'Tinyiko · Ndhuwa A',
    header_plan_title: 'Lowana wa wena wa ku tshala',
    header_plan_crumb: 'Lowana wa viki · Ndhuwa A',
    header_records_title: 'Tindhawu za timu na khumbulo',
    header_records_crumb: 'Ngwenyani le yi kale · Ndhuwa A',

    location_pill: 'Limpopo · Ndhuwa A',

    hero_title: 'Swi loko wu faneleke ku endlava xiyimo',
    hero_lead: 'Sungula hi muvili wa wena u bona leswi ndhuwa yi lava, u endlava ku vata tinyiko ya swilo a tshalwa, u rhangela viki-viki, u endlava ku hlola matiko ya ngwenyani.',
    hero_step_next: 'Leswi u faneleke ku sungula:',

    card1_tag: 'MUVILI',
    card1_title: 'Tlhekelela muvili',
    card1_body: 'Sensor wa muvili u vonakisa amatsi, vutomi na dijo — moka leswi diphomola yi lava.',
    card1_action: 'Vula ku hlola muvili',

    card2_tag: 'SWILO',
    card2_title: 'Vata tinyiko ya swilo',
    card2_body: 'Vona swilo a se nga hula kahle endzeni ka ha wena na misaveni, na nchumu wa leswi swi faneleke.',
    card2_action: 'Vona tinyiko',

    card3_tag: 'LOWANA',
    card3_title: 'Tivi nkarhi wa ku tshala',
    card3_body: 'Tlhela lowana le lexi la viki-viki u tshale, u ape le u lekole hi nkarhi lexi.',
    card3_action: 'Vula lowana wa ku tshala',

    card4_tag: 'KHUMBULO',
    card4_title: 'Khumbula ngwenyani le yi kale',
    card4_body: 'CropCue yi khumbula matiko ya wena yi kale yi endlava leswaku tinyiko ya ngwenyani yi yi fanele.',
    card4_action: 'Vona tindhawu za timu',

    sensor_connected: 'Sensor i tirha',
    sensor_low_bat: 'Kheta batri maleby',
    sensor_offline: 'Sensor ha yi humeki',
    sensor_sync: 'Tindla ku va ntsena',

    soil_moisture: 'Matsi a muvili',
    soil_temp: 'Vutomi wa muvili',
    soil_ph: 'Kumisana (pH)',
    soil_n: 'Nayitrojeni (dyo)',
    soil_p: 'Fosforasi',
    soil_k: 'Potasiamo',
    soil_ec: 'Mucha wa mchilo',
    soil_tension: 'Kumisana wa kuma',

    weather_today: 'Namuntlha',
    weather_rain: 'Mvula',
    weather_hot: 'Vutomi',
    weather_cold: 'Kubele',
    weather_5day: 'Miyaswi ya misati ya hlanu',

    weather_insight_title: 'Ku suka eka misava u ya muvilini',
    weather_rain_title: 'Mvula i ta ku nga',
    weather_rain_body: 'Mvula i mikulu i leteleke {days}. U nga tshali eka siku le nga pfuxeti — diphomola yi tshisiwa hi amatsi. Tshala miyaswi ya 2 ehansi ka mvula.',
    weather_good_title: 'Nkarhi wa ku tshala hi wena',
    weather_good_body: 'Miyaswi ya hlanu yi ta vona hi vutomi, yi hina amatsi — nkarhi lexi u faneleke ku tshala. Ape amatsi hi lexi leswaku muvili u fike 35%.',
    weather_hot_title: 'Masiku a vutomi a ta ku nga',
    weather_hot_body: 'Masiku a vutomi, a kuma a ta ku nga. Ape amatsi hoseng; tshimela morago ga ku tshala ku swi amatsi.',

    crop_high: 'I hula kahle',
    crop_medium: 'I hula na tlhekiliso',
    crop_low: 'A hi nkarhi lexi',
    crop_plant: 'Tshala pakeng',
    crop_why: 'Nchumu wa hula kahle',
    crop_friends: 'Vana va ndhawu',
    crop_not: 'U nga tshali eke lesri',
    crop_caveat: 'Tlhekiliso',
    crop_add: 'Kenya lowana',
    crops_intro_body: 'Endleke hi muvili wa wena + mvula ya viki.',

    plan_week: 'Viki',
    plan_do: 'Leswaku u endla',
    plan_note: 'Maleyi',
    plan_tag_prep: 'Alafetxa muvili',
    plan_tag_plant: 'Tshala',
    plan_tag_check: 'Hlayisela',
    plan_follow_weeks: 'Endla viki na nngwe hi lexi.',
    plan_progress: '{done} ya {total} yi endliwile',
    plan_weather_note: 'Lowana lexi u lekile na nkarhi wa mvula.',

    records_season: 'Ngwenyani',
    records_crop: 'Sejalwa',
    records_planted: 'Ku tshaliwa',
    records_harvest: 'Ku kotula',
    records_yield: 'Tiko / kg',
    records_yield_total: 'Matiko ya moka',
    records_notes: 'Leswaku endile',
    records_add: 'Kenya tlaleho lempa',
    records_rotation: 'Maleyi wa ku tshala gape',

    footer_note: 'Hi tirhisa fela tekanyo ya sensor. A hi na kakarhi.',

    ui_sensors: 'masensors a humekile',
    ui_battery: 'Bhatri',
    ui_signal: 'Xikarhi',
    ui_zone: 'Ndhuwa',
    ui_updated: 'Vuyisile',
    ui_reads: 'Tekanyo',
    ui_interpretation: 'Leswaku muvili u bira',
    ui_legend: 'Matala = ku hula kahle · Nkoka = tlhekiliso ye nca',
    ui_empty: 'Ri emetse tekanyo…',
    ui_refresh: 'Vuyisa moka',

    lang_select: 'Lurimo',
    lang_current: 'Ya wena',

    ok: 'Endla',
    cancel: 'Heka'
  },

  ve: {
    brand_name: 'CropCue',
    tagline: 'Nthuso ya inwe ya zwoṱhe i tshimbila finiho hashu.',

    nav_home: 'Haya',
    nav_soil: 'Tlamo ya Hashu',
    nav_crops: 'Nthuso ya Sejalwa',
    nav_plan: 'Lwanzhe lwa u Toma',
    nav_records: 'Mianzwa ya Temo',

    plan_pill: 'LWANZHE WA MAHALA',
    plan_body: 'Nthuso ya temo, zwiṱho za AI 10 masiku a ḽo.',
    plan_title: 'Lwanzhe lwa wena',

    header_home_greeting: 'Ndaa, Karabo',
    header_home_crumb: 'Dashboard · Tshimo A · Limpopo',
    header_soil_title: 'Hashu a wena a ongolaho',
    header_soil_crumb: 'Temo ya hashu · Tshimo A',
    header_crops_title: 'Zwo se vhudikiwa zwa u toma tshimoni',
    header_crops_crumb: 'Ṋangafaro · Tshimo A',
    header_plan_title: 'Lwanzhe lwa wena lwa u toma',
    header_plan_crumb: 'Lwanzhe lwa vheke · Tshimo A',
    header_records_title: 'Mianzwa ya temo na mulingo',
    header_records_crumb: 'Ngwenyani dza kale · Tshimo A',

    location_pill: 'Limpopo · Tshimo A',

    hero_title: 'Zwa wena zwoṱhe zwa u hula zwoṱhe',
    hero_lead: 'Tshimbulani hashu a wena u oṱha tshimo u oṱha zwo u lavaho, u vhure nthuso ya sejalwa, u ṱoḓela vheke-vheke, u ṱoḓela mulingo wa ngwani wa kale.',
    hero_step_next: 'Zwo u fanela u simbura:',

    card1_tag: 'HASHU',
    card1_title: 'Ṱolai tlamo ya hashu',
    card1_body: 'Sensor ya hashu i ṱonisa mvura, khushu na misho — zwoṱhe zwa diphio di lavaho.',
    card1_action: 'Vhula ku ṱola hashu',

    card2_tag: 'SEJALWA',
    card2_title: 'Ṋa nthuso ya sejalwa',
    card2_body: 'Ṋa zwo se vhudikiwa hula zwoṱhe tshimoni a wena na maikoni, na vhumbi wa vhumbi.',
    card2_action: 'Ṋa ṱangafaro',

    card3_tag: 'LWANZHE',
    card3_title: 'Tivi nambi ya u toma',
    card3_body: 'Tendela lwanzhe lwa vheke-vheke u toṱe, u ṱoḓela u ṱola u ṱola khushu.',
    card3_action: 'Vhula lwanzhe lwa u toma',

    card4_tag: 'MULINGO',
    card4_title: 'Ṱolai mulingo wa ngwani wa kale',
    card4_body: 'CropCue i khumbula mavhele a wena a kale u vhure nthuso ya inwe.',
    card4_action: 'Ṋa mianzwa ya temo',

    sensor_connected: 'Sensor i shumisa',
    sensor_low_bat: 'Khetha batri malofha',
    sensor_offline: 'Sensor ha i thuletshwe',
    sensor_sync: 'Tshimbudza u vha ntswa',

    soil_moisture: 'Mvura hashu',
    soil_temp: 'Khushu ya hashu',
    soil_ph: 'Kumisana (pH)',
    soil_n: 'Nayithrojini (misho)',
    soil_p: 'Fosforasi',
    soil_k: 'Potasiyamu',
    soil_ec: 'Mulingo wa madi',
    soil_tension: 'Kumisana wa khomayo',

    weather_today: 'Nndilo',
    weather_rain: 'Mvula',
    weather_hot: 'Khushu',
    weather_cold: 'Phanda',
    weather_5day: 'Masiku a 5 a tshi tuhla',

    weather_insight_title: 'Go tshi tshimbila divhuni u ya hashu',
    weather_rain_title: 'Mvula i guda',
    weather_rain_body: 'Mvula i mihulu i lelwelwa {days}. U nga tomeli siku i ṱhoho — diphio di washwa. Toma masiku a 2 aṱshimbwa nga mvula.',
    weather_good_title: 'Nambi ya u toṱe ya nwana',
    weather_good_body: 'Masiku a 5 a tshi tuhla a khushu, a sina mvula — nambi iyi u faneleka u toma. Ṭopela mvura hi ṱoḓela u toṱe hashu u fike 35%.',
    weather_hot_title: 'Masiku a khushu a guda',
    weather_hot_body: 'Masiku a khushu, a khomayo a guda. Ape mvura hoseng; tshimbudzana a u toma u swi mvura.',

    crop_high: 'I hula zwoṱhe',
    crop_medium: 'I hula na u shelela',
    crop_low: 'A i nambi iyi',
    crop_plant: 'Toma pakeng',
    crop_why: 'Ngano ya hula zwoṱhe',
    crop_friends: 'Vhana ḽa vhudza',
    crop_not: 'U nga tomeli lesri',
    crop_caveat: 'U shelele',
    crop_add: 'Kenya lwanzheni',
    crops_intro_body: 'Ṱolulwa na hashu a wena + maiko a vheke.',

    plan_week: 'Vheke',
    plan_do: 'Zwo u fanela u vha',
    plan_note: 'Nthuso',
    plan_tag_prep: 'Fetesa hashu',
    plan_tag_plant: 'Toma',
    plan_tag_check: 'Ṱolai',
    plan_follow_weeks: 'Enda vheke na nngwe hi ṱoḓela.',
    plan_progress: '{done} kha {total} di endilwe',
    plan_weather_note: 'Lwanzhe lexi u lekile na nambi ya mvula.',

    records_season: 'Ngwani',
    records_crop: 'Sejalwa',
    records_planted: 'Ku tomwa',
    records_harvest: 'Ku kotola',
    records_yield: 'Mavu / kg',
    records_yield_total: 'Mavhele a moka',
    records_notes: 'Zwo vhadzile',
    records_add: 'Kenya tlaleho yeṱsha',
    records_rotation: 'Nthuso ya u toma zwoṱhe',

    footer_note: 'Ri shumisa fela tekanyo ya sensor. A ri na kakarhi.',

    ui_sensors: 'masensors a humedzwa',
    ui_battery: 'Bhatri',
    ui_signal: 'Huṱoho',
    ui_zone: 'Tshimo',
    ui_updated: 'Vhudzidzi',
    ui_reads: 'Tekanyo',
    ui_interpretation: 'Zwo hashu hu bira',
    ui_legend: 'Tshanzha = ku hula zwoṱhe · Dembe = ṱoḓela ye nṱha',
    ui_empty: 'Ri humbela tekanyo…',
    ui_refresh: 'Vhudzidza moka',

    lang_select: 'Lurimi',
    lang_current: 'Ya wena',

    ok: 'Enda',
    cancel: 'Renguluka'
  },

  zu: {
    brand_name: 'CropCue',
    tagline: 'Izinqumo ezilungile ziqala phansi emphini.',

    nav_home: 'Ikhaya',
    nav_soil: 'Isimo Somhlaba',
    nav_crops: 'Isipiliyoni Sezitshalo',
    nav_plan: 'Uhlelo Lokutshala',
    nav_records: 'Amarekhodi Womlimi',

    plan_pill: 'UHLELO LWAMAHALA',
    plan_body: 'Inhlaliso yolimo, impendulo ye-AI 10 nsuku zonke.',
    plan_title: 'Uhlelo lwakho',

    header_home_greeting: 'Sawubona, Karabo',
    header_home_crumb: 'Dashboard · Insimu A · Limpopo',
    header_soil_title: 'Umhlaba wakho ubhekene kanjani',
    header_soil_crumb: 'Uhlelo lomhlaba · Insimu A',
    header_crops_title: 'Izitshalo ezithandayo insimu yakho namhlanje',
    header_crops_crumb: 'Izinkinga · Insimu A',
    header_plan_title: 'Uhlelo lwakho lokutshala',
    header_plan_crumb: 'Uhlelo lweveki · Insimu A',
    header_records_title: 'Amarekhodi womlimi nokukhumbula',
    header_records_crumb: 'Isizini esedlule · Insimu A',

    location_pill: 'Limpopo · Insimu A',

    hero_title: 'Konke okudingekayo ukukhula kahle',
    hero_lead: 'Qala ngomhlaba wakho ubone ukuthi insimu ikudehla ukuthini, uzuze isipiliyoni sezitshalo, uhlele izinsuku zakho, uzuze ufunde ngemvumo yakha edlule.',
    hero_step_next: 'Indawo ekahle yokugqiba:',

    card1_tag: 'UMHLABA',
    card1_title: 'Hlolisa isimo somhlaba',
    card1_body: 'Isiphaza somhlaba sikhombisa amanzi, ukushisa nezakudla — konke okudingekayo izitshalo.',
    card1_action: 'Vula ukuhlola umhlaba',

    card2_tag: 'IZITSHALO',
    card2_title: 'Thola isipiliyoni sezitshalo',
    card2_body: 'Bona izitshalo ezizokhula kahle endaweni yakho nasekhundleni, futhi kungani zikhethwa.',
    card2_action: 'Bona izinkinga',

    card3_tag: 'UHLELO',
    card3_title: 'Yazi isikhathi sokutshala',
    card3_body: 'Landela uhlelo olula lweveki-neveki utshale, uancaze uhlolise esikhathini esifanele.',
    card3_action: 'Vula uhlelo lokutshala',

    card4_tag: 'KHUMBULO',
    card4_title: 'Funda ngesizini esedlule',
    card4_body: 'I-CropCue ikhumbula ovinjileyo wakho ukuze isipiliyoni sezingwenya sibe ncono.',
    card4_action: 'Bona amarekhodi womlimi',

    sensor_connected: 'I-sensor isebenza',
    sensor_low_bat: 'Tshekha ibhutteri maduze',
    sensor_offline: 'I-sensor ayisekho',
    sensor_sync: 'Chofoza ukuvuselela',

    soil_moisture: 'Amanzi omhlaba',
    soil_temp: 'Ukushisa komhlaba',
    soil_ph: 'Ukuzingela (pH)',
    soil_n: 'I-Nitrogen (ukudla)',
    soil_p: 'I-Phosphorus',
    soil_k: 'I-Potassium',
    soil_ec: 'Izinga letiwali',
    soil_tension: 'Ukuzingela kokom',

    weather_today: 'Namhlanje',
    weather_rain: 'Imvula',
    weather_hot: 'Umlilo',
    weather_cold: 'Ubusuku',
    weather_5day: 'Izinselelo zesisu ezi-5 ezizayo',

    weather_insight_title: 'Kusuka ezulwini uye emhlabeni',
    weather_rain_title: 'Imvula izoya',
    weather_rain_body: 'Imvula enkulu ilindelwe {days}. Ungatshali usuku olungaphezulu — izitshalo ziyakugelethwa uzwa amanzi. Tshala izinsuku ezimbili emva kwemvula.',
    weather_good_title: 'Isikhathi esihle sokutshala',
    weather_good_body: 'Izinsuku ezi-5 ezizayo zibukeka zishisa futhi zingenamvula — isikhathi esihle sokutshala. Anceza amanzi kancane uma umhlaba wehliswa ezingeni 35%.',
    weather_hot_title: 'Izinsuku ezishisa zizoya',
    weather_hot_body: 'Izinsuku ezishisa, ezikomayo zizoya. Anceza amanzi ekuseni; ufake uncoumhlaba emva kokutshala ugcine amanzi.',

    crop_high: 'Iyakhula kahle kakhulu',
    crop_medium: 'Iyakhula ngenhlalakahle',
    crop_low: 'Ayisikhathi esilungile',
    crop_plant: 'Tshala phakathi',
    crop_why: 'Uhlobo lokukhula kahle',
    crop_friends: 'Abangani bendawo',
    crop_not: 'Ungalutshali lesi',
    crop_caveat: 'Nhlalakahle',
    crop_add: 'Faka ekuhleni lwakhona',
    crops_intro_body: 'Kukhethwe ngomhlaba wakho + isimo sezulu seveki.',

    plan_week: 'Iveki',
    plan_do: 'Okufanele wenze',
    plan_note: 'Isiqondiso',
    plan_tag_prep: 'Hlela umhlaba',
    plan_tag_plant: 'Tshala',
    plan_tag_check: 'Hlolisa',
    plan_follow_weeks: 'Sebenzisa eveki ngalinye kancane.',
    plan_progress: '{done} kwezi {total} seziwenziwe',
    plan_weather_note: 'Uhlelo luhambisana nesikhathi semvula.',

    records_season: 'Isizini',
    records_crop: 'Isitshalo',
    records_planted: 'Ikushatshaliwa',
    records_harvest: 'Ukukotula',
    records_yield: 'Izingcezu / kg',
    records_yield_total: 'Umvumo wonke',
    records_notes: 'Okwenzekile',
    records_add: 'Faka umrekha omusha',
    records_rotation: 'Isiqondiso sokuphenduka',

    footer_note: 'Sisebenzisa kuphela amanani e-sensor. Akukho ukuthikiswa.',

    ui_sensors: 'amasensors aqhathanisiwe',
    ui_battery: 'Ibhethri',
    ui_signal: 'Isiqondiso',
    ui_zone: 'Insimu',
    ui_updated: 'Buyiselwe',
    ui_reads: 'Izilinganiso',
    ui_interpretation: 'Ukuthi umhlaba uthini',
    ui_legend: 'Luhlaza = kuhamba kahle · Okhotsimunye = ukunaka okuncane',
    ui_empty: 'Silindile izilinganiso…',
    ui_refresh: 'Buyisela konke',

    lang_select: 'Ulimi',
    lang_current: 'Lwakho',

    ok: 'Yenza',
    cancel: 'Cela'
  },

  af: {
    brand_name: 'CropCue',
    tagline: 'Slimmer besluite begin onder die grond.',

    nav_home: 'Tuis',
    nav_soil: 'Grondgesondheid',
    nav_crops: 'Gewas-advies',
    nav_plan: 'Plantplan',
    nav_records: 'Plaasrekords',

    plan_pill: 'GRATIS PLAN',
    plan_body: 'Basiese boerdery-richtlyne, 10 AI-antwoorde per dag.',
    plan_title: 'Jou plan',

    header_home_greeting: 'Goeie môre, Karabo',
    header_home_crumb: 'Tuisblad · Veld A · Limpopo',
    header_soil_title: 'Jou grond in oënskou',
    header_soil_crumb: 'Grondinsigte · Veld A',
    header_crops_title: 'Gewasse wat jou veld nou liefhet',
    header_crops_crumb: 'Aanbevelings · Veld A',
    header_plan_title: 'Jou plantskedule',
    header_plan_crumb: 'Weeklikse plan · Veld A',
    header_records_title: 'Plaasrekords & geheue',
    header_records_crumb: 'Vorige seisoene · Veld A',

    location_pill: 'Limpopo · Veld A',

    hero_title: 'Alles wat jy nodig het om goed te groei',
    hero_lead: 'Begin met jou grond om te sien wat jou veld nodig het, kry dan gewas-advies, beplan jou weke, en leer van vorige oeste.',
    hero_step_next: '\'n Goeie plek om te begin:',

    card1_tag: 'GROND',
    card1_title: 'Toets jou grondgesondheid',
    card1_body: 'Jou grondsensor wys vog, warmte en voeding — alles wat sade nodig het om te floreer.',
    card1_action: 'Maak grondinsigte oop',

    card2_tag: 'GEWASSE',
    card2_title: 'Kry gewas-advies',
    card2_body: 'Sien watter gewasse goed in jou grond en weer sal groei, en hoekom hulle \'n goeie pasmaat is.',
    card2_action: 'Sien aanbevelings',

    card3_tag: 'PLAN',
    card3_title: 'Weet wanneer om te plant',
    card3_body: 'Volg \'n eenvoudige weeklikse skedule sodat jy plant, water en toets op die regte oomblikke.',
    card3_action: 'Maak plantplan oop',

    card4_tag: 'GESKIEDENIS',
    card4_title: 'Leer van vorige seisoene',
    card4_body: 'CropCue onthou jou vorige oeste sodat volgende seisoen se advies nog beter word.',
    card4_action: 'Sien plaasrekords',

    sensor_connected: 'Sensor werk',
    sensor_low_bat: 'Vervang battery binnekort',
    sensor_offline: 'Sensor is af',
    sensor_sync: 'Tik om nou te verfris',

    soil_moisture: 'Water in grond',
    soil_temp: 'Grondwarmte',
    soil_ph: 'Balans (pH)',
    soil_n: 'Stikstof (voeding)',
    soil_p: 'Fosfaat',
    soil_k: 'Kalium',
    soil_ec: 'Soutpeil',
    soil_tension: 'Droogte',

    weather_today: 'Vandag',
    weather_rain: 'Reën',
    weather_hot: 'Warm',
    weather_cold: 'Koel',
    weather_5day: 'Volgende 5 dae',

    weather_insight_title: 'Van die lug na jou grond',
    weather_rain_title: 'Reën is onderweg',
    weather_rain_body: 'Swaar reën verwag {days}. Moet 1 dag voor reën plant — sade spoel weg. Plant 2 dae ná die laaste reënval.',
    weather_good_title: 'Groot planttydvak',
    weather_good_body: 'Die volgende 5 dae lyk warm en meestal droog — \'n goeie tyd om te plant. Water liggies as grondvog onder 35% sak.',
    weather_hot_title: 'Warm dae voor',
    weather_hot_body: 'Warm, droë dae kom. Water vroegoggend; plaas deklaag na plant om vog in te hou.',

    crop_high: 'Groei baie goed',
    crop_medium: 'Groei met sorg',
    crop_low: 'Nie die beste tyd nie',
    crop_plant: 'Plant tussen',
    crop_why: 'Waarom dit werk',
    crop_friends: 'Goeie bure',
    crop_not: 'Moenie hierna plant nie',
    crop_caveat: 'Hou in gedagte',
    crop_add: 'Voeg by my plan',
    crops_intro_body: 'Gebaseer op jou grond + die komende week se weer.',

    plan_week: 'Week',
    plan_do: 'Wat om te doen',
    plan_note: 'Wenke',
    plan_tag_prep: 'Berei grond voor',
    plan_tag_plant: 'Plant',
    plan_tag_check: 'Gaan na',
    plan_follow_weeks: 'Werk een week op \'n slag.',
    plan_progress: '{done} van {total} aksies gedoen',
    plan_weather_note: 'Hierdie plan pas by die reënval-tydvak.',

    records_season: 'Seisoen',
    records_crop: 'Gewas',
    records_planted: 'Geplant',
    records_harvest: 'Geoes',
    records_yield: 'Sakke / kg',
    records_yield_total: 'Totale oes',
    records_notes: 'Wat gebeur het',
    records_add: 'Voeg nuwe rekord toe',
    records_rotation: 'Advies vir volgende planting',

    footer_note: 'Slegs regte sensor-lesings word gebruik. Geen raaie.',

    ui_sensors: 'sensors aanlyn',
    ui_battery: 'Battery',
    ui_signal: 'Sein',
    ui_zone: 'Veld',
    ui_updated: 'Opgedateer',
    ui_reads: 'Lesings',
    ui_interpretation: 'Wat jou grond sê',
    ui_legend: 'Groen = lyk goed · Oranje = bietjie aandag nodig',
    ui_empty: 'Wag vir lesings…',
    ui_refresh: 'Verfris alles',

    lang_select: 'Taal',
    lang_current: 'Huidige',

    ok: 'OK',
    cancel: 'Kanselleer'
  }
};

function translate(lang: Lang, key: string): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

export function formatTranslated(
  template: string,
  vars: Record<string, string | number>
): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return out;
}

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  languages: typeof LANGUAGES;
  t: (key: string) => string;
  tf: (key: string, vars: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx | null>(null);
const STORAGE_KEY = 'cropcue.lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
    } catch {/* ignore */}
    const nav = (typeof navigator !== 'undefined' ? navigator.language : 'en').toLowerCase();
    if (nav.startsWith('af')) return 'af';
    if (nav.startsWith('zu')) return 'zu';
    if (nav.startsWith('nso')) return 'nso';
    if (nav.startsWith('ts')) return 'ts';
    if (nav.startsWith('ve')) return 've';
    return 'en';
  });

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch {/* ignore */}
    try { (document.documentElement as HTMLElement).lang = lang; } catch {/* ignore */}
  }, [lang]);

  const value = useMemo<I18nCtx>(() => ({
    lang,
    setLang: setLangState,
    languages: LANGUAGES,
    t: (k) => translate(lang, k),
    tf: (k, vars) => formatTranslated(translate(lang, k), vars)
  }), [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
