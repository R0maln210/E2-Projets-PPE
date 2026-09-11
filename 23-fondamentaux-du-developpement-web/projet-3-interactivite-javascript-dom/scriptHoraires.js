const selectLangue = document.getElementById('jour');
const tousLesContenus = document.querySelectorAll('.contenuMenuDeroulant');

function mettreAJourAffichage() {
    const valeurSelectionnee = selectLangue.value;

    tousLesContenus.forEach(bloc => {
        bloc.classList.remove('actif');
    });

    const blocAAfficher = document.getElementById(valeurSelectionnee);
    if (blocAAfficher) {
        blocAAfficher.classList.add('actif');
    }
}

selectLangue.addEventListener('change', mettreAJourAffichage);

mettreAJourAffichage();