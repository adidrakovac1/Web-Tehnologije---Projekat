document.addEventListener("DOMContentLoaded", () => {
    const glavniElement = document.getElementById("upiti");
    const sviElementi = [...glavniElement.getElementsByClassName("upit")];
    const btnLijevo = document.getElementById("prev");
    const btnDesno = document.getElementById("next");

    const carousel = postaviCarousel(glavniElement, sviElementi);
    console.log(carousel);
    if (carousel) {
        
        btnLijevo.addEventListener("click", carousel.fnLijevo);
        btnDesno.addEventListener("click", carousel.fnDesno);
    }
});