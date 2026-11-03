var e=class e{static grecaptchaScriptLoader;lastPrefill=``;opener=null;grecaptchaCallbackResolver=()=>{};element;constructor(){e.grecaptchaScriptLoader||this.createScriptElement(),this.element=document.createElement(`dialog`),this.setupDialogElement(this.element)}setupDialogElement(e){e.innerHTML=`<button
    type="button"
    class="btn btn--big btn--outline dialog__btn-close"
    title="Click to close FRSOURCE contact form"
    aria-label="Click to close FRSOURCE contact form"
>
    <svg class="icon">
        <title>Left arrow</title>
        <use href="#arrow"></use>
    </svg>
</button>
<div class="dialog__body flex flex-col">
    <form
        class="gform flex h-full grow flex-col"
        method="POST"
        action="https://script.google.com/macros/s/AKfycbzrISB5QwRuuwGTgkxgKp7DGENDHPcxZTcka2_LRQ0zULSf5Ec/exec"
    >
        <label class="topline" for="form-name"
            ><small class="topline__item">Your</small
            ><span class="topline__item">&nbsp;name</span></label
        >
        <input type="text" name="name" id="form-name" required autofocus />

        <label class="topline" for="form-email"
            ><small class="topline__item">Your</small
            ><span class="topline__item">&nbsp;email</span></label
        >
        <input type="email" name="email" id="form-email" required />

        <label class="topline" for="form-message"
            ><small class="topline__item">Your</small
            ><span class="topline__item">&nbsp;message</span></label
        >
        <textarea
            type="text"
            name="message"
            id="form-message"
            class="grow"
            required
        ></textarea>

        <div class="flex justify-between">
            <small class="hidden uppercase md:block"
                >I will answer when<br />my cat falls asleep</small
            >
            <button class="btn fill grow uppercase md:grow-0" type="submit">
                Send
            </button>
        </div>
    </form>
</div>

<svg
    aria-hidden="true"
    class="svg-sprite"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
>
    <symbol id="arrow" viewBox="0 0 131 131">
        <circle r="60" cx="65" cy="65" stroke-width="9" fill="none" />
        <path
            d="M92.98 65.53L81.11 82.45h-8.83l9.28-12.98h-50.8V61.6h50.83l-9.31-12.99h8.83l11.87 16.92z"
        />
    </symbol>
</svg>
`,e.querySelectorAll(`input,textarea`).forEach(e=>{e.setAttribute(`placeholder`,` `)}),e.querySelector(`.dialog__btn-close`).addEventListener(`click`,this.hide.bind(this)),e.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.hide()}),e.querySelector(`.gform`).addEventListener(`submit`,this.onFormSubmit.bind(this))}createScriptElement(){e.grecaptchaScriptLoader=new Promise(e=>{let t=document.createElement(`script`);t.onload=()=>{let t=document.createElement(`div`);t.className=`grecaptcha-wrapper`,document.body.appendChild(t),window.grecaptcha.ready(()=>{window.grecaptcha.render(t,{sitekey:`6LdQaM8ZAAAAAJwBCtGEYIyh9u6be1rBOlsd-FWj`,size:`invisible`,callback:e=>this.grecaptchaCallbackResolver(e)}),e()})},t.src=`https://www.google.com/recaptcha/api.js?render=explicit`,t.defer=!0,t.async=!0,document.body.appendChild(t)})}async executeGrecaptcha(){let e=await new Promise(e=>{this.grecaptchaCallbackResolver=e,window.grecaptcha.execute()});return window.grecaptcha.reset(),e}async sendContactData(e,t=0){let n=`https://script.google.com/macros/s/AKfycbzrISB5QwRuuwGTgkxgKp7DGENDHPcxZTcka2_LRQ0zULSf5Ec/exec?`+e,r=await this.executeGrecaptcha();if((await(await fetch(n+`&token=`+encodeURIComponent(r),{redirect:`follow`,method:`POST`,headers:{"Content-Type":`text/plain;charset=utf-8`}})).json()).result!==`success`){if(++t<3)return this.sendContactData(e,t);throw Error(`Failed to submit contact form`)}}isShown(){return this.element.getAttribute(`open`)===`open`}show(e){this.opener=document.activeElement,requestAnimationFrame(()=>{e!==void 0&&this.prefill(e),this.element.setAttribute(`open`,`open`),this.element.querySelector(`input`)?.focus()})}hide(){this.element.removeAttribute(`open`),this.opener instanceof HTMLElement&&this.opener.focus(),this.opener=null}prefill(e){let t=this.element.querySelector(`textarea`);t&&(t.value===``||t.value===this.lastPrefill)&&(t.value=e,this.lastPrefill=e)}async onFormSubmit(t){await e.grecaptchaScriptLoader;let n=t.currentTarget,r=n.querySelector(`button`);r.disabled=!0,t.preventDefault();let i=Array.prototype.slice.apply(n.querySelectorAll(`input,textarea`)).map(e=>encodeURIComponent(e.name)+`=`+encodeURIComponent(e.value)).join(`&`);await this.sendContactData(i).then(()=>{r.textContent=`THX!`,r.classList.remove(`fill`),r.classList.add(`pointer-events-none`)},()=>{r.textContent=`ERROR! Try later.`,r.classList.remove(`fill`),r.classList.add(`pointer-events-none`)}),r.disabled=!1}};export{e as ContactDialogCtrl};