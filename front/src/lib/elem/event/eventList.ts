const date = new Date();

export let events = [
  {
    id: 1,
    title: "Atelier de Peinture Inspiré de Frida Kahlo",
    txt: "Un atelier pratique où vous pourrez explorer votre créativité en vous inspirant de l'univers de Frida Kahlo.",
    description: "Apprenez les techniques de peinture qui caractérisent le style unique de Frida Kahlo.",
    image: "/event/art_workshop_600x400.png",
    date: (() => { date.setDate(date.getDate() + 1); return date.toLocaleDateString('fr-FR')})(),
    location: "Centre Culturel Beaubourg Paris, Salle 101",
    time: "14h00 - 17h00" },
  {
    id: 2,
    title: "Exposition d'Art Latino",
    description: "Découvrez des œuvres d'artistes latino-américains émergents.",
    txt:"Découvrez les œuvres d'artistes latinos contemporains à travers cette exposition immersive.",
    image: "/event/art_exhibition.webp",
    date: (() => { date.setDate(date.getDate() + 2); return date.toLocaleDateString('fr-FR')})(),
    location: "Galerie d'Art, 2ème étage",
    time: "10h00 - 18h00"
  },
  {
    id: 3,
    title: "Soirée Cinéma : Films de Frida Kahlo",
    txt: "Projection de films documentaires et fictifs sur la vie et l'art de Frida Kahlo.",
    description: "Projection de films documentaires sur la vie et l'œuvre de Frida Kahlo.",
    image: "/event/cinema.webp",
    date: (() => { date.setDate(date.getDate() + 3); return date.toLocaleDateString('fr-FR')})(),
    location: "Cinéma Le Luxor, Salle A",
    time: "19h00 - 21h30"
  },
  {
    id: 4,
    title: "Discussion sur l'Art et la Résilience",
    txt: "Une table ronde avec des artistes et des psychologues pour explorer le lien entre art et résilience.",
    description: "Une table ronde sur l'impact de l'art dans les moments difficiles.",
    image: "/event/table_ronde.webp",
    date: (() => { date.setDate(date.getDate() + 5); return date.toLocaleDateString('fr-FR')})(),
    location: "Auditorium Descarte Paris 7, Salle B",
    time: "18h00 - 20h00"
  },
];