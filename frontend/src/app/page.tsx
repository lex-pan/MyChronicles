export default function About() {
    return(
        <>
        <iframe src="/about.html" className="about-synopsis" frameBorder="0" />
        <div className="attribution">
            <p>TY Jhamman for the sakura petals: <a className="sakura-link" href="https://github.com/jhammann/sakura">Link</a></p>
        </div>
        <div className="getting-started">
            <div className="started-info pink-border">
                <h1 className="pink-text page-title">Getting Started?</h1>
                <p>1. Create an account to keep track: <a className="pink-bottom" href="/login?post=back">Login</a></p>
                <p>2. Download our extension in the store:</p>
                <a className="pink-bottom extension-link" href="https://addons.mozilla.org/en-CA/firefox/addon/my-chronicles/">- Firefox</a>
                <a className="pink-bottom extension-link" href="https://microsoftedge.microsoft.com/addons/detail/mychronicles-extension/fjgebdoelpgbneakgkaoidkllobmgbmf">- Microsoft Edge</a>
                <p>Don&apos;t see a site you read on? <a className="pink-bottom" href="https://discord.gg/j48t82Tduk">Join MyChronicles discord for site requests, bug fixes, or to hang out</a></p>
            </div>
        </div>
        </>
    )
}