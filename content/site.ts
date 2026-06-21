import {
  proposalRoleDefinitions,
  proposalRoleIdAliases,
} from "@/content/proposal-roles"

export const siteConfig = {
  couple: {
    bride: "Karla Kaye Bastida", //Noenyl Bryle M. Gonzaga
    brideNickname: "Kaye", //Ltryl
    groom: "Engr. Felix Marturillas Jr", //Ltryl B. Benitez
    groomNickname: "Felix",
    monogram:"/monogram/new-monogram.png" ,//Ltryl
    backgroundMusic:"/background_music/Michal Leah - The Way I Love You.mp3"
  },
  googleAPI:{
    messageForm: "https://docs.google.com/forms/d/e/1FAIpQLSdddDGJNsAf2bKrOBayXhrd0Tpe8HWA9xskqf-lizr6qngS4A/formResponse",   //done
    message: "https://script.google.com/macros/s/AKfycbxyv3JVUkCGvuE79LUkzPhYjzNEY9IIdJ71OrVL0lcFRiVyYUP1z2QW4RzDOdL8dV7H/exec",  //done
    guestList: "https://script.google.com/macros/s/AKfycbyDZ8-58LPAHFvKjeWKvysTgaC1h49mdW2rTgy_yz-LrPIs4r9wHfSf9eJJy85DuFbT/exec",  //done
    guestRequest: "https://script.google.com/macros/s/AKfycbyhE9XQCO5hu6ZRlz_xa4LtcC3knQQ03IDwinTtxMDnuEz8ig8tkSZfgzn8N8ARLqF_/exec",  //done
    entourage: "https://script.google.com/macros/s/AKfycbyGlfi9VGZvLTKqnEq8gExPj7hdmHGpf5g_FK_8zqD5ykJVgWqggCwljr7T6YKS8n5n/exec",  //done
    sponsors: "https://script.google.com/macros/s/AKfycbwe788KcaYXkSdjX1-AsBbhLc8FkU8d7xar-yiScOOFTmHr2pI36sDDj4kDVroqgJ8m/exec",  //done
    weddingDetails: "https://script.google.com/macros/s/AKfycbyUpOW3O9U3KRUylMnSkVaFcc-LwUv1mkb3d0YrkZwfU31ErCGedIvxrCan8gYllSUZ/exec",   //done
    proposalResponses: "https://script.google.com/macros/s/AKfycbxrFIvR2m2CbYyS9NE8WOkmw_fQhmCGcyAUpUgyqR75FaMuiKOK9WpGTj7RHughrTI8/exec",  //done
////google share 
    googleShare: "https://docs.google.com/spreadsheets/d/1pDrDKrfwtEbFZHfQnxyp8ALxxC59ymURp9D91jdwqAM/edit?usp=sharing", //done
  },
  wedding: {
    date: "April 11, 2027",
    time: "1:30 PM",
    venue: "Chapel of San Pedro Calungsod, SRP, Cebu City",
    tagline: "are getting married!",
    theme: "Our wedding palette is inspired by timeless elegance and warmth.Motif Colors: Champagne Gold, Soft Beige, Warm Soft Brown",
    motif: "#BBCED5, #B9C3A8, #F3D8C5, #D1C4D4, #ECD8BA, #F4E8D8, #E1DCCF",
  },
  proposal: {
    // Use "Maid of Honor" for unmarried, "Matron of Honor" for married
    honorAttendant: "Maid of Honor" as "Matron of Honor" | "Maid of Honor",
    roles: proposalRoleDefinitions,
    roleIdAliases: proposalRoleIdAliases,
  },
  details: {
    rsvp: {
      deadline: "",
      contact: "Karla Kaye Bastida",
      phone: "+63 956 482 5255",
    },
  },
  contact: {
    bridePhone: "+63 956 482 5255",
    groomPhone: "",
    email: "",
  },
  giftRegistry: {
    QR_1:{
    id: "BPI",
    src: "/monogram/BPI.png",
    label: "BPI",
    accountNumber: "TE*I NI***E A GU******O",
    },
    QR_2:{
    id: "Zelle",
    src: "/monogram/Zelle.png",
    label: "Zelle",
    accountNumber: "Patrick: xxx-xxx-0009",
    }
  },
  ceremony: {
    location: "Chapel of San Pedro Calungsod, SRP, Cebu City",
    venue: "Chapel of San Pedro Calungsod, SRP, Cebu City",
    map: "https://maps.app.goo.gl/Cs6ASzTrMY5imd1M6",
    date: "April 11, 2027",
    day: "Sunday",
    time: "1:30 PM",
    entourageTime: "12:00 PM",
    guestsTime: "1:00 PM",
    image: "/Details/ceremony.png",
  },
  reception: {
    location: "Golden Peak Hotel Gorordo, Cebu City",
    venue: "Gorordo Avenue, corner N Escario St, Cebu City, 6000 Cebu, Philippines",
    map: "https://maps.app.goo.gl/eM9AcEfj3Z8g1JW8A",
    date: "April 11, 2027",
    day: "Sunday",
    time: "5:30 PM",
    image: ["/Details/reception1.png","/Details/reception2.png"],
  },
  dressCode: {
      theme: "SEMI-FORMAL",
    colors: "#BBCED5, #B9C3A8, #F3D8C5, #D1C4D4, #ECD8BA, #F4E8D8, #E1DCCF",
    sponsors: {
      male: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      female: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "Your Presence will make our day even more special \n Ninong: Formal Wear : Charcoal Gray suid and Slacks, white long sleeves, and burgundy neckite \n Ninang: Long Dress / Formal Dress Burgundy Long Formal Dress.",
      photo: "/Details/sponsors.png",
      palette: "#E2E5ED, #CED2D8, #B5C1D6,#95A6C7,#8191AC"
    },
    entourage: {
      gents: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      ladies: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "Your Presence will make our day even more special \n Ninong: Formal Wear : Charcoal Gray suid and Slacks, white long sleeves, and burgundy neckite \n Ninang: Long Dress / Formal Dress Burgundy Long Formal Dress.",
      photo: "/Details/sponsors.png",
      palette: "#E2E5ED, #CED2D8, #B5C1D6,#95A6C7,#8191AC",
    },
    guests: {
      gents: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      ladies: "Guests are kindly requested to wear attire in any of the shades within our wedding palette.Color pallet and image to be followed. STRICTLY no shorts, maong jeans, t-shirts, or slippers.",
      notes: "WE KINDLY ASK OUR GUEST TO WEAR THESE COLORS \n Gentlemen : Long sleeves / suit and slacks \n Ladies : Long Dress / Formal Dress",
      photo: "/Details/guest.png",
      palette: "#E2E5ED, #CED2D8, #B5C1D6,#95A6C7,#8191AC",
    },
    note: "We kindly request our guests to dress in attire following our wedding palette."
  },
  narratives: {
    ourStory: `Once upon a signature…

Our story began with a simple signature, one that slowly turned into something magical. He was my financial advisor, and I was there to sign documents. It was July 5, 2021, and we met at the Lobby of the building. Little did we know, that ordinary day would start a story neither of us expected.

I wasn't looking for anything, yet somehow, our connection grew in its own gentle, unexpected way. And then, on June 1, 2022, our story truly began—we became us. We found a love that feels like home.

Our journey wasn't rushed, but perfectly timed. We believe that God brought us together in His own way and season.

With hearts full of gratitude, we step into this new chapter hand in hand, trusting His plan and celebrating a love rooted in faith, patience, and grace.

Today, we choose each other- again and again- and we can't wait to celebrate this new chapter with the people we love most.`,
    groom: `The first time Mark saw Catherine, time seemed to slow down. It was an ordinary day that instantly became unforgettable: one smile, one hello, and suddenly his world had a new center. He didn't have the perfect words ready, but he knew he had met someone who felt like home.

Early conversations turned into late-night talks, sharing dreams, favorite meals, and whispered prayers for a future together. With every small adventure—coffee runs, long drives, quiet walks—Mark found himself choosing her over and over again. He loved how she laughed freely, how she listened with her whole heart, and how her faith steadied him.

There were seasons of distance and long workdays, but every reunion reminded him why he stayed patient: because Catherine was worth every mile and every minute apart. When he finally knelt to ask for her hand, it wasn't a question of "if," only "when can we start forever?"`,
    bride: `Catherine remembers the first time Mark said her name. It was gentle but sure, a kindness that made her feel both seen and safe. In that softness, she found a partner who met her with the same grace she prayed to give.

Mark's steadiness won her heart: the way he showed up, even when schedules were tight, and how he always found lightness in the small things. He celebrated her wins, held space for her worries, and never hesitated to choose "us" in every decision.

Now, as they prepare to say yes before God and the people they love most, Catherine is grateful for the patience, humor, and hope Mark brings to every day. She knows this next chapter is just the start of the love story they get to write together.`,
  },
  colors: {
    primary: "#87AE73",
    secondary: "#F5F5DC",
  },
  playlist: {
    title: "A Playlist from our hearts",
    subtitle: "Songs that have been part of our journey together",
    playlistName: "PJ & Nicole Wedding",
    embedUrl:
      "https://open.spotify.com/embed/playlist/2FUZHCJs6Z5iBvP0rKvQdu?utm_source=generator",
    spotifyUrl: "https://open.spotify.com/playlist/2FUZHCJs6Z5iBvP0rKvQdu",
  },
  snapShare: {
    googleDriveLink:
      "https://weduploader.com/upload/x2kqPwdYOMbQ5Dto?utm_source=site&utm_medium=qrcode&utm_campaign=dashboard&utm_content=x2kqPwdYOMbQ5Dto",
    albumQR: "/QR/AlbumQR.png",
    hashtag: ["#KaysChapterWithFelix"],
    instructions: "Please scan this QR Code and upload the photos and videos you have taken during our wedding reception. We are delighted to see your snaps too!",
  },
}

