import Render from '../src/render.js'

const render = new Render();

async function main()
{
    await render.page('http://127.0.0.1:5500/example/test.html', document.querySelector('#app'))

    render.msg_box({
        title: 'Notification',
        msg: 'This is a notification',
        action: {
            cancel: {
                text: 'Dismiss',
                callback: () => {
                    console.log('Cancel clicked')
                }
            },
            confirm: {
                text: 'Confirm',
                callback: () => {
                    console.log('Confirm clicked')
                }
            }
        },
        theme: 'dark'
    })
}

main()

