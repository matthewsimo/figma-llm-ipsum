import { init } from "./common/app";
import { PostMessage } from "./common/msg";
// Figma Documentation Links:
// https://www.figma.com/plugin-docs/how-plugins-run
// https://www.figma.com/plugin-docs/api/api-reference/

figma.showUI(__html__, { themeColors: true });
figma.ui.resize(400, 600);

(async () => {
  await init();
})();

const makeText = async (text) => {
  console.log({ text });
  const center = figma.viewport.center;
  const textNode = figma.createText();
  textNode.name = "LLM Ipsum Text";
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  textNode.characters = text;
  textNode.resize(200, 200);
  textNode.x = center.x;
  textNode.y = center.y;

  figma.notify("Created LLM Ipsum Text");
};

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: PostMessage) => {
  console.log(`"${msg.type}" Message Received!`);

  switch (msg.type) {
    case "create":
      // console.log("payload:");
      // console.log(msg.payload);
      await makeText(msg.payload.content);
      break;
    case "log": // Demonstrate UI passing data to code.ts
      console.log("payload:");
      console.log(msg.payload);
      break;
    case "close":
      figma.closePlugin();
      break;
    case "notifiy":
      figma.notify(msg.payload.message, msg.payload.options || {});
      break;
    default:
      console.log("Unknown PostMessage Received");
      console.log({ msg });
  }
};
