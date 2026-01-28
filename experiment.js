//Browser check
 if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
    alert("A Safari ebben a kutatásban nem támogatott böngésző. Kérlek használj Chrome-ot vagy Firefoxot!");
    throw new Error("Safari not supported");
}

//URL Parameters
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);

// Debug mode
const debug = false;
console.log(debug);

//Initialize jsPsych
let jsPsych = initJsPsych();


//Stimulus time parameters
const durations = {
    prime_duration: debug ? 1 : 133,
    blank_duration: debug ? 1 : 33,
    probe_stim_duration: debug ? 1 : 133,
    probe_trial_duration: debug ? 1 : 1000
}

//Fixation
const fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: debug ? 1 : Math.random() * (600 - 400) + 400,
    data: {
        task: 'fixation'
    }
}

//Prime
const prime = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('prime'),
    choices: 'NO_KEYS',
    trial_duration: durations.prime_duration,
    data: {
        task: 'prime'
    }
}

//Blank
const blank = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '',
    choices: 'NO_KEYS',
    trial_duration: durations.blank_duration,
    data: {
        task: 'blank'
    }
}

//Probe
const probe = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('probe'),
    choices: ['a', 'e', 'n', 'l'],
    stimulus_duration: durations.probe_stim_duration,
    trial_duration: durations.probe_trial_duration,
    response_ends_trial: false,
    data: {
        task: 'probe',
        correct_response: jsPsych.timelineVariable('correct_response'),
        congruency: jsPsych.timelineVariable('congruency'),
        color: jsPsych.timelineVariable('color'),
        monetary: jsPsych.timelineVariable('monetary'),
        name: jsPsych.timelineVariable('name')
    },
    on_finish: function (data) {
        console.log('Response data:', data);
        console.log('Key pressed:', data.response);
        data.correct = data.response === data.correct_response;
    }
}

//Practice parameters
const practice = {
    cutoff: 1000,
    feedback_duration: 700,
    accuracy_threshold: 0.8
};

//Creating subject code
let subj_code;
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
        }
    subj_code = makeid(6);
console.log(subj_code);
jsPsych.data.addProperties({subj_code: subj_code}); 

//Preparing stimulus variables
const probe_colors = {
    red: "#FF3B3B",
    green: "#00E676",
    blue: "#2979FF",
    yellow: "#FFD700",
    magenta: "#E040FB"
};

function format_prime_probe_trial(trial, block_index) {
    return {
        prime:`<span style="font-size:40px;">${trial.prime.replace(/\n/g, "<br>")}</span>`,
        probe:`<span style="font-size:40px; color:${probe_colors[trial.color]};">${trial.probe}</span>`,
        congruency: trial.congruency,
        correct_response: trial.correct_response,
        color: trial.color,
        monetary: trial.monetary,
        name: trial.name,
        block: block_index + 1
    }
};

let shuffled_blocks = jsPsych.randomization.shuffle(prime_probe_trials.trials);

let selected_blocks = shuffled_blocks.slice(0, 10);
console.log(selected_blocks);
let randomized_stimuli_per_participant = selected_blocks.map(
    (block, block_index) => 
        block.map(trial => format_prime_probe_trial(trial, block_index)) 
)

//Creating timeline
const timeline = [];

