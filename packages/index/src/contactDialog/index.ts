import tpl from './tpl.html?raw';

export class ContactDialogCtrl {
    static grecaptchaScriptLoader: Promise<void>;

    private lastPrefill = '';
    private opener: Element | null = null;
    private grecaptchaCallbackResolver: (token: string) => void = () => {};
    element: HTMLDialogElement;

    constructor() {
        if (!ContactDialogCtrl.grecaptchaScriptLoader)
            this.createScriptElement();

        this.element = document.createElement('dialog');
        this.setupDialogElement(this.element);
    }

    private setupDialogElement(element: HTMLDialogElement) {
        element.innerHTML = tpl;
        element.querySelectorAll('input,textarea').forEach((inputEl) => {
            inputEl.setAttribute('placeholder', ' '); // to let 'placeholder-shown' styling to kick in
        });
        element
            .querySelector('.dialog__btn-close')!
            .addEventListener('click', this.hide.bind(this));
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hide();
        });

        element
            .querySelector<HTMLFormElement>('.gform')!
            .addEventListener('submit', this.onFormSubmit.bind(this));
    }

    private createScriptElement() {
        ContactDialogCtrl.grecaptchaScriptLoader = new Promise<void>(
            (resolve) => {
                const script = document.createElement('script');
                script.onload = () => {
                    const container = document.createElement('div');
                    container.className = 'grecaptcha-wrapper';
                    document.body.appendChild(container);
                    (window as any).grecaptcha.ready(() => {
                        (window as any).grecaptcha.render(container, {
                            sitekey: '6LdQaM8ZAAAAAJwBCtGEYIyh9u6be1rBOlsd-FWj',
                            size: 'invisible',
                            callback: (token: string) =>
                                this.grecaptchaCallbackResolver(token),
                        });
                        resolve();
                    });
                };
                script.src =
                    'https://www.google.com/recaptcha/api.js?render=explicit';
                script.defer = true;
                script.async = true;

                document.body.appendChild(script);
            },
        );
    }

    private async executeGrecaptcha() {
        const token = await new Promise<string>((resolve) => {
            this.grecaptchaCallbackResolver = resolve;
            (window as any).grecaptcha.execute();
        });
        (window as any).grecaptcha.reset();

        return token;
    }

    private async sendContactData(data: string, attempt = 0): Promise<void> {
        const url =
            'https://script.google.com/macros/s/AKfycbzrISB5QwRuuwGTgkxgKp7DGENDHPcxZTcka2_LRQ0zULSf5Ec/exec?' +
            data;

        const token = await this.executeGrecaptcha();

        const res = await fetch(url + '&token=' + encodeURIComponent(token), {
            redirect: 'follow',
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });
        const resData = (await res.json()) as { result: string };
        if (resData.result === 'success') return;
        else if (++attempt < 3) return this.sendContactData(data, attempt);
        else throw new Error('Failed to submit contact form');
    }

    isShown() {
        return this.element.getAttribute('open') === 'open';
    }

    /** @param message optional text to pre-fill an empty (or untouched) message field */
    show(message?: string) {
        this.opener = document.activeElement;
        requestAnimationFrame(() => {
            if (message !== undefined) this.prefill(message);
            this.element.setAttribute('open', 'open');
            this.element.querySelector<HTMLElement>('input')?.focus();
        });
    }

    hide() {
        this.element.removeAttribute('open');
        if (this.opener instanceof HTMLElement) this.opener.focus();
        this.opener = null;
    }

    private prefill(message: string) {
        const textarea = this.element.querySelector('textarea');
        if (!textarea) return;
        if (textarea.value === '' || textarea.value === this.lastPrefill) {
            textarea.value = message;
            this.lastPrefill = message;
        }
    }

    async onFormSubmit(e: Event) {
        await ContactDialogCtrl.grecaptchaScriptLoader;

        const form = e.currentTarget as HTMLFormElement;
        const button = form.querySelector('button')!;
        button.disabled = true;
        e.preventDefault();

        const url = Array.prototype.slice
            .apply(form.querySelectorAll('input,textarea'))
            .map(
                (el: HTMLInputElement | HTMLTextAreaElement) =>
                    encodeURIComponent(el.name) +
                    '=' +
                    encodeURIComponent(el.value),
            )
            .join('&');

        await this.sendContactData(url).then(
            () => {
                button.textContent = 'THX!';
                button.classList.remove('fill');
                button.classList.add('pointer-events-none');
            },
            () => {
                button.textContent = 'ERROR! Try later.';
                button.classList.remove('fill');
                button.classList.add('pointer-events-none');
            },
        );
        button.disabled = false;
    }
}
