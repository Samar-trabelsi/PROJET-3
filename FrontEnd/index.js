/***************récuperation de données***********/

const reponseworks = await fetch ( 'http://localhost:5678/api/works')
let works = await reponseworks.json()

/***********************Gallery**********************/

function affichageworks(works){
for(let i= 0; i< works.length; i++){

    const cadrephoto = document.createElement('figure')
    const titrephoto = document.createElement('figcaption')
    const worksphoto = document.createElement('img')
    worksphoto.src = works[i].imageUrl
    worksphoto.alt = works[i].title
    titrephoto.innerText = works[i].title;
    cadrephoto.appendChild(worksphoto)
    cadrephoto.appendChild(titrephoto)

    const galleryImage = document.querySelector(".gallery")
    galleryImage.appendChild(cadrephoto)
}
}

affichageworks(works)

/*******************Filtres************************/

const filtresPhoto = document.querySelector(".filter-bar")

const boutonFiltresTous = document.createElement("button")
boutonFiltresTous.classList.add("filtres_Tous", "button_inactive")
boutonFiltresTous.innerText = "Tous"

const boutonFiltresObjets = document.createElement("button")
boutonFiltresObjets.classList.add("filtres_Objets", "button_inactive")
boutonFiltresObjets.innerText = "Objets"

const boutonFiltresAppartements = document.createElement("button")
boutonFiltresAppartements.classList.add("filtres_Appartements", "button_inactive")
boutonFiltresAppartements.innerText = "Appartements"

const boutonFiltresHoteletrestaurants = document.createElement("button")
boutonFiltresHoteletrestaurants.classList.add("filtres_Hoteletrestaurants", "button_inactive")
boutonFiltresHoteletrestaurants.innerText = "Hotel & restaurants"

filtresPhoto.appendChild(boutonFiltresTous);
filtresPhoto.appendChild(boutonFiltresObjets);
filtresPhoto.appendChild(boutonFiltresAppartements);
filtresPhoto.appendChild(boutonFiltresHoteletrestaurants);

/*Fonctionnalite des boutons filtres */

boutonFiltresTous.addEventListener("click", function(){
    boutonFiltresTous.classList.add("button_active")
    boutonFiltresAppartements.classList.remove("button_active")
    boutonFiltresObjets.classList.remove("button_active")
    boutonFiltresHoteletrestaurants.classList.remove("button_active")
    document.querySelector(".gallery").innerHTML=""
    affichageworks(works)

})

boutonFiltresObjets.addEventListener("click", function(){
    boutonFiltresTous.classList.remove("button_active")
    boutonFiltresAppartements.classList.remove("button_active")
    boutonFiltresObjets.classList.add("button_active")
    boutonFiltresHoteletrestaurants.classList.remove("button_active")
    document.querySelector(".gallery").innerHTML=""
    affichageworks(works.filter(work => work.categoryId === 1))
})

boutonFiltresAppartements.addEventListener("click", function(){
    boutonFiltresTous.classList.remove("button_active")
    boutonFiltresAppartements.classList.add("button_active")
    boutonFiltresObjets.classList.remove("button_active")
    boutonFiltresHoteletrestaurants.classList.remove("button_active")
    document.querySelector(".gallery").innerHTML=""
    affichageworks(works.filter(work => work.categoryId === 2))
})

boutonFiltresHoteletrestaurants.addEventListener("click", function(){
    boutonFiltresTous.classList.remove("button_active")
    boutonFiltresAppartements.classList.remove("button_active")
    boutonFiltresObjets.classList.remove("button_active")
    boutonFiltresHoteletrestaurants.classList.add("button_active")
    document.querySelector(".gallery").innerHTML=""
    affichageworks(works.filter(work => work.categoryId === 3))
})


document.querySelector(".gallery").innerHTML = ""
affichageworks(works) 