//Welcome
const welcome_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<img src="University_logo.png" alt="University Logo" style="width: 300px; display: block; margin: auto;">
            <h2>Üdvözlünk a Metatudomány kutatócsoport vizsgálatában!</h2>
                <p>Egy tudományos kutatásban veszel részt, amelynek vezetője Bognár Miklós, az ELTE Affektív Pszichológia Tanszékének kutatója. 
                A kutatás célja megvizsgálni, hogy különböző ingertípusok miként hatnak a reakcióidőre.</p>
                <h3>Részvétel</h3>
                <p>A kutatásban való részvétel teljesen önkéntes. A vizsgálatot bármikor indoklás nélkül megszakíthatod. 
                Ha bármilyen kérdésed, észrevételed vagy problémád van a kutatással kapcsolatban, írj Bognár Miklósnak a <a href="mailto:bognar.miklos@ppk.elte.hu">bognar.miklos@ppk.elte.hu</a> címre.</p>`,
    choices: ['Tovább ']
}

timeline.push(welcome_trial);

const fullscreen_trial = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: "<p>A kísérlet teljes képernyős módra vált.</p>",
        button_label: 'Tovább'
}

timeline.push(fullscreen_trial);

//Informed consent
const informed_consent_trial = {
    type:jsPsychHtmlButtonResponse,
    stimulus: `<h2>Beleegyező nyilatkozat</h2>
                <p>Felelősségem teljes tudatában kijelentem, hogy a mai napon az Eötvös Loránd Tudományegyetem, Bognár Miklós kutatásvezető által végzett vizsgálatban</p>
                 <ul>
                    <li>önként veszek részt.</li>
                    <li>a vizsgálat jellegéről, annak megkezdése előtt kielégítő tájékoztatást kaptam.</li>
                    <li>nem szenvedek semmilyen pszichiátriai betegségben.</li>
                    <li>a vizsgálat idején alkohol vagy drogok hatása alatt nem állok.</li>
                 </ul>

                <p>Tudomásul veszem, hogy az azonosításomra alkalmas személyi adataimat bizalmasan kezelik.
                    Hozzájárulok ahhoz, hogy a vizsgálat során a rólam felvett, személyem azonosítására nem alkalmas adatok más kutatók számára is hozzáférhetők legyenek.
                    Fenntartom a jogot arra, hogy a vizsgálat során annak folytatásától bármikor elállhassak. 
                    Ilyen esetben a rólam addig felvett adatokat törölni kell.</p>
                <p>Tudomásul veszem, hogy csak a teljesen befejezett kitöltésért kapok pontot a <em>Pszichológiai kísérletben és tudományos aktivitásban való részvétel</em> nevű kurzuson.</p>

                <p><strong>A kutatásban való részvételem körülményeiről részletes tájékoztatást kaptam, a feltételekkel egyetértek. 
                    Amennyiben egyetértesz a fenti feltételekkel, kattints az "Igen" gombra.</strong></p>`,
    choices: ['Igen', 'Nem'],
    response_ends_trial: true,
        on_finish: function(data) {
            if (data.response == 1) {
                jsPsych.abortExperiment('<p style="text-align: justify; max-width: 800px; margin: auto; font-size: 24px; font-weight: bold">A kísérlet véget ért. Köszönjük, hogy részt vettél a vizsgálatban!</p>');
            }
        }
}

timeline.push(informed_consent_trial);

//Data handling and informed consent
const data_handling_trial = {   
    type: jsPsychHtmlButtonResponse,
    stimulus: `<h2 style="text-align: center;">Adatkezelési tájékoztató</h2>
            <p style="text-align: justify; max-width: 800px; margin: auto;">Szigorúan bizalmasan kezelünk minden olyan személyes információt, amit a kutatás keretén belül gyűjtünk össze. 
                A kutatás során nyert adatokat kóddal ellátva biztonságos számítógépeken tároljuk. A kutatás során nyert adatokat összegezzük. 
                Az ELTE PPK Affektív Pszichológia Tanszék Metatudomány Kutatócsoportja, mint adatkezelő, fenti személyes adataidat bizalmasan kezeli, más adatkezelőnek, adatfeldolgozónak nem adja át.
                E tényállás részleteit a <a href="http://metasciencelab.elte.hu/hozzajarulas-adatkezeleshez/" target=_blank">"Hozzájárulás adatkezeléshez"</a> c. dokumentum tartalmazza.</p>

            <p>Az adatkezelésről szóló szabályzásról részletesebben pedig itt tájékozódhatsz:
                <a href="https://ppk.elte.hu/file/Hozzajarulas_adatkezeleshez_melleklet_2018.pdf" target="_blank">Hozzájárulás adatkezeléshez melléklet</a></p>
            <p>A kutatás során nyert személyes adataidat arra használjuk fel, hogy regisztrálhassuk a részvételért járó kurzuspontokat. 
            Az azonosítására alkalmas adatokat (NEPTUN kód) ezután törölni fogjuk. A kezelt adatok a következők:</p>
                <ul>
                    <li>Életkor</li>
                    <li>NEPTUN-kód</li>
                    <li>Nem</li>
                </ul>
            <p>Válaszaid nem lesznek semmilyen módon hozzád köthetők. Az anonimizált adataidat más kutatókkal megosztjuk.</p>
            <p><strong>Kérlek, amennyiben egyetértesz a fenti feltételekkel, és hozzájárulsz a kutatásban való részvételhez, kattints az "Igen" gombra.</strong></p>`,
    choices: ['Igen', 'Nem'],
    response_ends_trial: true,
        on_finish: function(data) {
            if (data.response == 1) {
                jsPsych.abortExperiment('<p style="text-align: justify; max-width: 800px; margin: auto; font-size: 24px; font-weight: bold">A kísérlet véget ért. Köszönjük, hogy részt vettél a vizsgálatban!</p>');
            }
        }
}

timeline.push(data_handling_trial);

//Demographic information
const age_neptun = {
  type: jsPsychSurveyText,
  questions: [
    {
        prompt: "Hány éves vagy?",
        name: "age",
        input_type: "number",
        required: true
    },
    {
        prompt: "Mi a NEPTUN kódod?",
        name: "neptun",
        required: true
    }
  ],
  button_label: "Tovább",
};
 
const gender = {
    type: jsPsychSurveyMultiChoice,
    questions: [
        {
            prompt: "Melyik a nemmel azonosulsz?", 
            name: "gender", 
            options: ["Férfi", "Nő", "Nem-bináris", "Nem szeretném megosztani"] ,
            required: true
        }
    ],
    button_label: "Tovább"
}

const demographic_timeline = [age_neptun, gender];

timeline.push(demographic_timeline);

//Instructions
const instruction_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h2>Instrukciók</h2>
                <p>Ebben a kísérletben arra vagyunk kíváncsiak, hogy miként befolyásolja a büntetésés és a jutalmazás a konfliktusfeldolgozást. 
                A kísérlet során iránymegjelöléseket fogsz olvasni (FEL, LE, JOBB, BAL). Először egy prime inger fog megjelenni a képernyőn, amin egy irány (pl.: „FEL”) lesz olvasható egymás alatt háromszor. 
                Ezt követően megjelenik a célinger, ami vagy azonos („FEL”) vagy ellentétes („LE”) lesz az előtte bemutatott iránnyal.
                A feladatod az lesz, hogy minél gyorsabban és pontosabban eltaláld a célinger irányát a hozzárendelt billentyű megnyomásával.</p> 
                <p>A kísérletet 2000 garassal kezded. Amikor a célinger <span style="color: #FF3B3B; font-weight: bold;">piros</span> színű, akkor 17 garast vonunk le tőled.
                Ha viszont <span style="color: #00E676; font-weight: bold;">zöld</span> színű célingert látsz, 17 garas a jutalmad. 
                A neutrális próbákat három szín fogja jelölni: <span style="color: #2979FF; font-weight: bold;">kék</span>, <span style="color: #FFD700; font-weight: bold;">sárga</span> és <span style="color: #E040FB; font-weight: bold;">rózsaszín</span>. Ezeknél a próbáknál sem jutalom, sem büntetés nem jár.</p> 
                <p>Kérlek helyezd a billentyűzetre a kezedet a képen látható módon:</p>
                <p>A bal gyűrűsujjadat tedd az <span class='key'>A</span>-ra. Ez lesz a "BAL" irány. 
                A jobb gyűrűsujjadat az <span class='key'>L</span>-re, ez fogja jelölni a "JOBB" irányt. 
                A jobb mutató ujjadat helyezd az <span class='key'>N</span>-re, ez lesz a "LE" irány. 
                Míg a bal középső ujjadat pedig tedd az <span class='key'>E</span>-re, ami a "FEL" irányt fogja jelölni! </p>
                <img src="NEWinstruction_pic.png" alt="Hand placement instructions" style="width: 40%; height: 40%;">
                <p style="text-align: center;"><em>Amennyiben készen állsz a kísérlet megkezdésére, nyomd meg a space billentyűt!</em></p>`,
            choices: [" "],
}

