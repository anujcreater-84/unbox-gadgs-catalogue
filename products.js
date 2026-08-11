/*
  PRODUCT DATABASE
  ----------------
  To add a product, copy one object and change its values.
  image: leave blank to use the emoji, OR use a local path such as "assets/ie200.jpg".
  WhatsApp number is configured in script.js.
*/
const products = [
 {id:1,name:"Sennheiser IE 200",brand:"Sennheiser",category:"Audio",price:7800,image:"",emoji:"🎧",badge:"NEW",rating:4.5,reviews:142,description:"High-fidelity in-ear monitors designed for detailed, natural listening.",specs:["TrueResponse transducer","Detachable braided cable","3.5 mm connector","Frequency response: 6 Hz–20,000 Hz","Impedance: 18 Ω"]},
 {id:2,name:"boAt Airdopes 161",brand:"boAt",category:"Audio",price:1499,image:"",emoji:"🎧",badge:"POPULAR",rating:4.4,reviews:128,description:"Everyday true wireless earbuds with a compact charging case.",specs:["Bluetooth wireless","Long playback","Fast charging","In-ear design"]},
 {id:3,name:"Noise ColorFit Pulse 3",brand:"Noise",category:"Wearables",price:1799,image:"",emoji:"⌚",badge:"HOT",rating:4.3,reviews:96,description:"Feature-packed smartwatch with a large display and everyday health tracking.",specs:["Large display","Bluetooth calling","Activity tracking","Multiple sports modes"]},
 {id:4,name:"JBL Flip 6",brand:"JBL",category:"Audio",price:9999,image:"",emoji:"🔊",badge:"",rating:4.6,reviews:210,description:"Portable Bluetooth speaker for powerful everyday listening.",specs:["Portable design","Bluetooth","Water resistant","Powerful audio"]},
 {id:5,name:"Redmi Note 13 Pro",brand:"Redmi",category:"Mobile & Gadgets",price:19999,image:"",emoji:"📱",badge:"FEATURED",rating:4.5,reviews:310,description:"Modern smartphone with a high-resolution display and capable camera system.",specs:["AMOLED display","High-resolution camera","Fast charging","5G connectivity"]},
 {id:6,name:"Ambrane 20000mAh Power Bank",brand:"Ambrane",category:"Accessories",price:1599,image:"",emoji:"🔋",badge:"",rating:4.4,reviews:75,description:"High-capacity portable power bank for phones and everyday devices.",specs:["20,000 mAh capacity","Multiple outputs","LED indicator","Travel friendly"]},
 {id:7,name:"Logitech K380 Keyboard",brand:"Logitech",category:"Computer",price:2795,image:"",emoji:"⌨️",badge:"",rating:4.5,reviews:88,description:"Compact wireless keyboard for multi-device setups.",specs:["Bluetooth","Compact layout","Multi-device support","Long battery life"]},
 {id:8,name:"TP-Link Dual-Band Router",brand:"TP-Link",category:"Computer",price:2499,image:"",emoji:"📡",badge:"",rating:4.2,reviews:64,description:"Reliable home networking solution for connected devices.",specs:["Dual-band Wi-Fi","Multiple antennas","Easy setup","App management"]},
 {id:9,name:"70mai Dash Cam",brand:"70mai",category:"Car Accessories",price:6999,image:"",emoji:"🚗",badge:"NEW",rating:4.6,reviews:51,description:"Compact dashboard camera for everyday driving and road recording.",specs:["Wide-angle camera","Loop recording","Parking monitoring","Mobile app support"]},
 {id:10,name:"65W USB-C GaN Charger",brand:"UNBOX PICK",category:"Accessories",price:2499,image:"",emoji:"🔌",badge:"",rating:4.5,reviews:112,description:"Compact fast charger for phones, tablets and compatible laptops.",specs:["65W output","USB-C PD","GaN technology","Compact design"]}
];