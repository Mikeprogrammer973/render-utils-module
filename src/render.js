
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
        let theme

        switch (prms.type)
        {
            case 'msg_box':
                const id__ = this.__id();

                this.inject_style('http://127.0.0.1:5500/src/styles/msg_box.css', id__)

                theme = prms.props.theme === 'light' ? 'light' : 'dark'

                const ntf = document.createElement('div');
                ntf.id = id__
                ntf.className = theme === 'light' ? 'backdrop-light' : 'backdrop';

                const ntf_content = document.createElement('div');
                ntf_content.className = theme === 'light' ? 'msg-box-light' : 'msg-box';

                const ntf_close_btn = document.createElement('button');
                ntf_close_btn.className = theme === 'light' ? 'close-light close' : 'close';
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
                ntf_cancel_btn.className = theme === 'light' ? 'cancel-light cancel' : 'cancel'
                ntf_cancel_btn.innerHTML = prms.props.action.cancel.text
                ntf_cancel_btn.addEventListener('click', () => {
                    prms.props.action.cancel.callback()
                    this.destroy(ntf.id)
                })

                const ntf_confirm_btn = document.createElement('button')
                ntf_confirm_btn.className = theme === 'light' ? 'confirm-light confirm' : 'confirm'
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
                const id = this.__id();

                this.inject_style('http://127.0.0.1:5500/src/styles/alert.css', id)

                const useLight = prms.props.theme === 'light';
                const type = ['info', 'success', 'warning', 'error'].includes(prms.props.variant)
                    ? prms.props.variant
                    : 'info';
                const cls = (base) => useLight ? `${base}-light ${base}` : `${base}-dark ${base}`

                const alert = Object.assign(document.createElement('div'), {
                    id,
                    className: `${cls('alert')} ${type}`,
                });

                const alert_msg = Object.assign(document.createElement('span'), {
                    className: 'alert-msg',
                    innerHTML: prms.props.msg,
                });

                const close_btn = Object.assign(document.createElement('button'), {
                    className: cls('close'),
                    innerHTML: '&times;',
                    onclick: () => this.destroy(id)
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
                            this.destroy(id)
                            return
                        }
                        currentWidth -= step
                        progress.style.width = `${currentWidth}%`
                    }, step)
                }

                return id;
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