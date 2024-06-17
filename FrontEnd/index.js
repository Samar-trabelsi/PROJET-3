/***************récuperation de données***********/

const reponseworks = await fetch ( 'http://localhost:5678/api/works')
let works = await reponseworks.json()

function affichageworks(works){
for(let i= 0; i< works.length; i++){

    const cadrephoto = document.createElement('figure')
    const titrephoto = document.createElement('figcaption')
    const worksphoto = document.createElement('img')
    worksphoto.src = works[i].imageUrl
    worksphoto.alt = works[i].title
    titrephoto.innertext = works[i].title
    cadrephoto.appendChild(worksphoto)
    cadrephoto.appendChild(titrephoto)

    const galleryImage = document.querySelector(".gallery")
    galleryImage.appendChild(cadrephoto)
}
}

affichageworks(works)
