export default function About() {
    return(
        <>
        <iframe src="/about.html" className="about-synopsis" frameBorder="0" />
        <div className="attribution">
            <p>TY Jhamman for the sakura petals: <a className="sakura-link" href="https://github.com/jhammann/sakura">Link</a></p>
        </div>
        <div className="getting-started">
            <div className="started-info">
                <h1>Getting Started?</h1>
                <p>1. Create an account to keep track. <a href="/login?post=back">Login Link</a></p>
                <p>2. Download our extension in the extension store <a>Extension Link</a></p>
                <p>Don&apos;t see a site you read on? <a href="https://discord.gg/j48t82Tduk">Join MyChronicles discord for site requests, bug fixes, or to hang out</a></p>
            </div>
        </div>
        </>
    )
}