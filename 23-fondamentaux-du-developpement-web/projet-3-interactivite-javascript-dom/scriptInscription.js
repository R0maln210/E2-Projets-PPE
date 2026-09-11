const planningParDefaut = [
    {langue: "francais", jour: "lundi", niveau: "debutant", places: 3},
    {langue: "anglais", jour: "lundi", niveau: "debutant", places: 5},

    {langue: "allemand", jour: "mardi", niveau: "debutant", places: 9},
    {langue: "espagnol", jour: "mardi", niveau: "debutant", places: 10},

    {langue: "francais", jour: "mercredi", niveau: "avance", places: 2},
    {langue: "anglais", jour: "mercredi", niveau: "avance", places: 1},
    {langue: "allemand", jour: "mercredi", niveau: "avance", places: 6},
    {langue: "espagnol", jour: "mercredi", niveau: "avance", places: 11},

    {langue: "allemand", jour: "jeudi", niveau: "debutant", places: 7},
    {langue: "espagnol", jour: "jeudi", niveau: "debutant", places: 4},

    {langue: "francais", jour: "vendredi", niveau: "debutant", places: 15},
    {langue: "anglais", jour: "vendredi", niveau: "debutant", places: 13},

    {langue: "francais", jour: "samedi", niveau: "avance", places: 14},
    {langue: "anglais", jour: "samedi", niveau: "avance", places: 12},
    {langue: "allemand", jour: "samedi", niveau: "avance", places: 17},
    {langue: "espagnol", jour: "samedi", niveau: "avance", places: 0}
];
const selectPrenom = document.getElementById('formulaireChampPrenom');
const selectNom = document.getElementById('formulaireChampNom');
const selectAtelier = document.getElementById('atelierSouhaite');
const selectJour = document.getElementById('jourSouhaite');
const selectNiveau = document.getElementById('niveauSouhaite');
const messageStatut = document.getElementById('messageStatut');
const zoneValidation = document.getElementById('zoneValidation');
const listeParticipants = document.getElementById('listeParticipants')
const planningCours = JSON.parse(localStorage.getItem("planning")) || planningParDefaut;
const listeInscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];

function verifierDisponibilite() {
    const atelierChoisi = selectAtelier.value;
    const jourChoisi = selectJour.value;
    const niveauChoisi = selectNiveau.value;

    const coursTrouve = planningCours.find(cours => cours.langue === atelierChoisi && cours.jour === jourChoisi && cours.niveau === niveauChoisi);

    if (!coursTrouve) {
        messageStatut.textContent = "Ce cours n'est pas disponible ce jour là";
        messageStatut.style.color = "red";
        zoneValidation.innerHTML = "";
    } 
    else if (coursTrouve.places === 0) {
        messageStatut.textContent = "Il n'y a plus de places disponibles pour ce cours";
        messageStatut.style.color = "orange";
        zoneValidation.innerHTML = "";
    }
    else {
        messageStatut.textContent = `Atelier disponible, il reste ${coursTrouve.places} places`;
        messageStatut.style.color = "green";
        zoneValidation.innerHTML = '<button type="submit" form="formulaire" id="boutonReserver" class="boutonReserver">Réserver</button>';
    }

    afficherListeParticipants()
}

selectAtelier.addEventListener('change', verifierDisponibilite);
selectJour.addEventListener('change', verifierDisponibilite);
selectNiveau.addEventListener('change', verifierDisponibilite);

verifierDisponibilite();


const erreurPrenom = document.getElementById('erreurPrenom');
const erreurNom = document.getElementById('erreurNom');
const formulaire = document.getElementById('formulaire');

