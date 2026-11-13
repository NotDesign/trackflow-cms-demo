export const visualStyles=String.raw`
/* Shared media behavior; each game's typography, colors and section order stay distinct. */
body .game-mobile-hero{display:none!important}
body .game-section-art{display:block;margin:0;min-width:0;overflow:hidden;background:var(--panel)}
body .game-section-art>img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:center}
body [data-section] .game-visual-card{display:block;padding:0;min-width:0;border:0}
body .game-feature-copy{padding:20px 0 0}
body .game-feature-copy>small{display:block;color:var(--muted);font-size:11px;margin-bottom:9px}
body .game-feature-copy h3{margin:0 0 12px}
body .game-feature-copy p{margin:0;line-height:1.85}
body [data-section=intro].game-intro-with-art{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);align-items:center;gap:clamp(24px,5vw,70px);max-width:1360px;text-align:left}
body .game-intro-copy{min-width:0}
body .game-intro-copy h2{max-width:none}
body .game-intro-copy p{max-width:650px;margin-top:22px}
body .game-device{position:relative;isolation:isolate;display:block;margin:0 auto;width:min(270px,100%);aspect-ratio:380/800;filter:drop-shadow(0 18px 18px #0003)}
body .game-phone-frame{position:absolute;z-index:2;inset:0;width:100%;height:100%;max-width:none;object-fit:contain;pointer-events:none}
body .game-phone-screen{position:absolute;overflow:hidden;left:4.47%;top:1.75%;width:90.26%;height:96.5%;border-radius:9%/4.5%;background:#0b1116}
body .game-phone-screen>img{display:block;width:100%;height:100%;object-fit:cover}
body .game-device.is-landscape{width:min(620px,100%);aspect-ratio:800/380}
body .is-landscape>.game-phone-frame{inset:auto;left:50%;top:50%;width:47.5%;height:210.526%;transform:translate(-50%,-50%) rotate(90deg)}
body .is-landscape>.game-phone-screen{left:1.75%;top:5.27%;width:96.5%;height:90.26%;border-radius:4.5%/9%}
body .game-mode-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:center;gap:36px;padding-block:28px}
body .game-mode-row:nth-child(odd)>.game-section-art{order:1}
body .game-mode-row h3{margin:10px 0 16px}
body .pm-modes>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
body .game-mode-disclosure{min-width:0;border:0;padding:0}
body .game-mode-disclosure>summary{display:block;padding:0;list-style:none;cursor:pointer}
body .game-mode-disclosure>summary::-webkit-details-marker{display:none}
body .game-mode-title{display:grid;grid-template-columns:minmax(0,1fr) 28px;gap:8px 12px;align-items:center;padding:20px 0 15px}
body .game-mode-title>strong{font-size:clamp(22px,2vw,30px);line-height:1.35}
body .game-mode-title>small{grid-column:1;font-size:11px;color:var(--muted)}
body .game-mode-title>span{grid-column:2;grid-row:1/3;justify-self:end;font-size:25px;line-height:1;transition:transform .15s}
body .game-mode-disclosure[open] .game-mode-title>span{transform:rotate(45deg)}
body .game-mode-disclosure>p{margin:0;padding:0 0 22px;font-size:13px;max-width:none}
body .game-faq-heading{min-width:0}
body .game-faq-heading .game-section-art{margin-top:24px}
body .game-faq-heading .game-section-art>img{aspect-ratio:4/3}
body [data-section=cta].game-cta-with-art{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:center;gap:clamp(24px,4vw,60px);text-align:left;padding:clamp(24px,5vw,64px) 5%}
body .game-cta-with-art>.gc-shell{width:100%}
body .game-cta-with-art>:is(.gc-shell,.game-cta-copy)>h2{margin:0;font-size:clamp(28px,3.5vw,48px)}
body .game-cta-with-art p{margin:18px 0 24px}
body .game-cta-with-art .gc-platforms{justify-content:flex-start}
body .ag-end.game-cta-with-art{grid-template-columns:1.2fr 1fr}
body .ag-end.game-cta-with-art>.button{grid-column:2;justify-self:start}
@media(max-width:900px){body .pm-modes>div{grid-template-columns:repeat(2,minmax(0,1fr))}body [data-section=intro].game-intro-with-art{gap:28px}}
@media(max-width:700px){
 body .game-desktop-hero{display:none!important}
 body .game-mobile-hero{display:block!important;width:100%!important;height:auto!important;max-height:none!important;min-height:0!important;aspect-ratio:3/4!important;object-fit:cover!important;object-position:50% 45%}
 body [data-section=intro].game-intro-with-art{display:flex;flex-direction:column;align-items:stretch;gap:28px;text-align:left}
 body .game-intro-with-art>.game-device,body .ag-intro>.game-device{order:-1}
 body .game-intro-copy h2{font-size:29px}
 body .game-intro-copy p{font-size:13px;margin-top:18px}
 body .pm-modes>div{grid-template-columns:1fr;gap:26px}
 body .game-mode-row{grid-template-columns:1fr;gap:20px}
 body .game-mode-row:nth-child(odd)>.game-section-art{order:0}
 body .game-feature-copy{padding-top:18px}
 body .game-faq-heading .game-section-art{margin-top:20px}
 body [data-section=cta].game-cta-with-art{display:flex;flex-direction:column;align-items:stretch;padding:30px 5%;gap:24px}
 body .game-cta-with-art>.game-section-art{width:100%}
 body .game-cta-with-art h2{font-size:29px!important}
 body .game-cta-with-art p{font-size:13px}
}
@media(prefers-reduced-motion:reduce){body .game-mode-title>span{transition:none}}
`;
