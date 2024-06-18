export default function About() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
          <iframe
            src="/public/about/about.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Static HTML Page"
          />
        </div>
      );
}