export const entourage = [
  // Best Man & Maid/Matron of Honor
  { role: "Best Man", name: "Red Casallo" },
  { role: "Matron of Honor", name: "Imeeliza Timpug" },

  // Parents of the Bride
  { role: "Father", name: "Jaime Balajadia (Uncle)", group: "kate-family" },
  { role: "Mother", name: "Eloida Ricohermoso", group: "kate-family" },

  // Parents of the Groom
  { role: "Brother", name: "Perry Ticbaen (Brother)", group: "christian-family" },
  { role: "Mother", name: "Felicitas Ticbaen", group: "christian-family" },

  // Bridesmaids
  { role: "Bridesmaid", name: "Thea Lynn Dela Cruz" },
  { role: "Bridesmaid", name: "Keara Zane A Cariño" },
  { role: "Bridesmaid", name: "Fidnah Gracia Padallan" },
  { role: "Bridesmaid", name: "Lorna Ladisla" },
  { role: "Bridesmaid", name: "Carla Vanessa Tabilin" },
  { role: "Bridesmaid", name: "Romela Tolentino" },
  { role: "Bridesmaid", name: "Emmalyn Lipio" },
  { role: "Bridesmaid", name: "Carmen Pascual" },
  { role: "Bridesmaid", name: "Ciddie Manota" },

  // Groomsmen
  { role: "Groomsman", name: "Noah Alcaria" },
  { role: "Groomsman", name: "Jervin Garcia" },
  { role: "Groomsman", name: "Myric Mateo" },
  { role: "Groomsman", name: "Caughvan Faustino" },
  { role: "Groomsman", name: "Jayson Torquiano" },
  { role: "Groomsman", name: "Jendah Egino" },
  { role: "Groomsman", name: "Vincent Saguinsin" },
  { role: "Groomsman", name: "Frederick Manota" },
  { role: "Groomsman", name: "Emerson Sulit" },

  // Secondary Sponsors
  // Candle Sponsors
  { role: "Bridesmaid", name: "Romela Tolentino", group: "candle" },
  // Cord Sponsors
  { role: "Bridesmaid", name: "Emmalyn Lipio", group: "cord" },

  // Flower Girls and Little Bride
  { role: "Flower Girl", name: "Kirsten Elija Leyson" },
  { role: "Flower Girl", name: "Blake Juan" },
  { role: "Flower Girl", name: "Reign Arastel Rivera" },
  { role: "Little Bride", name: "Paige Yael Ticbaen" },

  // Ring / Coin Bearers
  { role: "Ring Bearer", name: "Khaleb Dwayne M. Beltran" },
  { role: "Coin Bearer", name: "Lucas Rhaiden Beltran" },
  { role: "Ring Bearer", name: "Dean James Ticbaen" },
]

