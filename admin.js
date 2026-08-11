const sb=supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
const $=id=>document.getElementById(id);
let products=[],editing=null;

const money=n=>"₹"+Number(n||0).toLocaleString("en-IN");
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

async function uploadProductImage(){
  const file=$("image_file")?.files?.[0];
  if(!file) return $("image_url").value.trim();

  if(file.size>8*1024*1024) throw new Error("Image is larger than 8 MB.");
  if(!file.type.startsWith("image/")) throw new Error("Please select an image file.");

  const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
  const path=`products/${crypto.randomUUID()}.${ext}`;

  const {error}=await sb.storage
    .from("product-images")
    .upload(path,file,{contentType:file.type,upsert:false});

  if(error) throw new Error("Image upload failed: "+error.message);

  const {data}=sb.storage.from("product-images").getPublicUrl(path);
  if(!data?.publicUrl) throw new Error("Could not create a public image URL.");

  $("image_url").value=data.publicUrl;
  return data.publicUrl;
}

function updateDiscount(){
  const mrp=Number($("mrp")?.value||0);
  const price=Number($("price")?.value||0);
  if($("discount")) $("discount").value=(mrp>price&&mrp>0)?Math.round(((mrp-price)/mrp)*1000)/10:0;
}

function previewSelectedImage(){
  const file=$("image_file")?.files?.[0];
  const preview=$("imagePreview");
  if(!file||!preview)return;
  preview.src=URL.createObjectURL(file);
  preview.hidden=false;
}

async function start(){
  if(SUPABASE_URL.startsWith("PASTE_")){
    $("loginMsg").textContent="Add your Supabase URL and publishable key to config.js first.";
    return;
  }
  const {data:{session}}=await sb.auth.getSession();
  session?openDashboard():showLogin();
}

function showLogin(){
  $("loginPanel").hidden=false;
  $("dashboard").hidden=true;
}

async function openDashboard(){
  const {data:{user}}=await sb.auth.getUser();
  $("userArea").innerHTML=`<span style="font-size:12px">${esc(user.email)}</span> <button id="logout" style="margin-left:10px;padding:7px">Logout</button>`;
  $("logout").onclick=async()=>{await sb.auth.signOut();location.reload()};
  $("loginPanel").hidden=true;
  $("dashboard").hidden=false;
  await load();
}

async function login(){
  const {error}=await sb.auth.signInWithPassword({
    email:$("email").value,
    password:$("password").value
  });
  if(error){$("loginMsg").textContent=error.message;return}
  openDashboard();
}

$("loginBtn").onclick=login;
$("password").addEventListener("keydown",e=>{if(e.key==="Enter")login()});

async function load(){
  const {data,error}=await sb.from("products").select("*").order("created_at",{ascending:false});
  if(error){$("productTable").innerHTML=`<p class="msg">${esc(error.message)}</p>`;return}
  products=data||[];
  render();
}

function render(){
  const q=$("adminSearch").value.toLowerCase();
  const selected=$("adminFilter").value;
  const cats=[...new Set(products.map(p=>p.category).filter(Boolean))];

  $("adminFilter").innerHTML='<option>All</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join("");
  $("adminFilter").value=selected;

  const list=products.filter(p=>
    (selected==="All"||p.category===selected)&&
    (!q||[p.name,p.brand,p.category].join(" ").toLowerCase().includes(q))
  );

  $("stats").innerHTML=
    `<div class="stat"><b>${products.length}</b><small>Total products</small></div>
     <div class="stat"><b>${products.filter(p=>p.published).length}</b><small>Published</small></div>
     <div class="stat"><b>${products.filter(p=>p.featured).length}</b><small>Featured</small></div>`;

  $("productTable").innerHTML=list.map(p=>`
    <div class="row">
      <div style="display:flex;gap:10px;align-items:center">
        ${p.image_url?`<img src="${esc(p.image_url)}" style="width:44px;height:44px;object-fit:contain;border-radius:7px;background:#f3f5f7">`:""}
        <div><b>${esc(p.name)}</b><small>${esc(p.brand||"")} · ${esc(p.category||"")}</small></div>
      </div>
      <div><b>${money(p.price)}</b><small>${p.rating||0} ★</small></div>
      <div><span class="tag">${esc(p.badge||"STANDARD")}</span><small class="${p.published?"status":""}">${p.published?"Published":"Hidden"}</small></div>
      <div class="actions"><button data-edit="${p.id}">Edit</button> <button data-toggle="${p.id}">${p.published?"Hide":"Publish"}</button> <button class="danger" data-delete="${p.id}">Delete</button></div>
    </div>`).join("")||"<p>No products.</p>";

  document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));
  document.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>toggle(b.dataset.toggle));
  document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>removeProduct(b.dataset.delete));
}

