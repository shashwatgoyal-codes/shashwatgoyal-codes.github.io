// Auto-ported section markup from the finalized design mockup.
export default function Preloader() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const html = "<div id=\"preloader\"><span id=\"greet\">Hello</span></div>";
