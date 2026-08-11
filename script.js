const sb=supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const $=id=>document.getElementById(id);
let products=[];

const icons={"Mobile & Gadgets":"📱",Audio:"🎧",Computer:"💻",Accessories:"🔌","Car Accessories":"🚗",Wearables:"⌚"};
const money=n=>"₹"+Number(n||0).toLocaleString("en-IN");
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const stars=r=>"★".repeat(Math.floor(Number(r)||0))+(Number(r)%1>=.5?"½":"");
const safeUrl=u=>{
  const raw=String(u||"").trim();
  if(!raw)return "";
  if(/^https?:\/\//i.test(raw))return raw;
  if(/^www\./i.test(raw))return "https://"+raw;
  return "";
};
const priceHtml=p=>{
  const price=Number(p.price||0),mrp=Number(p.mrp||0),disc=Number(p.discount||0);
  return `<div class="price">${money(price)} ${mrp>price?`<del>${money(mrp)}</del>`:""} ${disc>0?`<small>${disc}% OFF</small>`:""}</div>`;
};

async function loadProducts(){
  if(SUPABASE_URL.startsWith("PASTE_")){
    $("resultInfo").textContent="Supabase is not connected.";
    return;
  }
  const {data,error}=await sb.from("products").select("*").eq("published",true).order("featured",{ascending:false}).order("created_at",{ascending:false});
  if(error){
    console.error("UNBOX_GADGS Supabase error:",error);
    $("resultInfo").textContent="Could not load products: "+(error.message||"Supabase request failed");
    return;
  }
  products=data||[];
  renderCategories();
  renderProducts();
}

function renderCategories(){
  const names=[...new Set(products.map(p=>p.category).filter(Boolean))];
  $("categoryGrid").innerHTML=names.map(c=>
    `<button type="button" class="category" data-cat="${esc(c)}">
      <div class="cat-icon">${icons[c]||"◈"}</div>
      <b>${esc(c)}</b>
      <small>${products.filter(p=>p.category===c).length} products</small>
    </button>`
  ).join("");
  $("categoryFilter").innerHTML='<option value="All">All</option>'+names.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
  document.querySelectorAll("[data-cat]").forEach(b=>b.addEventListener("click",()=>{
    $("categoryFilter").value=b.dataset.cat;
    $("catalogue").scrollIntoView({behavior:"smooth"});
    renderProducts();
  }));
}

function imageHtml(p){
  return p.image_url
    ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=&quot;emoji&quot;>${icons[p.category]||"◈"}</span>'">`
    : `<span class="emoji">${icons[p.category]||"◈"}</span>`;
}

function renderProducts(){
  const q=$("search").value.toLowerCase().trim();
  const cat=$("categoryFilter").value;
  const sort=$("sort").value;

  let list=products.filter(p=>
    (cat==="All"||p.category===cat)&&
    (!q||[p.name,p.brand,p.category].join(" ").toLowerCase().includes(q))
  );

  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(sort==="rating")list.sort((a,b)=>(b.rating||0)-(a.rating||0));

  $("resultInfo").textContent=`Showing ${list.length} of ${products.length} products`;

  $("productGrid").innerHTML=list.length
    ? list.map(p=>{
        const buy=safeUrl(p.amazon_url);
        return `<article class="product-card">
          ${p.badge?`<span class="badge ${p.badge==="NEW"?"green":""}">${esc(p.badge)}</span>`:""}
          <div class="product-image">${imageHtml(p)}</div>
          <div class="product-body">
            <h3>${esc(p.name)}</h3>
            <div class="rating">${stars(p.rating)} <span>${p.rating||0} · ${p.reviews||0} reviews</span></div>
            <div class="price-wrap">${priceHtml(p)}</div>
            <div class="label">${esc(p.brand||"")} · ${esc(p.category||"")}</div>
            <div class="actions">
              ${buy
                ? `<a class="buy-now" href="${esc(buy)}" target="_blank" rel="nofollow sponsored noopener">Buy Now ↗</a>`
                : `<button class="primary" type="button" data-view="${p.id}">View details</button>`}
              <button type="button" data-view="${p.id}">View details</button>
            </div>
          </div>
        </article>`;
      }).join("")
    : `<div style="grid-column:1/-1;text-align:center;padding:40px;background:#fff;border-radius:14px">No products found.</div>`;

  document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showProduct(b.dataset.view)));
}

function showProduct(id){
  const p=products.find(x=>String(x.id)===String(id));
  if(!p)return;
  const buy=safeUrl(p.amazon_url);

  $("modalContent").innerHTML=`
    <div class="detail">
      <div class="detail-image">${imageHtml(p)}</div>
      <div>
        <span class="kicker">${esc((p.category||"").toUpperCase())}</span>
        <h2>${esc(p.name)}</h2>
        <div class="rating">${stars(p.rating)} <span>${p.rating||0}/5 · ${p.reviews||0} reviews</span></div>
        <div class="price">${money(p.price)}</div>
        <p>${esc(p.description||"")}</p>
        <h3>Key specifications</h3>
        <ul class="specs">${(p.specs||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        <div class="detail-actions">
          ${buy
            ? `<a class="buy-now large" href="${esc(buy)}" target="_blank" rel="nofollow sponsored noopener">Buy Now ↗</a>`
            : `<span class="no-link">Buy Now link not added yet</span>`}
        </div>
      </div>
    </div>`;
  $("modal").style.display="block";
  document.body.style.overflow="hidden";
}

function closeModal(){
  const modal=$("modal");
  if(modal)modal.style.display="none";
  document.body.style.overflow="";
}

function outsideClose(e){
  if(e.target===$("modal"))closeModal();
}

function toggleNav(){
  const nav=$("nav");
  if(nav)nav.classList.toggle("open");
}

function bindPublicUI(){
  const search=$("search"),category=$("categoryFilter"),sort=$("sort");
  if(search)search.oninput=renderProducts;
  if(category)category.onchange=renderProducts;
  if(sort)sort.onchange=renderProducts;

  const refresh=$("refreshProducts");
  if(refresh)refresh.onclick=loadProducts;

  const contact=$("contactWhatsapp");
  if(contact){
    contact.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi UNBOX_GADGS, I need help choosing a product.")}`;
    contact.target="_blank";
  }

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape")closeModal();
  });
}

bindPublicUI();
loadProducts();