function reset(){
  editing=null;
  $("editorTitle").textContent="Add product";
  ["pid","name","brand","category","price","mrp","discount","rating","reviews","badge","image_url","description","specs","amazon_url"].forEach(k=>{if($(k))$(k).value=""});
  if($("image_file"))$("image_file").value="";
  if($("imagePreview"))$("imagePreview").hidden=true;
  $("published").checked=true;
  $("featured").checked=false;
  $("saveMsg").textContent="";
}

function add(){
  reset();
  $("editor").hidden=false;
}

function edit(id){
  const p=products.find(x=>String(x.id)===String(id));
  if(!p)return;
  editing=p;
  $("editorTitle").textContent="Edit product";
  $("pid").value=p.id;
  ["name","brand","category","price","mrp","discount","rating","reviews","badge","image_url","description","amazon_url"].forEach(k=>{
    if($(k))$(k).value=p[k]??"";
  });
  $("specs").value=(p.specs||[]).join("\n");
  $("published").checked=!!p.published;
  $("featured").checked=!!p.featured;
  if($("imagePreview")){
    $("imagePreview").src=p.image_url||"";
    $("imagePreview").hidden=!p.image_url;
  }
  $("saveMsg").textContent="";
  $("editor").hidden=false;
}

$("addBtn").onclick=add;
$("closeEditor").onclick=$("cancelBtn").onclick=()=>$("editor").hidden=true;
if($("mrp"))$("mrp").addEventListener("input",updateDiscount);
if($("price"))$("price").addEventListener("input",updateDiscount);
if($("image_file"))$("image_file").addEventListener("change",previewSelectedImage);

async function save(){
  try{
    $("saveMsg").textContent="Saving product…";

    const imageUrl=await uploadProductImage();
    const amazonUrl=$("amazon_url")?.value.trim()||"";

    const row={
      name:$("name").value.trim(),
      brand:$("brand").value.trim(),
      category:$("category").value.trim(),
      price:Number($("price").value||0),
      mrp:Number($("mrp").value||0),
      discount:Number($("discount").value||0),
      rating:Number($("rating").value||0),
      reviews:Number($("reviews").value||0),
      badge:$("badge").value,
      image_url:imageUrl,
      amazon_url:amazonUrl,
      description:$("description").value.trim(),
      specs:$("specs").value.split("\n").map(s=>s.trim()).filter(Boolean),
      published:$("published").checked,
      featured:$("featured").checked
    };

    const r=editing
      ?await sb.from("products").update(row).eq("id",editing.id)
      :await sb.from("products").insert(row);

    if(r.error){
      $("saveMsg").textContent=r.error.message;
      return;
    }

    $("editor").hidden=true;
    await load();
  }catch(e){
    $("saveMsg").textContent=e.message||"Could not save product.";
  }
}

$("saveBtn").onclick=save;
$("adminSearch").oninput=render;
$("adminFilter").onchange=render;

async function toggle(id){
  const p=products.find(x=>String(x.id)===String(id));
  const r=await sb.from("products").update({published:!p.published}).eq("id",id);
  if(r.error)alert(r.error.message);
  await load();
}

async function removeProduct(id){
  if(!confirm("Delete this product?"))return;
  const r=await sb.from("products").delete().eq("id",id);
  if(r.error)alert(r.error.message);
  await load();
}

start();
