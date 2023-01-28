import { h, render } from 'https://unpkg.com/preact@latest?module';
import { useEffect, useState } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import htm from "https://unpkg.com/htm?module"

// Initialize htm with Preact
const html = htm.bind(h);

const InterceptPaste = ({children, onImage, onMessage}) => {
  const onPaste = (event) => {
    event.preventDefault();
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;

    for (const item of items) {
      if (item.type !== "image/png") continue;

      const blob = item.getAsFile();
      var reader = new FileReader();
      reader.onload = (event) => onImage(event.target.result)
      reader.readAsDataURL(blob);
      return;
    }

    onImage(undefined)
    onMessage("Error: Paste event contained no image items")
  }

  return html`
    <div class="paste-interceptor" contenteditable="true" onpaste=${onPaste}>${children}</div>
  `
}

const Image = ({imageUrl, message}) => {
  console.log('message', message)
  if (!imageUrl) {
    return html`
      <h1 contenteditable="false">
        ${message}
      </h1>
    `
  }

  console.log('imageUrl: ', imageUrl);
  const style = `background-image: url("${imageUrl}")`;

  return html`<div class="tiled-image" contenteditable="false" style=${style}></div>`;
}

const defaultMessage = "Paste an image into this page at any time and we'll tile it across the whole screen.";

const App = () => {
  const [message, setMessage] = useState(defaultMessage);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if (!imageUrl) return;
    if (message === defaultMessage) return;

    setMessage(defaultMessage)
  }, [message, imageUrl])


  return html`
    <${InterceptPaste} onImage=${setImageUrl} onMessage=${setMessage}>
      <${Image} imageUrl=${imageUrl} message=${message}/>
    </${InterceptPaste}>
  `;
}

export default function main() {
  render(html`<${App} />`, document.body)
}