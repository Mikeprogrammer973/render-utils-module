import Render from '../src/render.js'

const render = new Render();

async function main()
{
    await render.page('http://127.0.0.1:5500/example/test.html', document.querySelector('#app'))

    render.msg_box({
        title: 'Message box',
        msg: 'Do you want to continue?',
        action: {
            cancel: {
                text: 'Cancel',
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

    render.alert({
        theme: 'light',
        variant: 'success',
        msg: 'This is a success alert, be cheerful, my friend!'
    })

    render.alert()

}

main()