formulaire.addEventListener('submit', function(event) {
    event.preventDefault();

    erreurPrenom.textContent = "";
    erreurNom.textContent = "";
    
    let formulaireValide = true;

    if (selectPrenom.value.trim() === "") {
        erreurPrenom.textContent = "Ce champ est obligatoire *"
        formulaireValide = false;
    }

    if (selectNom.value.trim() === "") {
        erreurNom.textContent = "Ce champ est obligatoire *"
        formulaireValide = false;
    }

    if (!formulaireValide) {
        return;
    }

    const prenom = selectPrenom.value;
    const nom = selectNom.value;
    const atelierChoisi = selectAtelier.value;
    const jourChoisi = selectJour.value;
    const niveauChoisi = selectNiveau.value;

    const estDejaInscrit = listeInscriptions.some(inscrit => 
        inscrit.prenom.toLowerCase() === prenom.toLowerCase() &&
        inscrit.nom.toLowerCase() === nom.toLowerCase() &&
        inscrit.atelier.toLowerCase() === atelierChoisi.toLowerCase() &&
        inscrit.jour.toLowerCase() === jourChoisi.toLowerCase() &&
        inscrit.niveau.toLowerCase() === niveauChoisi.toLowerCase()
    );

    if (estDejaInscrit) {
        messageStatut.textContent = `${prenom} ${nom} est déjà inscrit dans ce cours de ${atelierChoisi} ${niveauChoisi} le ${jourChoisi}`;
        messageStatut.style.color = "orange";
        return;
    }

    messageStatut.textContent = `Inscription validée pour ${prenom} ${nom}`;
    messageStatut.style.color = "green";
    zoneValidation.innerHTML = `<p class="texteListeReservation">Vous avez bien réservé le cours de ${atelierChoisi} niveau ${niveauChoisi} le ${jourChoisi}. Voici la liste des participants :</p>  `

    listeInscriptions.push({
        id: Date.now(),
        prenom: prenom,
        nom: nom,
        atelier: atelierChoisi,
        jour: jourChoisi,
        niveau: niveauChoisi
    });
    
    const coursTrouve = planningCours.find(cours => 
        cours.langue === atelierChoisi && 
        cours.jour === jourChoisi && 
        cours.niveau === niveauChoisi
    );

    if (coursTrouve) {
        coursTrouve.places--;
    }

    selectPrenom.value = "";
    selectNom.value = "";

    verifierDisponibilite();
    sauvegarder();
});

function afficherListeParticipants() {

    listeParticipants.innerHTML = "";
    
    const atelierChoisi = selectAtelier.value;
    const jourChoisi = selectJour.value;
    const niveauChoisi = selectNiveau.value;
    const listeInscritsCours = listeInscriptions.filter(element =>
        element.atelier === atelierChoisi && element.jour === jourChoisi && element.niveau === niveauChoisi
    );

    if (listeInscritsCours.length === 0) {
        listeParticipants.innerHTML = "<li>Il n'y a encore aucun inscrit pour ce cours</li>";
        return;
    }

    listeInscritsCours.forEach(element => {
        listeParticipants.innerHTML += `<li class="listeParticipantsReservation"> ${element.prenom} ${element.nom}</li>
        <button type="button" class="boutonSupprimerInscription" onclick="supprimerInscription(${element.id})">Annulez l'inscription</button>`
    });
}

selectPrenom.addEventListener('input', function() {
        erreurPrenom.textContent = "";
    });

    selectNom.addEventListener('input', function() {
        erreurNom.textContent = "";
    });

function supprimerInscription(idASupprimer) {
    
    const inscription = listeInscriptions.find(element => element.id === idASupprimer);
    if (!inscription) return;

    const coursTrouve = planningCours.find(cours => cours.langue === inscription.atelier && cours.jour === inscription.jour && cours.niveau === inscription.niveau
    );

    if (coursTrouve) {
        coursTrouve.places ++;
    }

    const index = listeInscriptions.findIndex(element => element.id === idASupprimer);

    if (index !== -1) {
        listeInscriptions.splice(index, 1);
    }

    verifierDisponibilite();
    sauvegarder();
}

function sauvegarder() {
    localStorage.setItem("inscriptions", JSON.stringify(listeInscriptions));
    localStorage.setItem("planning", JSON.stringify(planningCours))
}