timeline.push(instruction_trial);

//Practice blocks
const practice_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h2>Gyakorló blokk</h2>
            <p>A kísérlet megkezdése előtt egy rövid gyakorló blokk következik. Törekedj a minél gyorsabb és pontosabb válaszadásra! 
            A próbák 80%-át jól kell teljesítened, különben a gyakorlás újra indul<br>
            Ha készen állsz, nyomj meg egy tetszőleges billentyűt a kezdéshez.</p>`
}

const practice_intermission = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    return `<div style="text-align: center; max-width: 800px; margin: auto; font-size: 24px">
      <p>Még egy rövid gyakorló blokk következik.<br>
      Ha készen állsz, nyomj meg egy tetszőleges billentyűt a kezdéshez.</p>
      <p><strong>A blokk automatikusan elindul 2 perc múlva.</strong></p>
      <p id="timer" style="font-size: 28px; color: darkred;">Kezdés: 2:00</p>
    </div>`;
  },
  choices: 'ALL_KEYS',
  trial_duration: 120000, 
  on_load: function() {
    let time_left = 120;
    const timer_display = document.getElementById('timer');
    const countdown = setInterval(() => {
      time_left--;
      const minutes = Math.floor(time_left / 60);
      const seconds = time_left % 60;
      timer_display.textContent = `Kezdés: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      if (time_left <= 0) clearInterval(countdown);
    }, 1000);
  }
}

