const WHATSAPP_NUMBER="919999999999";
const categoryIcons={"Mobile & Gadgets":"📱","Audio":"🎧","Computer":"💻","Accessories":"🔌","Car Accessories":"🚗","Wearables":"⌚"};
const $=id=>document.getElementById(id);
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const stars=r=>{let full=Math.floor(r), half=r%1>=.5?"½":"";return "★".repeat(full)+half};
function renderCategories(){
 const names=[...new Set(products.map(p=>p.category))];
 $("categoryGrid").innerHTML=names.map(c=>`<button class="category" onclick="chooseCategory('${c.replaceAll("'","\\'")}')"><div class="cat-icon">${categoryIcons[c]||"◈"}</div><b>${c}</b><small>${products.filter(p=>p.category===c).length} products</small></button>`).join("");
 $("categoryFilter").innerHTML='<option>All</option>'+names.map(c=>`<option>${c}</option>`).join("");
}
function imageHTML(p,detail=false){
 return p.image?`<img src="${p.image}" alt="${p.name}" style="max-width:82%;max-height:82%;object-fit:contain">`:`<span class="emoji">${p.emoji||"◈"}</span>`;
}
function renderProducts(){
 const q=$("search").value.trim().toLowerCase(), cat=$("categoryFilter").value, sort=$("sort").value;
 let list=products.filter(p=>(cat==="All"||p.category===cat)&&(!q||[p.name,p.brand,p.category].join(" ").toLowerCase().includes(q)));
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price); if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
 $("resultInfo").textContent=`Showing ${list.length} of ${products.length} products`;
 $("productGrid").innerHTML=list.length?list.map(p=>`
 <article class="product-card">
  ${p.badge?`<span class="badge ${p.badge==="NEW"?"green":""}">${p.badge}</span>`:""}
  <div class="product-image">${imageHTML(p)}</div>
  <div class="product-body"><h3>${p.name}</h3><div class="rating">${stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
  <div class="price">${money(p.price)}</div><div class="category-label">${p.brand} · ${p.category}</div>
  <div class="product-actions"><button onclick="showProduct(${p.id})">View details</button><button class="primary-action" onclick="enquire(${p.id})">Enquire</button></div></div>
 </article>`).join(""):`<div style="grid-column:1/-1;padding:40px;text-align:center;background:#fff;border-radius:14px">No products found. Try another search.</div>`;
}
function chooseCategory(c){$("categoryFilter").value=c;$("catalogue").scrollIntoView({behavior:"smooth"});renderProducts()}
function showProduct(id){
 const p=products.find(x=>x.id===id); if(!p)return;
 $("modalContent").innerHTML=`<div class="detail"><div class="detail-image">${imageHTML(p,true)}</div><div><span class="kicker">${p.category.toUpperCase()}</span><h2>${p.name}</h2><div class="rating">${stars(p.rating)} <span>${p.rating}/5 · ${p.reviews} reviews</span></div><div class="price">${money(p.price)}</div><p>${p.description}</p><h3>Key specifications</h3><ul class="specs">${p.specs.map(s=>`<li>${s}</li>`).join("")}</ul><div class="share-row"><button class="wa" onclick="enquire(${p.id})">WhatsApp enquiry</button><button onclick="shareProduct(${p.id})">Share</button></div></div></div>`;
 $("modal").style.display="block";document.body.style.overflow="hidden";
}
function enquire(id){const p=products.find(x=>x.id===id);const msg=encodeURIComponent(`Hi UNBOX_GADGS, I want to enquire about ${p.name} (${money(p.price)}).`);window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank","noopener")}
async function shareProduct(id){const p=products.find(x=>x.id===id), data={title:p.name,text:`${p.name} — ${money(p.price)} | UNBOX_GADGS`,url:location.href+"#product-"+p.id};try{if(navigator.share)await navigator.share(data);else await navigator.clipboard.writeText(data.url);alert(navigator.share?"":"Product link copied.")}catch(e){}}
function closeModal(){$("modal").style.display="none";document.body.style.overflow=""}
function outsideClose(e){if(e.target.id==="modal")closeModal()}
function toggleNav(){const n=$("nav");n.style.display=n.style.display==="flex"?"":"flex";n.style.position="absolute";n.style.right="18px";n.style.top="68px";n.style.background="#080b10";n.style.padding="18px";n.style.flexDirection="column";n.style.borderRadius="12px"}
renderCategories();renderProducts();