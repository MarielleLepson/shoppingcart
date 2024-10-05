//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
let intervalId = null;
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
let maksmaNupp = null;

const korvSisuSumma = document.querySelector(".korv-summa"); 
const koguSummaElement = document.createElement('div'); 
koguSummaElement.classList.add('hind-tarnega');
document.querySelector('main').appendChild(koguSummaElement);


lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
            arvutaSumma();
            arvutaTäisHind();
        }
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => decreaseItem(toode, korvArtikkelD, lisaKorviNupp));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
            arvutaSumma();
            arvutaTäisHind();
        }
    });
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function decreaseItem(toode, korvArtikkelD, lisaKorviNupp) {
    korv.forEach(korvArtikkel => {
        let kogus = korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText;
        if (korvArtikkel.nimi === toode.nimi) {
            kogus = --korvArtikkel.kogus;
        }

        if (kogus == 0) {
            eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp);
        } else {
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = kogus;
            arvutaSumma();
        }
        arvutaTäisHind();
    })
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
        tühistaTaimer();
    } else {
        arvutaSumma();
    }
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <h3 class="korv-summa">Kokku: 0.00 €</h3>
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        maksmaNupp = document.querySelector('[data-action="kassa"]');
        if (maksmaNupp) {
            maksmaNupp.addEventListener('click', () => kassa());
        }
    }

    arvutaSumma();
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaOstukorviNupp => {
        lisaOstukorviNupp.innerText = 'Lisa ostukorvi';
        lisaOstukorviNupp.disabled = false;
    });

    korv = [];
    arvutaSumma();
    arvutaTäisHind();
    tühistaTaimer();
    
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function arvutaSumma() {
    let totalSum = 0;
    korv.forEach(korvArtikkel => {
        totalSum += korvArtikkel.hind * korvArtikkel.kogus;
        
    });
    
    if (document.querySelector('.korv-summa')) {
        document.querySelector('.korv-summa').innerText = `Kokku: ${totalSum.toFixed(2)} €`;
    }
}


//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuva) {
    tühistaTaimer();
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(intervalId);
            intervalId = null; 
            kuva.innerText = "alusta uuesti";

            if (maksmaNupp) {
                maksmaNupp.disabled = false;
            }
        }
    };
    intervalId = setInterval(taimer, 1000); 
    taimer();

};

function kassa() {
    const kuva = document.getElementById("time");
    alustaTaimer(60 * 2, kuva);
    
    if (maksmaNupp) {
        maksmaNupp.disabled = true;
    } 
};

function tühistaTaimer() {
    //console.log("Tühista taimer");
    
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null; 
    }
    document.getElementById("time").innerText = "";

    if (maksmaNupp) {
        maksmaNupp.disabled = false;
    }
}

//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const kinnitus = document.getElementById("kinnitus");
const telNr = document.getElementById("telefon");
const tarneValikud = document.querySelectorAll('input[name="tarneviis"]');
const tarneAeg = document.getElementById("tarneaeg");

const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    const eesnimeError = eesnimeKontroll(eesnimi.value.trim());
    if (eesnimeError != null) {
        errors.push(eesnimeError);
    }

    const perenimeError = pereNimeKontroll(perenimi.value.trim());
    if (perenimeError != null) {
        errors.push(perenimeError);
    }

    const telNrError = telefoninumbriKontroll(telNr.value.trim());
    if (telNrError != null) {
        errors.push(telNrError);
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    const valitudTarne = document.querySelector('input[name="tarneviis"]:checked');
    if (!valitudTarne) {
        errors.push("Palun vali tarneviis");
    }

    // Minu kood
    if (tarneAeg.value.trim() === "") {
        errors.push("Palun valige eelistatud tarneaeg");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join(', ');
    }
    else {
        errorMessage.innerHTML = "";

    }
    arvutaTäisHind();

})

function arvutaTäisHind() {
    let s = 0;
    korv.forEach(korvArtikkel => {
        s += korvArtikkel.hind * korvArtikkel.kogus;
    });
    
    const valitudTarne = document.querySelector('input[name="tarneviis"]:checked');
    let tarneHind = valitudTarne ? parseFloat(valitudTarne.value) : 0;
    let täisHind = s + tarneHind;
    koguSummaElement.innerHTML = `Kogusumma: ${täisHind.toFixed(2)} €`;
}

tarneValikud.forEach(radio => {
    radio.addEventListener('change', () => {
        arvutaTäisHind();
    });
});

/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */

function eesnimeKontroll(nimi) {
    if (nimi === "") {
        return "Eesnimi ei tohi olla tühi"
    }

    const sisaldabNumbreid = /\d/.test(nimi);
    if (sisaldabNumbreid) {
        return "Eesnime väljal ei tohi olla numbreid"
    }
    return null;
}


function pereNimeKontroll(nimi) {
    if (nimi === "") {
        return "Perenimi ei tohi olla tühi"
    }

    const sisaldabNumbreid = /\d/.test(nimi);
    if (sisaldabNumbreid) {
        return "Perenime väljal ei tohi olla numbreid"
    }
    return null;
}

function telefoninumbriKontroll(telNr) {
    if (telNr.length == 0) {
        return "Telefoninumber ei tohi olla tühi"
    }

    if (telNr.length < 6) {
        return "Telefoninumbri pikkus on lühem kui 6 sümbolit"
    }

    const ainultNumbrid = /^\d+$/.test(telNr);
    if (!ainultNumbrid) {
        return "Telefoninumber peab sisaldama ainult numbreid"
    }
}
