const PHONE='244948138785';
const zipPath='Foco%20studio.zip';
document.querySelectorAll('.whatsapp-link').forEach(a=>a.href='https://wa.me/'+PHONE+'?text='+encodeURIComponent('Olá, FOCUS STUDIO. Gostaria de obter informações sobre retratos, fotografia de beleza e natureza.'));
document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
async function loadPortfolio(){
 const gallery=document.getElementById('gallery');
 try{
  if(!window.JSZip)throw new Error('Leitor de imagens indisponível.');
  const response=await fetch(zipPath);if(!response.ok)throw new Error('Arquivo de fotografias indisponível.');
  const zip=await JSZip.loadAsync(await response.arrayBuffer());
  const entries=Object.values(zip.files).filter(f=>!f.dir&&/\.(jpe?g|png|webp)$/i.test(f.name));
  const assets={};const photos=[];
  for(const file of entries){
   const blob=await file.async('blob'),url=URL.createObjectURL(blob),base=file.name.split('/').pop().toLowerCase();
   if(base==='logo.png')assets.logo=url;
   else if(base==='banner.png')assets.banner=url;
   else if(!/logo|banner|brand|marca/.test(base))photos.push({name:file.name,url});
  }
  if(assets.logo)document.querySelectorAll('.brand-logo').forEach(img=>img.src=assets.logo);
  else document.querySelectorAll('.brand-logo').forEach(img=>img.src='logo.png');
  const hero=document.querySelector('.hero-backdrop');
  if(assets.banner)hero.style.backgroundImage='url("'+assets.banner+'")';
  else hero.style.backgroundImage='url("banner.png")';
  if(!photos.length)throw new Error('Não foram encontradas fotografias na pasta ZIP.');
  gallery.innerHTML='';
  photos.forEach((item,i)=>{
   const card=document.createElement('a');card.className='gallery-item';card.href=item.url;card.target='_blank';card.rel='noopener';card.setAttribute('aria-label','Ver fotografia '+(i+1));
   const img=document.createElement('img');img.src=item.url;img.alt='Fotografia artística '+(i+1)+' — FOCUS STUDIO';img.loading=i<4?'eager':'lazy';card.appendChild(img);gallery.appendChild(card);
  });
  const targets=[...document.querySelectorAll('[data-photo]')];
  targets.forEach(el=>{const index=Number(el.dataset.photo)%photos.length;el.style.backgroundImage='url("'+photos[index].url+'")';});
 }catch(error){
  document.querySelectorAll('.brand-logo').forEach(img=>img.src='logo.png');
  document.querySelector('.hero-backdrop').style.backgroundImage='url("banner.png")';
  gallery.innerHTML='<p class="gallery-loading">A galeria não ficou disponível neste momento. Contacte a FOCUS STUDIO para conhecer os trabalhos.</p>';
  console.error(error);
 }
}
loadPortfolio();