const practice_end = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:`<div style="padding-bottom: 350px; max-width: 800px; margin: 40px auto; font-size: 24px;">
    <p style="text-align: justify; margin: 0;">A gyakorló rész véget ért. A kísérleti blokkok következnek.<br> 
        A kísérleti blokkokban nem fogsz visszajelzést kapni, ha túl lassú, vagy hibás választ adtál.<br>
        Ne feledd, <span style="color: #FF3B3B; font-weight: bold;">piros</span> próbák esetén 17 garast vonunk le tőled.<br>
        <span style="color: #00E676; font-weight: bold;">Zöld</span> próbák esetén 17 garast kapsz.<br>
        Ha készen állsz, nyomd meg a space billentyűt a kezdéshez.<span style="display:inline-block; width:100%;"></span></p></div>
        <img src="NEWinstruction_pic.png" alt="Hand placement instructions" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 55%;max-width: 600px;">`,
  choices:  [" "],
};

const prac_feedback = {
    type:jsPsychHtmlKeyboardResponse,
    choices: 'NO_KEYS',
    stimulus: () => {
        const last = jsPsych.data.getLastTrialData().values()[0];
        if(last.rt === null || last.rt > practice.cutoff) {
            return "<div style='font-size:35px;'>Túl lassú!</div>";
        }
        if (!last.correct) {
            return "<div style='font-size:35px;'>Hibás válasz!</div>";
        }
        return "<div></div>";
    },
    trial_duration: () => {
        const last = jsPsych.data.getLastTrialData().values()[0];
        if (last.rt === null || last.rt > practice.cutoff || !last.correct) {
            return practice.feedback_duration;
        }
        return durations.blank_duration;
    }
};


//Preparing practice stimulus variables
const practice_blocks_raw = [
    prime_probe_prac_trials.trials_block1,
    prime_probe_prac_trials.trials_block2
];

const formatted_practice_blocks = practice_blocks_raw.map(
    (block, block_index) =>
        block.map(trial => format_prime_probe_trial(trial, block_index))
)

const practice_blocks = formatted_practice_blocks.map(block_stimuli => {
    console.log('Practice block stimuli:', block_stimuli);
    return {
        timeline: [
            {
                timeline: [fixation, prime, blank, probe, prac_feedback],
                timeline_variables: block_stimuli,
                randomize_order: false,
                loop_function: function(data) {
                    if (debug === 1) return false;
                    const probe_trials = data.filter({task:'probe'});
                    const correct_trials = probe_trials.filter({correct: true});
                    console.log('Correct trials:', correct_trials);
                    const accuracy = correct_trials.count() / probe_trials.count();
                    console.log('Prac acc:',accuracy);
                    return accuracy < practice.accuracy_threshold;
                    }
            }]
    };
});

timeline.push(practice_instructions, practice_blocks[0], practice_intermission, practice_blocks[1], practice_end);

//Main experiment blocks
const block_intro = (block_index) => ({
    type:jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="text-align:center; font-size:24px;">
                <h2>Blokk ${block_index + 1} kezdődik</h2></div>`,
    choices: 'NO_KEYS',
    trial_duration: 2000 
    }
);

const trial_sequence = {
    timeline: [fixation, prime, blank, probe],
    randomize_order: false
};

const experimental_blocks = randomized_stimuli_per_participant.map(
    (block_stimuli, i) => ({
        timeline: [block_intro(i), {...trial_sequence, timeline_variables: block_stimuli}],
        on_timeline_start: () => {
            console.log(`Starting block ${i + 1} with stimuli:`, block_stimuli);
        }
    })
);

//Intermission between experimental blocks
const block_intermission = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    return `
      <div style="text-align: center; max-width: 800px; margin: auto; font-size: 24px">
        <p><strong>Blokk vége.</strong></p>
        <p>Pihenj egy kicsit, majd nyomj meg egy billentyűt a következő blokk kezdéséhez.</p>
        <p><strong>A következő blokk automatikusan elindul 2 perc múlva.</strong></p>
        <p id="timer" style="font-size: 28px; color: darkred;">Kezdés: 2:00</p>
      </div>`;
  },
  choices: "ALL_KEYS",
  trial_duration: 120000,
  on_load: function() {
    let timeLeft = 120;
    const timerDisplay = document.getElementById('timer');
    const countdown = setInterval(() => {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `Kezdés: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      if (timeLeft <= 0) clearInterval(countdown);
    }, 1000);
  },
  data: {task: 'intermission'}
};

//Full experiment timeline
const full_experiment = [];
experimental_blocks.forEach((block, index) => {
    full_experiment.push(block);
    if (index < experimental_blocks.length - 1) {
        full_experiment.push(block_intermission);
    }
});

//End of experiment
const experiment_end = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
      <h2>Kísérlet vége</h2>
      <h3>Köszönjük, hogy részt vettél a vizsgálatban!</h3>
      
      <p>Hogy megkaphasd a pontjaidat, nyomd meg a "Vége" gombot</p>`,
  choices: ["Vége"],
};

//Adding full experiment and end trial to timeline
timeline.push(...full_experiment, experiment_end);

jsPsych.run(timeline);