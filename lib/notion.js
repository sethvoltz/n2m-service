const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

module.exports = class Notion {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    this.n2m = new NotionToMarkdown({ notionClient: this.notion });

    this.n2m.setCustomTransformer("code", async (block) => {
      const { code } = block;
      let { language } = code;

      if (language === "plain text") language = "text";
      const text = (code.text || code.rich_text || []).map(({ plain_text }) => plain_text).join("");
      const code_caption_plain = code.caption
        .map((item) => item.plain_text)
        .join("");

      if (code_caption_plain.trim().length > 0) {
        return `\`\`\`${language}
${text}
\`\`\`
<figcaption>${code_caption_plain}</figcaption>`;
      } else {
        return `\`\`\`${language}
${text}
\`\`\``;
      }
    });
  }

  async getPage(uuid) {
    const blocks = await this.n2m.pageToMarkdown(uuid);
    const mdString = this.n2m.toMarkdownString(blocks);
    return mdString.parent;
  }
}
