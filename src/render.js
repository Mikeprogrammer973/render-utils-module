
export default class Render
{
    #styleLoaded = false

    async inject_style(url)
    {
        if (!this.#styleLoaded)
        {
            const style = document.createElement('style');
            style.textContent = await (await fetch(url)).text();

            document.head.appendChild(style);

            this.#styleLoaded = true;
        }
    }


    build(prms)
    {
        switch (prms.type)
        {
            case 'msg_box':
                this.inject_style('https://cdn.jsdelivr.net/gh/Mikeprogrammer973/render-utils-module/src/styles/msg_box.css')

                const theme = prms.props.theme === 'light' ? 'light' : 'dark'

                const ntf = document.createElement('div');
                ntf.id = this.__id();
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

                return ntf.id;
        }
    }

    msg_box(prms = {theme: 'dark', title: 'Message', msg: 'Something...', action: { cancel: { text: 'Cancel', callback: ()=>{} }, confirm: { text: 'Confirm', callback: ()=>{}} } })
    {
        return this.build({ type: 'msg_box', props: prms })
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
        document.getElementById(id).remove();
    }
}