export const principalSponsors = [
  // Paired from provided Male and Female Sponsors (order-based)
  // { name: "Mr. Jony Balao", spouse: "Mrs. Conception Balao" },
  // { name: "Mr. Cresencio Francisco", spouse: "Dr. Editha Francisco" },
  // { name: "Mr. Aurelio Sab-it", spouse: "Mrs. Ester Sab-it" },
  // { name: "Mr. Pio McLiing", spouse: "Mrs. Edna Boloma" },
  // { name: "Mr. Fabian Dupiano", spouse: "Mrs. Mary Christine Dupiano" },
  // { name: "Mr. Roberto Dosdos", spouse: "Mrs. Angelica Dosdos" },
  // { name: "Mr. George Sacla", spouse: "Mrs. Minda De Bolt Sacla" },
  // { name: "Mr. Elmo Casallo", spouse: "Mrs. Nora Casallo" },
  // { name: "Engr. Jimmy Atayoc Sr", spouse: "Mrs. Mercedes Atayoc" },
  // { name: "Mr. Tomas Moyongan", spouse: "Mrs. Betty Moyongan" },
  // { name: "Mr. Roger Balantin", spouse: "Mrs. Delia Balantin" },
  // { name: "Honorable Mayor Roderick Awingan", spouse: "Mrs. ____ Awingan" },
  // { name: "Engr Roy Kepes", spouse: "Vice Gove MaryRose Kepes Fongwan" },
  // { name: "Mr. Bobos Nestor Fongwan", spouse: "Mrs. Marga Sison" },
  // { name: "Mr. Junvic Suguinsin", spouse: "Mrs. Lavenia Inson" },
  // { name: "Mr. Salino Dosdos Jr", spouse: "Mrs. Gina Guiang" },
  // { name: "Mr. Pampilo Balajadia", spouse: "Mrs. Angelica Balajadia" },
  // { name: "Mr. Alan M. Serduar", spouse: "Mrs. Oliva Serduar" },
  // { name: "Mr. Miguel Franco", spouse: "Mrs. Angela Balajadia" },
  // Remaining Female Sponsors without paired male
  // { name: "Mrs. Carina C. Watanabe", spouse: "" },
  // { name: "Mrs. Cecile Palilio", spouse: "" },
  // { name: "Mrs. Nida Saguinsin", spouse: "" },
  // { name: "Mrs. Araceli Pitogo", spouse: "" },
  // { name: "Mrs. Alda Unidad", spouse: "" },
  // { name: "Mrs. Reine Bernadeth Bolanos", spouse: "" },
]
