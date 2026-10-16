// THINK LEFT - SDY QUIZ NIGHT DATA SOURCE
const QUIZ_DATA = {
  meta: {
    title: "QUIZ NIGHT",
    brand: "THINK LEFT",
    subtitle: "УХААНАА УРАЛДУУЛАХ ҮДЭШ",
    organization: "SDY Dornogovi (Социал Демократ Залуучуудын Холбоо)",
    logo: "assets/images/sdy_dornogovi_dark.png",
    location: "Дорноговь аймаг, Сайншанд сум",
    contact: "+976 88885069",
    schedule: [
      { num: "01", title: "Нээлт, танилцуулга", time: "5 мин", desc: "Тэмцээний дүрэм, багуудын танилцуулга" },
      { num: "02", title: "1, 2-р үе шат", time: "30 мин", desc: "Зураг таах үе ба Random үеийн сонирхолтой асуултууд" },
      { num: "03", title: "Завсарлага, хөгжөөнт тэмцээн", time: "15 мин", desc: "Хөгжилтэй сорилт, чөлөөт цаг" },
      { num: "04", title: "3, 4-р үе шат", time: "30 мин", desc: "Сонсголын үе ба Говийн бүсийн сэдэвчилсэн асуултууд" },
      { num: "05", title: "Дүн танилцуулах, шагнал", time: "30 мин", desc: "Ялагчдыг тодруулах, шагнал гардуулах" }
    ],
    rules: [
      "Баг тус бүр 6 гишүүний бүрэлдэхүүнтэй байна.",
      "Баг бүр ахлагч болон өвөрмөц нэрээ сонгож бүртгүүлнэ.",
      "Хурд, зөв хариулт, багийн нягт эв нэгдэл хамгийн чухал.",
      "Асуулт бүрд оноогдсон хугацаанд амжиж хариулна.",
      "Хөтлөгчийн шийдвэр эцсийнх байна."
    ]
  },

  rounds: [
    {
      id: "round1",
      number: 1,
      title: "ЗУРАГ ТААХ ҮЕ",
      subtitle: "Түүхэн болон олны танил хүн, эрхмүүдийг таах",
      color: "#00e5ff",
      badge: "1-Р ҮЕ",
      defaultPoints: 2,
      questions: [
        {
          id: "r1_q1",
          questionNumber: 1,
          prompt: "Дараах эрхмүүдийн нэрийг таана уу",
          items: [
            {
              label: "Зүүн талын зураг",
              image: "assets/images/batmonkh.jpg",
              name: "Жамбын Батмөнх",
              title: "БНМАУ-ын Төр, нийгмийн нэрт зүтгэлтэн, эдийн засагч, профессор",
              bio: "Монголын төр, нийгмийн нэрт зүтгэлтэн, 1984-1990 онд МАХН-ын Төв Хорооны Ерөнхий нарийн бичгийн дарга, БНМАУ-ын Ардын Их Хурлын Тэргүүлэгчдийн даргаар ажилласан."
            },
            {
              label: "Баруун талын зураг",
              image: "assets/images/lincoln.jpg",
              name: "Абрахам Линколн",
              title: "АНУ-ын 16 дахь Ерөнхийлөгч",
              bio: "АНУ-ын иргэний дайны үед улс үндэстнээ нэгтгэж, боолчлолыг халсан түүхэн удирдагч."
            }
          ]
        },
        {
          id: "r1_q2",
          questionNumber: 2,
          prompt: "Дараах эрхмүүдийн нэрийг таана уу",
          items: [
            {
              label: "Зүүн талын зураг",
              image: "assets/images/diana.jpg",
              name: "Уэльсийн гүнж Диана",
              title: "Их Британийн язгууртан, Хүмүүнлэгийн элч",
              bio: "Дэлхий дахинд сайн үйлсийн ажил, энэрэнгүй сэтгэлээрээ хайрлагдсан 'Ардын гүнж' (People's Princess)."
            },
            {
              label: "Баруун талын зураг",
              image: "assets/images/surenjav.jpg",
              name: "У. Сүрэнжав",
              title: "Монгол Улсын Хөдөлмөрийн баатар, Паралимпийн аварга",
              bio: "Парис-2024 паралимпын наадмын таеквондогийн төрөлд алтан медаль хүртэж эх орныхоо нэрийг дэлхийд цуурайтуулсан тамирчин."
            }
          ]
        },
        {
          id: "r1_q3",
          questionNumber: 3,
          prompt: "Дараах эрхмүүдийн нэрийг таана уу",
          items: [
            {
              label: "Зүүн талын зураг",
              image: "assets/images/ishowspeed.jpg",
              name: "IShowSpeed /Darren Jason Watkins Jr./",
              title: "Дэлхийн алдартай Youtuber, Streamer",
              bio: "Эрч хүчтэй, хөгжилтэй контентоороо дэлхий даяар сая сая залуусын дагагчтай болсон цахим ертөнцийн од."
            },
            {
              label: "Баруун талын зураг",
              image: "assets/images/yamal.jpg",
              name: "Lamine Yamal",
              title: "Испани болон FC Barcelona клубийн од хөлбөмбөгчин",
              bio: "Евро-2024 наадмын аварга, дэлхийн шилдэг залуу тоглогч, хөлбөмбөгийн ертөнцийн шинэ үеийн супер од."
            }
          ]
        }
      ]
    },

    {
      id: "round2",
      number: 2,
      title: "RANDOM ҮЕ",
      subtitle: "Төрөл бүрийн сонирхолтой асуултууд (Сонголттой)",
      color: "#ff9100",
      badge: "2-Р ҮЕ",
      defaultPoints: 1,
      questions: [
        {
          id: "r2_q1",
          questionNumber: 1,
          question: "Ямар ундааг анх толгойны өвчин, мэдрэлийн өвчин намдаах эм гэж зах зээлд гаргаж байсан бэ?",
          options: [
            { key: "A", text: "Coca Cola", correct: true },
            { key: "B", text: "Fuze tea", correct: false },
            { key: "C", text: "Calpis", correct: false },
            { key: "D", text: "Red bull", correct: false }
          ],
          explanation: "1886 онд Атланта хотын эм зүйч Жон Пембертон Coca-Cola-г толгойн болон мэдрэлийн өвчин намдаах эрүүл мэндийн сироп хэлбэрээр анх худалдаанд гаргаж байжээ."
        },
        {
          id: "r2_q2",
          questionNumber: 2,
          question: "Хүний биеийн хамгийн том дотоод эрхтэн юу вэ?",
          options: [
            { key: "A", text: "Уушиг", correct: false },
            { key: "B", text: "Арьс", correct: false },
            { key: "C", text: "Элэг", correct: true },
            { key: "D", text: "Зүрх", correct: false }
          ],
          explanation: "Хүний биеийн хамгийн том эрхтэн нь нийтдээ арьс (гадаад) боловч, хамгийн том ДОТООД эрхтэн нь Элэг (дунджаар 1.5 кг жинтэй) юм."
        },
        {
          id: "r2_q3",
          questionNumber: 3,
          question: "Дэлхийн агаар мандлын хамгийн их буюу 78.08 хувийг ямар хий бүрдүүлдэг вэ?",
          options: [
            { key: "A", text: "Нүүрстөрөгчийн давхар исэл /CO2/", correct: false },
            { key: "B", text: "Хүчилтөрөгч /O2/", correct: false },
            { key: "C", text: "Азот /N2/", correct: true },
            { key: "D", text: "Аргон /Ar/", correct: false }
          ],
          explanation: "Агаар мандлын 78.08%-ийг Азот (N2), 20.95%-ийг Хүчилтөрөгч (O2), 0.93%-ийг Аргон, харин 0.04%-ийг Нүүрстөрөгчийн давхар исэл эзэлдэг."
        },
        {
          id: "r2_q4",
          questionNumber: 4,
          question: "VIII Богд Жавзандамба ямар гаралтай хүн байсан бэ?",
          options: [
            { key: "A", text: "Халх", correct: false },
            { key: "B", text: "Манж", correct: false },
            { key: "C", text: "Төвд", correct: true },
            { key: "D", text: "Буриад", correct: false }
          ],
          explanation: "VIII Богд Жавзандамба хутагт 1869 онд Төвдийн Лхас хотын ойролцоо төрсөн бөгөөд 1874 онд Монголд залагдан ирж, улмаар 1911 онд Олноо Өргөгдсөн Монгол Улсын Хэмжээгүй эрхт Хаанаар өргөмжлөгдсөн түүхтэй."
        },
        {
          id: "r2_q5",
          questionNumber: 5,
          question: "Европ болон Азийг ямар уулс тусгаарладаг вэ?",
          options: [
            { key: "A", text: "Андын нуруу", correct: false },
            { key: "B", text: "Альпийн нуруу", correct: false },
            { key: "C", text: "Гималайн нуруу", correct: false },
            { key: "D", text: "Уралын нуруу", correct: true }
          ],
          explanation: "Хойд мөсөн далайгаас Каспийн тэнгис хүртэл 2,500 км урт сунаж тогтсон Уралын нуруу нь Европ болон Ази тивийг байгалийн жамаар заагладаг усан хагалбар зааг юм."
        },
        {
          id: "r2_q6",
          questionNumber: 6,
          question: "Шотланд улсын үндэсний амьтан аль нь вэ?",
          options: [
            { key: "A", text: "Scottish Wildcat – Шотландын зэрлэг муур", correct: false },
            { key: "B", text: "Golden eagle – Алтан бүргэд", correct: false },
            { key: "C", text: "Puffin – Паффин шувуу", correct: false },
            { key: "D", text: "The unicorn – Ганц эвэрт", correct: true }
          ],
          explanation: "Ганц эвэрт (Unicorn) нь эрт дээр үеэс Шотландын хааны сүлдэнд эрх чөлөө, ялагдашгүй зориг, цэвэр ариун байдлын билэгдэл болж үндэсний амьтнаар өргөмжлөгджээ."
        }
      ]
    },

    {
      id: "round3",
      number: 3,
      title: "СОНСГОЛЫН ҮЕ",
      subtitle: "Дуучин болон дууны нэрийг таах",
      color: "#e040fb",
      badge: "3-Р ҮЕ",
      defaultPoints: 2,
      instructions: "Хонх цохиж, дуучин болон дууны нэрийг бүрэн зөв бичсэн эсвэл түрүүлж хариулсан баг оноо авна.",
      questions: [
        {
          id: "r3_q1",
          questionNumber: 1,
          hint: "Монголын рок хөгжмийн домогт дуу (32-37 сек)",
          singer: "Харанга хамтлаг (Х. Лхагвасүрэн)",
          songName: "Толин хул",
          genre: "Mongolian Classic Rock",
          year: "1994 он",
          audioSrc: "assets/audio/toliin_khul_32_37.wav",
          melodyPreset: "toliin_khul",
          details: "Х.Лхагвасүрэн агсны дуулсан, морины шандас, монгол хүний хийморийг илэрхийлсэн мөнхийн бүтээл."
        },
        {
          id: "r3_q2",
          questionNumber: 2,
          hint: "Залуусын хайртай уянгын хит (14-19 сек)",
          singer: "Мотив хамтлаг",
          songName: "Цасан бороо",
          genre: "Pop Rock",
          year: "2008 он",
          audioSrc: "assets/audio/tsasan_boroo_14_19.wav",
          melodyPreset: "tsasan_boroo",
          details: "Өвлийн улиралд хамгийн их эгшиглэдэг уянгын алдарт бүтээл."
        },
        {
          id: "r3_q3",
          questionNumber: 3,
          hint: "Дэлхийг байлдан дагуулсан монгол фолк рок (01:23-01:28)",
          singer: "The HU хамтлаг",
          songName: "Wolf Totem (Чонон сүлд)",
          genre: "Hunnu Rock",
          year: "2018 он",
          audioSrc: "assets/audio/wolf_totem_83_88.wav",
          melodyPreset: "wolf_totem",
          details: "Billboard хард рок чартыг тэргүүлсэн, Монголын түүх соёлыг дэлхийд таниулсан супер хит."
        },
        {
          id: "r3_q4",
          questionNumber: 4,
          hint: "Попын хааны алдарт хит",
          singer: "Michael Jackson",
          songName: "Billie Jean",
          genre: "Pop / Funk / Dance",
          year: "1983 он",
          audioSrc: "assets/audio/billie_jean.mp3",
          melodyPreset: "billie_jean",
          details: "Бүх цаг үеийн хамгийн их борлуулалттай 'Thriller' цомгийн гол дуу, саран алхаа бүжгийн эхлэл."
        },
        {
          id: "r3_q5",
          questionNumber: 5,
          hint: "Цэнгэлдэх хүрээлэн донсолгогч рок сүлд (05-10 сек)",
          singer: "Queen хамтлаг",
          songName: "We Will Rock You",
          genre: "Arena Rock",
          year: "1977 он",
          audioSrc: "assets/audio/we_will_rock_you_05_10.wav",
          melodyPreset: "we_will_rock_you",
          details: "Хөл, гарын алга таших цохилтоороо дэлхийн спортын бүх тоглолтод эгшиглэдэг алдарт дуу."
        },
        {
          id: "r3_q6",
          questionNumber: 6,
          hint: "Орчин үеийн 80-аад оны синтпоп хит (16-21 сек)",
          singer: "The Weeknd",
          songName: "Blinding Lights",
          genre: "Synthwave / Pop",
          year: "2019 он",
          audioSrc: "assets/audio/blinding_lights_16_21.wav",
          melodyPreset: "blinding_lights",
          details: "Spotify дээр бүх цаг үеийн хамгийн их сонсогдсон түүхэн дээд амжилтыг тогтоосон дуу."
        }
      ]
    },

    {
      id: "round4",
      number: 4,
      title: "СЭДЭВЧИЛСЭН АСУУЛТЫН ҮЕ",
      subtitle: "Говь нутаг, тэмээ, цөлийн танин мэдэхүй",
      color: "#00e676",
      badge: "4-Р ҮЕ",
      defaultPoints: 2,
      questions: [
        {
          id: "r4_q1",
          questionNumber: 1,
          question: "Дэлхийд нэн ховордсон зэрлэг тэмээ болох хавтгай Монгол Улсаас гадна аль улсад байгальд зэрлэгээр амьдардаг вэ?",
          options: [
            { key: "A", label: "А", text: "Япон", correct: false },
            { key: "B", label: "Б", text: "Энэтхэг", correct: false },
            { key: "C", label: "В", text: "Хятад", correct: true },
            { key: "D", label: "Г", text: "Казахстан", correct: false }
          ],
          answer: "В. Хятад",
          explanation: "Хавтгай (Camelus ferus) нь дэлхийд зөвхөн Монгол Улсын Говийн Их дархан цаазат газар болон БНХАУ-ын баруун хойд хэсгийн Такламакан, Лобнор орчмын цөлд байгальд зэрлэгээр амьдардаг дэлхийд нэн ховордсон амьтан юм."
        },
        {
          id: "r4_q2",
          questionNumber: 2,
          question: "Тэмээний бөхөнд юу байдаг вэ?",
          options: [
            { key: "A", label: "А", text: "Ус", correct: false },
            { key: "B", label: "Б", text: "Өөх тос", correct: true },
            { key: "C", label: "В", text: "Агаар", correct: false },
            { key: "D", label: "Г", text: "Сүү", correct: false }
          ],
          answer: "Б. Өөх тос",
          explanation: "Тэмээний бөх нь ус бус өөх тосоор дүүрсэн байдаг. Хоол тэжээл хомс үед уг өөх тос задарч энерги болон бодисын солилцооны чийг (ус) болон хувирдаг."
        },
        {
          id: "r4_q3",
          questionNumber: 3,
          question: "Тэмээ хэдэн зовхитой вэ?",
          options: [
            { key: "A", label: "А", text: "Нэг", correct: false },
            { key: "B", label: "Б", text: "Хоёр", correct: false },
            { key: "C", label: "В", text: "Гурав", correct: true },
            { key: "D", label: "Г", text: "Дөрөв", correct: false }
          ],
          answer: "В. Гурав (Гурван зовхитой)",
          explanation: "Тэмээ нь цөлийн ширүүн салхи, элсэн шуурганаас нүдээ хамгаалахын тулд 3 зовхитой байдаг. Гурав дахь зовхи нь хагас тунгалаг нимгэн мембран бөгөөд нүдийг элснээс цэвэрлэж, чийглэг байлгадаг."
        },
        {
          id: "r4_q4",
          questionNumber: 4,
          question: "Үлэг гүрвэлийн өндөг, чулуужсан олдвороороо дэлхийд алдартай Монголын говийн газар аль вэ?",
          options: [
            { key: "A", label: "А", text: "Баянзаг", correct: true },
            { key: "B", label: "Б", text: "Хөвсгөл нуур", correct: false },
            { key: "C", label: "В", text: "Харган гол", correct: false },
            { key: "D", label: "Г", text: "Тэрэлж", correct: false }
          ],
          answer: "А. Баянзаг",
          explanation: "1923 онд Рой Чепмэн Эндрюсийн удирдсан Америкийн байгалийн түүхийн төв музейн экспедиц Баянзаг (Flaming Cliffs)-аас дэлхийд анх удаа үлэг гүрвэлийн өндөг олж, олон улсын шинжлэх ухаанд түүхэн нээлт хийсэн билээ."
        },
        {
          id: "r4_q5",
          questionNumber: 5,
          question: "Дэлхий дээрх хамгийн том цөл аль нь вэ?",
          options: [
            { key: "A", label: "А", text: "Сахарын цөл", correct: false },
            { key: "B", label: "Б", text: "Говийн цөл", correct: false },
            { key: "C", label: "В", text: "Антарктидын цөл", correct: true },
            { key: "D", label: "Г", text: "Арабын цөл", correct: false }
          ],
          answer: "В. Антарктидын цөл",
          explanation: "Дэлхийн хамгийн том цөл бол 14.2 сая км² талбайтай хүйтэн туйлын Антарктидын цөл юм. Жилийн тунадас маш бага учир цөлд тооцогддог бөгөөд дэлхийн хамгийн том халуун цөл нь Сахар (9.2 сая км²) юм."
        }
      ]
    }
  ]
};
