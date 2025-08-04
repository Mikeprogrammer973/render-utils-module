
export default class Render
{
    async inject_style(url, id)
    {
        const style = document.createElement('style');
        style.id = `${id}-style`
        style.textContent = await (await fetch(url)).text();

        document.head.appendChild(style)
    }


    build(prms)
    {
        let useLight, id__, cls

        switch (prms.type)
        {
            case 'msg_box':
                id__ = this.__id();

                this.inject_style('http://127.0.0.1:5500/src/styles/msg_box.css', id__)

                const theme__ = prms.props.theme === 'light' ? 'light' : 'dark'

                const ntf = document.createElement('div');
                ntf.id = id__
                ntf.className = theme__ === 'light' ? 'backdrop-light' : 'backdrop';

                const ntf_content = document.createElement('div');
                ntf_content.className = theme__ === 'light' ? 'msg-box-light' : 'msg-box';

                const ntf_close_btn = document.createElement('button');
                ntf_close_btn.className = theme__ === 'light' ? 'close-light close' : 'close';
                ntf_close_btn.innerHTML =  '&times;'
                ntf_close_btn.addEventListener('click', () => {
                    prms.props.action.cancel.callback()
                    this.destroy(ntf.id)
                })

                const ntf_title = document.createElement('h2')
                ntf_title.innerHTML = prms.props.title

                const ntf_msg = document.createElement('p')
                ntf_msg.innerHTML = prms.props.msg;

                const ntf_actions = document.createElement('div')
                ntf_actions.className = 'actions'

                const ntf_cancel_btn = document.createElement('button')
                ntf_cancel_btn.className = theme__ === 'light' ? 'cancel-light cancel' : 'cancel'
                ntf_cancel_btn.innerHTML = prms.props.action.cancel.text
                ntf_cancel_btn.addEventListener('click', () => {
                    prms.props.action.cancel.callback()
                    this.destroy(ntf.id)
                })

                const ntf_confirm_btn = document.createElement('button')
                ntf_confirm_btn.className = theme__ === 'light' ? 'confirm-light confirm' : 'confirm'
                ntf_confirm_btn.innerHTML = prms.props.action.confirm.text
                ntf_confirm_btn.addEventListener('click', () => {
                    prms.props.action.confirm.callback()
                    this.destroy(ntf.id)
                })

                ntf_actions.appendChild(ntf_cancel_btn)
                ntf_actions.appendChild(ntf_confirm_btn)

                ntf_content.appendChild(ntf_close_btn)
                ntf_content.appendChild(ntf_title)
                ntf_content.appendChild(ntf_msg)
                ntf_content.appendChild(ntf_actions)

                ntf.appendChild(ntf_content)

                document.body.appendChild(ntf)

                return ntf.id
            case 'alert':
                id__ = this.__id();

                this.inject_style('http://127.0.0.1:5500/src/styles/alert.css', id__)

                useLight = prms.props.theme === 'light';
                const type = ['info', 'success', 'warning', 'error'].includes(prms.props.variant)
                    ? prms.props.variant
                    : 'info';
                cls = (base) => useLight ? `${base}-light ${base}` : `${base}-dark ${base}`

                const alert = Object.assign(document.createElement('div'), {
                    id: id__,
                    className: `${cls('alert')} ${type}`,
                });

                const alert_msg = Object.assign(document.createElement('span'), {
                    className: 'alert-msg',
                    innerHTML: prms.props.msg,
                });

                const close_btn = Object.assign(document.createElement('button'), {
                    className: cls('close'),
                    innerHTML: '&times;',
                    onclick: () => this.destroy(id__)
                });

                const progress = document.createElement('div');
                progress.className = 'alert-progress';

                alert.append(alert_msg, close_btn, progress);
                document.body.appendChild(alert);

                if (prms.props.timeout) {
                    const timeout = prms.props.timeout;
                    progress.style.width = '100%'

                    const step = 100 / (timeout / 2)
                    let currentWidth = 100

                    const interval = setInterval(() => {
                        if (currentWidth <= 0) {
                            clearInterval(interval)
                            this.destroy(id__)
                            return
                        }
                        currentWidth -= step
                        progress.style.width = `${currentWidth}%`
                    }, step)
                }

                return alert.id
            case 'spinner':
                id__ = this.__id();

                this.inject_style('http://127.0.0.1:5500/src/styles/spinner.css', id__);

                const { variant = 'simple', theme = 'dark', text = 'Loading...', backdrop = true, custom = {} } = prms.props

                useLight = theme === 'light';
                cls = (base) => useLight ? `${base}-light ${base}` : `${base}-dark ${base}`;

                const container = document.createElement('div');
                container.id = id__;
                container.className = backdrop ? cls('spinner-backdrop') : cls('spinner-container');

                const spinnerWrapper = document.createElement('div');
                spinnerWrapper.className = `spinner ${variant}`;

                if (variant === 'custom' && custom.url) {
                    const img = document.createElement('img');
                    img.src = custom.url;
                    img.alt = 'spinner';
                    img.className = `custom-spinner ${custom.animation || ''}`;
                    spinnerWrapper.appendChild(img);
                } else {
                    if (variant === 'simple' || variant === 'dual' || variant === 'triple') {
                        if (custom.animation === 'spin') {
                            const loader = document.createElement('div');
                            loader.className = 'spinner-loader';

                            const rings = variant === 'dual' ? 2 : variant === 'triple' ? 3 : 1;

                            for (let i = 0; i < rings; i++) {
                                const ring = document.createElement('div');
                                ring.className = 'spinner-ring';
                                loader.appendChild(ring);
                            }

                            spinnerWrapper.appendChild(loader);
                        } else {
                            const count = variant === 'dual' ? 2 : variant === 'triple' ? 3 : 1;
                            for (let i = 0; i < count; i++) {
                                const el = document.createElement('div');
                                el.className = `spinner-circle circle-${i + 1} ${custom.animation || ''}`;
                                spinnerWrapper.appendChild(el);
                            }
                        }
                    }
                }

                container.appendChild(spinnerWrapper);

                if (text) {
                    const caption = document.createElement('div');
                    caption.className = 'spinner-text';
                    caption.innerText = text;
                    container.appendChild(caption);
                }

                document.body.appendChild(container);

                return container.id
        }
    }

    msg_box(prms = {theme: 'dark', title: 'Message', msg: 'Something...', action: { cancel: { text: 'Cancel', callback: ()=>{} }, confirm: { text: 'Confirm', callback: ()=>{}} } })
    {
        return this.build({ type: 'msg_box', props: prms })
    }

    alert(prms = {theme: 'dark', variant: 'info', msg: 'Something...', timeout: 3000})
    {
        return this.build({ type: 'alert', props: prms })
    }

    spinner(prms = {variant: 'triple', theme: 'dark', text: '', backdrop: true, custom: { url: '', animation: 'spin' }})
    {
        return this.build({ type: 'spinner', props: prms })
    }

    async page(url, host = document.body, util = () => {})
    {
        host.innerHTML = await (await fetch(url)).text();
        util()
    }

    __id()
    {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 10; i++)
        {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        if (document.getElementById(id))
        {
            return this.__id();
        }

        return id;
    }

    destroy(id)
    {
        const el = document.getElementById(id)
        if (el)
        {
            el.remove()
            document.getElementById(`${id}-style`).remove()
        }
    }
}